import { useTheme, ThemeToggle } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";
import { FaXTwitter, FaLinkedin, FaGithub } from 'react-icons/fa6';
import { useEffect, useRef, useState } from "react";
import bgDark from "../assets/Dark-bg.png"; 
import bgLight from "../assets/Light-bg.png"

// import bgLight from "../assets/image.png"

import { ArrowRight, Cpu, Code2, Terminal, ShieldAlert } from 'lucide-react';

interface CardData {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  lightBgGradient: string;
  badgeStyle: string;
  icon: React.ComponentType<{ className?: string }>;
  personImage: string;
  personName: string;
  personRole: string;
}

const CARDS: CardData[] = [
  {
    id: 1,
    badge: 'Data Science',
    title: 'Data Scientist',
    subtitle: 'Master data analysis, ML models, and statistical storytelling.',
    ctaText: 'Launch Simulation',
    lightBgGradient: 'from-blue-50/90 via-white to-slate-50 border-slate-200 dark:from-blue-950/40 dark:via-neutral-950 dark:to-neutral-950 dark:border-blue-500/30',
    badgeStyle: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    icon: Cpu,
    personImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    personName: 'Elena Rostova',
    personRole: 'IoT Systems Lead',
  },
  {
    id: 2,
    badge: 'Design',
    title: 'UI/UX Designer',
    subtitle: 'Create stunning user interfaces and seamless user experiences.',
    ctaText: 'Start Challenge',
    lightBgGradient: 'from-indigo-50/90 via-white to-slate-50 border-slate-200 dark:from-indigo-950/40 dark:via-neutral-950 dark:to-neutral-950 dark:border-indigo-500/30',
    badgeStyle: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    icon: Code2,
    personImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    personName: 'Alex Chen',
    personRole: 'Algorithm Architect',
  },
  {
    id: 3,
    badge: 'Full Stack',
    title: 'Web Developer',
    subtitle: 'Build financial models, draft executive memos, and solve urgent operational crises.',
    ctaText: 'Inspect Outage',
    lightBgGradient: 'from-cyan-50/90 via-white to-slate-50 border-slate-200 dark:from-cyan-950/40 dark:via-neutral-950 dark:to-neutral-950 dark:border-cyan-500/30',
    badgeStyle: 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20',
    icon: Terminal,
    personImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    personName: 'Sarah Jenkins',
    personRole: 'Site Reliability Eng',
  },
  {
    id: 4,
    badge: 'Cybersecurity',
    title: 'API Guard & Auth',
    subtitle: 'Shield endpoints against flood traffic & invalid tokens.',
    ctaText: 'Test Shield',
    lightBgGradient: 'from-purple-50/90 via-white to-slate-50 border-slate-200 dark:from-purple-950/40 dark:via-neutral-950 dark:to-neutral-950 dark:border-purple-500/30',
    badgeStyle: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
    icon: ShieldAlert,
    personImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    personName: 'Marcus Vance',
    personRole: 'Security Researcher',
  },
];

export default function LandingPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const currentBg = theme === "dark" ? bgDark : bgLight;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/15 overflow-x-hidden">

      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <img 
          src={currentBg}
          alt="Isometric Background"
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none z-0 brightness-100 dark:brightness-150 contrast-105 transition-all duration-300 "
        />

        {/* Dynamic Overlay: Dark mode me 50% dark overlay, Light mode me subtle light/none overlay */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60 light:bg-transparent pointer-events-none z-0 hidden dark:block" />

        <div className="relative z-10">
          <Navbar />
          <HeroSection /> 
          <MovingCardBanner />
          
        </div>
      </div>

      <main>
        <CareerPathsSection />
        <HowItWorksSection />
        <SocialProofSection />
      </main>

      <Footer/>
      
      <div className="sr-only" aria-live="polite">
        {theme === "dark" ? "Dark mode enabled" : "Light mode enabled"}
      </div>
    </div>
  );
}

