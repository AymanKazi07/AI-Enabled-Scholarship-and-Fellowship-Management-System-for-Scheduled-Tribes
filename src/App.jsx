import React, { useState } from 'react';
import {
  ShieldCheck, BarChart3, UserCheck, Upload, CheckCircle2,
  AlertTriangle, XCircle, FileText, Sparkles, ArrowRight,
  Award, DollarSign, Download, MessageSquare, Globe, Clock, Check
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('applicant');
  const [language, setLanguage] = useState('EN'); // 'EN' or 'HI'
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [lastNotifiedApp, setLastNotifiedApp] = useState(null);

  // Applications Database State
  const [applications, setApplications] = useState([
    {
      id: "APP-2026-NFST-0101",
      scheme: "NFST",
      name: "Ramesh Chandra Munda",
      gender: "Male",
      subCaste: "Santhal",
      isPvtg: true,
      state: "Odisha",
      income: 320000,
      institution: "IIT Bhubaneswar",
      degree: "Ph.D. Material Science",
      meritScore: 89.5, // PG Marks %
      status: "APPROVED_L1",
      aiScore: 96,
      tamperStatus: "CLEAN (Pass)",
      flags: [],
      docName: "Caste_Certificate_Ramesh.pdf",
      stipendStatus: "DISBURSED",
      guideApproved: true
    },
    {
      id: "APP-2026-NOS-0402",
      scheme: "NOS",
      name: "Sunita Marandi",
      gender: "Female",
      subCaste: "Munda",
      isPvtg: false,
      state: "Jharkhand",
      income: 540000,
      institution: "Univ. of Melbourne (QS #14)",
      degree: "Master of Data Science",
      meritScore: 94.0, // QS Rank inverse / score
      status: "DEFICIENCY_RAISED",
      aiScore: 48,
      tamperStatus: "SUSPICIOUS (Outdated Format)",
      flags: ["Income certificate issued outside active financial year (FY 2024-25)"],
      docName: "Income_Cert_Old.jpg",
      stipendStatus: "ON_HOLD",
      guideApproved: false
    },
    {
      id: "APP-2026-NFST-0305",
      scheme: "NFST",
      name: "Anita Kumari Gond",
      gender: "Female",
      subCaste: "Gond",
      isPvtg: true,
      state: "Madhya Pradesh",
      income: 240000,
      institution: "AIIMS Bhopal",
      degree: "Ph.D. Microbiology",
      meritScore: 92.4,
      status: "APPROVED_L1",
      aiScore: 98,
      tamperStatus: "CLEAN (Pass)",
      flags: [],
      docName: "Caste_Cert_Anita.pdf",
      stipendStatus: "DISBURSED",
      guideApproved: true
    }
  ]);

  const [selectedAppId, setSelectedAppId] = useState("APP-2026-NFST-0101");
  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Form State
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

  // Handle Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newId = `APP-2026-${formScheme}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      id: newId,
      scheme: formScheme,
      name: formName || "Tribal Scholar",
      gender: formGender,
      subCaste: formSubCaste,
      isPvtg: formIsPvtg,
      state: formState,
      income: Number(formIncome),
      institution: formInstitution,
      degree: formDegree,
      meritScore: Number(formMarks),
      status: "PENDING_L1",
      aiScore: 95,
      tamperStatus: "CLEAN (Pass)",
      flags: [],
      docName: uploadedFile ? uploadedFile.name : "Certificate_Scan.pdf",
      stipendStatus: "PROCESSING",
      guideApproved: false
    };

    setApplications([newApp, ...applications]);
    setSelectedAppId(newId);
    setSubmissionSuccess(newApp);
  };

  // Officer Actions
  const handleOfficerAction = (action) => {
    setApplications(applications.map(app => {
      if (app.id === selectedApp.id) {
        if (action === "APPROVE") {
          return { ...app, status: "APPROVED_L1", flags: [] };
        }
        if (action === "DEFICIENCY") {
          const note = officerRemark || "Please re-upload a valid Income Certificate for FY 2025-26.";
          setLastNotifiedApp({ ...app, note });
          setShowSmsModal(true); // Trigger SMS modal!
          return { ...app, status: "DEFICIENCY_RAISED", flags: [note] };
        }
        if (action === "REJECT") return { ...app, status: "REJECTED" };
      }
      return app;
    }));
    setOfficerRemark("");
  };

  // Export Merit List to CSV
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

  // KPI calculations
  const totalApps = applications.length;
  const approvedApps = applications.filter(a => a.status === "APPROVED_L1").length;
  const femalePercentage = Math.round((applications.filter(a => a.gender === "Female").length / totalApps) * 100) || 0;
  const pvtgCount = applications.filter(a => a.isPvtg).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">

      {/* ========================================================================= */}
      {/* 1. TOP HEADER WITH BILINGUAL TOGGLE                                      */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-black text-xl shadow-md">
            सं
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-800">TRIBAL-SETU</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                MoTA 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'EN'
                ? 'Ministry of Tribal Affairs | National Fellowship & Overseas Scholarship Platform'
                : 'जनजातीय कार्य मंत्रालय | राष्ट्रीय अध्येतावृत्ति एवं विदेश छात्रवृत्ति मंच'}
            </p>
          </div>
        </div>

        {/* Portals Switcher + Language Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 gap-1">
            <button
              onClick={() => setActiveTab('applicant')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'applicant' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              {language === 'EN' ? '1. Applicant Portal' : '१. आवेदक पोर्टल'}
            </button>
            <button
              onClick={() => setActiveTab('scrutiny')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'scrutiny' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {language === 'EN' ? '2. AI Scrutiny Desk' : '२. एआई संवीक्षा'}
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">{applications.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('merit')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'merit' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Award className="w-4 h-4 text-amber-600" />
              {language === 'EN' ? '3. Merit & DBT Hub' : '३. मेरिट एवं डीबीटी'}
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              {language === 'EN' ? '4. Leadership Dashboard' : '४. नेतृत्व डैशबोर्ड'}
            </button>
          </div>

          {/* Hindi / English Toggle Button */}
          <button
            onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 rounded-xl text-slate-700 transition"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            {language === 'EN' ? 'हिन्दी' : 'English'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">

        {/* ========================================================================= */}
        {/* TAB 1: APPLICANT PORTAL                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'applicant' && (
          <div className="max-w-3xl mx-auto">
            {submissionSuccess ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-200 text-center animate-fadeIn">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
                <h2 className="text-2xl font-black text-slate-800">
                  {language === 'EN' ? 'Application Submitted to MoTA!' : 'आवेदन सफलतापूर्वक जमा हो गया!'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">Application Ref: <span className="font-mono font-bold text-emerald-700">{submissionSuccess.id}</span></p>

                <div className="mt-6 bg-slate-50 p-5 rounded-xl border border-slate-200 text-left max-w-md mx-auto space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-xs text-slate-700 pb-2 border-b border-slate-200">
                    <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-500" /> Instant AI Verification</span>
                    <span className="text-emerald-600">{submissionSuccess.aiScore}% Match</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Document Tamper Check:</span>
                    <span className="font-bold text-emerald-600">PASS (No Alterations)</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Caste e-District Cross-Check:</span>
                    <span className="font-bold text-emerald-600">State Registry Verified</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Assigned Queue:</span>
                    <span className="font-bold text-blue-600">Level-1 Desk Officer Scrutiny</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('scrutiny')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition"
                  >
                    View in Officer Scrutiny Desk <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSubmissionSuccess(null)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-5 py-3 rounded-xl transition"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-xl font-black text-slate-800">
                    {language === 'EN' ? 'Unified Scholarship & Fellowship Application' : 'एकीकृत अध्येतावृत्ति एवं छात्रवृत्ति आवेदन'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Configurable Scheme Engine: Automatically adapts eligibility rules & document requirements.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Scheme Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Select Target Scheme</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => setFormScheme('NFST')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${formScheme === 'NFST' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-bold text-sm text-slate-800">NFST (India)</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">750 Slots</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">National Fellowship for Ph.D. in India. ₹37,000/mo JRF stipend + HRA.</p>
                      </div>

                      <div
                        onClick={() => setFormScheme('NOS')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${formScheme === 'NOS' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-bold text-sm text-slate-800">NOS (Overseas)</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">100 Slots</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">National Overseas Scholarship for Masters/Ph.D. in Top 500 QS Universities.</p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Scholar Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="As on Class X / Aadhaar"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                      <select
                        value={formGender}
                        onChange={e => setFormGender(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Sub-Tribe Community</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Santhal, Gond, Bhil"
                        value={formSubCaste}
                        onChange={e => setFormSubCaste(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">State of Domicile</label>
                      <select
                        value={formState}
                        onChange={e => setFormState(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option>Odisha</option>
                        <option>Jharkhand</option>
                        <option>Madhya Pradesh</option>
                        <option>Chhattisgarh</option>
                        <option>Maharashtra</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Family Annual Income (₹)</label>
                      <input
                        required
                        type="number"
                        value={formIncome}
                        onChange={e => setFormIncome(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* PVTG Checkbox */}
                  <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200">
                    <label className="flex items-center gap-2 text-xs font-bold text-purple-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsPvtg}
                        onChange={e => setFormIsPvtg(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      Candidate belongs to Particularly Vulnerable Tribal Group (PVTG Priority)
                    </label>
                  </div>

                  {/* Academic Details + Merit Marks */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {formScheme === 'NFST' ? 'Indian University' : 'Foreign University'}
                      </label>
                      <input
                        required
                        type="text"
                        value={formInstitution}
                        onChange={e => setFormInstitution(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Research Degree</label>
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
                        {formScheme === 'NFST' ? 'PG Qualifying Marks (%)' : 'QS Ranking / Score'}
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

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-500 transition">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">Attach Verified ST Caste Certificate</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, PNG, JPG. Instant OCR & Tamper Analysis will run automatically.</p>
                    <input
                      type="file"
                      onChange={e => setUploadedFile(e.target.files[0])}
                      className="mt-3 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Run AI Scrutiny & Submit Application
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AI SCRUTINY DESK WITH SPLIT-SCREEN                                 */}
        {/* ========================================================================= */}
        {activeTab === 'scrutiny' && (
          <div className="grid grid-cols-12 gap-5 h-[calc(100vh-125px)]">
            {/* Queue List */}
            <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Scrutiny Queue</span>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{applications.length} Assigned</span>
              </div>

              <div className="space-y-2 mt-3 overflow-y-auto flex-1 pr-1">
                {applications.map(app => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${selectedApp.id === app.id ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] font-bold text-slate-500">{app.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${app.status === 'APPROVED_L1' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'DEFICIENCY_RAISED' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 text-xs mt-1.5">{app.name}</p>
                    <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                      <span>{app.scheme} • {app.subCaste}</span>
                      <span className="font-bold text-emerald-600">{app.aiScore}% Match</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Screen Document Viewer with Bounding Boxes */}
            <div className="col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Certificate Preview: {selectedApp.docName}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedApp.tamperStatus.includes('Pass') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                  Tamper Check: {selectedApp.tamperStatus}
                </span>
              </div>

              <div className="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-5 mt-3 relative flex flex-col justify-center items-center text-center">
                <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm border border-slate-200 relative">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pb-2 border-b">
                    Government of India • Scheduled Tribe Certificate
                  </div>

                  <div className="mt-4 p-2 bg-emerald-50 border-2 border-emerald-500 rounded relative group">
                    <span className="absolute -top-2 left-2 bg-emerald-600 text-white text-[8px] font-mono px-1 rounded">OCR: NAME (100% Match)</span>
                    <p className="font-serif font-bold text-sm text-slate-800">{selectedApp.name}</p>
                  </div>

                  <div className="mt-3 p-2 bg-emerald-50 border-2 border-emerald-500 rounded relative">
                    <span className="absolute -top-2 left-2 bg-emerald-600 text-white text-[8px] font-mono px-1 rounded">OCR: SUB-CASTE</span>
                    <p className="font-serif text-xs font-semibold text-slate-700">Tribe: {selectedApp.subCaste} Community</p>
                  </div>

                  <div className="mt-3 p-2 bg-blue-50 border-2 border-blue-400 rounded relative">
                    <span className="absolute -top-2 left-2 bg-blue-600 text-white text-[8px] font-mono px-1 rounded">e-District Digital Signature</span>
                    <p className="text-[10px] text-slate-500">SDM Office, {selectedApp.state} • Valid for Central Schemes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Decision Console */}
            <div className="col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" /> AI Scrutiny Assessment
                  </h3>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-600">{selectedApp.aiScore}%</span>
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Confidence</p>
                  </div>
                </div>

                <div className="space-y-2.5 mt-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Applicant Claim vs Doc</p>
                      <p className="text-xs font-bold text-slate-800">{selectedApp.name}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Tribe / Quota Category</p>
                      <p className="text-xs font-bold text-slate-800">{selectedApp.subCaste} {selectedApp.isPvtg && "• PVTG Priority"}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Reported Family Income</p>
                      <p className="text-xs font-bold text-slate-800">₹{selectedApp.income.toLocaleString('en-IN')}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  {selectedApp.flags.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-600" /> AI Discrepancies Flagged:
                      </p>
                      <ul className="list-disc list-inside text-xs text-amber-700">
                        {selectedApp.flags.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <input
                  type="text"
                  placeholder="Officer remarks / Deficiency note..."
                  value={officerRemark}
                  onChange={e => setOfficerRemark(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleOfficerAction("APPROVE")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 transition shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve L1
                  </button>
                  <button
                    onClick={() => handleOfficerAction("DEFICIENCY")}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 transition shadow-sm"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Flag Defect
                  </button>
                  <button
                    onClick={() => handleOfficerAction("REJECT")}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 transition shadow-sm"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUTOMATED MERIT ENGINE & POST-AWARD DBT DISBURSEMENT               */}
        {/* ========================================================================= */}
        {activeTab === 'merit' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  {language === 'EN' ? 'Automated Merit Ranking & Fellowship DBT Hub' : 'स्वचालित मेरिट सूची एवं अध्येतावृत्ति डीबीटी'}
                </h2>
                <p className="text-xs text-slate-500">
                  Algorithmic scoring applying 30% Female Quota, PVTG priority, and PFMS Direct Benefit Transfer batches.
                </p>
              </div>
              <button
                onClick={exportMeritCSV}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" /> Export Merit List (CSV)
              </button>
            </div>

            {/* Merit Ranking Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Provisional Selection Merit List (Ranked Automatically by Scheme Rules)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Application ID</th>
                      <th className="p-3">Scholar Name</th>
                      <th className="p-3">Scheme</th>
                      <th className="p-3">Tribe</th>
                      <th className="p-3">Affirmative Quota</th>
                      <th className="p-3">Merit Score</th>
                      <th className="p-3">Scrutiny Status</th>
                      <th className="p-3">Monthly Fellowship (DBT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {[...applications]
                      .sort((a, b) => b.meritScore - a.meritScore)
                      .map((app, index) => (
                        <tr key={app.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-emerald-800">#{index + 1}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">{app.id}</td>
                          <td className="p-3 font-bold text-slate-800">{app.name}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${app.scheme === 'NFST' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                              {app.scheme}
                            </span>
                          </td>
                          <td className="p-3">{app.subCaste}</td>
                          <td className="p-3">
                            {app.isPvtg && <span className="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded text-[10px] mr-1">PVTG Priority</span>}
                            {app.gender === 'Female' && <span className="bg-pink-100 text-pink-800 font-bold px-1.5 py-0.5 rounded text-[10px]">30% Female Quota</span>}
                          </td>
                          <td className="p-3 font-bold text-slate-800">{app.meritScore}%</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${app.status.includes('APPROVED') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-600">
                            {app.scheme === 'NFST' ? '₹37,000 / mo' : '$15,400 / yr'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Post-Award Fellowship Disbursement Life Cycle */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Post-Award Fellowship Lifecycle (PFMS & DBT Tribal Automation)
              </h3>
              <p className="text-xs text-slate-400 mb-4">Life after selection: Automated supervisor digital sign-off and monthly stipend credits.</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">1. University Joining</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Registrar joining report verified digitally via institutional email.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">2. Research Guide Approval</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Bi-annual progress & attendance certified by Ph.D. guide.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">3. PFMS DBT Credit</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">DIRECT TO AADHAAR</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Automated electronic payment advice pushed to PFMS portal.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: EXECUTIVE LEADERSHIP DASHBOARD                                     */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  {language === 'EN' ? 'MoTA Leadership Real-Time Telemetry' : 'जनजातीय कार्य मंत्रालय - नेतृत्व टेलीमेट्री'}
                </h2>
                <p className="text-xs text-slate-500">Live oversight of affirmative action quotas, fund utilization & verification SLAs.</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg">
                Academic Year 2026-27 Active
              </span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Applications</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{totalApps}</p>
                <p className="text-[11px] text-emerald-600 mt-1 font-semibold">{approvedApps} Approved L1</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Female Scholar Ratio</p>
                <p className="text-3xl font-black text-emerald-600 mt-1">{femalePercentage}%</p>
                <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Exceeds 30% Statutory Mandate</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">PVTG Candidates</p>
                <p className="text-3xl font-black text-purple-600 mt-1">{pvtgCount}</p>
                <p className="text-[11px] text-purple-600 mt-1 font-semibold">Particularly Vulnerable Groups</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Avg Scrutiny TAT</p>
                <p className="text-3xl font-black text-amber-600 mt-1">1.8 Days</p>
                <p className="text-[11px] text-slate-500 mt-1">Down from 6 months (manual)</p>
              </div>
            </div>

            {/* State Distribution Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 mb-4">State-wise Application & Clearance Telemetry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
                    <tr>
                      <th className="p-3">State</th>
                      <th className="p-3">NFST Applications</th>
                      <th className="p-3">NOS Applications</th>
                      <th className="p-3">PVTG Scholars</th>
                      <th className="p-3">Disbursed Funds</th>
                      <th className="p-3">Clearance Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr>
                      <td className="p-3 font-bold">Odisha</td>
                      <td className="p-3">185</td>
                      <td className="p-3">28</td>
                      <td className="p-3 font-bold text-purple-600">42</td>
                      <td className="p-3">₹8.4 Cr</td>
                      <td className="p-3"><span className="text-emerald-600 font-bold">92%</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Jharkhand</td>
                      <td className="p-3">160</td>
                      <td className="p-3">22</td>
                      <td className="p-3 font-bold text-purple-600">31</td>
                      <td className="p-3">₹6.9 Cr</td>
                      <td className="p-3"><span className="text-emerald-600 font-bold">88%</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Madhya Pradesh</td>
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
                <h3 className="font-bold text-sm text-slate-800">Automated Deficiency Alert Dispatched</h3>
                <p className="text-[11px] text-slate-400">Multi-Channel Gateway (SMS & WhatsApp)</p>
              </div>
            </div>

            {/* Mobile Notification Preview */}
            <div className="mt-4 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <div className="flex justify-between items-center text-[10px] text-emerald-800 font-bold mb-1">
                <span>GOV-MoTA ALERT</span>
                <span>JUST NOW</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-sans">
                "Dear <span className="font-bold">{lastNotifiedApp.name}</span>, a clarification is required for your <span className="font-bold">{lastNotifiedApp.scheme}</span> application ({lastNotifiedApp.id}).
                <br /><br />
                <span className="font-semibold text-amber-800">Remark: {lastNotifiedApp.note}</span>
                <br /><br />
                Please re-upload your document within <span className="font-bold text-rose-600">14 Days</span> at: <span className="underline text-blue-600">mota.gov.in/resubmit</span> to prevent rejection."
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <Clock className="w-3.5 h-3.5" /> 14-Day SLA Countdown Active
              </span>
              <span className="text-emerald-700 font-bold">Delivery Status: Sent ✓✓</span>
            </div>

            <button
              onClick={() => setShowSmsModal(false)}
              className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              Close & Return to Scrutiny Desk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}