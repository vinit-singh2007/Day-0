import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Code,
  Flame,
  IndianRupee,
  Palette,
  Play,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

// Interfaces
interface SalaryPrediction {
  minSalary: number;
  maxSalary: number;
  currency: string;
}

interface Evaluation {
  skillScore?: {
    technicalScore: number;
    problemSolvingScore: number;
    communicationScore: number;
    overallScore: number;
  };
  salaryPrediction?: SalaryPrediction;
}

interface AIReview {
  overallScore?: number;
  skillScore?: {
    overallScore: number;
  };
  salaryPrediction?: SalaryPrediction;
}

interface ResponseItem {
  day: number;
  response: string;
  evaluation?: Evaluation;
  submittedAt: string;
}

interface UserDomainData {
  _id: string;
  userId: string;
  domain: string;
  completedDays: number[];
  responses: ResponseItem[];
  aiReview?: AIReview;
  updatedAt: string;
}

interface MilestoneData {
  hasActiveDomain: boolean;
  domain?: string;
  currentLevel?: string;
  completedDaysCount?: number;
  remainingDays?: number;
  progressPercentage?: number;
  message?: string;
}

const staticSims = [
  {
    path: "Data Scientist",
    title: "Master data analysis, ML models, and statistical storytelling.",
    icon: TrendingUp,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    comingSoon: false,
  },
  {
    path: "Web Developer",
    title: "Build modern, scalable web applications using React and Node.js.",
    icon: Code,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    comingSoon: false,
  },
  {
    path: "UI/UX Designer",
    title: "Create stunning user interfaces and seamless user experiences.",
    icon: Palette,
    iconColor: "text-rose-600 dark:text-rose-400",
    comingSoon: false,
  },
];

const mentors = [
  {
    name: "Vinit Singh",
    role: "Jr. Full Stack Developer",
    initials: "VS",
    href: "https://axevin-ixyhk8vv8-axe-vin.vercel.app/",
  },
  {
    name: "Krishna Singh",
    role: "Sr. Gen AI Eng",
    initials: "KS",
    href: "https://portfolio-blush-eight-sztwrl98rm.vercel.app/",
  },
  {
    name: "Aditya Mishra",
    role: "Jr. Data Scientist",
    initials: "AM",
    href: "https://portfolio-nu-one-21.vercel.app/",
  },
];

interface DashboardProps {
  onNavigate?: () => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const navigate = useNavigate();
  const [userDomains, setUserDomains] = useState<UserDomainData[]>([]);
  const [milestone, setMilestone] = useState<MilestoneData | null>(null);

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL;

