import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.PORT || 3001);
const configUrl = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';
const languages = new Set(['en', 'hi', 'mr']);
const send = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
};
async function postJson(url, body, headers) {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(18000) });
  if (!response.ok) throw new Error(`Bhashini returned HTTP ${response.status}`);
  return response.json();
}
async function transcribe(request, response) {
  if (!process.env.BHASHINI_USER_ID || !process.env.BHASHINI_API_KEY || !process.env.BHASHINI_PIPELINE_ID) {
    send(response, 503, { error: 'Bhashini is not configured on this server' }); return;
  }
  let raw = '';
  try {
    for await (const chunk of request) {
      raw += chunk;
      if (raw.length > 1200000) { send(response, 413, { error: 'Recording is too large' }); return; }
    }
    const { audio, language } = JSON.parse(raw);
    if (!languages.has(language) || typeof audio !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(audio) || audio.length > 1100000) {
      send(response, 400, { error: 'Invalid recording or language' }); return;
    }
    const config = await postJson(configUrl, {
      pipelineTasks: [{ taskType: 'asr', config: { language: { sourceLanguage: language } } }],
      pipelineRequestConfig: { pipelineId: process.env.BHASHINI_PIPELINE_ID },
    }, { userID: process.env.BHASHINI_USER_ID, ulcaApiKey: process.env.BHASHINI_API_KEY });
    const service = config.pipelineResponseConfig?.find(item => item.taskType === 'asr')?.config?.find(item => item.language?.sourceLanguage === language);
    const endpoint = config.pipelineInferenceAPIEndPoint;
    const callback = new URL(endpoint?.callbackUrl || '');
    if (!service?.serviceId || callback.protocol !== 'https:' || !callback.hostname.endsWith('.bhashini.gov.in') || !endpoint?.inferenceApiKey?.name || !endpoint?.inferenceApiKey?.value) throw new Error('Bhashini ASR is unavailable for this language');
    const result = await postJson(callback.href, {
      pipelineTasks: [{ taskType: 'asr', config: { language: { sourceLanguage: language }, serviceId: service.serviceId, audioFormat: 'wav', samplingRate: 16000 } }],
      inputData: { audio: [{ audioContent: audio }] },
    }, { [endpoint.inferenceApiKey.name]: endpoint.inferenceApiKey.value });
    send(response, 200, { text: result.pipelineResponse?.find(item => item.taskType === 'asr')?.output?.[0]?.source || '' });
  } catch (error) {
    send(response, 502, { error: error instanceof SyntaxError ? 'Invalid request' : 'Voice service unavailable; please try again' });
  }
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
http.createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  if (pathname === '/api/bhashini/asr' && request.method === 'POST') return transcribe(request, response);
  if (pathname.startsWith('/api/')) return send(response, 404, { error: 'Not found' });
  if (request.method !== 'GET' && request.method !== 'HEAD') return send(response, 405, { error: 'Method not allowed' });
  const file = path.resolve(root, '.' + decodeURIComponent(pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) return send(response, 404, { error: 'Not found' });
  try {
    if (!(await stat(file)).isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': /\/assets\//.test(pathname) ? 'public, max-age=31536000, immutable' : 'no-cache' });
    response.end(request.method === 'HEAD' ? undefined : await readFile(file));
  } catch { send(response, 404, { error: 'Not found' }); }
}).listen(port, () => console.log(`Tribal Setu listening on ${port}`));
