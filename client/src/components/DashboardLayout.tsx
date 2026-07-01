import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, LayoutDashboard, Calendar, Siren, Bot, Users, Stethoscope, FileText,
  Settings, LogOut, Bell, Search, Globe, Menu, X,
} from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import { useLanguage } from "@/store/LanguageContext";

type Role = "patient" | "doctor" | "admin";

const navs: Record<Role, { to: string; labelKey: string; icon: any }[]> = {
  patient: [
    { to: "/patient", labelKey: "dashboard", icon: LayoutDashboard },
    { to: "/patient/appointments", labelKey: "appointments", icon: Calendar },
    { to: "/patient/prescriptions", labelKey: "prescriptions", icon: FileText },
    { to: "/patient/emergency", labelKey: "emergency", icon: Siren },
    { to: "/patient/assistant", labelKey: "aiAssistant", icon: Bot },
  ],
  doctor: [
    { to: "/doctor", labelKey: "dashboard", icon: LayoutDashboard },
    { to: "/doctor/appointments", labelKey: "appointments", icon: Calendar },
    { to: "/doctor/prescriptions", labelKey: "prescriptions", icon: FileText },
    { to: "/doctor/emergency", labelKey: "emergency", icon: Siren },
  ],
  admin: [
    { to: "/admin", labelKey: "overview", icon: LayoutDashboard },
    { to: "/admin", labelKey: "doctors", icon: Stethoscope },
    { to: "/admin", labelKey: "patients", icon: Users },
  ],
};

const roleNames: Record<Role, string> = {
  patient: "Patient Portal",
  doctor: "Doctor Portal",
  admin: "Admin Console",
};

export default function DashboardLayout({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const items = navs[role];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role validation
  useEffect(() => {
    if (!isLoading && user && user.role !== role) {
      nav(`/${user.role}`);
    }
  }, [user, role, nav, isLoading]);

  const handleLogout = async () => {
    await logout();
    nav("/login");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hero"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-soft flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-4">{language === "hi" ? "कृपया पहले लॉगिन करें" : "Please login first"}</div>
          <Link to="/login" className="text-primary hover:underline">{language === "hi" ? "लॉगिन पर जाएं" : "Go to login"}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              className="fixed left-0 top-0 h-full w-72 bg-background/95 backdrop-blur-xl border-r border-border/60 z-50 md:hidden shadow-2xl"
            >
              {SidebarContent({
                items, role, t, language, user, logout: handleLogout, toggleLanguage,
                closeSidebar: () => setSidebarOpen(false)
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-border/60 bg-background/80 backdrop-blur md:flex">
          {SidebarContent({
            items, role, t, language, user, logout: handleLogout, toggleLanguage
          })}
        </aside>

        {/* Main */}
        <div className="flex-1 min-h-screen">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
              {/* Mobile Toggle Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-secondary transition md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder={language === "hi" ? "खोजें..." : "Search patients, doctors, prescriptions…"}
                  className="w-80 rounded-full border bg-secondary/50 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full hover:bg-secondary transition hidden md:flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">{language === "en" ? "EN" : "HI"}</span>
              </button>

              <button className="relative grid h-10 w-10 place-items-center rounded-full border hover:bg-secondary">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              </button>

              <div className="flex items-center gap-3 rounded-full border bg-background py-1.5 pl-1.5 pr-4">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-hero text-xs font-bold text-white">
                  {user.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div className="hidden text-left leading-tight md:block">
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground">{roleNames[role]}</div>
                </div>
              </div>
            </div>
          </header>

          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 md:p-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  items, role, t, language, user, logout, toggleLanguage, closeSidebar
}: any) {
  const { pathname } = useLocation();

  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-hero text-white">
            <Activity className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold">Shiv Shakti</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {roleNames[role]}
            </div>
          </div>
        </div>
        {closeSidebar && (
          <button onClick={closeSidebar} className="p-1.5 rounded-lg hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        )}
        {!closeSidebar && (
          <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-secondary transition">
            <Globe className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {items.map((item: any, i: number) => {
          const active = pathname === item.to;
          return (
            <Link
              key={i}
              to={item.to}
              onClick={() => closeSidebar?.()}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-hero text-white shadow-soft"
                  : item.labelKey === "aiAssistant"
                    ? "bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 text-primary font-semibold"
                    : "text-foreground/75 hover:bg-secondary"
              }`}
            >
              <item.icon className={`h-4 w-4 ${item.labelKey === "aiAssistant" && !active ? "text-indigo-500" : ""}`} />
              {t(item.labelKey)}
              {item.labelKey === "aiAssistant" && !active && (
                <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-3">
        <Link
          to="/"
          onClick={() => closeSidebar?.()}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
        >
          <Settings className="h-4 w-4" /> {t("settings")}
        </Link>
        <button
          onClick={() => {
            logout();
            closeSidebar?.();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" /> {t("logout")}
        </button>
      </div>
    </>
  );
}