    const getDashboard = async () => {
      try {
        const response = await fetch(`${baseURL}/api/dash`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setUserDomains(data);
          } else if (data?.domains) {
            setUserDomains(data.domains);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    const getMilestone = async () => {
      try {
        const response = await fetch(`${baseURL}/api/milestone`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setMilestone(data);
        }
      } catch (error) {
        console.error("Failed to fetch milestone data:", error);
      }
    };

    getDashboard();
    getMilestone();
  }, []);

  const handleStart = (path: string) => {
    localStorage.setItem("active_domain", path);
    const encodedPath = encodeURIComponent(path);
    navigate(`/dashboard/assessment/${encodedPath}`);
  };

  // 1. STREAK CALCULATION LOGIC
  const calculateStreak = (): number => {
    if (!userDomains || userDomains.length === 0) return 0;

    const datesSet = new Set<string>();
    userDomains.forEach((d) => {
      d.responses?.forEach((r) => {
        if (r.submittedAt) {
          const dateStr = new Date(r.submittedAt).toISOString().split("T")[0];
          datesSet.add(dateStr);
        }
      });
    });

    if (datesSet.size === 0) return 0;

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (!datesSet.has(todayStr) && !datesSet.has(yesterdayStr)) {
      return 0;
    }

    let streakCount = 0;
    let checkDate = datesSet.has(todayStr) ? today : yesterday;

    while (true) {
      const checkStr = checkDate.toISOString().split("T")[0];
      if (datesSet.has(checkStr)) {
        streakCount++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streakCount;
  };

  // 2. REAL WEEKLY PROGRESS DATA MAPPER (Past 7 Days)
  const getWeeklyProgressData = () => {
    const daysLabel = ["S", "M", "T", "W", "T", "F", "S"];
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - i);
      const targetDateStr = targetDate.toISOString().split("T")[0];
      const dayLetter = daysLabel[targetDate.getDay()];

      let scoreForDay = 0;

      userDomains.forEach((d) => {
        d.responses?.forEach((r) => {
          if (r.submittedAt) {
            const resDateStr = new Date(r.submittedAt).toISOString().split("T")[0];
            if (resDateStr === targetDateStr) {
              const val = r.evaluation?.skillScore?.overallScore || 0;
              if (val > scoreForDay) scoreForDay = val;
            }
          }
        });
      });

      result.push({
        day: dayLetter,
        score: scoreForDay,
        target: 75,
      });
    }

    return result;
  };

  const dynamicWeekData = getWeeklyProgressData();

  // 3. FULL AI REVIEW OVERALL SKILL SCORE LOGIC
  const getLatestSkillScore = (domains: UserDomainData[]): number => {
    if (!domains || domains.length === 0) return 0;

    for (const domain of domains) {
      // Priority 1: Full AI Assessment Review Overall Score (e.g., Score 24)
      const reviewScore =
        domain.aiReview?.overallScore ??
        domain.aiReview?.skillScore?.overallScore;

      if (typeof reviewScore === "number" && reviewScore > 0) {
        return reviewScore;
      }

      // Priority 2: Fallback to latest Daily Evaluation Response score
      if (domain.responses && domain.responses.length > 0) {
        for (let i = domain.responses.length - 1; i >= 0; i--) {
          const dailyScore = domain.responses[i]?.evaluation?.skillScore?.overallScore;
          if (typeof dailyScore === "number" && dailyScore > 0) {
            return dailyScore;
          }
        }
      }
    }

    return 0;
  };

  const overallSkillScore = getLatestSkillScore(userDomains);

  // 4. SALARY PREDICTION RANGE
  const activeDomain = userDomains[0];
  const latestResponse = activeDomain?.responses?.[activeDomain.responses.length - 1];

  const salary =
    activeDomain?.aiReview?.salaryPrediction ||
    latestResponse?.evaluation?.salaryPrediction;

  const salaryText =
    salary && salary.maxSalary > 0
      ? `₹${(salary.minSalary / 100000).toFixed(1)}L - ₹${(salary.maxSalary / 100000).toFixed(1)}L`
      : "₹0";

  // 5. WORK DONE & ACTIVE STATUS
  const activeDomainCompletedDays = activeDomain?.completedDays?.length || 0;
  const hasActiveWork =
    milestone?.hasActiveDomain ?? (Boolean(activeDomain) && activeDomainCompletedDays < 7);

  const activeDomainName = milestone?.domain || activeDomain?.domain || "";
  const currentLevelText =
    milestone?.currentLevel || `Level ${activeDomainCompletedDays + 1}`;

  const completed7DayDomains = userDomains.filter(
    (d) => d.completedDays && d.completedDays.length >= 7
  ).length;

  const currentStreak = calculateStreak();

  const stats = [
    {
      label: "Streak",
      value: `${currentStreak}d`,
      delta: currentStreak > 0 ? "Active" : "Reset",
      icon: Flame,
    },
    {
      label: "Skill Score",
      value: `${overallSkillScore}`,
      delta: overallSkillScore > 0 ? "AI Review" : "0",
      icon: Target,
    },
    {
      label: "Est. Salary",
      value: salaryText,
      delta: "LLM Eval",
      icon: IndianRupee,
    },
    {
      label: "Work Done",
      value: `${completed7DayDomains}`,
      delta: "7-Days Done",
      icon: Trophy,
    },
  ];

  return (
    <div className="grid-canvas scene-3d p-4 sm:p-8 text-foreground">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left Column */}
        <div className="flex min-w-0 flex-col gap-6">
          {/* Active Hero Banner */}
          {hasActiveWork && (
            <section className="tilt-3d glow-primary relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground shadow-xl">
              <div className="float-3d absolute -top-16 -right-10 h-56 w-56 rounded-full bg-primary-foreground/10 blur-2xl" />

              <p className="label-mono text-primary-foreground/70 uppercase tracking-wider">
                ● Active Domain: {activeDomainName}
              </p>

              <h1 className="mt-3 max-w-lg text-3xl font-bold leading-tight sm:text-4xl">
                Experience the work before the job.
              </h1>

              <p className="mt-3 max-w-md text-sm text-primary-foreground/80">
                {currentLevelText} of the {activeDomainName} path.
              </p>

              <button
                onClick={() => handleStart(activeDomainName)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                <Play className="h-4 w-4 fill-current" />
                Resume today's shift
              </button>
            </section>
          )}

          {/* Career Paths Section */}
          <section className="scene-3d">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pb-4">
              <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                Career Paths
              </h2>

              <NavLink
                to="/dashboard/simulation"
                onClick={onNavigate}
                className="label-mono text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                See all
              </NavLink>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {staticSims.map((sim) => {
                const IconComponent = sim.icon;

                const domainRecord = userDomains.find(
                  (d) => d.domain.toLowerCase() === sim.path.toLowerCase()
                );

                const daysDone = domainRecord?.completedDays?.length || 0;
                
                const score =
                  domainRecord?.aiReview?.overallScore ??
                  domainRecord?.aiReview?.skillScore?.overallScore ??
                  domainRecord?.responses?.[domainRecord.responses.length - 1]?.evaluation?.skillScore?.overallScore ??
                  null;

                return (
                  <article
                    key={sim.path}
                    className="tilt-3d relative flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg dark:border-gray-800/60 dark:bg-[#0e131f] dark:shadow-2xl dark:hover:border-gray-700"
                  >
                    <div className="absolute top-5 right-5 flex flex-col items-end gap-1">
                      {daysDone > 0 ? (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Day {daysDone} Active
                        </span>
                      ) : sim.comingSoon ? (
                        <span className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-500 uppercase dark:border-gray-700/50 dark:bg-gray-800/80 dark:text-gray-400">
                          Coming Soon
                        </span>
                      ) : null}

                      {score !== null && (
                        <span className="text-[10px] font-bold text-indigo-500">
                          Score: {score}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 shadow-inner dark:border-white/10 dark:bg-white/5">
                        <IconComponent className={`h-6 w-6 ${sim.iconColor}`} />
                      </div>

                      <h3 className="mt-5 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {sim.path}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                        {sim.title}
                      </p>
                    </div>

                    <button
                      disabled={sim.comingSoon}
                      onClick={() => handleStart(sim.path)}
                      className={`group mt-6 flex w-fit items-center gap-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                        sim.comingSoon
                          ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
                          : "text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                      }`}
                    >
                      <span>{daysDone > 0 ? "Continue Path" : "Start Simulation"}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Dynamic Stats Section */}
          <section className="scene-3d grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(({ label, value, delta, icon: Icon }) => (
              <div key={label} className="panel tilt-3d p-5">
                <div className="flex items-center justify-between">
                  <p className="label-mono text-muted-foreground">{label}</p>
                  <Icon className="h-4 w-4 text-primary" />
                </div>

                <p className="font-display mt-3 text-xl font-bold sm:text-2xl">{value}</p>

                <p className="text-success mt-1 flex items-center gap-1 text-xs font-medium">
                  <ArrowUpRight className="h-3 w-3" />
                  {delta}
                </p>
              </div>
            ))}
          </section>

          {/* Weekly Progress Section */}
          <section className="panel scene-3d p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <h2 className="truncate text-base font-semibold">Weekly Progress</h2>

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
              {dynamicWeekData.map((item, index) => (
                <div key={index} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full items-end justify-center gap-1">
                    {/* Real Score Bar */}
                    <div
                      className="bar-3d w-1/2 rounded-t-md bg-primary transition-all duration-500"
                      style={{
                        height: `${Math.min(item.score * 1.5, 160)}px`,
                        animationDelay: `${index * 90}ms`,
                      }}
                      title={`Score: ${item.score}`}
                    />

                    {/* Target Bar */}
                    <div
                      className="bar-3d w-1/3 rounded-t-md bg-muted-foreground/25 transition-all duration-500"
                      style={{
                        height: `${Math.min(item.target * 1.5, 160)}px`,
                        animationDelay: `${index * 90 + 45}ms`,
                      }}
                      title={`Target: ${item.target}`}
                    />
                  </div>

                  <span className="label-mono text-muted-foreground">{item.day}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side Column */}
        <div className="flex flex-col gap-6">
          {/* Mentors Section */}
          <section className="panel p-6">
            <h2 className="text-base font-semibold">Your Mentors</h2>

            <ul className="mt-4 flex flex-col gap-4">
              {mentors.map((mentor) => (
                <li key={mentor.name} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-semibold">
                    {mentor.initials}
                  </span>

                  <span className="flex-1">
                    <span className="block text-sm font-medium">{mentor.name}</span>
                    <span className="block text-xs text-muted-foreground">{mentor.role}</span>
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

          {/* Dynamic Milestone Section */}
          <section className="panel p-6">
            <p className="label-mono text-muted-foreground">Next milestone</p>

            {milestone?.hasActiveDomain ? (
              <>
                <p className="font-display mt-2 text-xl font-bold">
                  {milestone.currentLevel} · {milestone.domain}
                </p>

                <div className="mt-4 h-1.5 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{
                      width: `${milestone.progressPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  {milestone.remainingDays}{" "}
                  {milestone.remainingDays === 1 ? "day" : "days"} remaining to complete 7-day milestone.
                </p>
              </>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                {milestone?.message || "No active domain found. Start a domain assessment to track your progress!"}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;