import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Play,
  Target,
  Trophy,
  TrendingUp, 
  Code, 
  Palette, 
  Megaphone, 
  ShieldCheck, 
  Cloud, 
  Kanban, 
  Link2, 
  Scale, 
  BookOpen, 
  Database,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const stats = [
  { label: "Streak", value: "12d", delta: "+3", icon: Flame },
  { label: "Skill Score", value: "87", delta: "+12", icon: Target },
  { label: "Tasks", value: "24/30", delta: "80%", icon: CheckCircle2 },
  { label: "Rank", value: "#41", delta: "+9", icon: Trophy },
];

const week = [
  { day: "M", score: 52, target: 70 },
  { day: "T", score: 64, target: 70 },
  { day: "W", score: 58, target: 70 },
  { day: "T", score: 78, target: 75 },
  { day: "F", score: 70, target: 75 },
  { day: "S", score: 88, target: 80 },
  { day: "S", score: 82, target: 80 },
];

const sims = [
  {
    path: "Data Scientist",
    title: "Master data analysis, ML models, and statistical storytelling.",
    icon: TrendingUp,
    iconColor: "text-indigo-400",
    comingSoon: false,
  },
  {
    path: "Web Developer",
    title: "Build modern, scalable web applications using React and Node.js.",
    icon: Code,
    iconColor: "text-emerald-400",
    comingSoon: false,
  },
  {
    path: "UI/UX Designer",
    title: "Create stunning user interfaces and seamless user experiences.",
    icon: Palette,
    iconColor: "text-rose-400",
    comingSoon: false,
  },
];

const tasks = [
  { title: "Submit sprint retro notes", due: "09:30", done: true },
  { title: "Reply to stakeholder escalation", due: "11:00", done: true },
  { title: "Ship onboarding copy review", due: "14:15", done: false },
  { title: "1:1 prep with your mentor", due: "16:45", done: false },
];

const mentors = [
  {
    name: "Vinit Singh",
    role: "Jr. Full Stack Developer",
    initials: "VS",
    href: "https://axevin-ixyhk8vv8-axe-vin.vercel.app/",
  },
  { name: "Krishna Singh", role: "Sr. Gen AI Eng", initials: "KS" },
  { name: "Aditya Mishra", role: "Jr. Data Scientist", initials: "AM" },
];

interface handleNavigateSimulation {
  onNavigate?: () => void;
}

