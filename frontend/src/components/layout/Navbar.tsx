import { useAuth } from "@/context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { 
  Menu, 
  Search, 
  X, 
  LogOut, 
  Settings, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  MapPin, 
  HelpCircle,
  Bell
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onNavigate?: () => void;
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick, onNavigate }: NavbarProps) => {
  // Context se global user data aur setter consume kar rahe hain
  const { user, setUser } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSimulationsExpanded, setIsSimulationsExpanded] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Dummy notifications list (Replace with dynamic notifications from API/Context as needed)
  const notifications = [
    { id: 1, title: "Welcome 2 Day 0", msg:"Continue Doing Work", read: false },
    // { id: 2, title: "New Task Assigned", time: "1h ago", read: false },
    // { id: 3, title: "Welcome to JobSim!", time: "1d ago", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Outside click handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userName = user?.name || user?.user_name || "User";
  const isGithubUser = user?.provider === "github" || Boolean(user?.githubUsername);
  const userIdentity = isGithubUser
    ? `@${user?.githubUsername || "User-github"}`
    : (user?.email || "user@gmail.com");

  const userLocation = user?.location || "India, Global";
  const userAvatar = user?.avatarUrl;
  const initials = getInitials(userName);

  // Mongoose Array se COMPLETED domains filter karna
  const completedDomains = user?.domainsAttempted?.filter(
    (domain) => domain.status === "COMPLETED"
  ) || [];

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      const baseURL = import.meta.env.VITE_API_URL;
      
      const res = await fetch(`${baseURL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null); // Context State Clear
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("jobsim_user");
        localStorage.removeItem("active_domain");
        if (onNavigate) onNavigate();
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:flex sm:justify-between sm:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:w-96">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-100 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="relative min-w-0 flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-400" />
          <input
            type="search"
            placeholder="Search simulations, tasks, mentors…"
            className="w-full rounded-xl border border-border bg-secondary py-2.5 pr-3 pl-9 text-sm outline-hidden placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div ref={navRef} className="relative flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Notification Bell Button */}
        <button
          onClick={() => {
            setIsNotificationOpen(!isNotificationOpen);
            setIsProfileOpen(false);
          }}
          aria-label="Notifications"
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-background dark:ring-slate-950" />
          )}
        </button>

        {/* Notifications Dropdown Modal */}
        {isNotificationOpen && (
          <div className="absolute top-12 right-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:w-96">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <div key={item.id} className="py-2.5 px-1 flex items-start justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg transition-colors cursor-pointer">
                    <div>
                      <p className={`text-xs ${item.read ? "text-slate-600 dark:text-slate-400" : "font-semibold text-slate-900 dark:text-slate-100"}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400">{item.msg}</span>
                    </div>
                    {!item.read && <span className="h-2 w-2 rounded-full bg-indigo-600 mt-1 shrink-0" />}
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-slate-400">No new notifications</p>
              )}
            </div>
          </div>
        )}

        {/* Profile Trigger Button */}
        <button
          onClick={() => {
            setIsProfileOpen(!isProfileOpen);
            setIsNotificationOpen(false);
          }}
          className="text-left"
        >
          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-secondary py-1.5 pr-2.5 pl-1.5 transition-colors hover:bg-secondary/80 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="h-7 w-7 shrink-0 rounded-lg object-cover" />
            ) : (
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-indigo-600 text-xs font-semibold text-white">
                {initials}
              </span>
            )}
            <span className="hidden truncate text-sm font-medium sm:block dark:text-slate-200">
              {userName}
            </span>
          </div>
        </button>

        {/* Dynamic User Profile Modal Card */}
        {isProfileOpen && (
          <div className="absolute top-12 right-0 z-50 w-80 sm:w-96 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                User Profile
              </h2>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-6 flex flex-col items-center text-center">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="h-24 w-24 rounded-full object-cover shadow-lg" />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-full bg-indigo-600 text-3xl font-extrabold text-white shadow-indigo-200 shadow-xl dark:shadow-none">
                  {initials}
                </div>
              )}
              <h3 className="mt-4 text-xl font-black uppercase tracking-wide text-slate-900 dark:text-slate-100">
                {userName}
              </h3>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                {userIdentity}
              </p>
            </div>

            <div className="space-y-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-xs dark:bg-slate-800">
                  {isGithubUser ? (
                    <svg className="h-5 w-5 fill-indigo-600 dark:fill-indigo-400" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  ) : (
                    <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isGithubUser ? "GITHUB USERNAME" : "EMAIL ADDRESS"}
                  </p>
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-200">
                    {userIdentity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-xs dark:bg-slate-800">
                  <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">LOCATION</p>
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-200">
                    {userLocation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="col-span-2 rounded-2xl bg-emerald-50/60 p-3 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/30">
                <button
                  onClick={() => setIsSimulationsExpanded(!isSimulationsExpanded)}
                  className="flex w-full items-center justify-between text-left text-xs font-bold text-emerald-800 dark:text-emerald-300"
                >
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>COMPLETED SIMULATIONS ({completedDomains.length})</span>
                  </div>
                  {isSimulationsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isSimulationsExpanded && (
                  <div className="mt-2 space-y-1 border-t border-emerald-200/40 pl-6 pt-2 dark:border-emerald-900/40">
                    {completedDomains.length > 0 ? (
                      completedDomains.map((domain, index) => (
                        <p 
                          key={index}
                          className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                          onClick={() => { setIsProfileOpen(false); navigate("/simulations"); }}
                        >
                          • {domain.domainName}
                        </p>
                      ))
                    ) : (
                      <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 italic">
                        No simulations completed yet
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => { setIsProfileOpen(false); navigate("/settings"); }}
                className="flex flex-col items-center justify-center rounded-2xl bg-indigo-50/60 p-3 text-center transition-colors hover:bg-indigo-100/60 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white dark:bg-slate-800">
                  <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="mt-2 text-xs font-extrabold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                  SETTINGS
                </span>
              </button>

              <button
                onClick={() => { setIsProfileOpen(false); navigate("/help"); }}
                className="flex flex-col items-center justify-center rounded-2xl bg-indigo-50/60 p-3 text-center transition-colors hover:bg-indigo-100/60 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white dark:bg-slate-800">
                  <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="mt-2 text-xs font-extrabold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                  HELP HUB
                </span>
              </button>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
              >
                <LogOut className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                Sign Out
              </button>
            </div>

          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;