import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Code,
  Palette,
  Megaphone,
  ShieldCheck,
  Cloud,
  Kanban,
  Link2,
  Database,
  TrendingUp,
  Terminal,
  Brain,
  Smartphone,
  Monitor,
  Layers,
} from "lucide-react";

const sims = [
  {
    id: "data-scientist",
    path: "Data Scientist",
    title:
      "Master data analysis, ML models, and statistical storytelling.",
    icon: TrendingUp,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    comingSoon: false,
  },
  {
    id: "web-developer",
    path: "Web Developer",
    title:
      "Build modern, scalable web applications using React and Node.js.",
    icon: Code,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    comingSoon: false,
  },
  {
    id: "ui-ux-designer",
    path: "UI/UX Designer",
    title:
      "Create stunning user interfaces and seamless user experiences.",
    icon: Palette,
    iconColor: "text-rose-600 dark:text-rose-400",
    comingSoon: false,
  },
  {
    id: "digital-marketer",
    path: "Digital Marketer",
    title:
      "Optimize campaigns, SEO, growth funnels, and analytics.",
    icon: Megaphone,
    iconColor: "text-amber-600 dark:text-amber-400",
    comingSoon: true,
  },
  {
    id: "cybersecurity-analyst",
    path: "Cybersecurity Analyst",
    title:
      "Perform threat analysis, penetration testing, and network defense.",
    icon: ShieldCheck,
    iconColor: "text-cyan-600 dark:text-cyan-400",
    comingSoon: true,
  },
  {
    id: "cloud-architect",
    path: "Cloud Architect",
    title:
      "Design scalable cloud infrastructure and serverless solutions.",
    icon: Cloud,
    iconColor: "text-sky-600 dark:text-sky-400",
    comingSoon: true,
  },
  {
    id: "product-manager",
    path: "Product Manager",
    title:
      "Build product roadmaps, manage sprints, and backlog grooming.",
    icon: Kanban,
    iconColor: "text-purple-600 dark:text-purple-400",
    comingSoon: true,
  },
  {
    id: "blockchain-developer",
    path: "Blockchain Developer",
    title:
      "Develop smart contracts, Web3 protocols, and dApps.",
    icon: Link2,
    iconColor: "text-red-600 dark:text-red-400",
    comingSoon: true,
  },
  {
    id: "data-engineer",
    path: "Data Engineer",
    title:
      "Construct robust ETL pipelines and enterprise data lakes.",
    icon: Database,
    iconColor: "text-blue-600 dark:text-blue-400",
    comingSoon: true,
  },
  {
    id: "frontend-developer",
    path: "Frontend Developer",
    title:
      "Create responsive and interactive web interfaces with modern frontend technologies.",
    icon: Monitor,
    iconColor: "text-violet-600 dark:text-violet-400",
    comingSoon: true,
  },
  {
    id: "full-stack-developer",
    path: "Full Stack Developer",
    title:
      "Design and develop complete web applications across frontend, backend, and databases.",
    icon: Layers,
    iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
    comingSoon: true,
  },
  {
    id: "mobile-app-developer",
    path: "Mobile App Developer",
    title:
      "Build high-performance Android and iOS applications with modern mobile frameworks.",
    icon: Smartphone,
    iconColor: "text-green-600 dark:text-green-400",
    comingSoon: true,
  },
  {
    id: "software-engineer",
    path: "Software Engineer",
    title:
      "Design, develop, test, and maintain reliable software systems and applications.",
    icon: Terminal,
    iconColor: "text-blue-600 dark:text-blue-400",
    comingSoon: true,
  },
  {
    id: "machine-learning-engineer",
    path: "Machine Learning Engineer",
    title:
      "Build, train, optimize, and deploy machine learning models for real-world applications.",
    icon: Brain,
    iconColor: "text-pink-600 dark:text-pink-400",
    comingSoon: true,
  },
];

interface handleNavigateSimulation {
  onNavigate?: () => void;
}


const Simulations = ({onNavigate}:handleNavigateSimulation) => {
  const navigate = useNavigate();

  const handleStartSimulation = (path: string, comingSoon: boolean) => {
    if (comingSoon) return;
    localStorage.setItem("active_domain",path)
    const encodedPath = encodeURIComponent(path);
    navigate(`/dashboard/assessment/${encodedPath}`);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="grid-canvas scene-3d flex-1 px-4 py-6 sm:px-8">
          <div className="w-full">
            <div className="flex min-w-0 flex-col gap-6">

              {/* Career Paths */}
              <section className="scene-3d">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pb-4">
                  <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                    Career Paths
                  </h2>
                </div>

                {/* Career Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                  {sims.map((sim) => {
                    const IconComponent = sim.icon;

                    return (
                      <article
                        key={sim.id}
                        className={`tilt-3d relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#0e131f] border border-gray-200 dark:border-gray-800/60 p-6 shadow-sm dark:shadow-2xl transition-all duration-300 ${
                          sim.comingSoon
                            ? "opacity-70 dark:opacity-60"
                            : "hover:border-gray-300 dark:hover:border-gray-700 hover:-translate-y-1 shadow-md hover:shadow-lg dark:hover:shadow-2xl"
                        }`}
                      >
                        {/* Coming Soon Badge */}
                        {sim.comingSoon && (
                          <span className="absolute top-5 right-5 rounded-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 px-2.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Coming Soon
                          </span>
                        )}

                        <div>
                          {/* Icon */}
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-inner">
                            <IconComponent
                              className={`h-6 w-6 ${sim.iconColor}`}
                            />
                          </div>

                          {/* Role Title */}
                          <h3 className="mt-5 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {sim.path}
                          </h3>

                          {/* Role Description */}
                          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                            {sim.title}
                          </p>
                        </div>

                        {/* Action Button */}
                        <button
                          type="button"
                          disabled={sim.comingSoon}
                          onClick={() =>
                            handleStartSimulation(
                              sim.path,
                              sim.comingSoon
                            )
                          }
                          className={`mt-6 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase group w-fit transition-colors ${
                            sim.comingSoon
                              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                              : "text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                          }`}
                        >
                          <span>
                            {sim.comingSoon
                              ? "Coming Soon"
                              : "Start Simulation"}
                          </span>

                          {!sim.comingSoon && (
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          )}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Simulations;