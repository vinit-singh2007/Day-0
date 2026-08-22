import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Award, Zap, CheckCircle, TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, Loader2, Sparkles, Compass } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DayReview {
  day: number;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface FullReviewData {
  overallScore: number;
  overallSummary: string;
  keyQualities: string[];
  topRecommendations: string[];
  dailyBreakdown: DayReview[];
}

export const AIReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { path } = useParams<{ path?: string }>();

  const [userDomains, setUserDomains] = useState<string[]>([]);
  const [activeDomain, setActiveDomain] = useState<string>('');
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewData, setReviewData] = useState<FullReviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const completedDomainKeys = allKeys.filter(key => key.startsWith("completed_days_"));
    const domains = completedDomainKeys.map(key => key.replace("completed_days_", ""));
    
    setUserDomains(domains);

    const initialDomain = path 
      ? decodeURIComponent(path) 
      : localStorage.getItem("active_domain") || (domains.length > 0 ? domains[0] : "");
    
    setActiveDomain(initialDomain);
    
    if (!initialDomain) {
      setIsLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (!activeDomain) {
      setIsLoading(false);
      return;
    }

    const savedCompleted: number[] = JSON.parse(
      localStorage.getItem(`completed_days_${activeDomain}`) || "[]"
    );
    setCompletedDays(savedCompleted);

    if (savedCompleted.length >= 7) {
      fetchFullAIReview(activeDomain);
    } else {
      setReviewData(null);
      setError(null);
      setIsLoading(false);
    }
  }, [activeDomain]);

  const fetchFullAIReview = async (domainToFetch: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${baseURL}/api/full-ai-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user?._id,
          domain: domainToFetch,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate comprehensive review.");

      setReviewData(data);
    } catch (err: any) {
      setError(err.message || "Error loading AI review.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1. EMPTY STATE (No active domain)
  if (!isLoading && !activeDomain) {
    return (
      <div className="min-h-[85vh] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0B0D1B]">
        <div className="max-w-md w-full border rounded-3xl p-8 text-center space-y-6 bg-white dark:bg-[#131629] border-slate-200 dark:border-blue-900/40 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto border border-blue-500/20">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              No Domain Enrolled
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Aapne abhi tak koi simulation start nahi kiya hai. Pehle domain page par jaakar apna simulation choose karein.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Go to Simulation Page
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. INCOMPLETE STATE (< 7 Days)
  if (!isLoading && completedDays.length < 7) {
    return (
      <div className="min-h-[85vh] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0B0D1B]">
        <div className="max-w-md w-full border rounded-3xl p-8 text-center space-y-6 bg-white dark:bg-[#131629] border-slate-200 dark:border-blue-900/40 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Simulation Incomplete
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong className="text-blue-500">{activeDomain}</strong> ka full AI review unlock karne ke liye saare 7 days complete karein.
            </p>
            <div className="pt-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
              Current Progress: {completedDays.length} / 7 Days
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/dashboard/assessment/${encodeURIComponent(activeDomain)}`)}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Continue Simulation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-[85vh] w-full flex flex-col items-center justify-center space-y-4 bg-slate-50 dark:bg-[#0B0D1B]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Generating AI Evaluation...
        </h3>
      </div>
    );
  }

  // 4. COMPLETED STATE (Full Review Content)
  return (
    <div className="min-h-screen w-full p-6 md:p-10 space-y-8 bg-slate-50 text-slate-900 dark:bg-[#0B0D1B] dark:text-slate-100 transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-blue-900/30 pb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-blue-400 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-500" />
            AI Performance Review
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Domain: <strong className="text-blue-500 dark:text-blue-400">{activeDomain}</strong>
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/e-certificate')}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Award className="w-5 h-5" />
          Claim E-Certificate
        </button>
      </div>

      {error ? (
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900">
          {error}
        </div>
      ) : (
        reviewData && (
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#131629] border border-slate-200 dark:border-blue-900/30 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-slate-100 dark:border-blue-900/20 pb-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                    Final Assessment Result
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-3">
                    Overall Summary & Score
                  </h2>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#1B1E36] px-6 py-3.5 rounded-2xl border border-slate-200/80 dark:border-blue-900/40 shadow-inner">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score</span>
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{reviewData.overallScore}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-bold text-sm">/ 100</span>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
                {reviewData.overallSummary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Key Demonstrated Qualities
                  </h4>
                  <div className="space-y-2">
                    {reviewData.keyQualities?.map((quality, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50/80 dark:bg-[#1B1E36] p-3.5 rounded-xl border border-slate-200/60 dark:border-blue-900/30 text-sm font-medium text-slate-800 dark:text-slate-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        {quality}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" /> Strategic Recommendations
                  </h4>
                  <div className="space-y-2">
                    {reviewData.topRecommendations?.map((rec, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50/80 dark:bg-[#1B1E36] p-3.5 rounded-xl border border-slate-200/60 dark:border-blue-900/30 text-sm font-medium text-slate-800 dark:text-slate-200">
                        <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-500" />
                Day-by-Day Evaluation Breakdown
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {reviewData.dailyBreakdown?.map((dayItem) => (
                  <div key={dayItem.day} className="p-6 rounded-2xl bg-white dark:bg-[#131629] border border-slate-200 dark:border-blue-900/30 shadow-md space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-blue-900/20 pb-3">
                      <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                        Day {dayItem.day} Evaluation
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm border dark:border-blue-500/20">
                        Score: {dayItem.score}/100
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dayItem.feedback}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">Strengths:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                          {dayItem.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">Areas to Improve:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                          {dayItem.improvements?.map((imp, i) => <li key={i}>{imp}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};