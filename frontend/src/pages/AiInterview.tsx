// import React, { useState, useEffect } from 'react';
// import { Mic, MicOff, Video, VideoOff, Sparkles, User, Bot, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

// export const AIInterview: React.FC = () => {
//   // Session States
//   const [isMicOn, setIsMicOn] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [answer, setAnswer] = useState('');
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per question

//   // Mock Interview Questions
//   const questions = [
//     {
//       id: 1,
//       category: "System Design",
//       question: "How would you design a scalable rate limiter for an API gateway handling millions of requests per second?",
//       hint: "Consider algorithms like Token Bucket or Leaky Bucket, and distributed storage like Redis."
//     },
//     {
//       id: 2,
//       category: "Problem Solving",
//       question: "Explain how you would handle race conditions in a high-concurrency database environment.",
//       hint: "Discuss pessimistic vs optimistic locking, and database isolation levels."
//     },
//     {
//       id: 3,
//       category: "Behavioral",
//       question: "Describe a time when you had to optimize a severely lagging web application under tight deadlines.",
//       hint: "Use the STAR method: Situation, Task, Action, Result."
//     }
//   ];

//   const currentQ = questions[currentQuestionIndex];

//   // Timer countdown hook
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [currentQuestionIndex]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setIsSubmitting(true);
//       setTimeout(() => {
//         setCurrentQuestionIndex(prev => prev + 1);
//         setAnswer('');
//         setTimeLeft(180);
//         setIsSubmitting(false);
//       }, 800);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col p-4 md:p-8 font-sans transition-colors duration-300">
//       {/* Top Header Bar */}
//       <header className="flex justify-between items-center pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
//             <Sparkles className="w-6 h-6 animate-pulse" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AI Technical & Behavioral Interview</h1>
//             <p className="text-xs text-slate-500 dark:text-slate-400">Live AI Assessment • Domain: Full Stack / Software Engineering</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-sm font-semibold text-amber-600 dark:text-amber-400 shadow-sm">
//             <Clock className="w-4 h-4" />
//             <span>{formatTime(timeLeft)} remaining</span>
//           </div>
//           <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
//             Question {currentQuestionIndex + 1} of {questions.length}
//           </span>
//         </div>
//       </header>

//       {/* Main Grid Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
//         {/* Left Section: AI Interviewer Video / Feed & Transcript (4 Cols) */}
//         <div className="lg:col-span-5 flex flex-col gap-6">
//           {/* AI Video Simulation Box */}
//           <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 aspect-video flex items-center justify-center shadow-xl group">
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent dark:from-slate-950/80 z-10" />
            
//             {/* AI Avatar Animation Wave */}
//             <div className="flex flex-col items-center gap-3 z-20">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-bounce">
//                 <Bot className="w-10 h-10 text-white" />
//               </div>
//               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-700/50 backdrop-blur-md shadow-sm">
//                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
//                 <span className="text-xs font-medium text-slate-700 dark:text-slate-300">AI Interviewer Speaking...</span>
//               </div>
//             </div>

//             {/* User Camera Small Floating Preview */}
//             <div className="absolute bottom-4 right-4 w-32 h-24 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 z-20 shadow-lg flex items-center justify-center">
//               {isVideoOn ? (
//                 <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
//                   <User className="w-8 h-8 text-slate-400" />
//                   <span className="absolute bottom-1 left-1 text-[10px] bg-slate-950/70 px-1.5 py-0.5 rounded text-slate-200">You</span>
//                 </div>
//               ) : (
//                 <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-500 gap-1">
//                   <VideoOff className="w-5 h-5" />
//                   <span className="text-[10px]">Camera Off</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Question Card Box */}
//           <div className="flex-1 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm flex flex-col justify-between space-y-4 shadow-sm">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
//                   {currentQ.category}
//                 </span>
//                 <span className="text-xs text-slate-400">ID: Q-{currentQ.id}</span>
//               </div>
//               <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
//                 {currentQ.question}
//               </h2>
//             </div>

//             <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
//               <Sparkles className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
//               <p><strong className="font-semibold">AI Tip:</strong> {currentQ.hint}</p>
//             </div>
//           </div>
//         </div>

//         {/* Right Section: Answer Input & Controls (7 Cols) */}
//         <div className="lg:col-span-7 flex flex-col gap-6">
//           <div className="flex-1 flex flex-col p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm shadow-xl space-y-4">
//             <div className="flex justify-between items-center">
//               <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
//                 Your Answer / Response Code
//               </label>
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsMicOn(!isMicOn)}
//                   className={`p-2.5 rounded-xl border transition ${
//                     isMicOn 
//                       ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700' 
//                       : 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400'
//                   }`}
//                   title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
//                 >
//                   {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setIsVideoOn(!isVideoOn)}
//                   className={`p-2.5 rounded-xl border transition ${
//                     isVideoOn 
//                       ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700' 
//                       : 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400'
//                   }`}
//                   title={isVideoOn ? "Turn off Video" : "Turn on Video"}
//                 >
//                   {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>

//             {/* Answer Text Area */}
//             <textarea
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//               placeholder="Type your structured answer here, or speak into your microphone to transcribe in real-time..."
//               className="w-full flex-1 min-h-[260px] p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-600 text-sm focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition resize-none leading-relaxed"
//             />

//             {/* Bottom Submit / Action Buttons */}
//             <div className="flex items-center justify-between pt-2">
//               <span className="text-xs text-slate-400 dark:text-slate-500">
//                 {answer.trim().length} characters typed
//               </span>

//               <button
//                 type="button"
//                 onClick={handleNextQuestion}
//                 disabled={isSubmitting || answer.trim().length < 5}
//                 className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <>Evaluating Response...</>
//                 ) : currentQuestionIndex === questions.length - 1 ? (
//                   <>
//                     Finish Interview <CheckCircle2 className="w-4 h-4" />
//                   </>
//                 ) : (
//                   <>
//                     Submit & Next Question <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };