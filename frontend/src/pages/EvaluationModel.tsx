import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, X, RefreshCw, CheckCircle, TrendingUp, Award, FileText, ChevronRight } from 'lucide-react';

export interface EvaluationData {
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
}

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEvaluating: boolean;
  evalError: string | null;
  evalData: EvaluationData | null;
  currentDay: number;
  onRetry: () => void;
  onNextDay: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  isOpen,
  onClose,
  isEvaluating,
  evalError,
  evalData,
  currentDay,
  onRetry,
  onNextDay,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-7 md:p-9 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 border border-indigo-500/20">
              <Zap className="h-7 w-7 fill-current" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                AI Evaluation
              </h3>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">
                DAY {currentDay} PERFORMANCE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-6">
          {/* Loading State */}
          {isEvaluating && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Evaluating response...
              </p>
              <p className="text-sm text-slate-400">
                Analyzing your submission against industry standards.
              </p>
            </div>
          )}

          {/* Error State */}
          {!isEvaluating && evalError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-6 dark:border-rose-900/40 dark:bg-rose-950/40">
              <p className="text-base font-bold text-rose-600 dark:text-rose-400">
                Evaluation Error
              </p>
              <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">
                {evalError}
              </p>
              <button
                onClick={onRetry}
                className="mt-5 flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-rose-700 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Evaluation
              </button>
            </div>
          )}

          {/* Success State */}
          {!isEvaluating && !evalError && evalData && (
            <div className="space-y-6">
              {evalData.score !== undefined && (
                <div className="flex items-center justify-between rounded-2xl bg-indigo-50/90 p-5 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50">
                  <span className="text-sm font-extrabold uppercase tracking-widest text-indigo-900 dark:text-indigo-300">
                    Total Score
                  </span>
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {evalData.score} <span className="text-xl text-slate-400 dark:text-slate-500 font-bold">/ 100</span>
                  </span>
                </div>
              )}

              {evalData.feedback && (
                <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                    {evalData.feedback}
                  </p>
                </div>
              )}

              {evalData.strengths && evalData.strengths.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" /> Strengths
                  </p>
                  <ul className="space-y-2 pl-2">
                    {evalData.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-base text-slate-700 dark:text-slate-300 leading-normal">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {evalData.improvements && evalData.improvements.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Key Areas to Improve
                  </p>
                  <ul className="space-y-2.5 pl-2">
                    {evalData.improvements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-base text-slate-700 dark:text-slate-300 leading-normal">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dynamic Footer Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-end">
                {currentDay < 7 ? (
                  <button
                    type="button"
                    onClick={onNextDay}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    Move to Day {currentDay + 1}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/dashboard/e-certificate?domain');
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Award className="w-5 h-5" />
                      Get E-Certificate
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/dashboard/ai-review');
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <FileText className="w-5 h-5" />
                      Full AI Review
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};