import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowLeft, AlertTriangle, ArrowRight, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const ECertificate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [userDomains, setUserDomains] = useState<string[]>([]);
  const [activeDomain, setActiveDomain] = useState<string>('');
  const [completedDaysCount, setCompletedDaysCount] = useState<number>(0);
  const [issueDate, setIssueDate] = useState<string>('');
  const [certificateId, setCertificateId] = useState<string>('');

  useEffect(() => {
    // 1. LocalStorage se bas unhi domains ko nikalo jiske 7 days complete hain
    const allKeys = Object.keys(localStorage);
    const completedDomainKeys = allKeys.filter(key => key.startsWith("completed_days_"));
    
    // Sirf wahi domains filter karo jinme poore 7 days finished hain
    const fullyCompletedDomains = completedDomainKeys.filter(key => {
      const days = JSON.parse(localStorage.getItem(key) || "[]");
      return days.length >= 7;
    }).map(key => key.replace("completed_days_", ""));

    setUserDomains(fullyCompletedDomains);

    // Current Active Domain Check
    const currentActive = localStorage.getItem("active_domain") || (fullyCompletedDomains.length > 0 ? fullyCompletedDomains[0] : "");
    setActiveDomain(currentActive);

    // Selected domain ke exact completed days count read karo
    if (currentActive) {
      const activeDays = JSON.parse(localStorage.getItem(`completed_days_${currentActive}`) || "[]");
      setCompletedDaysCount(activeDays.length);
    } else {
      setCompletedDaysCount(0);
    }

    // Meta details
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setIssueDate(today);

    const randomId = 'CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setCertificateId(randomId);
  }, []);

  const handleDomainChange = (domain: string) => {
    setActiveDomain(domain);
    localStorage.setItem("active_domain", domain);
    const activeDays = JSON.parse(localStorage.getItem(`completed_days_${domain}`) || "[]");
    setCompletedDaysCount(activeDays.length);
  };

  const handlePrint = () => {
    window.print();
  };

  // 🔒 STRICT GUARD CLAUSE: Agar selected domain completed nahi hai
  if (!activeDomain || completedDaysCount < 7) {
    return (
      <div className="min-h-[85vh] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0B0D1B]">
        <div className="max-w-md w-full border rounded-3xl p-8 text-center space-y-6 bg-white dark:bg-[#131629] border-slate-200 dark:border-blue-900/40 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              E-Certificate Locked
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Certificate unlocked karne ke liye aapko pehle <strong className="text-blue-500">{activeDomain || "Domain"}</strong> ke saare 7-day assessment tasks complete karne honge. <br />
              Current Progress: <b>{completedDaysCount}/7 days</b>
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(activeDomain ? `/dashboard/assessment/${encodeURIComponent(activeDomain)}` : '/dashboard')}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Go to Assessment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 md:p-10 space-y-8 bg-slate-50 text-slate-900 dark:bg-[#0B0D1B] dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Header Controls */}
      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-blue-900/30 pb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-blue-400 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-500" />
            Verified E-Certificate
          </h1>
        </div>

        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95"
        >
          <Printer className="w-5 h-5" />
          Print / Save PDF
        </button>
      </div>

      {/* Completed Domains Switcher */}
      {userDomains.length > 1 && (
        <div className="print:hidden flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-200 dark:border-blue-900/30">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Completed Certificates:</span>
          {userDomains.map((dom) => (
            <button
              key={dom}
              onClick={() => handleDomainChange(dom)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 shrink-0 ${
                activeDomain === dom
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-200/70 dark:bg-[#131629] text-slate-600 dark:text-slate-400 border dark:border-blue-900/30 hover:bg-slate-300 dark:hover:bg-[#1B1E36]"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      )}

      {/* CERTIFICATE DISPLAY */}
      <div className="flex justify-center items-center py-4">
        <div 
          ref={certificateRef}
          className="relative w-full max-w-4xl aspect-[1.414/1] bg-white dark:bg-[#131629] border-8 border-slate-200 dark:border-blue-900/40 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col justify-between overflow-hidden text-slate-900 dark:text-white"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
          <div className="absolute inset-3 border border-slate-200 dark:border-blue-800/30 rounded-2xl pointer-events-none" />

          {/* Certificate Content */}
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black tracking-wider text-lg uppercase text-blue-600 dark:text-blue-400">
                  AI Assessment Platform
                </h3>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">Verified Simulation Credential</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block">ID: {certificateId}</span>
              <span className="text-[11px] font-mono text-slate-400 block">Issued: {issueDate}</span>
            </div>
          </div>

          <div className="text-center space-y-6 my-auto relative z-10 py-6">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.3em] text-slate-400">
              Certificate of Completion
            </h2>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              This is to officially certify that
            </p>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 capitalize">
              {user?.name || "Candidate Name"}
            </h1>

            <p className="text-sm max-w-xl mx-auto text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              has successfully completed the intensive <strong className="text-blue-500 font-bold">7-Day Assessment Simulation</strong> in 
              <span className="inline-block mx-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-[#1B1E36] border dark:border-blue-900/50 font-bold text-blue-600 dark:text-blue-400">
                {activeDomain}
              </span> 
              demonstrating key practical capabilities evaluated by AI.
            </p>
          </div>

          <div className="flex justify-between items-end border-t border-slate-100 dark:border-blue-900/30 pt-6 relative z-10">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              AI Evaluated & Authenticated
            </div>

            <div className="text-center">
              <div className="font-serif italic text-lg text-slate-700 dark:text-slate-300 border-b border-slate-300 dark:border-slate-700 px-4 pb-1">
                AI Assessor System
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 block">
                Automated Verification
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};