import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Zap, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Toast } from '../components/ui/Toast';
import { dataScientistContent, webDeveloperContent, uiuxDesignerContent } from "./Domains.tsx";

const domainData: Record<string, any> = {
  "Data Scientist": dataScientistContent,
  "Web Developer": webDeveloperContent,
  "UI/UX Designer": uiuxDesignerContent,
};

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();

  // App State
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [response, setResponse] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { path } = useParams<{ path?: string }>();
  const decodedPath = path ? decodeURIComponent(path) : "";
  
  useEffect(() => {
    const activeDomain = localStorage.getItem("active_domain"); 

    // Agar URL me domain nahi hai aur LocalStorage me activeDomain milta hai toh navigate kar do
    if (!decodedPath && activeDomain) {
      const formattedPath = encodeURIComponent(activeDomain);
      navigate(`/dashboard/assessment/${formattedPath}`, { replace: true });
    }
  }, [decodedPath, navigate]);

  // Active domain content check
  const CurrentDomain = domainData[decodedPath];
  const currentAssessment = CurrentDomain ? CurrentDomain[currentDay - 1] : null;

  const handleSaveDraft = () => {
    localStorage.setItem(`draft_day_${currentDay}`, response);
    setShowToast(true);
  };

  const handleBack = () => {
    if (currentDay > 1) {
      const prevDay = currentDay - 1;
      setCurrentDay(prevDay);
      setResponse(localStorage.getItem(`draft_day_${prevDay}`) || '');
    }
  };

  const handleNextDay = () => {
    if (currentDay < 7) {
      const nextDay = currentDay + 1;
      setCurrentDay(nextDay);
      setResponse(localStorage.getItem(`draft_day_${nextDay}`) || '');
    }
  };

  const handleEvaluate = async () => {
    // Evaluate action logic
  };


  if (!currentAssessment) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center p-6">
        <div className="max-w-md w-full border rounded-3xl p-8 text-center space-y-6 bg-white border-slate-200/80 shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
            <Zap className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              No Active Domain
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              To Do Skill Assesment First Select The Domain!!
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/simulation')}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Go to Simulation Page
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full transition-colors duration-300 p-6 md:p-10 space-y-8 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" /> 7 Dedicated Days
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-500">
              <Zap className="w-4 h-4" /> Industry Simulation
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight capitalize text-slate-900 dark:text-white">
            {decodedPath} Assessment
          </h1>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto justify-end">
          {/* Progress Bar */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Exercise {currentDay} of 7
            </span>
            <div className="w-36 md:w-48 h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500 shadow-sm shadow-blue-500/50" 
                style={{ width: `${(currentDay / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Assessment Card */}
      <div className="border rounded-3xl p-6 md:p-8 shadow-xl transition-all bg-white border-slate-200/80 text-slate-900 shadow-slate-200/50 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-100 dark:shadow-blue-950/20">
        <div className="flex justify-between items-center mb-8">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30">
            {currentAssessment.category}
          </span>
          
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl border bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-200">
            <button 
              onClick={handleBack}
              disabled={currentDay === 1}
              className="p-1 rounded-lg hover:bg-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold">Day {currentDay}</span>
            <button 
              onClick={handleNextDay}
              disabled={currentDay === 7}
              className="p-1 rounded-lg hover:bg-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
          {currentAssessment.title}
        </h2>
        
        {/* Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl border bg-slate-50 border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-700/60">
            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Target Dataset</h4>
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              {currentAssessment.dataset}
            </p>
          </div>
          
          <div className="p-5 rounded-2xl border bg-slate-50 border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-700/60">
            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Company Scenario</h4>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {currentAssessment.scenario}
            </p>
          </div>
          
          <div className="p-5 rounded-2xl border bg-slate-50 border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-700/60">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Your Task</h4>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {currentAssessment.task}
            </p>
          </div>

          <div className="p-5 rounded-2xl border bg-slate-50 border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-700/60">
            <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Submission Requirement</h4>
            <p className="font-semibold text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {currentAssessment.submission}
            </p>
          </div>
        </div>

        {/* Text Area Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Your Detailed Response (Day {currentDay})
            </label>
            <span className="text-xs text-slate-400 italic">Be detailed & comprehensive</span>
          </div>
          <textarea 
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={`Type your solution for Day ${currentDay} (${currentAssessment.title})...`}
            className="w-full min-h-[220px] p-4 rounded-2xl border transition outline-none text-sm leading-relaxed resize-y bg-slate-50/50 border-slate-200 focus:border-blue-600 text-slate-900 placeholder-slate-400 dark:bg-slate-950/80 dark:border-slate-800 dark:focus:border-blue-500 dark:text-slate-100 dark:placeholder-slate-600"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button 
            type="button"
            onClick={handleSaveDraft}
            className="px-5 py-2.5 rounded-xl border text-sm font-semibold transition border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Save Draft
          </button>
          
          <button 
            type="button"
            onClick={handleEvaluate}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-95 border border-blue-400/30"
          >
            Submit Day {currentDay} Task
          </button>
        </div>
      </div>

      <Toast 
        message={`Saved Day ${currentDay} draft successfully!`} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};