function Navbar() {
 const navigate=useNavigate()
  return (
    <nav className="sticky top-0 z-50  bg-transparent backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <a href="/" className="font-display text-xl font-bold tracking-tight uppercase">
            Day 0
          </a>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <button onClick={()=>{navigate("/login")}} className="hover:text-foreground transition-colors">
              Dashboard
            </button>
            <button onClick={()=>{navigate("/login")}} className="hover:text-foreground transition-colors">
              Simulations
            </button>
            <button onClick={()=>{navigate("/login")}} className="hover:text-foreground transition-colors">
              Tasks
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={()=>{navigate("/login")}} className="hidden sm:block text-sm font-medium px-4 py-2 hover:text-foreground transition-colors">
            Login 
          </button>
          <button onClick={()=>{navigate("/login")}}  className="text-sm font-medium bg-foreground text-background px-5 py-2 rounded-sm hover:bg-foreground/90 transition-colors shadow-sm">
            Start Training
          </button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export function MovingCardBanner() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const CARD_WIDTH = 472; // 456px card width + 16px gap
  const TOTAL_ORIGINAL_CARDS = CARDS.length;

  // Track ke liye original cards ko 3 baar duplicate kar diya taaki infinite seamless loop bane
  const displayCards = [...CARDS, ...CARDS, ...CARDS];

  // Scroll position se active indicator pill sync karne ke liye
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const index = Math.round(scrollPosition / CARD_WIDTH);
      setActiveIndex(index % TOTAL_ORIGINAL_CARDS);
    }
  };

  // Indicator dot par click karke direct move karne ke liye
  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * CARD_WIDTH,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  // 🔄 TRUE INFINITE CYLINDRICAL 2-SECOND STEP LOOP
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      if (!scrollRef.current) return;

      const currentScroll = scrollRef.current.scrollLeft;
      const currentIndex = Math.round(currentScroll / CARD_WIDTH);

      // Agar hum 2nd Set ke end ke paas pahunch gaye hain:
      if (currentIndex >= TOTAL_ORIGINAL_CARDS * 2) {
        // Step 1: Chupke se instant wapas 1st set par teleport karo (bina animation ke)
        const resetIndex = currentIndex - TOTAL_ORIGINAL_CARDS;
        scrollRef.current.scrollTo({
          left: resetIndex * CARD_WIDTH,
          behavior: 'instant' as ScrollBehavior,
        });

        // Step 2: Aur agle tick par smoothly 1 step aage badho
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({
              left: (resetIndex + 1) * CARD_WIDTH,
              behavior: 'smooth',
            });
          }
        }, 50);
      } else {
        // Normal Step-by-Step Smooth Scroll
        scrollRef.current.scrollTo({
          left: (currentIndex + 1) * CARD_WIDTH,
          behavior: 'smooth',
        });
      }
    }, 2000); // Har 2 sec baad step move hoga

    return () => clearInterval(timer);
  }, [isHovered, TOTAL_ORIGINAL_CARDS]);

  return (
    <div 
      className="w-full max-w-7xl mx-auto px-6 py-2 relative"
      onMouseEnter={() => setIsHovered(true)}  /* Hover par pause */
      onMouseLeave={() => setIsHovered(false)} /* Mouse hatate hi resume */
    >
      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={`${card.id}-${index}`}
              className={`w-[456px] h-[200px] shrink-0 rounded-2xl border bg-gradient-to-br ${card.lightBgGradient} p-5 shadow-sm dark:shadow-xl transition-all duration-300 hover:scale-[1.01] flex justify-between items-stretch gap-4 relative overflow-hidden`}
            >
              {/* Left Column: Content */}
              <div className="flex flex-col justify-between flex-1 min-w-0 relative z-10 py-0.5">
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold border mb-2.5 ${card.badgeStyle}`}>
                    <Icon className="w-3 h-3" />
                    {card.badge}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug truncate">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mt-1.5">
                    {card.subtitle}
                  </p>
                </div>

                <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors pt-1">
                  {card.ctaText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right Column: Person Image */}
              <div className="w-[145px] shrink-0 h-full rounded-xl overflow-hidden relative group/img border border-slate-200/80 dark:border-white/10 shadow-sm">
                <img
                  src={card.personImage}
                  alt={card.personName}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-xs font-semibold text-white leading-tight truncate">
                    {card.personName}
                  </span>
                  <span className="text-[9.5px] text-slate-300 font-mono truncate mt-0.5">
                    {card.personRole}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pill Indicators (Dots) */}
      <div className="flex items-center gap-1.5 mt-4">
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? 'w-6 bg-slate-700 dark:bg-blue-400'
                : 'w-2 bg-slate-300 dark:bg-neutral-800 hover:bg-slate-400 dark:hover:bg-neutral-700'
            }`}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


