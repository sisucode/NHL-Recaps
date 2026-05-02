import { motion } from "motion/react";
import { Activity, LayoutDashboard, Trophy, Newspaper } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const navItems = [
  { path: "/", label: "Matcher", icon: LayoutDashboard },
  { path: "/stats", label: "Stats", icon: Trophy },
  { path: "/nyheter", label: "Nyheter", icon: Newspaper },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-subtle bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black italic tracking-tighter text-white">
            NHL<span className="text-neon-orange">PULSE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "nav-link ml-8",
                  isActive && "nav-link-active"
                )}
              >
                {item.label.toUpperCase()}
              </Link>
            );
          })}
        </div>

        {/* Mobile Nav (Bottom/Compact) */}
        <div className="flex items-center gap-4 md:hidden">
           {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase transition-colors",
                  isActive ? "text-neon-orange" : "text-text-secondary"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
