import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home", isAnchor: false },
  { to: "#features", label: "Features", isAnchor: true },
  { to: "#how", label: "How it works", isAnchor: true },
  { to: "#location", label: "Location", isAnchor: true }, // <-- Fixed Anchor link
  { to: "/patient/assistant", label: "AI Assistant", isAnchor: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Helper function to handle dynamic linking (Anchor vs Route)
  const renderLinkContents = (l: typeof links[0]) => {
    const isActive = pathname === l.to || (l.isAnchor && pathname === "/" && window.location.hash === l.to);
    const baseClass = `relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-foreground/80"
    }`;

    if (l.isAnchor) {
      // Agar user home page par nahi hai, toh pehle "/" par bhejega phir hash kaam karega
      const finalHref = pathname === "/" ? l.to : `/${l.to}`;
      return (
        <a key={l.label} href={finalHref} className={baseClass}>
          {l.label}
        </a>
      );
    }

    return (
      <Link key={l.to} to={l.to} className={baseClass}>
        {l.label}
        {pathname === l.to && (
          <motion.span
            layoutId="nav-pill"
            className="absolute inset-0 -z-10 rounded-full bg-primary/10"
          />
        )}
      </Link>
    );
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.06 }}
            className="grid h-10 w-10 place-items-center rounded-xl bg-hero text-white shadow-soft"
          >
            <Activity className="h-5 w-5" />
          </motion.div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">
              Shiv Shakti<span className="text-primary">+</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Medical Healthcare
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => renderLinkContents(l))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="bg-hero text-white shadow-soft hover:opacity-95">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>

        <button
          aria-label="menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur"
        >
          <div className="container flex flex-col gap-2 px-4 py-4">
            {links.map((l) => {
              if (l.isAnchor) {
                const finalHref = pathname === "/" ? l.to : `/${l.to}`;
                return (
                  <a key={l.label} href={finalHref} onClick={() => setOpen(false)} className="py-2 text-sm block text-foreground/80 hover:text-primary">
                    {l.label}
                  </a>
                );
              }
              return (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 text-sm block text-foreground/80 hover:text-primary">
                  {l.label}
                </Link>
              );
            })}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="flex-1 bg-hero text-white">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
