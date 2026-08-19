import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Route as RouteIcon,
  ListChecks,
  Users,
  Settings,
  LogOut,
  Zap,
  X,
  History,
  Sparkles,
  User,
  Diamond,
  Sun,
  HelpCircle,
  MessageSquarePlus,
} from "lucide-react";
import { ThemeToggle } from "@/hooks/use-theme";
import { useEffect, useRef, useState } from "react";
import { getAuth, signOut } from "firebase/auth";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Simulations", icon: Zap, path: "/dashboard/simulation" },
  { label: "Skill Assessment", icon: ListChecks, path: "/dashboard/assessment" },
  { label: "Path", icon: RouteIcon, path: "/dashboard/path" },
  { label: "Inbox", icon: Inbox, path: "/dashboard/path" },
  { label: "Network", icon: Users, path: "/dashboard/path" },
];

const cohort = [
  { name: "Aarav Mehta", role: "PM Path", initials: "AM" },
  { name: "Sara Lin", role: "Data Path", initials: "SL" },
  { name: "Noah Ade", role: "Design Path", initials: "NA" },
];

interface SidebarContentProps {
  onNavigate?: () => void;
}

const SidebarContent = ({ onNavigate }: SidebarContentProps) => {
  const navigate = useNavigate();

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
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        localStorage.removeItem("active_domain");
        if (onNavigate) onNavigate();
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <NavLink
        to="/dashboard"
        className="mb-8 flex items-center gap-2 px-2"
        onClick={onNavigate}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
          0
        </span>

        <span className="font-display text-lg font-bold tracking-tight">
          DAY 0
        </span>
      </NavLink>

      <p className="label-mono px-2 pb-2 text-muted-foreground">
        Workspace
      </p>

      <nav className="flex flex-col gap-1">
        {nav.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            onClick={onNavigate}
            end={path === "/dashboard"}
            className={({ isActive }) =>
              `tilt-3d flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <p className="label-mono px-2 pb-3 pt-8 text-muted-foreground">
        Cohort
      </p>

      <ul className="flex flex-col gap-3 px-2">
        {cohort.map((person) => (
          <li
            key={person.name}
            className="flex min-w-0 items-center gap-3"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
              {person.initials}
            </span>

            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">
                {person.name}
              </span>

              <span className="label-mono block text-muted-foreground">
                {person.role}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-1 pt-8">
        <div className="relative" ref={menuRef}>
          {/* FLOATING CARD */}
          {isOpen && (
            <div className="absolute bottom-12 left-0 right-0 z-50 rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
              <div className="flex flex-col gap-0.5">
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span>Activity</span>
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span>Personal Intelligence</span>
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Avatar</span>
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                  <Diamond className="h-4 w-4 text-muted-foreground" />
                  <span>Gems</span>
                </button>

                <div className="my-1 h-[1px] bg-border" />

                {/* THEME TOGGLE OPTION */}
                <div className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                  <div className="flex items-center gap-3">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <span>Theme</span>
                  </div>
                  <ThemeToggle />
                </div>

                <div className="my-1 h-[1px] bg-border" />

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Help</span>
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                  <MessageSquarePlus className="h-4 w-4 text-muted-foreground" />
                  <span>Send feedback</span>
                </button>
              </div>
            </div>
          )}

          {/* SETTINGS BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isOpen
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>

        <button
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );
};

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ open = false, onClose }: SidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-x-hidden overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex self-start">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          open ? "" : "pointer-events-none"
        }`}
        inert={!open}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-x-hidden overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 py-6 shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="absolute right-4 top-5 grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <SidebarContent onNavigate={onClose} />
        </aside>
      </div>
    </>
  );
};

export default Sidebar;