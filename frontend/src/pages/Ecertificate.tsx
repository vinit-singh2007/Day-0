import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowLeft, AlertTriangle, ArrowRight, Printer, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const ECertificate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userDomains, setUserDomains] = useState<string[]>([]);
  const [activeDomain, setActiveDomain] = useState<string>('');
  const [completedDaysCount, setCompletedDaysCount] = useState<number>(0);
  const [issueDate, setIssueDate] = useState<string>('');
  const [certificateId, setCertificateId] = useState<string>('');

  // Helper function: Get completed days count for a specific domain
  const getCompletedDays = (domainName: string): number => {
    if (!domainName) return 0;
    
    let days: string[] = [];
    if (user?._id) {
      const rawUserDays = localStorage.getItem(`completed_days_${user._id}_${domainName}`);
      if (rawUserDays) {
        try {
          days = JSON.parse(rawUserDays);
        } catch {
          days = [];
        }
      }
    } else {
      const rawDays = localStorage.getItem(`completed_days_${domainName}`);
      if (rawDays) {
        try {
          days = JSON.parse(rawDays);
        } catch {
          days = [];
        }
      }
    }
    
    return Array.isArray(days) ? days.length : 0;
  };

  useEffect(() => {
    setIsLoading(true);

    const storedActiveDomain = localStorage.getItem("active_domain") || "";
    const allKeys = Object.keys(localStorage);
    
    // Strict prefix for current logged-in user
    const userPrefix = user?._id ? `completed_days_${user._id}_` : `completed_days_`;
    
    // Filter domains that actually belong to this user and have >= 7 completed days
    const completedDomainKeys = allKeys.filter(key => key.startsWith(userPrefix));

    const fullyCompletedDomains: string[] = [];

    completedDomainKeys.forEach(key => {
      try {
        const days = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(days) && days.length >= 7) {
          const domainName = key.replace(userPrefix, "");
          if (domainName && domainName.trim() !== "") {
            fullyCompletedDomains.push(domainName);
          }
        }
      } catch {
        // ignore parse error
      }
    });

    const uniqueDomains = Array.from(new Set(fullyCompletedDomains));
    setUserDomains(uniqueDomains);

    // Pick active domain ONLY IF it is part of completed domains or stored active domain
    let currentActive = "";
    if (storedActiveDomain && uniqueDomains.includes(storedActiveDomain)) {
      currentActive = storedActiveDomain;
    } else if (uniqueDomains.length > 0) {
      currentActive = uniqueDomains[0];
    } else if (storedActiveDomain) {
      // User selected domain, but hasn't completed 7 days
      currentActive = storedActiveDomain;
    }

    setActiveDomain(currentActive);

    if (currentActive) {
      const daysCount = getCompletedDays(currentActive);
      setCompletedDaysCount(daysCount);
    } else {
      setCompletedDaysCount(0);
    }

    // Certificate metadata
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setIssueDate(today);

    const randomId = 'CF-CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setCertificateId(randomId);

    setIsLoading(false);
  }, [user?._id]);

  const handleDomainChange = (domain: string) => {
    setActiveDomain(domain);
    localStorage.setItem("active_domain", domain);
    const daysCount = getCompletedDays(domain);
    setCompletedDaysCount(daysCount);
  };

  const handlePrint = () => {
    window.print();
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-[85vh] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0B0D1B]">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm font-semibold">Verifying completion status...</p>
        </div>
      </div>
    );
  }

  // 2. Strict Locked View: Triggered if no domain is selected OR completed days are less than 7
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
              To unlock your CareerForge certificate, you must complete all 7-day assessment tasks for <strong className="text-blue-500">{activeDomain || "Selected Domain"}</strong>. <br />
              Current Progress: <b>{completedDaysCount}/7 days</b>
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(activeDomain ? `/dashboard/assessment/${encodeURIComponent(activeDomain)}` : '/dashboard/simulation')}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Complete Assessment Tasks
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. Unlocked Certificate View
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
            CareerForge Verified E-Certificate
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

      {/* Unlocked Domains Switcher */}
      {userDomains.length > 1 && (
        <div className="print:hidden flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-200 dark:border-blue-900/30">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Unlocked Certificates:</span>
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

      {/* Certificate Container */}
      <div className="flex justify-center items-center py-4">
        <div 
          ref={certificateRef}
          className="relative w-full max-w-4xl aspect-[1.414/1] bg-white dark:bg-[#131629] border-8 border-slate-200 dark:border-blue-900/40 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col justify-between overflow-hidden text-slate-900 dark:text-white"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
          <div className="absolute inset-3 border border-slate-200 dark:border-blue-800/30 rounded-2xl pointer-events-none" />

          {/* Certificate Content Header */}
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black tracking-wider text-lg uppercase text-blue-600 dark:text-blue-400">
                  Day 0
                </h3>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">Verified Simulation Credential</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block">ID: {certificateId}</span>
              <span className="text-[11px] font-mono text-slate-400 block">Issued: {issueDate}</span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="text-center space-y-6 my-auto relative z-10 py-6">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.3em] text-slate-400">
              Certificate of Completion
            </h2>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              This is to proudly certify that
            </p>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 capitalize">
              {user?.name || "Candidate Name"}
            </h1>

            <p className="text-sm max-w-xl mx-auto text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              has successfully completed the intensive <strong className="text-blue-500 font-bold">7-Day Simulation Assessment</strong> on 
              <span className="inline-block mx-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-[#1B1E36] border dark:border-blue-900/50 font-bold text-blue-600 dark:text-blue-400">
                {activeDomain}
              </span> 
              via Day 0, demonstrating professional proficiency and problem-solving excellence.
            </p>
          </div>

          {/* Certificate Footer */}
          <div className="flex justify-between items-end border-t border-slate-100 dark:border-blue-900/30 pt-6 relative z-10">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              Day 0 Authenticated
            </div>

            <div className="text-center">
              <div className="font-serif italic text-lg text-slate-700 dark:text-slate-300 border-b border-slate-300 dark:border-slate-700 px-4 pb-1">
                Day 0 Evaluator
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 block">
                Authorized Signature
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};