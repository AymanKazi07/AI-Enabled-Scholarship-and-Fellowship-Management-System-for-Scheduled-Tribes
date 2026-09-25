import { useEffect, useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { toWavBase64 } from './voice';
import { t } from './i18n';

export default function VoiceField({ label, language, onResult, lowData, uiLanguage }) {
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  const translate = key => t(uiLanguage, key);
  const recorder = useRef(null);
  const stream = useRef(null);
  const timer = useRef(null);
  useEffect(() => () => {
    clearTimeout(timer.current);
    if (recorder.current?.state === 'recording') recorder.current.stop();
    stream.current?.getTracks().forEach(track => track.stop());
  }, []);

  const record = async () => {
    if (recorder.current?.state === 'recording') {
      recorder.current.stop();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setMessage(translate('Audio recording is unavailable here. Type your answer instead.'));
      return;
    }
    try {
      setMessage('');
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = mic;
      const chunks = [];
      const next = new MediaRecorder(mic);
      recorder.current = next;
      next.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      next.onstop = async () => {
        clearTimeout(timer.current);
        mic.getTracks().forEach(track => track.stop());
        if (!chunks.length) { setState('idle'); return; }
        setState('working');
        try {
          const audio = await toWavBase64(new Blob(chunks, { type: next.mimeType }));
          const response = await fetch('/api/bhashini/asr', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio, language }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Transcription failed');
          if (!result.text?.trim()) throw new Error('No speech was detected. Please try again.');
          onResult(result.text.trim());
          setMessage(translate('Text added. Review it before submitting.'));
        } catch { setMessage(translate('Voice service unavailable. Type your answer instead.')); }
        finally { setState('idle'); }
      };
      next.start();
      setState('recording');
      timer.current = setTimeout(() => { if (next.state === 'recording') next.stop(); }, 12000);
    } catch { setMessage(translate('Microphone permission was denied. Type your answer instead.')); setState('idle'); }
  };
  return <span className="voice-control">
    <button type="button" onClick={record} disabled={state === 'working' || lowData}
      aria-label={state === 'recording' ? `Stop recording ${label}` : `Dictate ${label} with Bhashini`}
      title={lowData ? 'Turn off low data mode to use voice' : `Dictate ${label} with Bhashini`}
      className="voice-button">
      {state === 'recording' ? <Square size={14} /> : <Mic size={14} />}
      {translate(state === 'recording' ? 'Stop' : state === 'working' ? 'Processing…' : 'Speak')}
    </button>
    {message && <span role="status" className="voice-message">{message}</span>}
  </span>;
}
