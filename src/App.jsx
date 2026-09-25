import React, { useState } from 'react';
import { schemes } from './schemes';
import VoiceField from './VoiceField';
import { t } from './i18n';
import {
  ShieldCheck, BarChart3, UserCheck, Upload, CheckCircle2,
  AlertTriangle, XCircle, FileText, Sparkles, ArrowRight,
  Award, DollarSign, Download, MessageSquare, Globe, Clock,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('applicant');
  const [language, setLanguage] = useState(() => localStorage.getItem('siteLanguage') === 'HI' ? 'HI' : 'EN');
  const translate = key => t(language, key);
  const [voiceLanguage, setVoiceLanguage] = useState('hi');
  const [lowData, setLowData] = useState(() => localStorage.getItem('lowData') === 'true' || navigator.connection?.saveData === true);
  const [schemeQuery, setSchemeQuery] = useState('');
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [schemeProvider, setSchemeProvider] = useState('All');
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [lastNotifiedApp, setLastNotifiedApp] = useState(null);

  // Applications Database with Realistic Scholar Data & Photos
  const [applications, setApplications] = useState([
    {
      id: "APP-2026-NFST-0101",
      scheme: "NFST",
      name: "Ramesh Chandra Munda",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      gender: "Male",
      subCaste: "Santhal",
      isPvtg: true,
      state: "Odisha",
      income: 320000,
      institution: "IIT Bhubaneswar",
      degree: "Ph.D. Material Science",
      meritScore: 89.5,
      status: "APPROVED_L1",
      aiScore: 98,
      tamperStatus: "AUTHENTIC (PASS)",
      flags: [],
      docName: "Caste_Cert_Odisha_Gov_2025.pdf",
      certNumber: "OD/MAYUR/ST/2025/89214",
      issueDate: "14-Jan-2025",
      issuingOfficer: "Sub-Divisional Magistrate, Mayurbhanj",
      stipendStatus: "DISBURSED",
      guideApproved: true
    },
    {
      id: "APP-2026-NOS-0402",
      scheme: "NOS",
      name: "Sunita Marandi",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      gender: "Female",
      subCaste: "Munda",
      isPvtg: false,
      state: "Jharkhand",
      income: 540000,
      institution: "Univ. of Melbourne (QS #14)",
      degree: "Master of Data Science",
      meritScore: 94.0,
      status: "DEFICIENCY_RAISED",
      aiScore: 52,
      tamperStatus: "SUSPICIOUS (Format Anomaly)",
      flags: ["Income certificate financial year does not cover current FY 2025-26"],
      docName: "Income_Cert_Scan_Old.jpg",
      certNumber: "JH/RAN/INC/2024/00341",
      issueDate: "10-Feb-2024 (EXPIRED)",
      issuingOfficer: "Tehsildar Office, Ranchi",
      stipendStatus: "ON_HOLD",
      guideApproved: false
    },
    {
      id: "APP-2026-NFST-0305",
      scheme: "NFST",
      name: "Anita Kumari Gond",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      gender: "Female",
      subCaste: "Gond",
      isPvtg: true,
      state: "Madhya Pradesh",
      income: 240000,
      institution: "AIIMS Bhopal",
      degree: "Ph.D. Microbiology",
      meritScore: 92.4,
      status: "APPROVED_L1",
      aiScore: 97,
      tamperStatus: "AUTHENTIC (PASS)",
      flags: [],
      docName: "Caste_Cert_MP_Gov.pdf",
      certNumber: "MP/BHO/ST/2025/11094",
      issueDate: "02-Dec-2024",
      issuingOfficer: "SDM Bhopal Central",
      stipendStatus: "DISBURSED",
      guideApproved: true
    }
  ]);

  const [selectedAppId, setSelectedAppId] = useState("APP-2026-NFST-0101");
  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Dynamic Form
  const [formScheme, setFormScheme] = useState("NFST");
  const [formName, setFormName] = useState("");
  const [formGender, setFormGender] = useState("Female");
  const [formSubCaste, setFormSubCaste] = useState("Santhal");
  const [formIsPvtg, setFormIsPvtg] = useState(true);
  const [formState, setFormState] = useState("Odisha");
  const [formIncome, setFormIncome] = useState(260000);
  const [formInstitution, setFormInstitution] = useState("IIT Kharagpur");
  const [formDegree, setFormDegree] = useState("Ph.D. Environmental Eng");
  const [formMarks, setFormMarks] = useState(88.5);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [officerRemark, setOfficerRemark] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newId = `APP-2026-${formScheme}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      id: newId,
      scheme: formScheme,
      name: formName || "Tribal Scholar",
      avatar: formGender === 'Female'
        ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      gender: formGender,
      subCaste: formSubCaste,
      isPvtg: formIsPvtg,
      state: formState,
      income: Number(formIncome),
      institution: formInstitution,
      degree: formDegree,
      meritScore: Number(formMarks),
      status: "PENDING_L1",
      aiScore: 96,
      tamperStatus: "AUTHENTIC (PASS)",
      flags: [],
      docName: uploadedFile ? uploadedFile.name : "Caste_Certificate_Uploaded.pdf",
      certNumber: `${formState.substring(0, 2).toUpperCase()}/REV/ST/2026/${Math.floor(10000 + Math.random() * 90000)}`,
      issueDate: "20-Jan-2026",
      issuingOfficer: `SDM Office, ${formState}`,
      stipendStatus: "PROCESSING",
      guideApproved: false
    };

    setApplications([newApp, ...applications]);
    setSelectedAppId(newId);
    setSubmissionSuccess(newApp);
  };

  const handleOfficerAction = (action) => {
    setApplications(applications.map(app => {
      if (app.id === selectedApp.id) {
        if (action === "APPROVE") return { ...app, status: "APPROVED_L1", flags: [] };
        if (action === "DEFICIENCY") {
          const note = officerRemark || "Please re-upload a valid Income Certificate for FY 2025-26.";
          setLastNotifiedApp({ ...app, note });
          setShowSmsModal(true);
          return { ...app, status: "DEFICIENCY_RAISED", flags: [note] };
        }
        if (action === "REJECT") return { ...app, status: "REJECTED" };
      }
      return app;
    }));
    setOfficerRemark("");
  };

  const exportMeritCSV = () => {
    const headers = "Rank,App ID,Name,Scheme,Tribe,PVTG,Gender,Merit Score,Status\n";
    const rows = [...applications]
      .sort((a, b) => b.meritScore - a.meritScore)
      .map((app, index) =>
        `${index + 1},${app.id},"${app.name}",${app.scheme},${app.subCaste},${app.isPvtg ? 'YES' : 'NO'},${app.gender},${app.meritScore}%,${app.status}`
      ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MoTA_Merit_List_2026.csv`;
    a.click();
  };

  const totalApps = applications.length;
  const approvedApps = applications.filter(a => a.status === "APPROVED_L1").length;
  const femalePercentage = Math.round((applications.filter(a => a.gender === "Female").length / totalApps) * 100) || 0;
  const pvtgCount = applications.filter(a => a.isPvtg).length;
  const filteredSchemes = schemes.filter(scheme =>
    (schemeProvider === 'All' || scheme.provider.includes(schemeProvider)) &&
    `${scheme.name} ${scheme.nameHi} ${scheme.summary} ${scheme.summaryHi} ${scheme.level} ${scheme.eligibility} ${scheme.eligibilityHi}`.toLocaleLowerCase().includes(schemeQuery.toLocaleLowerCase())
  );
  const changeLowData = () => setLowData(value => {
    localStorage.setItem('lowData', String(!value));
    return !value;
  });

  return (
    <div lang={language === 'HI' ? 'hi' : 'en'} className={`min-h-screen flex flex-col bg-slate-100 font-sans selection:bg-emerald-100 selection:text-emerald-900 ${lowData ? 'low-data' : ''}`}>

      {/* ========================================================================= */}
      {/* 1. OFFICIAL GOV HEADER WITH EMBLEM & TRICOLOR TOP STRIP                   */}
      {/* ========================================================================= */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="portal-header-inner max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

          {/* Ministry Brand & National Emblem */}
          <div className="flex items-center gap-4">
            <div className="portal-mark" aria-hidden="true"><ShieldCheck size={26} strokeWidth={1.8} /></div>
            <div className="border-l border-slate-300 pl-4">
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900">{translate('TRIBAL-SETU')}</span>
                <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs tracking-wider">
{translate('Demo portal')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{translate('Scholarship information and application prototype')}</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="portal-controls flex items-center gap-3">
            <div className="portal-nav flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('applicant')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'applicant' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'EN' ? 'Applicant Portal' : 'आवेदक पोर्टल'}
              </button>
              <button
                onClick={() => setActiveTab('scrutiny')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'scrutiny' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'EN' ? 'AI Scrutiny Desk' : 'एआई संवीक्षा'}
                <span className="bg-emerald-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">{applications.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('merit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'merit' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                {language === 'EN' ? 'Merit & DBT' : 'मेरिट एवं डीबीटी'}
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                {language === 'EN' ? 'Dashboard' : 'डैशबोर्ड'}
              </button>
            </div>

            <button type="button" onClick={changeLowData} aria-pressed={lowData}
              className="text-xs font-bold bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-slate-700">
              {translate(lowData ? 'Low data: On' : 'Low data: Off')}
            </button>
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(current => { const next = current === 'EN' ? 'HI' : 'EN'; localStorage.setItem('siteLanguage', next); return next; })}
              className="flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-xl text-slate-700 shadow-xs transition"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              {language === 'EN' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">

        {/* ========================================================================= */}
        {/* TAB 1: APPLICANT PORTAL                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'applicant' && (
          <div className="max-w-4xl mx-auto space-y-6">

            <div className="portal-notice" role="note">{translate('Demo portal · Not an official government website')}</div>
            {/* Hero Motivational Banner */}
            <div className="relative rounded-2xl overflow-hidden shadow-md bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-8">
              <div className="relative z-10 max-w-xl">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                  {translate('Academic Year 2026-27 Registrations Open')}
                </span>
                <h2 className="text-2xl font-black mt-3 leading-tight">
                  {translate('Empowering Scheduled Tribe Scholars with World-Class Higher Education')}
                </h2>
                <p className="text-xs text-emerald-200/90 mt-2 leading-relaxed">
                  {translate('Fast-track digital processing with automated AI document verification for the National Fellowship (NFST) and National Overseas Scholarship (NOS).')}
                </p>
              </div>
              {!lowData && <img loading="lazy"
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80"
                alt={translate('Students studying')}
                className="absolute right-0 top-0 bottom-0 w-1/3 object-cover opacity-20 mask-radial"
              />}
            </div>

            <section className="steps-panel" aria-label={translate('How to use this portal')}>
              <h3>{translate('How to use this portal')}</h3>
              <div className="steps-grid">
                <div><strong>{translate('1. Find a scheme')}</strong><p>{translate('Search across ST schemes and compare basic support.')}</p></div>
                <div><strong>{translate('2. Check the rules')}</strong><p>{translate('Open the scheme summary and verify details at the source.')}</p></div>
                <div><strong>{translate('3. Use the right portal')}</strong><p>{translate('Apply only through the linked official website.')}</p></div>
              </div>
            </section>
            <section className="scheme-directory" aria-labelledby="scheme-heading">
              <div className="scheme-heading">
                <div>
                  <h3 id="scheme-heading">{translate('Explore ST scholarships and fellowships')}</h3>
                  <p>{translate('Official scheme links verified 25 September 2026. Check the linked portal for eligibility, application route and current dates.')}</p>
                </div>
                <span>{filteredSchemes.length} {translate('schemes')}</span>
              </div>
              <div className="scheme-filters">
                <label>{translate('Search schemes')}
                  <input type="search" value={schemeQuery} onChange={event => setSchemeQuery(event.target.value)} placeholder={language === 'HI' ? 'नाम, शिक्षा स्तर या सहायता खोजें' : 'Search by name, study level or support'} />
                </label>
                <label>{translate('Portal')}
                  <select value={schemeProvider} onChange={event => setSchemeProvider(event.target.value)}>
                    <option value="All">{translate('All')}</option><option value="MahaDBT">{translate('MahaDBT')}</option><option value="Ministry of Tribal Affairs">{translate('Ministry of Tribal Affairs')}</option><option value="Ministry of Education">{translate('Ministry of Education')}</option>
                  </select>
                </label>
              </div>
              <div className="scheme-list" aria-live="polite">
                {filteredSchemes.map(scheme => <article key={scheme.name} className="scheme-item">
                  <div className="scheme-item-main">
                    <small>{translate(scheme.provider.split(' · ')[0])} · {translate(scheme.level)}</small>
                    <h4>{language === 'HI' ? scheme.nameHi : scheme.name}</h4>
                    <p>{language === 'HI' ? scheme.summaryHi : scheme.summary}</p>
                    {expandedScheme === scheme.name && <div className="scheme-details">
                      <p><strong>{translate('Who can apply')}:</strong> {language === 'HI' ? scheme.eligibilityHi : scheme.eligibility}</p>
                      <p><strong>{translate('Support offered')}:</strong> {language === 'HI' ? scheme.benefitHi : scheme.benefit}</p>
                      <p><strong>{translate('Apply on')}:</strong> {translate(scheme.provider.split(' · ')[0])}</p>
                    </div>}
                  </div>
                  <div className="scheme-actions">
                    <button type="button" aria-expanded={expandedScheme === scheme.name} onClick={() => setExpandedScheme(expandedScheme === scheme.name ? null : scheme.name)}>
                      {translate(expandedScheme === scheme.name ? 'Hide details' : 'See scheme details')}
                    </button>
                    <a href={scheme.url} target="_blank" rel="noopener noreferrer" aria-label={`${translate('Official details')}: ${language === 'HI' ? scheme.nameHi : scheme.name}`}>
                      {translate('Official details')} <ExternalLink size={14} />
                    </a>
                  </div>
                </article>)}
                {!filteredSchemes.length && <p>{translate('No schemes match your search.')}</p>}
              </div>
            </section>

            {submissionSuccess ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-200 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">
                  {language === 'EN' ? 'Demo application saved for this session' : 'नमूना आवेदन इस सत्र में सहेजा गया'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{translate('Application Reference No:')} <span className="font-mono font-bold text-emerald-700">{submissionSuccess.id}</span></p>

                {/* Digital Verification Receipt */}
                <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left max-w-lg mx-auto space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="font-bold text-xs text-slate-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> {translate('Illustrative scrutiny summary')}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-0.5 rounded-full">
                      {submissionSuccess.aiScore}% {translate('Match')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{translate('Document Tamper Status:')}</span>
                    <span className="font-bold text-emerald-600">{translate('Sample check passed')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{translate('State Revenue Registry Match:')}</span>
                    <span className="font-bold text-emerald-600">{translate('Demo record shown')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{translate('Workflow Stage:')}</span>
                    <span className="font-bold text-blue-700">{translate('Shown in sample scrutiny desk')}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('scrutiny')}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition"
                  >
                    {translate('View in Officer Scrutiny Desk')} <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSubmissionSuccess(null)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-5 py-3 rounded-xl transition"
                  >
                    {translate('Submit Another Application')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h3 className="text-lg font-black text-slate-800">
                    {language === 'EN' ? 'Unified Scheme Application' : 'एकीकृत योजना आवेदन पत्र'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{translate('Configurable Scheme Engine: Field criteria and document rules change based on your selected scheme.')}</p>
                </div>

                <form onSubmit={handleFormSubmit} className="app-form space-y-6">
                  <div className="voice-panel">
                    <div><strong>{translate('Bhashini voice assisted form filling')}</strong><p>{translate('Choose a language, tap Speak next to a text field, and check the result. The microphone records for up to 12 seconds.')}</p></div>
                    <label>{translate('Speech language')} <select value={voiceLanguage} onChange={event => setVoiceLanguage(event.target.value)} disabled={lowData}>
                      <option value="hi">हिन्दी</option><option value="mr">मराठी</option><option value="en">{translate('English')}</option>
                    </select></label>
                    {lowData && <p>{translate('Voice is paused in low data mode. All fields remain available for typing.')}</p>}
                  </div>

                  {/* Scheme Selection Cards with Rich Photos */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{translate('Select Scheme')}</label>
                    <div className="grid grid-cols-2 gap-4" role="radiogroup" aria-label={translate("Select Scheme")}>

                      {/* NFST Card */}
                      <div
                        onClick={() => setFormScheme('NFST')}
                        role="radio" aria-checked={formScheme === 'NFST'} tabIndex={0}
                        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setFormScheme('NFST'); } }}
                        className={`relative rounded-xl border-2 p-5 cursor-pointer transition overflow-hidden group ${formScheme === 'NFST' ? 'border-emerald-600 bg-emerald-50/60 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                      >
                        <div className="flex items-start justify-between relative z-10">
                          <div>
                            <span className="font-black text-slate-900 text-sm">{translate('NFST (National Fellowship)')}</span>
                            <span className="block text-[10px] font-bold text-emerald-700 mt-0.5">{translate('For Higher Education in India')}</span>
                          </div>
                          <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {translate('750 Slots')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 relative z-10 leading-relaxed">
                          {translate('For ST scholars pursuing regular M.Phil/Ph.D. in UGC/AICTE recognized universities and IITs.')} <span className="font-semibold text-slate-700">{translate('₹37,000/mo JRF stipend + HRA')}</span>.
                        </p>
                      </div>

                      {/* NOS Card */}
                      <div
                        onClick={() => setFormScheme('NOS')}
                        role="radio" aria-checked={formScheme === 'NOS'} tabIndex={0}
                        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setFormScheme('NOS'); } }}
                        className={`relative rounded-xl border-2 p-5 cursor-pointer transition overflow-hidden group ${formScheme === 'NOS' ? 'border-blue-600 bg-blue-50/60 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                      >
                        <div className="flex items-start justify-between relative z-10">
                          <div>
                            <span className="font-black text-slate-900 text-sm">{translate('NOS (Overseas Scholarship)')}</span>
                            <span className="block text-[10px] font-bold text-blue-700 mt-0.5">{translate('For Studies Abroad')}</span>
                          </div>
                          <span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {translate('100 Slots')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 relative z-10 leading-relaxed">
                          {translate('For Master’s and Ph.D. abroad in Top 500 QS World Ranked Universities.')} <span className="font-semibold text-slate-700">{translate('$15,400/yr + Full Tuition + Flights')}</span>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{translate('Scholar Full Name')}</label>
                      <VoiceField label={translate("Scholar Full Name")} uiLanguage={language} language={voiceLanguage} lowData={lowData} onResult={setFormName} />
                      <input
                        required
                        type="text"
                        placeholder={language === 'HI' ? 'उदाहरण: बिरसा पुरती' : 'e.g. Birsa Purty'}
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{translate('Gender')}</label>
                      <select
                        value={formGender}
                        onChange={e => setFormGender(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option value="Female">{translate('Female')}</option>
                        <option value="Male">{translate('Male')}</option>
                        <option value="Other">{translate('Other')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{translate('Sub-Tribe Community')}</label>
                      <VoiceField label={translate("Sub-Tribe Community")} uiLanguage={language} language={voiceLanguage} lowData={lowData} onResult={setFormSubCaste} />
                      <input
                        required
                        type="text"
                        placeholder={language === 'HI' ? 'उदाहरण: संथाल, गोंड, भील' : 'e.g. Santhal, Gond, Bhil'}
                        value={formSubCaste}
                        onChange={e => setFormSubCaste(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{translate('State of Domicile')}</label>
                      <select
                        value={formState}
                        onChange={e => setFormState(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option value="Odisha">{translate('Odisha')}</option>
                        <option value="Jharkhand">{translate('Jharkhand')}</option>
                        <option value="Madhya Pradesh">{translate('Madhya Pradesh')}</option>
                        <option value="Chhattisgarh">{translate('Chhattisgarh')}</option>
                        <option value="Rajasthan">{translate('Rajasthan')}</option>
                        <option value="Maharashtra">{translate('Maharashtra')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{translate('Family Annual Income (₹)')}</label>
                      <input
                        required
                        type="number"
                        value={formIncome}
                        onChange={e => setFormIncome(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* PVTG Priority Checkbox */}
                  <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 flex items-center justify-between">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-purple-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsPvtg}
                          onChange={e => setFormIsPvtg(e.target.checked)}
                          className="w-4 h-4 text-purple-700 rounded"
                        />
                        {translate('Scholar belongs to a Particularly Vulnerable Tribal Group (PVTG Priority)')}
                      </label>
                      <p className="text-[11px] text-purple-700/80 ml-6 mt-0.5">{translate('MoTA gives special priority allocation to 75 recognized PVTG communities across India.')}</p>
                    </div>
                    <span className="text-[10px] font-extrabold bg-purple-200 text-purple-900 px-2 py-0.5 rounded">{translate('STATUTORY QUOTA')}</span>
                  </div>

                  {/* Dynamic Academic Details */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {translate(formScheme === 'NFST' ? 'Host Indian Institute' : 'Foreign University (Top 500 QS)')}
                      </label>
                      <VoiceField label={translate("Host Indian Institute")} uiLanguage={language} language={voiceLanguage} lowData={lowData} onResult={setFormInstitution} />
                      <input
                        required
                        type="text"
                        value={formInstitution}
                        onChange={e => setFormInstitution(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{translate('Enrolled Degree')}</label>
                      <VoiceField label={translate("Enrolled Degree")} uiLanguage={language} language={voiceLanguage} lowData={lowData} onResult={setFormDegree} />
                      <input
                        required
                        type="text"
                        value={formDegree}
                        onChange={e => setFormDegree(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {translate(formScheme === 'NFST' ? 'Qualifying Exam Marks (%)' : 'Foreign University QS Rank')}
                      </label>
                      <input
                        required
                        type="number"
                        step="0.1"
                        value={formMarks}
                        onChange={e => setFormMarks(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Document Upload Area */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-600 transition bg-slate-50/50">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mx-auto mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">{translate('Attach Verified ST Caste Certificate')}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{translate('Supports PDF, PNG, JPG. Optical Character Recognition (OCR) will run automatically.')}</p>
                    <input
                      type="file"
                      onChange={e => setUploadedFile(e.target.files[0])}
                      className="mt-3 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                    />
                  </div>

                  <section className="application-summary" aria-label={translate('Application summary')}>
                    <h4>{translate('Application summary')}</h4>
                    <p>{translate('Review details before submitting. This prototype does not verify eligibility or submit to government portals.')}</p>
                    <dl>
                      <div><dt>{translate('Selected scheme')}</dt><dd>{formScheme}</dd></div>
                      <div><dt>{translate('Applicant name')}</dt><dd>{formName || '—'}</dd></div>
                      <div><dt>{translate('State')}</dt><dd>{translate(formState)}</dd></div>
                      <div><dt>{translate('Annual income')}</dt><dd>₹{Number(formIncome || 0).toLocaleString('en-IN')}</dd></div>
                      <div><dt>{translate('Institute')}</dt><dd>{formInstitution || '—'}</dd></div>
                      <div><dt>{translate('Certificate')}</dt><dd>{uploadedFile?.name || translate('Not attached')}</dd></div>
                    </dl>
                  </section>
                  <button
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" /> {translate('Run AI Scrutiny & Submit Application')}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AI SCRUTINY DESK WITH REALISTIC CERTIFICATE PREVIEW                */}
        {/* ========================================================================= */}
        {activeTab === 'scrutiny' && (
          <div className="scrutiny-layout grid grid-cols-12 gap-5 h-[calc(100vh-130px)]">

            {/* Left Queue with Scholar Photos */}
            <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{translate('Pending Queue')}</span>
                <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">{applications.length} {translate('Files')}</span>
              </div>

              <div className="space-y-2.5 mt-3 overflow-y-auto flex-1 pr-1">
                {applications.map(app => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${selectedApp.id === app.id ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <img
                      src={lowData ? undefined : app.avatar} loading="lazy"
                      alt={app.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600/40"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] font-bold text-slate-400">{app.id}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${app.status === 'APPROVED_L1' ? 'bg-emerald-100 text-emerald-800' :
                            app.status === 'DEFICIENCY_RAISED' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {translate(app.status)}
                        </span>
                      </div>
                      <p className="font-bold text-slate-800 text-xs truncate mt-0.5">{app.name}</p>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>{app.scheme} • {app.subCaste}</span>
                        <span className="font-bold text-emerald-700">{app.aiScore}% {translate('Match')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: REALISTIC SCANNED CERTIFICATE WITH OFFICIAL SEALS & GLOWING BOUNDING BOXES */}
            <div className="col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  Doc: {selectedApp.docName}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${selectedApp.tamperStatus.includes('PASS') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                  {translate(selectedApp.tamperStatus)}
                </span>
              </div>

              {/* Realistic Scanned Government Certificate Simulation */}
              <div className="flex-1 bg-amber-50/40 rounded-xl border border-amber-200/60 p-5 mt-2.5 overflow-y-auto relative shadow-inner">
                <div className="bg-[#fffef8] p-6 rounded-lg border border-slate-300 shadow-md relative min-h-[460px] text-slate-800 font-serif text-[11px] leading-relaxed">

                  {/* Watermark Emblem */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <img
                      src={lowData ? undefined : "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"} loading="lazy"
                      alt="Watermark"
                      className="w-64 h-64 object-contain"
                    />
                  </div>

                  {/* Certificate Top Header */}
                  <div className="text-center pb-3 border-b-2 border-slate-800 relative z-10">
                    <img
                      src={lowData ? undefined : "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"} loading="lazy"
                      alt="State Emblem"
                      className="h-9 mx-auto mb-1 opacity-90"
                    />
                    <p className="font-sans text-[10px] font-black uppercase tracking-widest text-slate-800">
                      GOVERNMENT OF {selectedApp.state.toUpperCase()}
                    </p>
                    <p className="font-sans text-[9px] font-bold text-slate-600">{translate('OFFICE OF THE SUB-DIVISIONAL MAGISTRATE')}</p>
                    <p className="font-sans text-[11px] font-black underline tracking-wide mt-1 text-slate-900">
                      {translate('CERTIFICATE OF SCHEDULED TRIBE CASTE')}
                    </p>
                  </div>

                  {/* Cert Registration Barcode */}
                  <div className="flex justify-between items-center my-3 text-[9px] font-sans text-slate-600 border-b border-dashed border-slate-300 pb-2 relative z-10">
                    <div>
                      <p><span className="font-bold">{translate('Cert No:')}</span> {selectedApp.certNumber}</p>
                      <p><span className="font-bold">{translate('Issue Date:')}</span> {selectedApp.issueDate}</p>
                    </div>
                    <div className="text-right">
                      {/* Barcode graphic */}
                      <div className="font-mono text-xs tracking-widest bg-slate-900 text-white px-2 py-0.5 rounded">
                        ||| || |||| | ||||| |||
                      </div>
                      <span className="text-[8px] text-slate-400 font-mono">{translate('e-District Digital Barcode')}</span>
                    </div>
                  </div>

                  {/* Certificate Body with Cyber AI Bounding Boxes */}
                  <div className="space-y-3 relative z-10 font-serif text-slate-800 leading-normal">
                    <p>
                      This is to certify that Shri / Smt / Kumari
                    </p>

                    {/* AI Bounding Box: Scholar Name */}
                    <div className="p-2 bg-emerald-100/50 border-2 border-emerald-500 rounded relative shadow-xs">
                      <span className="absolute -top-2 left-2 bg-emerald-700 text-white text-[8px] font-sans font-bold px-1.5 py-0.2 rounded shadow-xs">
                        AI OCR: NAME (99.8% Match)
                      </span>
                      <p className="font-bold text-sm text-slate-900 font-sans tracking-wide">
                        {selectedApp.name}
                      </p>
                    </div>

                    <p>
                      {translate('Resident of')} <span className="font-bold underline">{translate(selectedApp.state)}</span> {translate('recognized community')}:
                    </p>

                    {/* AI Bounding Box: Sub-Tribe */}
                    <div className="p-2 bg-emerald-100/50 border-2 border-emerald-500 rounded relative shadow-xs">
                      <span className="absolute -top-2 left-2 bg-emerald-700 text-white text-[8px] font-sans font-bold px-1.5 py-0.2 rounded shadow-xs">
                        AI OCR: RECOGNIZED TRIBE
                      </span>
                      <p className="font-bold text-xs text-slate-900 font-sans">
                        {selectedApp.subCaste} ({translate('Scheduled Tribe under the Constitution Order 1950')})
                      </p>
                    </div>

                    <p className="text-[10px] text-slate-600 italic">
                      This certificate is digitally authenticated by the state portal and valid across all Central Government Fellowship and Educational Schemes.
                    </p>
                  </div>

                  {/* Stamp & Seal Simulation */}
                  <div className="mt-6 pt-4 flex justify-between items-end relative z-10">
                    {/* Official Round Ink Seal */}
                    <div className="relative w-20 h-20 rounded-full border-2 border-purple-700 flex items-center justify-center text-center p-1 transform -rotate-12 opacity-85">
                      <div className="w-16 h-16 rounded-full border border-purple-600 flex flex-col justify-center items-center text-[7px] font-bold font-sans text-purple-800 leading-none">
                        <span>{translate('GOVT OF INDIA')}</span>
                        <span className="text-[6px] my-0.5">{translate('★ SEAL ★')}</span>
                        <span>{translate('SDM OFFICE')}</span>
                      </div>
                    </div>

                    {/* Signature */}
                    <div className="text-right font-sans">
                      <div className="font-serif italic text-blue-900 font-bold text-sm pb-1">
                        S. K. Mohapatra
                      </div>
                      <p className="text-[9px] font-bold text-slate-800">{selectedApp.issuingOfficer}</p>
                      <p className="text-[8px] text-slate-500">{translate('Government of')} {translate(selectedApp.state)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: AI Evaluation & Action Console */}
            <div className="col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <img
                      src={lowData ? undefined : selectedApp.avatar} loading="lazy"
                      alt={selectedApp.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-xs text-slate-800 leading-tight">{selectedApp.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">{selectedApp.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-700">{selectedApp.aiScore}%</span>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{translate('AI Confidence')}</p>
                  </div>
                </div>

                <div className="space-y-2.5 mt-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{translate('Candidate Claim vs Certificate')}</p>
                      <p className="text-xs font-bold text-slate-800">{selectedApp.name}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{translate('Affirmative Category')}</p>
                      <p className="text-xs font-bold text-slate-800">{selectedApp.subCaste} {selectedApp.isPvtg && `• ${translate('PVTG Priority')}`}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{translate('Verified Annual Income')}</p>
                      <p className="text-xs font-bold text-slate-800">₹{selectedApp.income.toLocaleString('en-IN')}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  {selectedApp.flags.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-600" /> {translate('AI Discrepancies Flagged:')}
                      </p>
                      <ul className="list-disc list-inside text-xs text-amber-700">
                        {selectedApp.flags.map((f, i) => <li key={i}>{translate(f)}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <input
                  type="text"
                  placeholder={translate('Officer remarks / Deficiency explanation...')}
                  value={officerRemark}
                  onChange={e => setOfficerRemark(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleOfficerAction("APPROVE")}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 transition shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> {translate('Approve L1')}
                  </button>
                  <button
                    onClick={() => handleOfficerAction("DEFICIENCY")}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 transition shadow-sm"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> {translate('Flag Defect')}
                  </button>
                  <button
                    onClick={() => handleOfficerAction("REJECT")}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 transition shadow-sm"
                  >
                    <XCircle className="w-3.5 h-3.5" /> {translate('Reject')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUTOMATED MERIT ENGINE & DBT HUB                                  */}
        {/* ========================================================================= */}
        {activeTab === 'merit' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  {language === 'EN' ? 'Automated Merit Ranking & Fellowship DBT Hub' : 'स्वचालित मेरिट सूची एवं अध्येतावृत्ति डीबीटी'}
                </h2>
                <p className="text-xs text-slate-500">
                  {translate('Algorithmic scoring applying 30% Female Quota, PVTG priority, and PFMS Direct Benefit Transfer batches.')}
                </p>
              </div>
              <button
                onClick={exportMeritCSV}
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" /> {translate('Export Merit List (CSV)')}
              </button>
            </div>

            {/* Merit Ranking Table with Scholar Photos */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                {translate('Provisional Selection Merit List (Ranked Automatically by Scheme Rules)')}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
                    <tr>
                      <th className="p-3">{translate('Rank')}</th>
                      <th className="p-3">{translate('Scholar')}</th>
                      <th className="p-3">{translate('Scheme')}</th>
                      <th className="p-3">{translate('Tribe')}</th>
                      <th className="p-3">{translate('Affirmative Quota')}</th>
                      <th className="p-3">{translate('Merit Score')}</th>
                      <th className="p-3">{translate('Scrutiny Status')}</th>
                      <th className="p-3">{translate('Fellowship Stipend')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {[...applications]
                      .sort((a, b) => b.meritScore - a.meritScore)
                      .map((app, index) => (
                        <tr key={app.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-emerald-800">#{index + 1}</td>
                          <td className="p-3 flex items-center gap-2.5">
                            <img src={lowData ? undefined : app.avatar} loading="lazy" alt={app.name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-slate-800 leading-tight">{app.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{app.id}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${app.scheme === 'NFST' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                              {app.scheme}
                            </span>
                          </td>
                          <td className="p-3">{app.subCaste}</td>
                          <td className="p-3">
                            {app.isPvtg && <span className="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded text-[10px] mr-1">{translate('PVTG Priority')}</span>}
                            {app.gender === 'Female' && <span className="bg-pink-100 text-pink-800 font-bold px-1.5 py-0.5 rounded text-[10px]">{translate('30% Female Quota')}</span>}
                          </td>
                          <td className="p-3 font-bold text-slate-800">{app.meritScore}%</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${app.status.includes('APPROVED') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {translate(app.status)}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-700">
                            {app.scheme === 'NFST' ? '₹37,000 / mo' : '$15,400 / yr'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Post-Award Fellowship Lifecycle Cards */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                {translate('Post-Award Fellowship Lifecycle (PFMS & DBT Tribal Automation)')}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{translate('Continuous digital oversight: University joining verification, bi-annual guide sign-offs, and automated stipend disbursements.')}</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{translate('1. University Joining')}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{translate('Registrar joining report verified digitally via institutional email.')}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{translate('2. Research Guide Approval')}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{translate('Bi-annual progress & attendance certified digitally by Ph.D. guide.')}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{translate('3. PFMS DBT Credit')}</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">{translate('DIRECT TO AADHAAR')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{translate('Automated electronic payment advice pushed to Public Financial Management System.')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: LEADERSHIP DASHBOARD                                               */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  {language === 'EN' ? 'MoTA Leadership Real-Time Telemetry' : 'जनजातीय कार्य मंत्रालय - नेतृत्व टेलीमेट्री'}
                </h2>
                <p className="text-xs text-slate-500">{translate('Live oversight of affirmative action quotas, fund utilization & verification SLAs.')}</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg">
                {translate('Academic Year 2026-27 Active')}
              </span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">{translate('Total Applications')}</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{totalApps}</p>
                <p className="text-[11px] text-emerald-600 mt-1 font-semibold">{approvedApps} {translate('Approved L1')}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">{translate('Female Scholar Ratio')}</p>
                <p className="text-3xl font-black text-emerald-600 mt-1">{femalePercentage}%</p>
                <p className="text-[11px] text-emerald-600 mt-1 font-semibold">{translate('Sample ratio from demo records')}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">{translate('PVTG Candidates')}</p>
                <p className="text-3xl font-black text-purple-600 mt-1">{pvtgCount}</p>
                <p className="text-[11px] text-purple-600 mt-1 font-semibold">{translate('Particularly Vulnerable Groups')}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">{translate('Avg Scrutiny TAT')}</p>
                <p className="text-3xl font-black text-amber-600 mt-1">{translate('1.8 Days')}</p>
                <p className="text-[11px] text-slate-500 mt-1">{translate('Illustrative value only')}</p>
              </div>
            </div>

            {/* State Distribution Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 mb-4">{translate('State-wise Application & Clearance Telemetry')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
                    <tr>
                      <th className="p-3">{translate('State')}</th>
                      <th className="p-3">{translate('NFST Applications')}</th>
                      <th className="p-3">{translate('NOS Applications')}</th>
                      <th className="p-3">{translate('PVTG Scholars')}</th>
                      <th className="p-3">{translate('Disbursed Funds')}</th>
                      <th className="p-3">{translate('Clearance Rate')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr>
                      <td className="p-3 font-bold">{translate('Odisha')}</td>
                      <td className="p-3">185</td>
                      <td className="p-3">28</td>
                      <td className="p-3 font-bold text-purple-600">42</td>
                      <td className="p-3">₹8.4 Cr</td>
                      <td className="p-3"><span className="text-emerald-600 font-bold">92%</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">{translate('Jharkhand')}</td>
                      <td className="p-3">160</td>
                      <td className="p-3">22</td>
                      <td className="p-3 font-bold text-purple-600">31</td>
                      <td className="p-3">₹6.9 Cr</td>
                      <td className="p-3"><span className="text-emerald-600 font-bold">88%</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">{translate('Madhya Pradesh')}</td>
                      <td className="p-3">140</td>
                      <td className="p-3">18</td>
                      <td className="p-3 font-bold text-purple-600">26</td>
                      <td className="p-3">₹5.8 Cr</td>
                      <td className="p-3"><span className="text-emerald-600 font-bold">85%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="portal-footer"><div className="max-w-7xl mx-auto px-6 py-5">
        <strong>{translate('TRIBAL-SETU')}</strong> · {translate('Demo portal · Not an official government website')}<br />
        {translate('Official scheme links verified 25 September 2026. Check the linked portal for eligibility, application route and current dates.')}
      </div></footer>

      {/* ========================================================================= */}
      {/* REAL-TIME SMS & WHATSAPP DEFICIENCY NOTIFICATION MODAL                    */}
      {/* ========================================================================= */}
      {showSmsModal && lastNotifiedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">{translate('Automated Deficiency Alert Dispatched')}</h3>
                <p className="text-[11px] text-slate-400">{translate('Multi-Channel Gateway (SMS & WhatsApp)')}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <div className="flex justify-between items-center text-[10px] text-emerald-800 font-bold mb-1">
                <span>{translate('GOV-MoTA ALERT')}</span>
                <span>{translate('JUST NOW')}</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-sans">
                {translate('Dear')} <span className="font-bold">{lastNotifiedApp.name}</span>, {translate('a clarification is required for your')} <span className="font-bold">{lastNotifiedApp.scheme}</span> {translate('application')} ({lastNotifiedApp.id}).
                <br /><br />
                <span className="font-semibold text-amber-800">{translate('Remark:')} {translate(lastNotifiedApp.note)}</span>
                <br /><br />
                {translate('This is a demo notification; use the official scheme portal.')}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <Clock className="w-3.5 h-3.5" /> {translate('14-Day SLA Countdown Active')}
              </span>
              <span className="text-emerald-700 font-bold">{translate('Example message preview')}</span>
            </div>

            <button
              onClick={() => setShowSmsModal(false)}
              className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              {translate('Close & Return to Scrutiny Desk')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}