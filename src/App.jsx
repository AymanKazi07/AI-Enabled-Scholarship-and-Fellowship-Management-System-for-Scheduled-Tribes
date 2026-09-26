import React, { useState } from 'react';
import { schemes } from './schemes';
import VoiceField from './VoiceField';
import { t } from './i18n';
import {
  ShieldCheck, BarChart3, UserCheck, Upload, CheckCircle2,
  AlertTriangle, XCircle, FileText, Sparkles, ArrowRight,
  Award, DollarSign, Download, MessageSquare, Globe, Clock,
  ExternalLink, Search, RefreshCw, Filter, ChevronDown, Check,
  Eye, Phone, Mail, Building, Landmark, User, Lock, Key, LogOut,
  Info, Bell, FileSpreadsheet, ShieldAlert, Cpu, LogIn
} from 'lucide-react';

export default function App() {
  // Navigation & Role states
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'schemes' | 'applicant' | 'scrutiny' | 'merit' | 'dashboard'

  // Officer Authentication State (ONLY AI Scrutiny Desk requires login)
  const [isOfficerLoggedIn, setIsOfficerLoggedIn] = useState(false);
  const [officerCredentials, setOfficerCredentials] = useState({
    username: '',
    password: '',
    captcha: ''
  });
  const [loginError, setLoginError] = useState('');

  // Accessibility & Language states (strictly preserved)
  const [language, setLanguage] = useState(() => localStorage.getItem('siteLanguage') === 'HI' ? 'HI' : 'EN');
  const [voiceLanguage, setVoiceLanguage] = useState(() => localStorage.getItem('siteLanguage') === 'HI' ? 'hi' : 'en');
  const [lowData, setLowData] = useState(() => localStorage.getItem('lowData') === 'true' || navigator.connection?.saveData === true);
  const [textZoom, setTextZoom] = useState('normal'); // 'normal' | 'large' | 'xlarge'

  // Bulletproof bilingual text translator
  const tr = (en, hi) => (language === 'HI' ? hi : en);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('siteLanguage', lang);
    setVoiceLanguage(lang === 'HI' ? 'hi' : 'en');
  };

  const toggleLowData = () => {
    const next = !lowData;
    setLowData(next);
    localStorage.setItem('lowData', String(next));
  };

  // Scheme Discovery Filters
  const [schemeQuery, setSchemeQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterIncome, setFilterIncome] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [expandedScheme, setExpandedScheme] = useState(null);

  // Applicant Portal Form State (NO LOGIN REQUIRED)
  const [applicantForm, setApplicantForm] = useState({
    fullName: '',
    fatherName: '',
    aadhaarNo: '',
    tribeName: '',
    annualIncome: '',
    instituteName: '',
    courseName: '',
    state: 'Jharkhand',
    district: '',
    schemeSelected: 'Pre-Matric Scholarship for ST Students (Class IX & X)',
    casteCertUploaded: false,
    incomeCertUploaded: false
  });
  const [submissionReceipt, setSubmissionReceipt] = useState(null);
  const [isVerifyingDocs, setIsVerifyingDocs] = useState(false);

  // Initial Officer Scrutiny Applications
  const initialApplications = [
    {
      id: 'MOTA-2026-ST-8821',
      name: 'Sunita Soren',
      fatherName: 'Mangal Soren',
      tribe: 'Santhal (ST)',
      state: 'Jharkhand',
      district: 'Dumka',
      scheme: 'National Fellowship for ST Students (M.Phil / Ph.D)',
      institute: 'Birsa Agriculture University, Ranchi',
      course: 'Ph.D. Agronomy',
      marksPercent: 88.5,
      annualIncome: '₹ 1,45,000',
      appliedDate: '2026-09-18',
      aiScore: 98.4,
      status: 'AI Verified',
      statusNote: 'Aadhaar e-KYC matched. Digitally signed caste certificate verified via Jharkhand JharSewa PKI.',
      casteCertDetails: {
        docNo: 'JH/CT/2024/991204',
        issueAuthority: 'Circle Officer, Dumka',
        issueDate: '12-Jan-2024',
        nameMatch: 100,
        casteExtracted: 'Santhal (Recognized ST)',
        signatureStatus: 'Cryptographically Valid'
      }
    },
    {
      id: 'MOTA-2026-ST-8834',
      name: 'Rameshwar Boro',
      fatherName: 'Bijen Boro',
      tribe: 'Boro (ST)',
      state: 'Assam',
      district: 'Kokrajhar',
      scheme: 'National Overseas Scholarship (NOS) for Higher Studies Abroad',
      institute: 'Imperial College London (QS Rank #6)',
      course: 'M.Sc Artificial Intelligence',
      marksPercent: 91.2,
      annualIncome: '₹ 4,20,000',
      appliedDate: '2026-09-21',
      aiScore: 95.8,
      status: 'AI Verified',
      statusNote: 'Foreign unconditional offer verified. Income Certificate under ₹6.0L cap confirmed via Assam Sewa Setu.',
      casteCertDetails: {
        docNo: 'AS/ST/2023/448102',
        issueAuthority: 'Deputy Commissioner, Kokrajhar',
        issueDate: '04-Aug-2023',
        nameMatch: 100,
        casteExtracted: 'Boro (ST Plains)',
        signatureStatus: 'Cryptographically Valid'
      }
    },
    {
      id: 'MOTA-2026-ST-8849',
      name: 'Priyanka Mandavi',
      fatherName: 'Sukhlal Mandavi',
      tribe: 'Gond (ST)',
      state: 'Chhattisgarh',
      district: 'Bastar',
      scheme: 'Top Class Education Scheme for ST Students',
      institute: 'AIIMS Raipur',
      course: 'MBBS (1st Year)',
      marksPercent: 86.0,
      annualIncome: '₹ 2,10,000',
      appliedDate: '2026-09-22',
      aiScore: 61.2,
      status: 'Discrepancy Detected',
      statusNote: 'Blurry upload on Income Certificate. Authority stamp seal obscured. 14-day defect SLA active.',
      casteCertDetails: {
        docNo: 'CG/CST/2022/10041',
        issueAuthority: 'Sub-Divisional Magistrate, Jagdalpur',
        issueDate: '18-Nov-2022',
        nameMatch: 98,
        casteExtracted: 'Gond (Recognized ST)',
        signatureStatus: 'Warning: Stamp Seal Low Contrast OCR'
      }
    },
    {
      id: 'MOTA-2026-ST-8855',
      name: 'Jitin Prakash Uike',
      fatherName: 'Deviram Uike',
      tribe: 'Bharia (PVTG)',
      state: 'Madhya Pradesh',
      district: 'Chhindwara',
      scheme: 'Post-Matric Scholarship for ST Students',
      institute: 'MANIT Bhopal',
      course: 'B.Tech Computer Science',
      marksPercent: 84.4,
      annualIncome: '₹ 95,000',
      appliedDate: '2026-09-24',
      aiScore: 97.2,
      status: 'Approved',
      statusNote: 'PVTG High-Priority candidate. Approved for 100% tuition waiver + ₹1,200/mo maintenance allowance.',
      casteCertDetails: {
        docNo: 'MP/PVTG/2024/774',
        issueAuthority: 'Tehsildar, Tamia Patalkot',
        issueDate: '10-Feb-2024',
        nameMatch: 100,
        casteExtracted: 'Bharia (Particularly Vulnerable Tribal Group)',
        signatureStatus: 'Cryptographically Valid'
      }
    }
  ];

  const [applications, setApplications] = useState(initialApplications);
  const [selectedApp, setSelectedApp] = useState(initialApplications[0]);
  const [officerFilterStatus, setOfficerFilterStatus] = useState('All');
  const [officerSearch, setOfficerSearch] = useState('');

  // Deficiency Notice Modal State
  const [deficiencyModal, setDeficiencyModal] = useState({
    isOpen: false,
    app: null,
    reason: 'Income Certificate is blurry / issuing seal signature not legible by AI OCR engine.',
    channel: 'BOTH'
  });

  // Filter schemes
  const filteredSchemes = schemes.filter(s => {
    const matchesQuery = schemeQuery === '' ||
      s.name.toLowerCase().includes(schemeQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(schemeQuery.toLowerCase());
    const matchesLevel = filterLevel === 'All' || (s.level && s.level.toLowerCase().includes(filterLevel.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || (s.category && s.category.toLowerCase().includes(filterCategory.toLowerCase()));
    return matchesQuery && matchesLevel && matchesCategory;
  });

  // Filter officer applications
  const filteredApplications = applications.filter(app => {
    const matchesStatus = officerFilterStatus === 'All' || app.status === officerFilterStatus;
    const matchesSearch = officerSearch === '' ||
      app.name.toLowerCase().includes(officerSearch.toLowerCase()) ||
      app.id.toLowerCase().includes(officerSearch.toLowerCase()) ||
      app.tribe.toLowerCase().includes(officerSearch.toLowerCase()) ||
      app.institute.toLowerCase().includes(officerSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // CSV Export for Merit List
  const handleExportMeritCSV = () => {
    const headers = ["All_India_Rank,Application_ID,Candidate_Name,Tribe_Category,State,Institute,Course,Merit_Marks_Pct,Annual_Income,AI_Verification_Score,Disbursal_Status\n"];
    const rows = applications.map((app, index) =>
      `${index + 1},${app.id},"${app.name}","${app.tribe}","${app.state}","${app.institute}","${app.course}",${app.marksPercent},"${app.annualIncome}",${app.aiScore}%,"${app.status}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "MoTA_ST_Merit_List_2026_AIR.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Form Submit for Applicants
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsVerifyingDocs(true);
    setTimeout(() => {
      setIsVerifyingDocs(false);
      const generatedId = `MOTA-2026-ST-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRec = {
        id: generatedId,
        name: applicantForm.fullName || 'Tribal Scholar',
        fatherName: applicantForm.fatherName || 'Guardian',
        tribe: applicantForm.tribeName ? `${applicantForm.tribeName} (ST)` : 'Scheduled Tribe (ST)',
        state: applicantForm.state,
        district: applicantForm.district || 'Ranchi',
        scheme: applicantForm.schemeSelected,
        institute: applicantForm.instituteName || 'Central University',
        course: applicantForm.courseName || 'Higher Education',
        marksPercent: 88.0,
        annualIncome: applicantForm.annualIncome ? `₹ ${applicantForm.annualIncome}` : '₹ 1,50,000',
        appliedDate: new Date().toISOString().split('T')[0],
        aiScore: 97.8,
        status: 'AI Verified',
        statusNote: 'Submitted via portal. Immediate AI OCR extraction completed successfully with zero defects.',
        casteCertDetails: {
          docNo: `JH/ST/2026/${Math.floor(100000 + Math.random() * 900000)}`,
          issueAuthority: 'Executive Magistrate',
          issueDate: '15-Aug-2025',
          nameMatch: 100,
          casteExtracted: applicantForm.tribeName || 'Scheduled Tribe',
          signatureStatus: 'Cryptographically Valid'
        }
      };
      setApplications([newRec, ...applications]);
      setSelectedApp(newRec);
      setSubmissionReceipt(newRec);
    }, 1300);
  };

  // Officer Login Handler
  const handleOfficerLogin = (e) => {
    e.preventDefault();
    // Allow demo credentials or sample login
    if (officerCredentials.username.trim() !== '' || true) {
      setIsOfficerLoggedIn(true);
      setLoginError('');
    }
  };

  const handleOfficerLogout = () => {
    setIsOfficerLoggedIn(false);
    setActiveTab('home');
  };

  const handleApprove = (appId) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: 'Approved', statusNote: 'Approved by Verification Officer. Released to PFMS for DBT credit.' } : a));
    if (selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status: 'Approved', statusNote: 'Approved by Verification Officer. Released to PFMS for DBT credit.' });
    }
  };

  const handleSendDeficiencyNotice = () => {
    if (!deficiencyModal.app) return;
    const appId = deficiencyModal.app.id;
    setApplications(applications.map(a => a.id === appId ? {
      ...a,
      status: 'Discrepancy Detected',
      statusNote: `Notice issued (${deficiencyModal.channel}). 14-day SLA deadline triggered. Defect: ${deficiencyModal.reason}`
    } : a));
    if (selectedApp.id === appId) {
      setSelectedApp({
        ...selectedApp,
        status: 'Discrepancy Detected',
        statusNote: `Notice issued (${deficiencyModal.channel}). 14-day SLA deadline triggered. Defect: ${deficiencyModal.reason}`
      });
    }
    alert(`Official Deficiency Notice dispatched via ${deficiencyModal.channel} to ${deficiencyModal.app.name}. 14-day re-upload active.`);
    setDeficiencyModal({ ...deficiencyModal, isOpen: false, app: null });
  };

  const textSizeClass = textZoom === 'large' ? 'text-base' : textZoom === 'xlarge' ? 'text-lg' : 'text-xs';

  return (
    <div className={`min-h-screen bg-slate-100 text-slate-900 font-sans ${textSizeClass}`}>
      {/* 1. TRICOLOR TOP ACCENT STRIPE */}
      <div style={{ height: '5px', width: '100%', background: 'linear-gradient(to right, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)' }} />

      {/* 2. GOVT UTILITIES & ACCESSIBILITY BAR */}
      <div style={{ backgroundColor: '#0f172a', color: '#ffffff', borderBottom: '1px solid #334155', padding: '6px 16px' }} className="flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-3">
          <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
            {tr('GOVERNMENT OF INDIA', 'भारत सरकार')}
          </span>
          <span style={{ color: '#64748b' }}>|</span>
          <span style={{ color: '#e2e8f0' }}>
            {tr('MINISTRY OF TRIBAL AFFAIRS', 'जनजातीय कार्य मंत्रालय')}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Font Resizer */}
          <div style={{ display: 'inline-flex', border: '1px solid #475569', backgroundColor: '#1e293b' }}>
            <button
              onClick={() => setTextZoom('normal')}
              style={{ padding: '2px 8px', fontWeight: 'bold', backgroundColor: textZoom === 'normal' ? '#d97706' : 'transparent', color: '#ffffff', borderRadius: 0 }}
              title="Standard Font Size"
            >
              A-
            </button>
            <button
              onClick={() => setTextZoom('large')}
              style={{ padding: '2px 8px', fontWeight: 'bold', backgroundColor: textZoom === 'large' ? '#d97706' : 'transparent', color: '#ffffff', borderRadius: 0 }}
              title="Large Font Size"
            >
              A
            </button>
            <button
              onClick={() => setTextZoom('xlarge')}
              style={{ padding: '2px 8px', fontWeight: 'bold', backgroundColor: textZoom === 'xlarge' ? '#d97706' : 'transparent', color: '#ffffff', borderRadius: 0 }}
              title="Extra Large Font Size"
            >
              A+
            </button>
          </div>

          {/* Low Bandwidth 2G Mode */}
          <button
            onClick={toggleLowData}
            style={{
              padding: '3px 10px',
              fontWeight: 'bold',
              borderRadius: 0,
              border: lowData ? '1px solid #10b981' : '1px solid #475569',
              backgroundColor: lowData ? '#047857' : '#1e293b',
              color: '#ffffff'
            }}
            className="flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{tr('2G / Low-Data Mode:', '2G / लो-डेटा मोड:')} {lowData ? tr('ON', 'चालू') : tr('OFF', 'बंद')}</span>
          </button>

          {/* ACTIVE BILINGUAL CONVERSION BUTTONS */}
          <div style={{ display: 'inline-flex', border: '1px solid #475569', backgroundColor: '#1e293b' }}>
            <button
              onClick={() => handleLanguageChange('EN')}
              style={{ padding: '3px 10px', fontWeight: 'bold', backgroundColor: language === 'EN' ? '#d97706' : 'transparent', color: '#ffffff', borderRadius: 0 }}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('HI')}
              style={{ padding: '3px 10px', fontWeight: 'bold', backgroundColor: language === 'HI' ? '#d97706' : 'transparent', color: '#ffffff', borderRadius: 0 }}
            >
              हिन्दी
            </button>
          </div>

          {/* Officer Session Badge (shown if logged into Scrutiny desk) */}
          {isOfficerLoggedIn && (
            <div style={{ backgroundColor: '#451a03', border: '1px solid #d97706', padding: '3px 10px', color: '#fef3c7', fontWeight: 'bold' }} className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{tr('Officer Desk #4 Active', 'अधिकारी डेस्क #4 सक्रिय')}</span>
              <button
                onClick={handleOfficerLogout}
                style={{ color: '#f87171', marginLeft: '6px', textDecoration: 'underline' }}
              >
                {tr('Logout', 'लॉगआउट')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. NATIONAL EMBLEM & MINISTRY LOGO BAR */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #cbd5e1', padding: '14px 20px' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* National Emblem Badge */}
            <div style={{ width: '56px', height: '64px', backgroundColor: '#fef3c7', border: '2px solid #0f172a', padding: '4px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark className="w-8 h-8 text-amber-900" />
              <span style={{ fontSize: '7px', fontWeight: '900', color: '#0f172a' }}>सत्यमेव जयते</span>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>
                {tr('Ministry of Tribal Affairs | Government of India', 'जनजातीय कार्य मंत्रालय | भारत सरकार')}
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase', lineHeight: '1.2' }}>
                {tr('TRIBAL-SETU • National ST Portal', 'ट्राइबल-सेतु • राष्ट्रीय अनुसूचित जनजाति पोर्टल')}
              </h1>
              <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                {tr('AI-Enabled National Scholarship & Fellowship Management System (DBT Direct Benefit Transfer)', 'एआई-सक्षम राष्ट्रीय छात्रवृत्ति एवं फैलोशिप प्रबंधन प्रणाली (प्रत्यक्ष लाभ अंतरण)')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col text-right border-r border-slate-200 pr-4">
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>
                {tr('National Tribal Toll-Free Helpline', 'राष्ट्रीय जनजातीय टोल-फ्री हेल्पलाइन')}
              </span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0b2545' }} className="flex items-center justify-end gap-1">
                <Phone className="w-4 h-4 text-amber-600" /> 1800-11-7777
              </span>
              <span style={{ fontSize: '10px', color: '#047857', fontWeight: 'bold' }}>
                {tr('24x7 Multi-Lingual Helpdesk', '24x7 बहुभाषी सहायता केंद्र')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ border: '1px solid #cbd5e1', padding: '4px 8px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '900', color: '#1e3a8a' }}>Digital India</div>
                <div style={{ fontSize: '8px', color: '#64748b', textTransform: 'uppercase' }}>{tr('Power To Empower', 'सशक्तिकरण')}</div>
              </div>
              <div style={{ border: '1px solid #fcd34d', padding: '4px 8px', backgroundColor: '#fffbeb', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '900', color: '#b45309' }}>NSP Partner</div>
                <div style={{ fontSize: '8px', color: '#92400e', textTransform: 'uppercase' }}>{tr('DBT Aadhaar Seeding', 'डीबीटी आधार सीडिंग')}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4. RED TICKER: LATEST NOTIFICATIONS */}
      <div style={{ backgroundColor: '#991b1b', color: '#ffffff', padding: '6px 16px', borderBottom: '2px solid #7f1d1d' }} className="flex items-center overflow-hidden text-xs">
        <div style={{ backgroundColor: '#450a0a', padding: '2px 8px', color: '#fef08a', fontWeight: 'bold', flexShrink: 0, marginRight: '12px' }} className="flex items-center gap-1.5 shadow">
          <Bell className="w-3.5 h-3.5" />
          <span>{tr('LATEST UPDATES:', 'नवीनतम सूचनाएं:')}</span>
        </div>
        <div className="whitespace-nowrap overflow-x-auto scrollbar-none flex gap-8 font-medium">
          <span>• <strong>{tr('National Overseas Scholarship (NOS) 2026-27:', 'राष्ट्रीय प्रवासी छात्रवृत्ति (NOS) 2026-27:')}</strong> {tr('Round 2 candidate verification underway at AI Scrutiny Desk.', 'राउंड 2 अभ्यर्थी सत्यापन एआई संवीक्षा डेस्क पर जारी है।')}</span>
          <span>• <strong>{tr('Aadhaar Face-Auth & e-KYC:', 'आधार फेस-प्रमाणीकरण व ई-केवाईसी:')}</strong> {tr('Mandatory for all Pre-Matric & Post-Matric DBT bank releases.', 'सभी प्री-मैट्रिक और पोस्ट-मैट्रिक डीबीटी भुगतानों के लिए अनिवार्य।')}</span>
          <span>• <strong>{tr('750 Ph.D. Fellowships:', '750 पीएच.डी. फैलोशिप:')}</strong> {tr('Provisional AIR Merit list published. Discrepancy correction open until 15th October 2026.', 'अखिल भारतीय मेरिट सूची प्रकाशित। आपत्ति दर्ज करने की अंतिम तिथि 15 अक्टूबर 2026।')}</span>
          <span>• <strong>{tr('Bhashini Voice Input:', 'भाषिणी वॉयस इनपुट:')}</strong> {tr('Scholars can speak details in Santhali, Gondi, Hindi & English.', 'छात्र संथाली, गोंडी, हिंदी और अंग्रेजी में बोलकर फॉर्म भर सकते हैं।')}</span>
        </div>
      </div>

      {/* 5. PRIMARY GOVT NAVIGATION BAR (SOLID NAVY BLUE) */}
      <nav style={{ backgroundColor: '#0b2545', color: '#ffffff', borderBottom: '3px solid #d97706' }} className="sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center overflow-x-auto">
            <button
              onClick={() => setActiveTab('home')}
              style={{
                padding: '14px 18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backgroundColor: activeTab === 'home' ? '#d97706' : 'transparent',
                color: '#ffffff',
                borderRight: '1px solid #1e3a5f',
                borderRadius: 0
              }}
            >
              {tr('HOME', 'मुख्य पृष्ठ')}
            </button>
            <button
              onClick={() => setActiveTab('schemes')}
              style={{
                padding: '14px 18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backgroundColor: activeTab === 'schemes' ? '#d97706' : 'transparent',
                color: '#ffffff',
                borderRight: '1px solid #1e3a5f',
                borderRadius: 0
              }}
            >
              {tr('SCHEMES DIRECTORY', 'योजनाएं सूची')}
            </button>
            <button
              onClick={() => setActiveTab('applicant')}
              style={{
                padding: '14px 18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backgroundColor: activeTab === 'applicant' ? '#d97706' : 'transparent',
                color: '#ffffff',
                borderRight: '1px solid #1e3a5f',
                borderRadius: 0
              }}
              className="flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              <span>{tr('APPLICANT PORTAL (NO LOGIN)', 'छात्र आवेदन पोर्टल (सीधे भरें)')}</span>
            </button>
            <button
              onClick={() => setActiveTab('scrutiny')}
              style={{
                padding: '14px 18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backgroundColor: activeTab === 'scrutiny' ? '#d97706' : 'transparent',
                color: '#ffffff',
                borderRight: '1px solid #1e3a5f',
                borderRadius: 0
              }}
              className="flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>{tr('AI SCRUTINY DESK (OFFICER LOGIN)', 'एआई संवीक्षा डेस्क (अधिकारी लॉगिन)')}</span>
            </button>
            <button
              onClick={() => setActiveTab('merit')}
              style={{
                padding: '14px 18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backgroundColor: activeTab === 'merit' ? '#d97706' : 'transparent',
                color: '#ffffff',
                borderRight: '1px solid #1e3a5f',
                borderRadius: 0
              }}
              className="flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{tr('AIR MERIT LIST', 'अखिल भारतीय मेरिट')}</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '14px 18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backgroundColor: activeTab === 'dashboard' ? '#d97706' : 'transparent',
                color: '#ffffff',
                borderRight: '1px solid #1e3a5f',
                borderRadius: 0
              }}
              className="flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{tr('BI DASHBOARD', 'डैशबोर्ड')}</span>
            </button>
          </div>

          {/* Sharp Saffron Action Button */}
          <div className="hidden lg:block pl-4">
            <button
              onClick={() => setActiveTab('applicant')}
              style={{ backgroundColor: '#d97706', color: '#ffffff', padding: '10px 18px', fontWeight: '900', textTransform: 'uppercase', borderRadius: 0 }}
              className="hover:bg-amber-700 shadow flex items-center gap-2"
            >
              <span>{tr('APPLY FOR SCHOLARSHIP', 'छात्रवृत्ति हेतु आवेदन करें')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* 6. TAB 1: HOME PAGE (ROYAL NAVY HERO & DISCOVERY PANEL)  */}
      {/* ======================================================== */}
      {activeTab === 'home' && (
        <div>
          {/* Royal Navy Blue Hero Section */}
          <div
            style={{
              backgroundColor: '#0b2545',
              color: '#ffffff',
              padding: '48px 16px 70px 16px',
              borderBottom: '4px solid #d97706'
            }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="max-w-3xl">
                <div style={{ backgroundColor: '#1e3a5f', border: '1px solid #f59e0b', color: '#fef08a', padding: '4px 12px', display: 'inline-block', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', marginBottom: '16px', borderRadius: 0 }}>
                  ★ {tr('Autonomous DBT & Zero-Paperwork Portal for Scheduled Tribes', 'अनुसूचित जनजातियों हेतु स्वायत्त डीबीटी और डिजिटल पोर्टल')}
                </div>
                <h2 style={{ fontSize: '38px', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.15', color: '#ffffff', marginBottom: '16px' }}>
                  {tr('Scholarship & Fellowship Schemes', 'छात्रवृत्ति एवं फैलोशिप योजनाएं')}
                </h2>
                <p style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: '1.6', marginBottom: '28px' }}>
                  {tr(
                    'Ministry of Tribal Affairs, Government of India — Empowering Scheduled Tribe scholars across India and abroad through automated, transparent Direct Benefit Transfers (DBT) and real-time AI-powered document verification.',
                    'जनजातीय कार्य मंत्रालय, भारत सरकार — देश एवं विदेश में अध्ययनरत अनुसूचित जनजाति के शोधार्थियों एवं छात्रों को पारदर्शी प्रत्यक्ष लाभ अंतरण (DBT) और त्वरित एआई दस्तावेज सत्यापन से सशक्त बनाना।'
                  )}
                </p>

                {/* Sharp Cornered Quick Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-10">
                  <button
                    onClick={() => setActiveTab('schemes')}
                    style={{ backgroundColor: '#d97706', color: '#ffffff', padding: '12px 24px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 0 }}
                    className="hover:bg-amber-700 shadow flex items-center gap-2"
                  >
                    <span>{tr('Explore Schemes', 'योजनाएं देखें')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('applicant')}
                    style={{ backgroundColor: 'transparent', color: '#ffffff', border: '2px solid #ffffff', padding: '12px 24px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 0 }}
                    className="hover:bg-white/10"
                  >
                    {tr('Apply Directly (No Login Needed)', 'सीधा आवेदन (लॉगिन की आवश्यकता नहीं)')}
                  </button>
                  <button
                    onClick={() => setActiveTab('scrutiny')}
                    style={{ backgroundColor: '#133e68', color: '#fef08a', border: '1px solid #f59e0b', padding: '12px 22px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 0 }}
                    className="hover:bg-slate-900 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>{tr('Officer Scrutiny Login', 'अधिकारी संवीक्षा लॉगिन')}</span>
                  </button>
                </div>
              </div>

              {/* 4 Feature Badges from Reference Image */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-700">
                <div style={{ backgroundColor: '#133e68', borderLeft: '4px solid #f59e0b', padding: '14px', borderRadius: 0, color: '#ffffff' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#fef08a' }}>{tr('262 Institutes', '262 संस्थान')}</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px', color: '#ffffff' }}>{tr('Premier Institutes', 'उत्कृष्ट संस्थान')}</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{tr('IITs, IIMs, NITs, AIIMS, NLUs with 100% full fee funding', 'आईआईटी, आईआईएम, एम्स में 100% शुल्क प्रतिपूर्ति')}</div>
                </div>

                <div style={{ backgroundColor: '#133e68', borderLeft: '4px solid #10b981', padding: '14px', borderRadius: 0, color: '#ffffff' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#6ee7b7' }}>{tr('750 Fellowships', '750 फैलोशिप')}</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px', color: '#ffffff' }}>{tr('Ph.D. / M.Phil St.', 'पीएच.डी. शोधार्थी')}</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{tr('₹35,000/mo JRF + HRA research grant direct credit', '₹35,000 प्रतिमाह जेआरएफ + एचआरए सीधा बैंक में')}</div>
                </div>

                <div style={{ backgroundColor: '#133e68', borderLeft: '4px solid #38bdf8', padding: '14px', borderRadius: 0, color: '#ffffff' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#7dd3fc' }}>{tr('QS Top 500', 'QS टॉप 500')}</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px', color: '#ffffff' }}>{tr('Overseas Scholars', 'विदेशी अध्ययन')}</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{tr('National Overseas Scheme (NOS) for Master\'s & Ph.D. abroad', 'विदेश में उच्च शिक्षा (NOS) हेतु पूर्ण वित्तीय सहायता')}</div>
                </div>

                <div style={{ backgroundColor: '#133e68', borderLeft: '4px solid #c084fc', padding: '14px', borderRadius: 0, color: '#ffffff' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#d8b4fe' }}>{tr('AI Verification', 'एआई सत्यापन')}</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px', color: '#ffffff' }}>{tr('Instant Scrutiny', 'त्वरित संवीक्षा')}</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{tr('Real-time digital signature & state caste database cross-check', 'जाति प्रमाण पत्र डिजिटल हस्ताक्षर व राज्य डेटाबेस मिलान')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* SMART SCHEME DISCOVERY & FILTER PANEL */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-10 relative z-20">
            <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', padding: '24px', borderRadius: 0 }} className="shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2">
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase' }} className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-amber-600" />
                    <span>{tr('Find the Right Scholarship (Smart Scheme Discovery)', 'सही छात्रवृत्ति खोजें (स्मार्ट योजना खोज)')}</span>
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    {tr('Filter central and state tribal development schemes matching your eligibility criteria.', 'अपनी पात्रता के अनुसार केंद्रीय एवं राज्य जनजातीय विकास योजनाओं को खोजें।')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFilterLevel('All');
                    setFilterIncome('All');
                    setFilterCategory('All');
                    setFilterState('All');
                    setSchemeQuery('');
                  }}
                  style={{ fontSize: '12px', color: '#0b2545', fontWeight: 'bold' }}
                  className="hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> {tr('Reset Filters', 'फ़िल्टर रीसेट करें')}
                </button>
              </div>

              {/* 4 Multi-criteria Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    {tr('Studying Level', 'अध्ययन स्तर')}
                  </label>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    style={{ width: '100%', border: '2px solid #cbd5e1', backgroundColor: '#f8fafc', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', borderRadius: 0 }}
                  >
                    <option value="All">{tr('All Education Levels', 'सभी शिक्षा स्तर')}</option>
                    <option value="Pre-Matric">{tr('Class IX & X (Pre-Matric)', 'कक्षा 9 और 10 (प्री-मैट्रिक)')}</option>
                    <option value="Post-Matric">{tr('Class XI, XII & Diploma', 'कक्षा 11, 12 व डिप्लोमा')}</option>
                    <option value="Higher Education">{tr('UG / Degree / Engineering / Medical', 'स्नातक / इंजीनियरिंग / मेडिकल')}</option>
                    <option value="Research">{tr('M.Phil / Ph.D. Fellowship', 'एम.फिल / पीएच.डी. फैलोशिप')}</option>
                    <option value="Overseas">{tr('Overseas Studies (Masters/Ph.D.)', 'विदेश में उच्च अध्ययन')}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    {tr('Annual Family Income', 'वार्षिक पारिवारिक आय')}
                  </label>
                  <select
                    value={filterIncome}
                    onChange={(e) => setFilterIncome(e.target.value)}
                    style={{ width: '100%', border: '2px solid #cbd5e1', backgroundColor: '#f8fafc', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', borderRadius: 0 }}
                  >
                    <option value="All">{tr('Any Income Limit', 'कोई भी आय सीमा')}</option>
                    <option value="2.5L">{tr('Up to ₹ 2,50,000 / year', '₹ 2,50,000 / वर्ष तक')}</option>
                    <option value="6.0L">{tr('Up to ₹ 6,00,000 / year (NOS)', '₹ 6,00,000 / वर्ष तक (NOS)')}</option>
                    <option value="8.0L">{tr('Up to ₹ 8,00,000 / year (Top Class)', '₹ 8,00,000 / वर्ष तक (Top Class)')}</option>
                    <option value="None">{tr('No Income Ceiling', 'कोई आय सीमा नहीं')}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    {tr('Scheme Category', 'योजना श्रेणी')}
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ width: '100%', border: '2px solid #cbd5e1', backgroundColor: '#f8fafc', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', borderRadius: 0 }}
                  >
                    <option value="All">{tr('All Categories', 'सभी श्रेणियां')}</option>
                    <option value="Pre-Matric">{tr('Pre-Matric ST', 'प्री-मैट्रिक जनजाति')}</option>
                    <option value="Post-Matric">{tr('Post-Matric ST', 'पोस्ट-मैट्रिक जनजाति')}</option>
                    <option value="Higher Education">{tr('Top Class Higher Education', 'टॉप क्लास उच्च शिक्षा')}</option>
                    <option value="Fellowship">{tr('National Fellowship (Ph.D.)', 'राष्ट्रीय फैलोशिप (Ph.D.)')}</option>
                    <option value="Overseas">{tr('National Overseas (Foreign)', 'राष्ट्रीय प्रवासी (विदेश)')}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    {tr('Domicile State / UT', 'मूल निवासी राज्य / केंद्र शासित')}
                  </label>
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    style={{ width: '100%', border: '2px solid #cbd5e1', backgroundColor: '#f8fafc', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', borderRadius: 0 }}
                  >
                    <option value="All">{tr('All India (Central Schemes)', 'अखिल भारतीय (केंद्रीय योजनाएं)')}</option>
                    <option value="Jharkhand">झारखंड (Jharkhand)</option>
                    <option value="Odisha">ओडिशा (Odisha)</option>
                    <option value="Madhya Pradesh">मध्य प्रदेश (Madhya Pradesh)</option>
                    <option value="Chhattisgarh">छत्तीसगढ़ (Chhattisgarh)</option>
                    <option value="Assam">असम एवं पूर्वोत्तर (Assam & NE)</option>
                    <option value="Maharashtra">महाराष्ट्र (Maharashtra)</option>
                  </select>
                </div>
              </div>

              {/* Keyword Search Input & Button */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2 items-center">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={schemeQuery}
                    onChange={(e) => setSchemeQuery(e.target.value)}
                    placeholder={tr("Search by keywords (e.g. 'Ph.D.', 'IIT', 'Hostel allowance', 'Overseas')...", "कीवर्ड द्वारा खोजें (जैसे 'पीएच.डी.', 'आईआईटी', 'छात्रावास', 'विदेश')...")}
                    style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px', fontSize: '12px', color: '#0f172a', borderRadius: 0 }}
                  />
                  {schemeQuery && (
                    <button onClick={() => setSchemeQuery('')} style={{ position: 'absolute', right: '12px', top: '9px', color: '#94a3b8' }}>✕</button>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('schemes')}
                  style={{ backgroundColor: '#0b2545', color: '#ffffff', padding: '9px 24px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
                  className="w-full sm:w-auto hover:bg-slate-900 flex items-center justify-center gap-2"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>{tr(`Search (${filteredSchemes.length} Schemes)`, `खोजें (${filteredSchemes.length} योजनाएं उपलब्ध)`)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* DUAL ROLE GATEWAYS */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Applicant Portal Gateway (NO LOGIN) */}
              <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', padding: '24px', borderRadius: 0, position: 'relative' }} className="shadow-md hover:border-amber-600 transition-all">
                <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#d97706', color: '#ffffff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', padding: '4px 12px' }}>
                  {tr('No Login Required', 'लॉगिन की आवश्यकता नहीं')}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7', border: '1px solid #fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User className="w-6 h-6 text-amber-800" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase' }}>
                      {tr('Scholar Application Portal', 'छात्रवृत्ति आवेदन पोर्टल')}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                      {tr('Directly apply with voice assistance or manual entry', 'बिना लॉगिन सीधे बोलकर या लिखकर तुरंत आवेदन करें')}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.6', marginBottom: '20px' }}>
                  {tr(
                    'ST scholars can submit applications, speak details in tribal languages, and upload certificates directly. An instant official acknowledgement number is issued.',
                    'अनुसूचित जनजाति के छात्र बिना किसी जटिल लॉगिन प्रक्रिया के सीधे अपना आवेदन पत्र भर सकते हैं। फॉर्म जमा होते ही तुरंत पावती पर्ची प्राप्त होगी।'
                  )}
                </p>

                <button
                  onClick={() => setActiveTab('applicant')}
                  style={{ width: '100%', backgroundColor: '#d97706', color: '#ffffff', padding: '12px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
                  className="hover:bg-amber-700 shadow flex items-center justify-center gap-2"
                >
                  <span>{tr('Open Application Form Directly', 'सीधा आवेदन फॉर्म खोलें')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 2: AI Scrutiny Desk Gateway (OFFICER LOGIN REQUIRED) */}
              <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', padding: '24px', borderRadius: 0, position: 'relative' }} className="shadow-md hover:border-slate-800 transition-all">
                <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#0b2545', color: '#ffffff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', padding: '4px 12px' }}>
                  {tr('Officer Access Only', 'केवल अधिकृत अधिकारी')}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#e0f2fe', border: '1px solid #7dd3fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock className="w-6 h-6 text-blue-900" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase' }}>
                      {tr('AI Scrutiny & Verification Desk', 'एआई संवीक्षा एवं सत्यापन डेस्क')}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                      {tr('Protected portal for District & Ministry Officers', 'जिला एवं मंत्रालय स्तर के नोडल अधिकारियों हेतु सुरक्षित लॉगिन')}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.6', marginBottom: '20px' }}>
                  {tr(
                    'Requires official NIC Single Sign-On (SSO) credentials. Officers can inspect high-res certificates with AI bounding boxes and trigger 14-day defect SLAs.',
                    'इस डेस्क तक पहुँचने हेतु शासकीय एनआईसी लॉगिन अनिवार्य है। अधिकारी एआई द्वारा जांची गई पत्रावलियों की समीक्षा कर डीबीटी जारी कर सकते हैं।'
                  )}
                </p>

                <button
                  onClick={() => setActiveTab('scrutiny')}
                  style={{ width: '100%', backgroundColor: '#0b2545', color: '#fef08a', padding: '12px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
                  className="hover:bg-slate-900 shadow flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{tr('Login to AI Scrutiny Desk', 'एआई संवीक्षा डेस्क में लॉगिन करें')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. TAB 2: SCHEMES DIRECTORY                              */}
      {/* ======================================================== */}
      {activeTab === 'schemes' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="border-b-2 border-slate-300 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#b45309', textTransform: 'uppercase' }}>
                {tr('Department of Tribal Development', 'जनजातीय विकास विभाग')}
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase' }}>
                {tr('National ST Scholarship Schemes Directory', 'राष्ट्रीय अनुसूचित जनजाति छात्रवृत्ति योजनाएं')}
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                {tr(`Showing ${filteredSchemes.length} Government of India Welfare Schemes with Full Eligibility Guidelines`, `भारत सरकार की ${filteredSchemes.length} कल्याणकारी योजनाएं पूर्ण पात्रता विवरण सहित`)}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('applicant')}
              style={{ backgroundColor: '#d97706', color: '#ffffff', padding: '10px 18px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
              className="hover:bg-amber-700 shadow"
            >
              + {tr('Start Fresh Application', 'नया आवेदन प्रारंभ करें')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', padding: '20px', borderRadius: 0 }} className="shadow hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', textTransform: 'uppercase' }}>
                      {scheme.category || 'Central Sector Scheme'}
                    </span>
                    <span style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px' }}>
                      DBT Verified
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase', marginBottom: '8px', lineHeight: '1.3' }}>
                    {scheme.name}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
                    {scheme.description}
                  </p>

                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', fontSize: '12px' }} className="space-y-1.5 mb-4">
                    <div className="flex justify-between">
                      <span style={{ color: '#64748b' }}>{tr('Eligible Level:', 'पात्रता स्तर:')}</span>
                      <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{scheme.level || 'All Scheduled Tribe Scholars'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#64748b' }}>{tr('Annual Income Ceiling:', 'वार्षिक आय सीमा:')}</span>
                      <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{scheme.incomeLimit || 'Up to ₹2.50 Lakhs / annum'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#64748b' }}>{tr('Funding / Stipend:', 'वित्तीय सहायता / वजीफा:')}</span>
                      <span style={{ fontWeight: 'bold', color: '#b45309' }}>{scheme.funding || '100% Tuition Waiver + Monthly Grant'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setApplicantForm({ ...applicantForm, schemeSelected: scheme.name });
                      setActiveTab('applicant');
                    }}
                    style={{ flex: 1, backgroundColor: '#d97706', color: '#ffffff', padding: '10px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
                    className="hover:bg-amber-700 shadow"
                  >
                    {tr('Apply for this Scheme', 'इस योजना हेतु आवेदन करें')}
                  </button>
                  <button
                    onClick={() => setExpandedScheme(expandedScheme === idx ? null : idx)}
                    style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 14px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
                  >
                    {expandedScheme === idx ? tr('Hide Guidelines', 'दिशानिर्देश छिपाएं') : tr('Guidelines', 'दिशानिर्देश')}
                  </button>
                </div>

                {expandedScheme === idx && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', fontSize: '12px', color: '#334155' }} className="space-y-2">
                    <div style={{ fontWeight: 'bold', color: '#0b2545', textTransform: 'uppercase' }}>
                      {tr('Mandatory Documents Required:', 'अनिवार्य आवश्यक दस्तावेज:')}
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      <li>{tr('Valid ST Caste Certificate issued by Competent Revenue Authority.', 'सक्षम राजस्व प्राधिकारी द्वारा जारी वैध एसटी जाति प्रमाण पत्र।')}</li>
                      <li>{tr('Current Financial Year Family Income Certificate.', 'चालू वित्तीय वर्ष का पारिवारिक आय प्रमाण पत्र।')}</li>
                      <li>{tr('Aadhaar Card (must be linked to bank account with active DBT seeding).', 'आधार कार्ड (बैंक खाते से डीबीटी सीडिंग लिंक अनिवार्य)।')}</li>
                      <li>{tr('Bonafide Certificate from participating educational institute.', 'शिक्षण संस्थान से बोनाफाइड प्रमाण पत्र।')}</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. TAB 3: APPLICANT PORTAL (NO LOGIN REQUIRED)           */}
      {/* ======================================================== */}
      {activeTab === 'applicant' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
          {/* Header Banner */}
          <div style={{ backgroundColor: '#0b2545', color: '#ffffff', padding: '18px 24px', borderBottom: '4px solid #d97706', marginBottom: '24px' }} className="flex items-center justify-between">
            <div>
              <span style={{ fontSize: '10px', color: '#fef08a', fontWeight: '900', textTransform: 'uppercase' }}>
                {tr('Public Citizen Service Gateway (No Login Needed)', 'नागरिक सेवा पोर्टल (लॉगिन की आवश्यकता नहीं)')}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', color: '#ffffff' }}>
                {tr('ST Scholar Direct Application Desk', 'अनुसूचित जनजाति छात्रवृत्ति सीधा आवेदन')}
              </h2>
              <p style={{ fontSize: '12px', color: '#cbd5e1' }}>
                {tr('Fill and submit your form directly with instant official receipt generation', 'अपना फॉर्म भरें एवं तुरंत आधिकारिक पावती पर्ची प्राप्त करें')}
              </p>
            </div>
            <div style={{ backgroundColor: '#d97706', color: '#ffffff', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 0 }}>
              {tr('Open Access', 'खुला पोर्टल')}
            </div>
          </div>

          {/* Submission Receipt */}
          {submissionReceipt ? (
            <div style={{ backgroundColor: '#ffffff', border: '2px solid #059669', padding: '24px', borderRadius: 0 }} className="shadow-xl">
              <div className="flex items-center gap-3 border-b-2 border-emerald-100 pb-4 mb-4">
                <div style={{ width: '48px', height: '48px', backgroundColor: '#d1fae5', border: '1px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase' }}>
                    {tr('Application Successfully Registered', 'आवेदन सफलतापूर्वक पंजीकृत')}
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>
                    {tr('Application ID:', 'आवेदन संख्या:')} {submissionReceipt.id}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    {tr('Official Acknowledgement Slip • Ministry of Tribal Affairs', 'आधिकारिक पावती पर्ची • जनजातीय कार्य मंत्रालय')}
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '16px', fontSize: '12px' }} className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>{tr('Applicant Name:', 'आवेदक का नाम:')}</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{submissionReceipt.name}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>{tr('Father / Guardian:', 'पिता / अभिभावक:')}</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{submissionReceipt.fatherName}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>{tr('Tribe Community:', 'जनजाति समुदाय:')}</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{submissionReceipt.tribe}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>{tr('Domicile State:', 'मूल राज्य:')}</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{submissionReceipt.state} ({submissionReceipt.district})</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>{tr('Applied Scheme:', 'चयनित योजना:')}</span>
                  <span style={{ fontWeight: 'bold', color: '#b45309' }}>{submissionReceipt.scheme}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>{tr('AI Scrutiny Desk Status:', 'एआई संवीक्षा स्थिति:')}</span>
                  <span style={{ fontWeight: 'bold', color: '#059669' }} className="flex items-center gap-1">
                    <Check className="w-4 h-4" /> {submissionReceipt.status} (Score: {submissionReceipt.aiScore}%)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => window.print()}
                  style={{ backgroundColor: '#0b2545', color: '#ffffff', padding: '10px 20px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
                  className="hover:bg-slate-900 shadow flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> {tr('Download Acknowledgement Slip', 'पावती पर्ची डाउनलोड करें')}
                </button>
                <button
                  onClick={() => {
                    setSubmissionReceipt(null);
                    setApplicantForm({
                      fullName: '',
                      fatherName: '',
                      aadhaarNo: '',
                      tribeName: '',
                      annualIncome: '',
                      instituteName: '',
                      courseName: '',
                      state: 'Jharkhand',
                      district: '',
                      schemeSelected: 'Pre-Matric Scholarship for ST Students (Class IX & X)',
                      casteCertUploaded: false,
                      incomeCertUploaded: false
                    });
                  }}
                  style={{ backgroundColor: '#d97706', color: '#ffffff', padding: '10px 20px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
                  className="hover:bg-amber-700"
                >
                  {tr('Apply For Another Candidate', 'अन्य उम्मीदवार हेतु आवेदन करें')}
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Application Form with inputs and VoiceField */
            <form onSubmit={handleFormSubmit} style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', padding: '24px', borderRadius: 0 }} className="shadow-md">
              {/* Voice assistance banner */}
              <div style={{ backgroundColor: '#fffbeb', borderLeft: '4px solid #d97706', padding: '12px', marginBottom: '24px' }} className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div style={{ fontSize: '12px', color: '#334155' }}>
                  <span style={{ fontWeight: 'bold', color: '#0f172a', display: 'block', textTransform: 'uppercase' }}>
                    {tr('Bhashini Multi-Lingual Voice Input Active', 'भाषिणी बहुभाषी वॉयस इनपुट सक्रिय')}
                  </span>
                  {tr(
                    'Speak into your microphone or type directly. Supports Hindi, English, Santhali and Gondi.',
                    'माइक पर बोलकर या सीधे टाइप करके जानकारी दर्ज करें। हिंदी, अंग्रेजी व क्षेत्रीय भाषाएं समर्थित हैं।'
                  )}
                </div>
              </div>

              {/* Section 1: Demographics */}
              <div className="mb-6">
                <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
                  {tr('1. Candidate Personal & Scheduled Tribe Demographics', '1. अभ्यर्थी की व्यक्तिगत एवं जनजाति संबंधी जानकारी')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('Applicant Full Name (As per Aadhaar) *', 'आवेदक का पूरा नाम (आधार के अनुसार) *')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={applicantForm.fullName}
                        onChange={(e) => setApplicantForm({ ...applicantForm, fullName: e.target.value })}
                        placeholder={tr("e.g. Rahul Devendra Munda", "उदा. राहुल देवेन्द्र मुंडा")}
                        style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 0 }}
                      />
                      <div className="flex-shrink-0">
                        <VoiceField
                          onTranscript={(text) => setApplicantForm(prev => ({ ...prev, fullName: text }))}
                          onChange={(text) => setApplicantForm(prev => ({ ...prev, fullName: text }))}
                          value={applicantForm.fullName}
                          lang={voiceLanguage}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('Father / Mother / Guardian Name *', 'पिता / माता / अभिभावक का नाम *')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={applicantForm.fatherName}
                        onChange={(e) => setApplicantForm({ ...applicantForm, fatherName: e.target.value })}
                        placeholder={tr("e.g. Sugana Munda", "उदा. सुगना मुंडा")}
                        style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 0 }}
                      />
                      <div className="flex-shrink-0">
                        <VoiceField
                          onTranscript={(text) => setApplicantForm(prev => ({ ...prev, fatherName: text }))}
                          onChange={(text) => setApplicantForm(prev => ({ ...prev, fatherName: text }))}
                          value={applicantForm.fatherName}
                          lang={voiceLanguage}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('12-Digit Aadhaar No. *', '12-अंकीय आधार संख्या *')}
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      required
                      placeholder="XXXX-XXXX-XXXX"
                      value={applicantForm.aadhaarNo}
                      onChange={(e) => setApplicantForm({ ...applicantForm, aadhaarNo: e.target.value })}
                      style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 0 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('ST Community Name *', 'जनजाति समुदाय का नाम *')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder={tr("e.g. Santhal, Gond, Munda", "उदा. संथाली, गोंड, मुंडा")}
                        value={applicantForm.tribeName}
                        onChange={(e) => setApplicantForm({ ...applicantForm, tribeName: e.target.value })}
                        style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 0 }}
                      />
                      <div className="flex-shrink-0">
                        <VoiceField
                          onTranscript={(text) => setApplicantForm(prev => ({ ...prev, tribeName: text }))}
                          onChange={(text) => setApplicantForm(prev => ({ ...prev, tribeName: text }))}
                          value={applicantForm.tribeName}
                          lang={voiceLanguage}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('Annual Family Income (INR) *', 'वार्षिक पारिवारिक आय (रु) *')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="150000"
                        value={applicantForm.annualIncome}
                        onChange={(e) => setApplicantForm({ ...applicantForm, annualIncome: e.target.value })}
                        style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 0 }}
                      />
                      <div className="flex-shrink-0">
                        <VoiceField
                          onTranscript={(text) => setApplicantForm(prev => ({ ...prev, annualIncome: text }))}
                          onChange={(text) => setApplicantForm(prev => ({ ...prev, annualIncome: text }))}
                          value={applicantForm.annualIncome}
                          lang={voiceLanguage}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('Domicile State / UT *', 'मूल निवासी राज्य *')}
                    </label>
                    <select
                      value={applicantForm.state}
                      onChange={(e) => setApplicantForm({ ...applicantForm, state: e.target.value })}
                      style={{ width: '100%', border: '2px solid #cbd5e1', backgroundColor: '#ffffff', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', borderRadius: 0 }}
                    >
                      <option value="Jharkhand">झारखंड (Jharkhand)</option>
                      <option value="Odisha">ओडिशा (Odisha)</option>
                      <option value="Madhya Pradesh">मध्य प्रदेश (Madhya Pradesh)</option>
                      <option value="Chhattisgarh">छत्तीसगढ़ (Chhattisgarh)</option>
                      <option value="Assam">असम (Assam)</option>
                      <option value="Maharashtra">महाराष्ट्र (Maharashtra)</option>
                      <option value="Nagaland">नागालैंड (Nagaland)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('Home District *', 'गृह जिला *')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder={tr("e.g. Ranchi, Dumka, Bastar", "उदा. रांची, दुमका, बस्तर")}
                        value={applicantForm.district}
                        onChange={(e) => setApplicantForm({ ...applicantForm, district: e.target.value })}
                        style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 0 }}
                      />
                      <div className="flex-shrink-0">
                        <VoiceField
                          onTranscript={(text) => setApplicantForm(prev => ({ ...prev, district: text }))}
                          onChange={(text) => setApplicantForm(prev => ({ ...prev, district: text }))}
                          value={applicantForm.district}
                          lang={voiceLanguage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Scheme & Academics */}
              <div className="mb-6">
                <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
                  {tr('2. Welfare Scheme Selection & Institute Bonafide', '2. छात्रवृत्ति योजना चयन एवं शिक्षण संस्थान विवरण')}
                </h3>

                <div className="mb-4">
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    {tr('Select Target Welfare Scheme *', 'योजना का चयन करें *')}
                  </label>
                  <select
                    value={applicantForm.schemeSelected}
                    onChange={(e) => setApplicantForm({ ...applicantForm, schemeSelected: e.target.value })}
                    style={{ width: '100%', border: '2px solid #cbd5e1', backgroundColor: '#ffffff', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', borderRadius: 0 }}
                  >
                    {schemes.map((s, idx) => (
                      <option key={idx} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('Enrolled Institute / University Name *', 'विश्वविद्यालय / संस्थान का नाम *')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder={tr("e.g. Birsa Agriculture University / IIT Bombay", "उदा. बिरसा कृषि विश्वविद्यालय / आईआईटी बॉम्बे")}
                        value={applicantForm.instituteName}
                        onChange={(e) => setApplicantForm({ ...applicantForm, instituteName: e.target.value })}
                        style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 0 }}
                      />
                      <div className="flex-shrink-0">
                        <VoiceField
                          onTranscript={(text) => setApplicantForm(prev => ({ ...prev, instituteName: text }))}
                          onChange={(text) => setApplicantForm(prev => ({ ...prev, instituteName: text }))}
                          value={applicantForm.instituteName}
                          lang={voiceLanguage}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('Course & Year of Study *', 'पाठ्यक्रम एवं अध्ययन वर्ष *')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder={tr("e.g. Ph.D. Agronomy (2nd Year)", "उदा. पीएच.डी. एग्रोनॉमी (द्वितीय वर्ष)")}
                        value={applicantForm.courseName}
                        onChange={(e) => setApplicantForm({ ...applicantForm, courseName: e.target.value })}
                        style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', backgroundColor: '#ffffff', borderRadius: 0 }}
                      />
                      <div className="flex-shrink-0">
                        <VoiceField
                          onTranscript={(text) => setApplicantForm(prev => ({ ...prev, courseName: text }))}
                          onChange={(text) => setApplicantForm(prev => ({ ...prev, courseName: text }))}
                          value={applicantForm.courseName}
                          lang={voiceLanguage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Document Uploads */}
              <div className="mb-6">
                <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
                  {tr('3. Digital Certificate Upload (Instant AI OCR Scan)', '3. डिजिटल प्रमाण पत्र अपलोड (त्वरित एआई स्कैन)')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div style={{ border: '2px dashed #cbd5e1', padding: '16px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                    <FileText className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', display: 'block' }}>
                      {tr('ST Caste Certificate', 'एसटी जाति प्रमाण पत्र')}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '12px' }}>
                      {tr('Issued by SDM / Tehsildar (PDF/JPG)', 'सक्षम राजस्व प्राधिकारी द्वारा जारी')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setApplicantForm({ ...applicantForm, casteCertUploaded: true })}
                      style={{
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        borderRadius: 0,
                        border: '1px solid',
                        backgroundColor: applicantForm.casteCertUploaded ? '#047857' : '#ffffff',
                        borderColor: applicantForm.casteCertUploaded ? '#047857' : '#94a3b8',
                        color: applicantForm.casteCertUploaded ? '#ffffff' : '#0f172a'
                      }}
                    >
                      {applicantForm.casteCertUploaded ? tr('✓ Certificate Uploaded', '✓ प्रमाण पत्र अपलोड हुआ') : tr('Upload ST Certificate', 'जाति प्रमाण पत्र अपलोड करें')}
                    </button>
                  </div>

                  <div style={{ border: '2px dashed #cbd5e1', padding: '16px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                    <Landmark className="w-8 h-8 text-blue-700 mx-auto mb-2" />
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', display: 'block' }}>
                      {tr('Annual Income Certificate', 'आय प्रमाण पत्र')}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '12px' }}>
                      {tr('Valid for FY 2025-26', 'वित्तीय वर्ष 2025-26 हेतु वैध')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setApplicantForm({ ...applicantForm, incomeCertUploaded: true })}
                      style={{
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        borderRadius: 0,
                        border: '1px solid',
                        backgroundColor: applicantForm.incomeCertUploaded ? '#047857' : '#ffffff',
                        borderColor: applicantForm.incomeCertUploaded ? '#047857' : '#94a3b8',
                        color: applicantForm.incomeCertUploaded ? '#ffffff' : '#0f172a'
                      }}
                    >
                      {applicantForm.incomeCertUploaded ? tr('✓ Certificate Uploaded', '✓ प्रमाण पत्र अपलोड हुआ') : tr('Upload Income Certificate', 'आय प्रमाण पत्र अपलोड करें')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {tr('By submitting, you certify that all information is truthful under IT Act 2000.', 'जमा करके आप प्रमाणित करते हैं कि दी गई जानकारी सत्य एवं वैध है।')}
                </span>
                <button
                  type="submit"
                  disabled={isVerifyingDocs}
                  style={{ backgroundColor: isVerifyingDocs ? '#94a3b8' : '#d97706', color: '#ffffff', padding: '12px 28px', fontWeight: '900', textTransform: 'uppercase', fontSize: '13px', borderRadius: 0 }}
                  className="hover:bg-amber-700 shadow flex items-center gap-2"
                >
                  {isVerifyingDocs ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{tr('Verifying with AI Engine...', 'एआई इंजन द्वारा सत्यापन जारी...')}</span>
                    </>
                  ) : (
                    <>
                      <span>{tr('Submit Application & Get Receipt', 'आवेदन जमा करें एवं पावती प्राप्त करें')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. TAB 4: AI SCRUTINY DESK (DEDICATED OFFICER LOGIN)    */}
      {/* ======================================================== */}
      {activeTab === 'scrutiny' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          {/* CASE A: OFFICER NOT LOGGED IN -> RENDER DEDICATED LOGIN PORTAL */}
          {!isOfficerLoggedIn ? (
            <div className="max-w-md mx-auto my-8">
              <div style={{ backgroundColor: '#ffffff', border: '3px solid #0b2545', borderRadius: 0 }} className="shadow-2xl">
                {/* Login Header */}
                <div style={{ backgroundColor: '#0b2545', color: '#ffffff', padding: '20px', textAlign: 'center', borderBottom: '3px solid #d97706' }}>
                  <div className="flex justify-center mb-2">
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Landmark className="w-7 h-7 text-amber-900" />
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#fef08a', fontWeight: '900', textTransform: 'uppercase' }}>
                    {tr('Department of Tribal Development', 'जनजातीय विकास विभाग')}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', marginTop: '2px' }}>
                    {tr('AI Scrutiny Desk • Officer Login', 'एआई संवीक्षा डेस्क • अधिकारी लॉगिन')}
                  </h3>
                  <p style={{ fontSize: '11px', color: '#cbd5e1' }}>
                    {tr('National Informatics Centre (NIC Parichay SSO)', 'राष्ट्रीय सूचना विज्ञान केंद्र (एनआईसी परिचय एसएसओ)')}
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleOfficerLogin} className="p-6 space-y-4">
                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px', fontSize: '11px', color: '#1e3a8a' }}>
                    <strong>{tr('Restricted Access:', 'प्रतिबंधित क्षेत्र:')}</strong> {tr('This portal is strictly for authorized verification officers, state nodal officers & MoTA scrutiny officials.', 'यह पोर्टल केवल अधिकृत सत्यापन अधिकारियों व राज्य नोडल अधिकारियों हेतु है।')}
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('Official NIC / Gov.in Email or Employee ID *', 'शासकीय ईमेल या कर्मचारी आईडी *')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={officerCredentials.username}
                        onChange={(e) => setOfficerCredentials({ ...officerCredentials, username: e.target.value })}
                        placeholder="sk.meena@gov.in"
                        style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px 8px 34px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', borderRadius: 0 }}
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('Password / Security Token *', 'पासवर्ड / सुरक्षा टोकन *')}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={officerCredentials.password}
                        onChange={(e) => setOfficerCredentials({ ...officerCredentials, password: e.target.value })}
                        placeholder="••••••••••••"
                        style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px 8px 34px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', borderRadius: 0 }}
                      />
                      <Key className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Security Captcha */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {tr('Security Captcha Verification *', 'सुरक्षा कैप्चा सत्यापन *')}
                    </label>
                    <div className="flex items-center gap-2">
                      <div style={{ backgroundColor: '#1e293b', color: '#fef08a', padding: '8px 16px', fontWeight: 'black', letterSpacing: '4px', fontSize: '14px', fontFamily: 'monospace' }}>
                        T 7 B 9 K
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Captcha"
                        value={officerCredentials.captcha}
                        onChange={(e) => setOfficerCredentials({ ...officerCredentials, captcha: e.target.value })}
                        style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', borderRadius: 0 }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{ width: '100%', backgroundColor: '#0b2545', color: '#fef08a', padding: '12px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
                    className="hover:bg-slate-900 shadow flex items-center justify-center gap-2 mt-4"
                  >
                    <LogIn className="w-4 h-4 text-amber-400" />
                    <span>{tr('Sign In with Parichay SSO', 'परिचय एसएसओ द्वारा लॉगिन करें')}</span>
                  </button>

                  {/* Instant Demo Login Button */}
                  <div className="pt-3 border-t border-slate-200 text-center">
                    <button
                      type="button"
                      onClick={() => setIsOfficerLoggedIn(true)}
                      style={{ backgroundColor: '#d97706', color: '#ffffff', padding: '8px 16px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', borderRadius: 0 }}
                      className="hover:bg-amber-700 shadow"
                    >
                      ★ {tr('Instant Demo Login (Dr. S. K. Meena, Verification Officer)', 'त्वरित डेमो लॉगिन (डॉ. एस. के. मीणा, सत्यापन अधिकारी)')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* CASE B: OFFICER IS LOGGED IN -> RENDER FULL SPLIT-SCREEN SCRUTINY DESK */
            <div>
              {/* Officer Header with Logout */}
              <div style={{ backgroundColor: '#0b2545', color: '#ffffff', padding: '16px 20px', borderBottom: '4px solid #d97706', marginBottom: '24px' }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ backgroundColor: '#f59e0b', color: '#020617', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 0 }}>
                      NIC SSO Verified
                    </span>
                    <span style={{ fontSize: '11px', color: '#fef08a', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {tr('Department of Tribal Development', 'जनजातीय विकास विभाग')}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', marginTop: '4px', color: '#ffffff' }}>
                    {tr('AI Automated Scrutiny & Verification Desk', 'एआई स्वचालित संवीक्षा एवं सत्यापन डेस्क')}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#cbd5e1' }}>
                    {tr('Active Officer Session: ', 'सक्रिय अधिकारी सत्र: ')} <strong>Dr. S. K. Meena, State Verification Officer (MoTA Desk #4)</strong>
                  </p>
                </div>

                {/* Queue Filter and Logout */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setOfficerFilterStatus('All')}
                    style={{
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      borderRadius: 0,
                      backgroundColor: officerFilterStatus === 'All' ? '#d97706' : '#1e3a5f',
                      color: '#ffffff',
                      border: '1px solid #475569'
                    }}
                  >
                    {tr('All', 'सभी')} ({applications.length})
                  </button>
                  <button
                    onClick={() => setOfficerFilterStatus('AI Verified')}
                    style={{
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      borderRadius: 0,
                      backgroundColor: officerFilterStatus === 'AI Verified' ? '#047857' : '#1e3a5f',
                      color: '#ffffff',
                      border: '1px solid #475569'
                    }}
                  >
                    {tr('AI Verified', 'सत्यापित')}
                  </button>
                  <button
                    onClick={() => setOfficerFilterStatus('Discrepancy Detected')}
                    style={{
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      borderRadius: 0,
                      backgroundColor: officerFilterStatus === 'Discrepancy Detected' ? '#b91c1c' : '#1e3a5f',
                      color: '#ffffff',
                      border: '1px solid #475569'
                    }}
                  >
                    {tr('Discrepancies', 'कमियां पाई गईं')}
                  </button>

                  <button
                    onClick={handleOfficerLogout}
                    style={{ backgroundColor: '#991b1b', color: '#ffffff', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 0 }}
                    className="hover:bg-red-800 flex items-center gap-1 ml-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{tr('Log Out', 'लॉगआउट')}</span>
                  </button>
                </div>
              </div>

              {/* SPLIT-SCREEN WORKSPACE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column (4 cols): Queue */}
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', borderRadius: 0 }} className="lg:col-span-4 shadow flex flex-col h-[750px]">
                  <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                    <input
                      type="text"
                      placeholder={tr("Filter by name, app ID, tribe...", "नाम, आवेदन संख्या, जनजाति द्वारा खोजें...")}
                      value={officerSearch}
                      onChange={(e) => setOfficerSearch(e.target.value)}
                      style={{ width: '100%', border: '1px solid #cbd5e1', padding: '6px 10px', fontSize: '12px', color: '#0f172a', borderRadius: 0 }}
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
                    {filteredApplications.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        style={{
                          backgroundColor: selectedApp.id === app.id ? '#fffbeb' : '#ffffff',
                          borderLeft: selectedApp.id === app.id ? '4px solid #d97706' : '4px solid transparent'
                        }}
                        className="p-3.5 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-mono font-bold text-slate-600">{app.id}</span>
                          <span className={`px-2 py-0.5 font-bold uppercase text-[9px] ${app.status === 'Approved' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                            app.status === 'AI Verified' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                              'bg-red-100 text-red-900 border border-red-300'
                            }`}>
                            {app.status}
                          </span>
                        </div>

                        <div className="font-black text-slate-900 text-sm">{app.name}</div>
                        <div className="text-xs text-slate-600">{app.tribe} • {app.state}</div>
                        <div className="text-[11px] text-amber-900 font-semibold mt-1 truncate">{app.scheme}</div>

                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                          <span>AIR Score: <strong>{app.marksPercent}%</strong></span>
                          <span className="font-bold text-emerald-700">AI Score: {app.aiScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column (8 cols): Certificate Split-Screen */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Top: Candidate Scorecard */}
                  <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', padding: '20px', borderRadius: 0 }} className="shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2">
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>
                          {tr('Selected Candidate Dossier', 'चयनित पत्रावली')}
                        </span>
                        <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase' }}>{selectedApp.name} ({selectedApp.id})</h3>
                        <p style={{ fontSize: '12px', color: '#475569' }}>{selectedApp.course} • {selectedApp.institute}</p>
                      </div>

                      {/* AI Confidence Meter */}
                      <div className="text-right">
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {tr('AI Authenticity Index', 'एआई प्रामाणिकता सूचकांक')}
                        </span>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: selectedApp.aiScore >= 90 ? '#047857' : '#b91c1c' }}>
                          {selectedApp.aiScore}%
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: '600', color: '#64748b' }}>Zero-Tamper Hash Match</span>
                      </div>
                    </div>

                    {/* 4 Inspection Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-4">
                      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Aadhaar e-KYC</span>
                        <span style={{ fontWeight: 'bold', color: '#047857' }} className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> 100% Match
                        </span>
                      </div>

                      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Caste Certificate</span>
                        <span style={{ fontWeight: 'bold', color: '#047857' }} className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Digitally Valid
                        </span>
                      </div>

                      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Income Cap</span>
                        <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{selectedApp.annualIncome}</span>
                      </div>

                      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Academic Merit</span>
                        <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{selectedApp.marksPercent}% Score</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', padding: '10px', fontSize: '12px', color: '#334155' }}>
                      <strong>AI Inspection Log:</strong> {selectedApp.statusNote}
                    </div>
                  </div>

                  {/* REALISTIC CERTIFICATE INSPECTION PREVIEW WITH AI BOUNDING BOXES */}
                  <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', padding: '20px', borderRadius: 0 }} className="shadow">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                      <h4 style={{ fontSize: '12px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase' }} className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-700" />
                        <span>{tr('Real-Time Certificate OCR & Security Seal Verification View', 'प्रमाण पत्र ओसीआर एवं सुरक्षा सील लाइव संवीक्षा')}</span>
                      </h4>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', border: '1px solid #cbd5e1' }}>
                        High-Res 300 DPI Rendering
                      </span>
                    </div>

                    {/* Simulated Official Indian Government State Certificate */}
                    <div style={{ backgroundColor: '#fffdfa', border: '4px solid #8B7355', padding: '24px', position: 'relative', overflow: 'hidden' }} className="shadow-inner font-serif text-slate-900">
                      {/* Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <Landmark className="w-80 h-80 text-slate-900" />
                      </div>

                      {/* Certificate Top Header */}
                      <div className="text-center border-b-2 border-slate-400 pb-3 mb-4">
                        <div style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#475569' }} className="font-sans">
                          GOVERNMENT OF {selectedApp.state.toUpperCase()} • REVENUE ADMINISTRATION
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', marginTop: '4px' }}>
                          CERTIFICATE OF SCHEDULED TRIBE (ST)
                        </div>
                        <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#475569' }}>
                          Issued under Constitution (Scheduled Tribes) Order, 1950
                        </div>
                      </div>

                      {/* Certificate Body with AI Bounding Box Highlights */}
                      <div className="space-y-3 text-xs leading-relaxed">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 border-b border-dashed border-slate-300 pb-1">
                          <span>Certificate No: <strong>{selectedApp.casteCertDetails.docNo}</strong></span>
                          <span>Date of Issue: <strong>{selectedApp.casteCertDetails.issueDate}</strong></span>
                        </div>

                        <p>
                          This is to certify that Shri / Smt / Kumari{' '}
                          {/* AI Bounding Box 1: Name */}
                          <span style={{ border: '2px solid #059669', backgroundColor: 'rgba(209, 250, 229, 0.6)', padding: '2px 6px', fontWeight: 'bold', position: 'relative', display: 'inline-block' }} className="font-sans text-slate-950">
                            {selectedApp.name}
                            <span style={{ position: 'absolute', top: '-14px', right: 0, backgroundColor: '#059669', color: '#ffffff', fontSize: '8px', padding: '1px 4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                              AI: 100% Name Match
                            </span>
                          </span>
                          , son / daughter of Shri{' '}
                          <span className="font-bold">{selectedApp.fatherName}</span> of Village/Town{' '}
                          <span className="font-bold">{selectedApp.district}</span> in District{' '}
                          <span className="font-bold">{selectedApp.district}</span> of the State of{' '}
                          <span className="font-bold">{selectedApp.state}</span> belongs to the{' '}
                          {/* AI Bounding Box 2: Tribe */}
                          <span style={{ border: '2px solid #2563eb', backgroundColor: 'rgba(219, 234, 254, 0.6)', padding: '2px 6px', fontWeight: 'bold', position: 'relative', display: 'inline-block' }} className="font-sans text-blue-950">
                            {selectedApp.tribe}
                            <span style={{ position: 'absolute', top: '-14px', right: 0, backgroundColor: '#2563eb', color: '#ffffff', fontSize: '8px', padding: '1px 4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                              AI: Valid ST Schedule
                            </span>
                          </span>{' '}
                          Community which is recognized as a Scheduled Tribe under the Constitution of India.
                        </p>

                        <p style={{ fontSize: '11px', color: '#334155' }}>
                          2. Shri/Kumari {selectedApp.name} and his/her family ordinarily reside(s) in District {selectedApp.district} of {selectedApp.state}.
                        </p>
                      </div>

                      {/* Certificate Footer Seals */}
                      <div className="mt-8 pt-4 border-t-2 border-slate-300 flex justify-between items-end">
                        {/* Official Stamp Seal */}
                        <div className="text-center">
                          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #991b1b', color: '#991b1b', padding: '4px', fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)' }}>
                            <span>REVENUE</span>
                            <span>OFFICE</span>
                            <span>SEAL</span>
                          </div>
                          <span style={{ fontSize: '9px', color: '#64748b', display: 'block', marginTop: '4px' }} className="font-sans">Official State Seal</span>
                        </div>

                        {/* Digital Signature Box */}
                        <div style={{ border: '1px solid #94a3b8', backgroundColor: '#ffffff', padding: '8px', textAlign: 'right' }}>
                          <div style={{ fontSize: '9px', color: '#047857', fontWeight: 'bold' }} className="font-mono flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>DIGITALLY SIGNED VIA JHARSEWA PKI</span>
                          </div>
                          <div style={{ fontSize: '9px', color: '#475569' }}>
                            Signer: {selectedApp.casteCertDetails.issueAuthority}
                          </div>
                          <div style={{ fontSize: '8px', color: '#64748b' }}>
                            Timestamp: {selectedApp.casteCertDetails.issueDate} 11:42:01 IST
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Officer Decision Bar (Strictly Sharp-Cornered Buttons) */}
                    <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div style={{ fontSize: '12px', color: '#475569' }}>
                        Current Status: <strong style={{ color: '#0f172a', textTransform: 'uppercase' }}>{selectedApp.status}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDeficiencyModal({
                            isOpen: true,
                            app: selectedApp,
                            reason: 'Income Certificate is blurry / issuing seal signature not legible by AI OCR engine.',
                            channel: 'BOTH'
                          })}
                          style={{ backgroundColor: '#b91c1c', color: '#ffffff', padding: '8px 16px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
                          className="hover:bg-red-800 shadow flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{tr('Issue 14-Day Deficiency Notice', '14-दिवसीय आपत्ति नोटिस भेजें')}</span>
                        </button>

                        <button
                          onClick={() => handleApprove(selectedApp.id)}
                          style={{ backgroundColor: '#047857', color: '#ffffff', padding: '8px 20px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
                          className="hover:bg-emerald-800 shadow flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{tr('Approve & Release DBT', 'स्वीकृत करें एवं डीबीटी जारी करें')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. TAB 5: AIR MERIT LIST & CSV EXPORT (NO LOGIN)        */}
      {/* ======================================================== */}
      {activeTab === 'merit' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="border-b-2 border-slate-300 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#b45309', textTransform: 'uppercase' }}>
                {tr('Automated AIR Ranking Engine', 'स्वचालित मेरिट रैंकिंग प्रणाली')}
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase' }}>
                {tr('All-India Merit List (National ST Fellowships & Scholarships)', 'अखिल भारतीय मेरिट सूची (एसटी छात्रवृत्ति एवं फैलोशिप)')}
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                {tr('Ranked objectively by academic score + family need quotient with zero human bias.', 'अकादमिक प्राप्तांक एवं पारिवारिक आवश्यकता के आधार पर पारदर्शी निष्पक्ष वरीयता क्रम।')}
              </p>
            </div>

            <button
              onClick={handleExportMeritCSV}
              style={{ backgroundColor: '#047857', color: '#ffffff', padding: '10px 18px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', borderRadius: 0 }}
              className="hover:bg-emerald-800 shadow flex items-center gap-2 self-start sm:self-auto"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{tr('Download Official CSV Merit Sheet', 'आधिकारिक सीएसवी मेरिट शीट डाउनलोड करें')}</span>
            </button>
          </div>

          {/* Merit Table */}
          <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', borderRadius: 0 }} className="shadow overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#0b2545', color: '#ffffff', borderBottom: '3px solid #d97706' }} className="uppercase text-[11px] tracking-wider">
                  <th className="p-3 font-black">AIR</th>
                  <th className="p-3 font-black">{tr('Application ID', 'आवेदन संख्या')}</th>
                  <th className="p-3 font-black">{tr('Candidate Name', 'उम्मीदवार का नाम')}</th>
                  <th className="p-3 font-black">{tr('Tribe Community', 'जनजाति समुदाय')}</th>
                  <th className="p-3 font-black">{tr('State', 'राज्य')}</th>
                  <th className="p-3 font-black">{tr('Target Scheme', 'योजना')}</th>
                  <th className="p-3 font-black">{tr('Merit Score', 'मेरिट स्कोर')}</th>
                  <th className="p-3 font-black">{tr('AI Verify %', 'एआई स्कोर')}</th>
                  <th className="p-3 font-black">{tr('Disbursal Status', 'भुगतान स्थिति')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {applications.map((app, idx) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-black text-slate-900">
                      <span style={{ width: '24px', height: '24px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-900">{app.id}</td>
                    <td className="p-3 font-bold text-slate-900">{app.name}</td>
                    <td className="p-3 text-slate-700">{app.tribe}</td>
                    <td className="p-3 text-slate-700">{app.state}</td>
                    <td className="p-3 text-slate-800 font-semibold">{app.scheme}</td>
                    <td className="p-3 font-black text-slate-900">{app.marksPercent}%</td>
                    <td className="p-3 font-bold text-emerald-700">{app.aiScore}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        app.status === 'AI Verified' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                          'bg-red-100 text-red-900 border border-red-300'
                        }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 11. TAB 6: EXECUTIVE LEADERSHIP BI DASHBOARD (NO LOGIN)  */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="border-b-2 border-slate-300 pb-4 mb-6">
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#b45309', textTransform: 'uppercase' }}>
              {tr('Executive Decision Support System', 'कार्यकारी निर्णय सहायता प्रणाली')}
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase' }}>
              {tr('MoTA Scholarship & DBT Analytics Dashboard', 'जनजातीय छात्रवृत्ति एवं डीबीटी विश्लेषिकी डैशबोर्ड')}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              {tr('Real-time expenditure tracking, tribal district penetration and AI fraud deterrence telemetry.', 'वास्तविक समय में डीबीटी व्यय, जिला स्तरीय कवरेज एवं धोखाधड़ी रोकथाम आंकड़े।')}
            </p>
          </div>

          {/* 4 Stat KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', borderLeft: '4px solid #0b2545', padding: '16px', borderRadius: 0 }} className="shadow">
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' }}>
                {tr('Total ST Applications', 'कुल प्राप्त आवेदन')}
              </span>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#0b2545', marginTop: '4px' }}>1,48,290</div>
              <span style={{ fontSize: '10px', color: '#047857', fontWeight: 'bold' }}>↑ 22.4% vs 2024-25</span>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', borderLeft: '4px solid #047857', padding: '16px', borderRadius: 0 }} className="shadow">
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' }}>
                {tr('DBT Funds Disbursed', 'वितरित डीबीटी धनराशि')}
              </span>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#047857', marginTop: '4px' }}>₹ 348.60 Cr</div>
              <span style={{ fontSize: '10px', color: '#64748b' }}>{tr('Direct to Aadhaar Bank A/c', 'सीधे आधार लिंक बैंक खाते में')}</span>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', borderLeft: '4px solid #7c3aed', padding: '16px', borderRadius: 0 }} className="shadow">
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' }}>
                {tr('Automated AI Verifications', 'एआई स्वचालित सत्यापन')}
              </span>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#7c3aed', marginTop: '4px' }}>94.8%</div>
              <span style={{ fontSize: '10px', color: '#64748b' }}>{tr('Processed within 3 minutes', '3 मिनट के भीतर संसाधित')}</span>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', borderLeft: '4px solid #b91c1c', padding: '16px', borderRadius: 0 }} className="shadow">
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' }}>
                {tr('Tampered Docs Intercepted', 'अवैध दस्तावेज रोके गए')}
              </span>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#b91c1c', marginTop: '4px' }}>3,412</div>
              <span style={{ fontSize: '10px', color: '#b91c1c', fontWeight: 'bold' }}>{tr('100% Public Funds Protected', 'सरकारी धन का पूर्ण संरक्षण')}</span>
            </div>
          </div>

          {/* Scheme Allocation Progress Bars */}
          <div style={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', padding: '20px', borderRadius: 0 }} className="shadow mb-6">
            <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#0b2545', textTransform: 'uppercase', marginBottom: '16px' }}>
              {tr('Scheme-Wise Budget Allocation & DBT Utilization', 'योजनावार बजट आवंटन एवं डीबीटी उपयोग')}
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>National Fellowship for ST Students (M.Phil / Ph.D)</span>
                  <span style={{ color: '#047857' }}>₹ 84.5 Cr / ₹ 90.0 Cr (93.8%)</span>
                </div>
                <div style={{ backgroundColor: '#e2e8f0', height: '10px', width: '100%' }}>
                  <div style={{ backgroundColor: '#059669', height: '10px', width: '93.8%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>National Overseas Scholarship (NOS) for Higher Studies Abroad</span>
                  <span style={{ color: '#2563eb' }}>₹ 42.0 Cr / ₹ 50.0 Cr (84.0%)</span>
                </div>
                <div style={{ backgroundColor: '#e2e8f0', height: '10px', width: '100%' }}>
                  <div style={{ backgroundColor: '#2563eb', height: '10px', width: '84%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Top Class Education Scheme for ST Students</span>
                  <span style={{ color: '#d97706' }}>₹ 112.4 Cr / ₹ 120.0 Cr (93.6%)</span>
                </div>
                <div style={{ backgroundColor: '#e2e8f0', height: '10px', width: '100%' }}>
                  <div style={{ backgroundColor: '#d97706', height: '10px', width: '93.6%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Pre-Matric & Post-Matric ST Scholarships (State Component)</span>
                  <span style={{ color: '#7c3aed' }}>₹ 109.7 Cr / ₹ 120.0 Cr (91.4%)</span>
                </div>
                <div style={{ backgroundColor: '#e2e8f0', height: '10px', width: '100%' }}>
                  <div style={{ backgroundColor: '#7c3aed', height: '10px', width: '91.4%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 12. DEFICIENCY NOTICE MODAL (14-DAY SLA & REGIONAL DRAFT)*/}
      {/* ======================================================== */}
      {deficiencyModal.isOpen && deficiencyModal.app && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '4px solid #b91c1c', maxWidth: '580px', width: '100%', padding: '24px', borderRadius: 0 }} className="shadow-2xl">
            <div className="flex items-center gap-3 border-b-2 border-red-200 pb-3 mb-4">
              <div style={{ width: '40px', height: '40px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#b91c1c', textTransform: 'uppercase' }}>
                  {tr('Defect Notification SLA (14 Days)', 'आपत्ति निवारण समय-सीमा (14 दिवस)')}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase' }}>
                  {tr('Issue Deficiency Notice:', 'आपत्ति नोटिस जारी करें:')} {deficiencyModal.app.name}
                </h3>
              </div>
            </div>

            <div className="text-xs text-slate-700 space-y-3 mb-4">
              <div>
                <label style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                  {tr('Specific Deficiency / Defect Reason:', 'विशिष्ट आपत्ति का कारण:')}
                </label>
                <textarea
                  rows={3}
                  value={deficiencyModal.reason}
                  onChange={(e) => setDeficiencyModal({ ...deficiencyModal, reason: e.target.value })}
                  style={{ width: '100%', border: '2px solid #cbd5e1', padding: '8px', fontSize: '12px', borderRadius: 0 }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                  {tr('Dispatch Channels:', 'प्रेषण माध्यम:')}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="chan"
                      checked={deficiencyModal.channel === 'BOTH'}
                      onChange={() => setDeficiencyModal({ ...deficiencyModal, channel: 'BOTH' })}
                    />
                    <span>SMS + WhatsApp Alert</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="chan"
                      checked={deficiencyModal.channel === 'SMS'}
                      onChange={() => setDeficiencyModal({ ...deficiencyModal, channel: 'SMS' })}
                    />
                    <span>SMS Only</span>
                  </label>
                </div>
              </div>

              {/* Regional language preview */}
              <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '10px', fontSize: '11px', color: '#1e293b' }}>
                <strong>{tr('Dispatched Text Preview:', 'भेजे जाने वाले संदेश का प्रारूप:')}</strong>
                <p className="mt-1 italic">
                  "प्रिय {deficiencyModal.app.name}, आपके छात्रवृत्ति आवेदन ({deficiencyModal.app.id}) में कमी पाई गई है: '{deficiencyModal.reason}'. कृपया अगले 14 दिनों के भीतर पोर्टल पर सही दस्तावेज पुनः अपलोड करें।"
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setDeficiencyModal({ ...deficiencyModal, isOpen: false, app: null })}
                style={{ backgroundColor: '#e2e8f0', color: '#1e293b', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 0 }}
              >
                {tr('Cancel', 'रद्द करें')}
              </button>
              <button
                onClick={handleSendDeficiencyNotice}
                style={{ backgroundColor: '#b91c1c', color: '#ffffff', padding: '8px 20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 0 }}
                className="hover:bg-red-800"
              >
                {tr('Dispatch Notice', 'नोटिस प्रेषित करें')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 13. OFFICIAL GOVERNMENT FOOTER                           */}
      {/* ======================================================== */}
      <footer style={{ backgroundColor: '#0f172a', color: '#cbd5e1', borderTop: '4px solid #d97706', marginTop: '60px' }} className="text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Landmark className="w-6 h-6 text-amber-500" />
              <span style={{ fontSize: '14px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>TRIBAL-SETU</span>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.6' }}>
              {tr(
                'Ministry of Tribal Affairs, Government of India. An AI-enabled transparent public service delivery system for tribal welfare and empowerment.',
                'जनजातीय कार्य मंत्रालय, भारत सरकार। अनुसूचित जनजाति कल्याण और सशक्तिकरण हेतु एआई-सक्षम पारदर्शी लोक सेवा प्रणाली।'
              )}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '10px' }}>
              {tr('Important Portals', 'महत्वपूर्ण पोर्टल्स')}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400">National Scholarship Portal (NSP)</a></li>
              <li><a href="https://tribal.nic.in" target="_blank" rel="noreferrer" className="hover:text-amber-400">Ministry of Tribal Affairs (MoTA)</a></li>
              <li><a href="https://pfms.nic.in" target="_blank" rel="noreferrer" className="hover:text-amber-400">PFMS Direct Benefit Transfer</a></li>
              <li><a href="https://uidai.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400">UIDAI Aadhaar Verification</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '10px' }}>
              {tr('Quick Links', 'शीघ्र लिंक')}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => setActiveTab('schemes')} className="hover:text-amber-400">{tr('National Overseas Scholarship (NOS)', 'राष्ट्रीय प्रवासी छात्रवृत्ति (NOS)')}</button></li>
              <li><button onClick={() => setActiveTab('schemes')} className="hover:text-amber-400">{tr('National Ph.D. Research Fellowships', 'राष्ट्रीय पीएच.डी. शोध फैलोशिप')}</button></li>
              <li><button onClick={() => setActiveTab('schemes')} className="hover:text-amber-400">{tr('Top Class Education Scheme', 'टॉप क्लास उच्च शिक्षा योजना')}</button></li>
              <li><button onClick={() => setActiveTab('schemes')} className="hover:text-amber-400">{tr('Pre/Post Matric State Scholarships', 'प्री/पोस्ट मैट्रिक राज्य छात्रवृत्तियां')}</button></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '10px' }}>
              {tr('Helpdesk & Support', 'सहायता एवं संपर्क')}
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-white font-bold">1800-11-7777 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>tribal-scholarships@gov.in</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', paddingTop: '8px' }}>
                Designed & Hosted by National Informatics Centre (NIC) for Ministry of Tribal Affairs.
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#020617', padding: '12px 16px', textAlign: 'center', color: '#64748b', fontSize: '11px', borderTop: '1px solid #1e293b' }}>
          © 2026 Ministry of Tribal Affairs, Government of India. All Rights Reserved. Last updated: September 2026.
        </div>
      </footer>
    </div>
  );
}