function HeroSection() {
  const navigate = useNavigate();

  return (
   <section 
  id="simulation" 
  className="relative overflow-hidden py-12 min-h-[60vh] flex items-center justify-center"
>
  {/* -mt-12 ya -mt-16 se content upar shift ho jayega */}
  <div className="relative z-10 mx-auto max-w-4xl px-6 flex flex-col items-center text-center -mt-15 md:mt-10">
    
    {/* Heading */}
    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white leading-[0.95] mb-6 text-balance">
      Experience the <span className="text-primary italic">work</span> before the job.
    </h1>
    
    {/* Paragraph */}
    <p className="text-lg text-slate-700 dark:text-slate-300 max-w-[48ch] mb-10 leading-relaxed text-pretty font-medium">
      Interactive career simulations that mirror real workplace pressures. Master the role, build your portfolio, and land the offer.
    </p>

    {/* Buttons */}
    <div className="flex flex-wrap justify-center gap-4">
      <button 
        onClick={() => { navigate("/login"); }} 
        className="px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-sm hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/30"
      >
        Browse Simulations
      </button>
      
      <button 
        onClick={() => { navigate("/login"); }} 
        className="px-7 py-3.5 border border-slate-300 dark:border-white/20 bg-white/70 dark:bg-black/40 backdrop-blur-sm text-slate-900 dark:text-white font-semibold rounded-sm hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm"
      >
        View Tasks
      </button>
    </div>
  </div>
</section>
  );
}

// function HeroGraph() {
//   const bars = [42, 68, 55, 82, 60, 95, 74, 88];
//   const linePath = "M 20 120 L 60 96 L 100 108 L 140 72 L 180 84 L 220 48 L 260 60 L 300 32";
//   return (
//     <div className="relative animate-float will-change-transform" style={{ transformStyle: "preserve-3d" }}>
//       <div className="tilt-3d relative rounded-lg border border-border bg-card/90 backdrop-blur-xl shadow-2xl shadow-primary/10 dark:shadow-primary/20 overflow-hidden">
//         <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
//           <div className="flex items-center gap-2">
//             <span className="size-2.5 rounded-full bg-destructive/70" />
//             <span className="size-2.5 rounded-full bg-chart-5/80" />
//             <span className="size-2.5 rounded-full bg-chart-4/80" />
//           </div>
//           <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
//             day-0 / performance
//           </span>
//           <span className="font-mono text-[10px] text-primary">● LIVE</span>
//         </div>

//         <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
//           {[
//             { label: "Streak", value: "12d", trend: "+3" },
//             { label: "Skill Score", value: "87", trend: "+12" },
//             { label: "Tasks", value: "24/30", trend: "80%" },
//           ].map((m) => (
//             <div key={m.label} className="px-4 py-3">
//               <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
//                 {m.label}
//               </p>
//               <p className="font-display text-xl font-bold text-foreground leading-none">{m.value}</p>
//               <p className="text-[10px] text-primary font-mono mt-1">▲ {m.trend}</p>
//             </div>
//           ))}
//         </div>

//         <div className="p-5">
//           <div className="flex items-center justify-between mb-4">
//             <p className="font-display text-sm font-semibold text-foreground">Weekly Progress</p>
//             <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
//               <span className="flex items-center gap-1.5"><span className="size-2 bg-primary rounded-sm" /> Score</span>
//               <span className="flex items-center gap-1.5"><span className="size-2 bg-accent-blue-dim/60 rounded-sm" /> Target</span>
//             </div>
//           </div>

//           <svg viewBox="0 0 320 160" className="w-full h-40" role="img" aria-label="Weekly performance graph">
//             <defs>
//               <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="1" />
//                 <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.3" />
//               </linearGradient>
//               <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
//                 <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
//               </linearGradient>
//             </defs>

//             {[30, 70, 110, 150].map((y) => (
//               <line key={y} x1="10" y1={y} x2="310" y2={y}
//                 stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 4" />
//             ))}

//             {bars.map((h, i) => {
//               const x = 24 + i * 36;
//               const barH = h * 1.1;
//               return (
//                 <rect
//                   key={i}
//                   x={x}
//                   y={150 - barH}
//                   width="14"
//                   height={barH}
//                   rx="2"
//                   fill="url(#barGrad)"
//                   className="bar-rise"
//                   style={{ animationDelay: `${i * 90}ms` }}
//                 />
//               );
//             })}

