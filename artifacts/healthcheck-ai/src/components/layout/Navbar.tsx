import { Link, useLocation } from "wouter";
import { Activity, Stethoscope, LineChart, Lightbulb, Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const navLinks = [
    { href: "/assessment", label: "Assessment", icon: Stethoscope },
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    { href: "/vitals", label: "Vitals", icon: LineChart },
    { href: "/tips", label: "Health Tips", icon: Lightbulb },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              HealthCheck<span className="text-primary">.ai</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-border flex items-center gap-4">
              <button 
                onClick={toggleDark}
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link href="/assessment">
                <Button className="rounded-full shadow-primary/30">Get Started</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleDark}
              className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3",
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-border">
              <Link href="/assessment" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">Start Assessment</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
