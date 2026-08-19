import { Bell, Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarProps {
  onMenuClick?: () => void;
}

interface UserProfile {
  name?: string;
  email?: string;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Get user saved after login
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";

    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  const userName = user?.name || "User";
  const initials = getInitials(userName);

  return (
    <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur sm:flex sm:justify-between sm:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:w-96">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="relative min-w-0 flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            placeholder="Search simulations, tasks, mentors…"
            className="w-full rounded-xl border border-border bg-secondary py-2.5 pr-3 pl-9 text-sm outline-hidden placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />

          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-secondary py-1.5 pr-3 pl-1.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </span>

          <span className="hidden truncate text-sm font-medium sm:block">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;