//             <path
//               d={`${linePath} L 300 150 L 20 150 Z`}
//               fill="url(#areaGrad)"
//               opacity="0.9"
//             />
//             <path
//               d={linePath}
//               fill="none"
//               stroke="var(--color-primary)"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="line-draw"
//             />
//             {[[20,120],[60,96],[100,108],[140,72],[180,84],[220,48],[260,60],[300,32]].map(([x,y], i) => (
//               <circle key={i} cx={x} cy={y} r="3.5"
//                 fill="var(--color-background)"
//                 stroke="var(--color-primary)" strokeWidth="2"
//                 className="dot-pulse" style={{ animationDelay: `${i * 200}ms` }}
//               />
//             ))}
//           </svg>
//         </div>
//       </div>

//       <div
//         className="absolute -top-4 -right-4 md:-right-8 rounded-md border border-border bg-card px-4 py-3 shadow-xl animate-float-slow"
//         style={{ transform: "translateZ(40px)" }}
//       >
//         <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Level Up</p>
//         <p className="font-display text-lg font-bold text-foreground">+240 XP</p>
//       </div>

//       <div
//         className="absolute -bottom-5 -left-4 md:-left-10 rounded-md border border-border bg-card px-4 py-3 shadow-xl animate-float-slow flex items-center gap-3"
//         style={{ transform: "translateZ(60px)", animationDelay: "-2s" }}
//       >
//         <span className="size-8 grid place-items-center rounded-sm bg-primary/15 text-primary font-mono text-xs font-bold">
//           ✓
//         </span>
//         <div>
//           <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Task Complete</p>
//           <p className="text-xs font-semibold text-foreground">Sprint retro submitted</p>
//         </div>
//       </div>
//     </div>
//   );
// }