const Dashboard = ({ onNavigate }: handleNavigateSimulation) => {
  const [dashboardData, setDashboardData] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseURL}/api/dash`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    getDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="grid-canvas scene-3d flex-1 px-4 py-6 sm:px-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex min-w-0 flex-col gap-6">
              {/* simulation */}
            <section className="scene-3d">
  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pb-4">
    <h2 className="truncate text-base font-semibold text-white">
      Career Paths
    </h2>

    <NavLink to="/dashboard/simulation" onClick={onNavigate} className="label-mono text-indigo-400 hover:text-indigo-300">See all</NavLink>
  </div>

  {/* Updated grid to enforce a 3-column layout max */}
  <div className="grid gap-6 md:grid-cols-3">
    {sims.map((sim) => {
      const IconComponent = sim.icon;
      return (
        <article
          key={sim.path}
          className="tilt-3d relative flex flex-col justify-between rounded-3xl bg-[#0e131f] border border-gray-800/60 p-6 text-white shadow-2xl transition-all duration-300 hover:border-gray-700"
        >
          {/* Top Badge for Coming Soon items */}
          {sim.comingSoon && (
            <span className="absolute top-5 right-5 rounded-full bg-gray-800/80 border border-gray-700/50 px-2.5 py-0.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Coming Soon
            </span>
          )}

          <div>
            {/* Dynamic Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              <IconComponent className={`h-6 w-6 ${sim.iconColor}`} />
            </div>

            {/* Role Title */}
            <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
              {sim.path}
            </h3>

            {/* Role Description */}
            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              {sim.title}
            </p>
          </div>

          {/* Action Link */}
          <button 
            disabled={sim.comingSoon}
            className={`mt-6 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase group w-fit transition-colors ${
              sim.comingSoon 
                ? "text-gray-600 cursor-not-allowed" 
                : "text-indigo-400 hover:text-indigo-300"
            }`}
          >
            <span>Start Simulation</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </article>
      );
    })}
  </div>
</section>

              {/* Stats */}
              <section className="scene-3d grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map(({ label, value, delta, icon: Icon }) => (
                  <div key={label} className="panel tilt-3d p-5">
                    <div className="flex items-center justify-between">
                      <p className="label-mono text-muted-foreground">
                        {label}
                      </p>

                      <Icon className="h-4 w-4 text-primary" />
                    </div>

                    <p className="font-display mt-3 text-2xl font-bold">
                      {value}
                    </p>

                    <p className="text-success mt-1 flex items-center gap-1 text-xs font-medium">
                      <ArrowUpRight className="h-3 w-3" />
                      {delta}
                    </p>
                  </div>
                ))}
              </section>

              

              {/* Weekly Performance */}
              <section className="panel scene-3d p-6">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                  <h2 className="truncate text-base font-semibold">
                    Weekly Progress
                  </h2>

                  <div className="flex shrink-0 items-center gap-4">
                    <span className="label-mono text-muted-foreground flex items-center gap-1.5">
                      <span className="rounded-xs h-2 w-2 bg-primary" />
                      Score
                    </span>

                    <span className="label-mono text-muted-foreground flex items-center gap-1.5">
                      <span className="rounded-xs h-2 w-2 bg-muted-foreground/40" />
                      Target
                    </span>
                  </div>
                </div>

                <div className="chart-3d mt-8 flex items-end gap-3 sm:gap-5">
                  {week.map((day, index) => (
                    <div
                      key={index}
                      className="flex min-w-0 flex-1 flex-col items-center gap-2"
                    >
                      <div className="flex h-40 w-full items-end justify-center gap-1">
                        <div
                          className="bar-3d w-1/2 rounded-t-md bg-primary"
                          style={{
                            height: `${day.score * 1.6}px`,
                            animationDelay: `${index * 90}ms`,
                          }}
                        />

                        <div
                          className="bar-3d w-1/3 rounded-t-md bg-muted-foreground/25"
                          style={{
                            height: `${day.target * 1.6}px`,
                            animationDelay: `${index * 90 + 45}ms`,
                          }}
                        />
                      </div>

                      <span className="label-mono text-muted-foreground">
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

                  {/* Hero */}
              <section className="tilt-3d glow-primary relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground">
                <div className="float-3d absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary-foreground/10 blur-2xl" />

                <p className="label-mono text-primary-foreground/70">
                  ● Simulation: active
                </p>

                <h1 className="mt-3 max-w-lg text-3xl font-bold leading-tight sm:text-4xl">
                  Experience the work before the job.
                </h1>

                <p className="mt-3 max-w-md text-sm text-primary-foreground/80">
                  Day 12 of the Product Manager path. Four tasks are waiting in
                  your simulated inbox.
                </p>

                <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5">
                  <Play className="h-4 w-4" />
                  Resume today's shift
                </button>
              </section>
            </div>

                  
            {/* Right Side */}
            <div className="flex flex-col gap-6">
              {/* Tasks */}
              <section className="panel p-6">
                <h2 className="text-base font-semibold">Today's Tasks</h2>

                <ul className="mt-4 flex flex-col gap-3">
                  {tasks.map((task) => (
                    <li key={task.title} className="flex items-start gap-3">
                      {task.done ? (
                        <CheckCircle2 className="text-success h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}

                      <span>
                        <span
                          className={`block text-sm ${
                            task.done
                              ? "text-muted-foreground line-through"
                              : "font-medium"
                          }`}
                        >
                          {task.title}
                        </span>

                        <span className="label-mono text-muted-foreground">
                          {task.due}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Mentors */}
              <section className="panel p-6">
                <h2 className="text-base font-semibold">Your Mentors</h2>

                <ul className="mt-4 flex flex-col gap-4">
                  {mentors.map((mentor) => (
                    <li key={mentor.name} className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-semibold">
                        {mentor.initials}
                      </span>

                      <span className="flex-1">
                        <span className="block text-sm font-medium">
                          {mentor.name}
                        </span>

                        <span className="block text-xs text-muted-foreground">
                          {mentor.role}
                        </span>
                      </span>

                      <button
                        onClick={() => {
                          if (mentor.href) {
                            window.open(mentor.href, "_blank");
                          }
                        }}
                        className="label-mono border-border text-muted-foreground hover:text-primary rounded-lg border px-2.5 py-1"
                      >
                        Ask
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Milestone */}
              <section className="panel p-6">
                <p className="label-mono text-muted-foreground">
                  Next milestone
                </p>

                <p className="font-display mt-2 text-xl font-bold">
                  Level 4 · Associate PM
                </p>

                <div className="mt-4 h-1.5 rounded-full bg-muted">
                  <div className="h-full w-3/4 rounded-full bg-primary" />
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  240 XP to unlock the stakeholder negotiation simulation.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;