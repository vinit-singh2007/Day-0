import { useTheme, ThemeToggle } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";


export default function LandingPage() {
  const { theme } = useTheme();
  const navigate=useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/15 overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection  />
        <CareerPathsSection />
        <HowItWorksSection />
        <SocialProofSection />
      </main>
      <Footer />
      <div className="sr-only" aria-live="polite">
        {theme === "dark" ? "Dark mode enabled" : "Light mode enabled"}
      </div>
    </div>
  );
}

function Navbar() {
 const navigate=useNavigate()
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <a href="/" className="font-display text-xl font-bold tracking-tight uppercase">
            Day 0
          </a>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#simulation" className="hover:text-foreground transition-colors">
              Simulation
            </a>
            <a href="#paths" className="hover:text-foreground transition-colors">
              Paths
            </a>
            <a href="#network" className="hover:text-foreground transition-colors">
              Network
            </a>
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


function HeroSection() {
  const navigate=useNavigate()
  return (
    <section id="simulation" className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-420px w-420px rounded-full bg-primary/20 blur-3xl animate-orb"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-40 -right-32 h-380px w-380px rounded-full bg-accent-blue-dim/25 blur-3xl animate-orb"
        style={{ animationDelay: "-4s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-primary/10 border border-primary/20 mb-6 rounded-sm">
            <span className="size-1.5 bg-primary rounded-full animate-pulse" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              System: Online
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-foreground leading-[0.95] mb-6 text-balance">
            Experience the <span className="text-primary italic">work</span> before the job.
          </h1>
          <p className="text-lg text-muted-foreground max-w-[42ch] mb-10 leading-relaxed text-pretty">
            Interactive career simulations that mirror real workplace pressures. Master the role, build your portfolio, and land the offer.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={()=>{navigate("/login")}} className="px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-sm hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/30">
              Browse Simulations
            </button>
            <button className="px-7 py-3.5 border border-border font-semibold rounded-sm hover:bg-accent transition-all">
              View Paths
            </button>
          </div>
        </div>
        <div className="relative lg:pl-4 perspective-1000">
          <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full opacity-60 dark:opacity-40 pointer-events-none" />
          <HeroGraph />
        </div>
      </div>
    </section>
  );
}

function HeroGraph() {
  const bars = [42, 68, 55, 82, 60, 95, 74, 88];
  const linePath = "M 20 120 L 60 96 L 100 108 L 140 72 L 180 84 L 220 48 L 260 60 L 300 32";
  return (
    <div className="relative animate-float will-change-transform" style={{ transformStyle: "preserve-3d" }}>
      <div className="tilt-3d relative rounded-lg border border-border bg-card/90 backdrop-blur-xl shadow-2xl shadow-primary/10 dark:shadow-primary/20 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-destructive/70" />
            <span className="size-2.5 rounded-full bg-chart-5/80" />
            <span className="size-2.5 rounded-full bg-chart-4/80" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            day-0 / performance
          </span>
          <span className="font-mono text-[10px] text-primary">● LIVE</span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          {[
            { label: "Streak", value: "12d", trend: "+3" },
            { label: "Skill Score", value: "87", trend: "+12" },
            { label: "Tasks", value: "24/30", trend: "80%" },
          ].map((m) => (
            <div key={m.label} className="px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                {m.label}
              </p>
              <p className="font-display text-xl font-bold text-foreground leading-none">{m.value}</p>
              <p className="text-[10px] text-primary font-mono mt-1">▲ {m.trend}</p>
            </div>
          ))}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display text-sm font-semibold text-foreground">Weekly Progress</p>
            <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2 bg-primary rounded-sm" /> Score</span>
              <span className="flex items-center gap-1.5"><span className="size-2 bg-accent-blue-dim/60 rounded-sm" /> Target</span>
            </div>
          </div>

          <svg viewBox="0 0 320 160" className="w-full h-40" role="img" aria-label="Weekly performance graph">
            <defs>
              <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[30, 70, 110, 150].map((y) => (
              <line key={y} x1="10" y1={y} x2="310" y2={y}
                stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 4" />
            ))}

            {bars.map((h, i) => {
              const x = 24 + i * 36;
              const barH = h * 1.1;
              return (
                <rect
                  key={i}
                  x={x}
                  y={150 - barH}
                  width="14"
                  height={barH}
                  rx="2"
                  fill="url(#barGrad)"
                  className="bar-rise"
                  style={{ animationDelay: `${i * 90}ms` }}
                />
              );
            })}

            <path
              d={`${linePath} L 300 150 L 20 150 Z`}
              fill="url(#areaGrad)"
              opacity="0.9"
            />
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="line-draw"
            />
            {[[20,120],[60,96],[100,108],[140,72],[180,84],[220,48],[260,60],[300,32]].map(([x,y], i) => (
              <circle key={i} cx={x} cy={y} r="3.5"
                fill="var(--color-background)"
                stroke="var(--color-primary)" strokeWidth="2"
                className="dot-pulse" style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </svg>
        </div>
      </div>

      <div
        className="absolute -top-4 -right-4 md:-right-8 rounded-md border border-border bg-card px-4 py-3 shadow-xl animate-float-slow"
        style={{ transform: "translateZ(40px)" }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Level Up</p>
        <p className="font-display text-lg font-bold text-foreground">+240 XP</p>
      </div>

      <div
        className="absolute -bottom-5 -left-4 md:-left-10 rounded-md border border-border bg-card px-4 py-3 shadow-xl animate-float-slow flex items-center gap-3"
        style={{ transform: "translateZ(60px)", animationDelay: "-2s" }}
      >
        <span className="size-8 grid place-items-center rounded-sm bg-primary/15 text-primary font-mono text-xs font-bold">
          ✓
        </span>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Task Complete</p>
          <p className="text-xs font-semibold text-foreground">Sprint retro submitted</p>
        </div>
      </div>
    </div>
  );
}


function CareerPathsSection() {
  const paths = [
    {
      code: "TECH_01",
      title: "Product Engineer",
      description: "Ship high-stakes features, manage tech debt, and collaborate with cross-functional leads.",
      duration: "8 WEEKS",
      tag: "High Load",
    },
    {
      code: "DESIGN_04",
      title: "Growth Designer",
      description: "Execute A/B tests, refine user funnels, and present data-backed design decisions.",
      duration: "6 WEEKS",
      tag: "Analytical",
    },
    {
      code: "OPS_02",
      title: "Strategy Associate",
      description: "Build financial models, draft executive memos, and solve urgent operational crises.",
      duration: "10 WEEKS",
      tag: "Strategic",
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
          <a href="#" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            View all 24 paths &rarr;
          </a>
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

function HowItWorksSection() {
  return (
    <section id="network" className="relative overflow-hidden py-24 md:py-32 bg-background">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -top-20 right-1/3 h-340px w-340px rounded-full bg-primary/15 blur-3xl animate-orb"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-10 -left-20 h-320px w-320px rounded-full bg-accent-blue-dim/20 blur-3xl animate-orb"
        style={{ animationDelay: "-5s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span className="font-mono text-xs uppercase text-muted-foreground mb-4 block tracking-[0.2em]">
              ( 02 ) The Protocol
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
              A mirror of the <span className="text-primary italic">actual</span> environment.
            </h2>
            <div className="space-y-12 mt-12">
              {[
                { n: "01", t: "Accept the Mission", d: "Receive a structured project brief from your virtual lead. Define scope and timelines." },
                { n: "02", t: "Simulated Pressure", d: "Navigate unexpected Slack pings, changing requirements, and tight internal deadlines." },
                { n: "03", t: "Expert Review", d: "Submit your work to a network of real industry mentors for high-fidelity feedback." },
              ].map((s) => (
                <div key={s.n} className="flex gap-6 group">
                  <span className="font-mono text-primary text-xl group-hover:scale-125 transition-transform">{s.n}</span>
                  <div>
                    <h4 className="font-display font-bold text-lg mb-2 text-foreground">{s.t}</h4>
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
                  Active Task
                </p>
                <p className="text-sm font-medium text-card-foreground italic">
                  "The client needs the revised mockups by 5 PM. Can we pivot the color palette to something more corporate?"
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

function Footer() {
  return (
    <footer className="relative overflow-hidden surface-contrast py-20">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 h-400px w-600px rounded-full bg-primary/10 blur-3xl animate-orb"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <span className="font-display text-2xl font-bold tracking-tight uppercase block mb-6">
            Day 0
          </span>
          <p className="text-muted-foreground text-sm max-w-sm mb-8 italic">
            "The shortest distance between ambition and reality is simulation."
          </p>
          <div className="flex gap-3">
            <SocialLink aria-label="Twitter" />
            <SocialLink aria-label="LinkedIn" />
            <SocialLink aria-label="GitHub" />
          </div>
        </div>
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
      <div className="relative mx-auto max-w-7xl px-6 mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>&copy; 2024 DAY 0 SYSTEMS INC. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-primary transition-colors">TERMS</a>
          <a href="#" className="hover:text-primary transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-primary transition-colors">COOKIE POLICY</a>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ "aria-label": label }: { "aria-label": string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="size-8 rounded-full border border-border grid place-items-center hover:bg-primary/10 hover:border-primary/40 transition-colors"
    >
      <span className="sr-only">{label}</span>
    </a>
  );
}