function CareerPathsSection() {
  const navigate=useNavigate()
  const paths = [
    {
      code: "TECH_01",
      title: "Data Scientist",
      description: 'Master data analysis, ML models, and statistical storytelling.',
      duration: "7 Days",
      tag: "High Load",
    },
    {
      code: "DESIGN_04",
      title: "UI/UX Designer",
      description: "Create stunning user interfaces and seamless user experiences.",
      duration: "6 Days",
      tag: "Designing",
    },
    {
      code: "DEV_01",
      title: "Web Developer",
      description: "Build financial models, draft executive memos, and solve urgent operational crises.",
      duration: "8 Days",
      tag: "Full Stack",
    },
  ];

  return (
    <section id="paths" className="relative overflow-hidden surface-contrast py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute top-10 right-10 h-360px w-360px rounded-full bg-primary/15 blur-3xl animate-orb"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-300px w-300px rounded-full bg-accent-blue-dim/15 blur-3xl animate-orb"
        style={{ animationDelay: "-6s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-16">
          <div>
            <span className="font-mono text-xs uppercase text-muted-foreground mb-4 block tracking-[0.2em]">
              ( 01 ) Select Vector
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Available Disciplines
            </h2>
          </div>
          <button onClick={()=>{navigate("/login")}} className="text-sm font-medium text-primary hover:underline underline-offset-4">
            View all 24 paths &rarr;
          </button>
        </div>

        <div className="perspective-1000 grid md:grid-cols-3 gap-6">
          {paths.map((path, i) => (
            <div
              key={path.code}
              className="card-3d group bg-card border border-border p-8 cursor-pointer rounded-sm shadow-sm hover:border-primary/50"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="mb-12 font-mono text-xs text-muted-foreground">[ {path.code} ]</div>
              <h3 className="font-display text-2xl font-bold mb-3 text-card-foreground">{path.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">{path.description}</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 border border-border text-[10px] font-mono">
                  {path.duration}
                </span>
                <span className="px-2 py-0.5 border border-border text-[10px] font-mono uppercase">
                  {path.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="network" className="relative overflow-hidden py-24 md:py-32 bg-background">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -top-20 right-1/3 h-[340px] w-[340px] rounded-full bg-primary/15 blur-3xl animate-orb"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-10 -left-20 h-[320px] w-[320px] rounded-full bg-accent-blue-dim/20 blur-3xl animate-orb"
        style={{ animationDelay: "-5s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span className="font-mono text-xs uppercase text-muted-foreground mb-4 block tracking-[0.2em]">
              ( 02 ) Evaluation Pipeline
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
              A mirror of real industry pressure. <span className="text-primary italic">Powered by AI.</span>
            </h2>
            <div className="space-y-12 mt-12">
              {[
                { 
                  n: "01", 
                  t: "Simulated Role Assignment", 
                  d: "Receive structured briefs, ambiguous requirements, and sprint goals modeled on real workplace tickets." 
                },
                { 
                  n: "02", 
                  t: "Real-Time Environment Stress", 
                  d: "Navigate shifting deadlines, unexpected Slack pings, and live edge-case bugs as you execute your tasks." 
                },
                { 
                  n: "03", 
                  t: "Instant AI Readiness Diagnostic", 
                  d: "Get instant, automated feedback scoring your code quality, architecture choices, and industry preparedness." 
                },
              ].map((s) => (
                <div key={s.n} className="flex gap-6 group">
                  <span className="font-mono text-primary text-xl group-hover:scale-125 transition-transform">{s.n}</span>
                  <div>
                    <h3 className="font-display font-bold text-lg mb-2 text-foreground">{s.t}</h3>
                    <p className="text-muted-foreground text-sm max-w-[40ch]">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative perspective-1000">
            <div className="card-3d aspect-4/5 bg-muted rounded-sm flex items-center justify-center relative overflow-hidden ring-1 ring-border shadow-2xl shadow-primary/10">
              <img
                src="/src/assets/simulation-task.jpg"
                alt="A professional working on a laptop in a modern office with a task management interface on screen"
                width={1008}
                height={1200}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div
                className="absolute bottom-6 left-6 right-6 bg-card p-5 shadow-xl border border-border rounded-sm animate-float-slow"
                style={{ transform: "translateZ(50px)" }}
              >
                <p className="font-mono text-[10px] text-primary mb-2 uppercase tracking-tighter">
                  Active AI Telemetry
                </p>
                <p className="text-sm font-medium text-card-foreground italic">
                  "Code architecture score: 88%. System detected missing error handling on rate limits. Deploy hotfix to boost score."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProofSection() {
  const companies = ["LINEAR", "NOTION", "STRIPE", "FRAMER", "VERCEL"];

  return (
    <section className="relative py-20 border-y border-border bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-10">
          Our alumni lead teams at
        </p>
        <div className="flex flex-wrap justify-center gap-10 md:gap-14 opacity-50 grayscale dark:opacity-60">
          {companies.map((name) => (
            <span
              key={name}
              className="font-display text-2xl font-bold tracking-tighter text-foreground hover:scale-110 hover:opacity-100 transition-all cursor-pointer"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

interface SocialLinkProps {
  'aria-label': 'Twitter' | 'LinkedIn' | 'GitHub' | string;
  href?: string;
}


function SocialLink({ 'aria-label': label, href = '#' }: SocialLinkProps) {
  const icons: Record<string, React.ComponentType<{ size?: number }>> = {
    Twitter: FaXTwitter,
    LinkedIn: FaLinkedin,
    GitHub: FaGithub,
  };

  const Icon = icons[label];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:bg-muted/50 transition-all duration-200"
    >
      {Icon && <Icon size={16} />}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden surface-contrast py-20">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/10 blur-3xl animate-orb"
        aria-hidden
      />

      {/* Main Footer Content */}
      <div className="relative mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-12">
        {/* Brand & Socials */}
        <div className="md:col-span-2">
          <span className="font-display text-2xl font-bold tracking-tight uppercase block mb-6">
            Day 0
          </span>
          <p className="text-muted-foreground text-sm max-w-sm mb-8 italic">
            "The shortest distance between ambition and reality is simulation."
          </p>
          
          {/* Social Links with Your Handles */}
          <div className="flex gap-3">
            <SocialLink 
              aria-label="Twitter" 
              href="https://x.com/VinitSi34094131" 
            />
            <SocialLink 
              aria-label="LinkedIn" 
              href="https://www.linkedin.com/in/vinitsi-2043-/" 
            />
            <SocialLink 
              aria-label="GitHub" 
              href="https://github.com/vinit-singh2007" 
            />
          </div>
        </div>

        {/* Product Navigation */}
        <div>
          <h5 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Product
          </h5>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Curriculum</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Simulation Engine</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Mentorship</a></li>
          </ul>
        </div>

        {/* Company Navigation */}
        <div>
          <h5 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Company
          </h5>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Manifesto</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="relative mx-auto max-w-7xl px-6 mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} DAY 0 SYSTEMS INC. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-primary transition-colors">TERMS</a>
          <a href="#" className="hover:text-primary transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-primary transition-colors">COOKIE POLICY</a>
        </div>
      </div>
    </footer>
  );
}

