import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Lock, Mail, ArrowRight, Stethoscope, User, Shield, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/AuthContext";

type Role = "patient" | "doctor" | "admin";
const roles: { id: Role; label: string; icon: any; route: string }[] = [
  { id: "patient", label: "Patient", icon: User, route: "/patient" },
  { id: "doctor", label: "Doctor", icon: Stethoscope, route: "/doctor" },
  { id: "admin", label: "Admin", icon: Shield, route: "/admin" },
];

export default function Login() {
  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const { login, isLoading, error, clearError, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      nav(`/${user.role}`, { replace: true });
    }
  }, [user, nav]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password, role);
      const route = roles.find((r) => r.id === role)!.route;
      nav(route);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-soft">
      <div className="absolute inset-0 bg-mesh opacity-70" />
      <div className="container relative mx-auto grid min-h-screen items-center gap-10 px-4 py-10 md:grid-cols-2">
        {/* Left brand */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-hero text-white shadow-soft">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-bold">Shiv Shakti+</span>
          </Link>
          <h1 className="mt-10 font-display text-5xl font-extrabold leading-[1.05] tracking-tight">
            Welcome back to <span className="text-gradient">calmer care</span>.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Pick up where you left off — your appointments, prescriptions and AI
            assistant are right here.
          </p>

          <div className="mt-10 grid max-w-sm gap-3">
            {[
              "End-to-end encrypted records",
              "AI triage in plain language",
              "Reach a doctor in under 3 min",
            ].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 rounded-2xl border bg-background/70 p-3 backdrop-blur"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  ✓
                </div>
                <span className="text-sm">{t}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md rounded-3xl border bg-background/90 p-8 shadow-soft backdrop-blur"
        >
          <div className="mb-6 md:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-hero text-white">
                <Activity className="h-4 w-4" />
              </div>
              <span className="font-display text-xl font-bold">MediCare+</span>
            </Link>
          </div>

          <h2 className="font-display text-2xl font-bold">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose your role and enter your credentials.
          </p>

          {/* Role tabs */}
          <div className="mt-6 grid grid-cols-3 rounded-2xl bg-secondary p-1">
            {roles.map((r) => {
              const active = r.id === role;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className="relative px-3 py-2 text-sm font-medium"
                >
                  {active && (
                    <motion.span
                      layoutId="role-pill"
                      className="absolute inset-0 rounded-xl bg-background shadow"
                    />
                  )}
                  <span className={`relative flex items-center justify-center gap-1.5 ${active ? "text-primary" : "text-muted-foreground"}`}>
                    <r.icon className="h-4 w-4" /> {r.label}
                  </span>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div>
              <Label>Email</Label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="you@medicare.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mt-1.5 text-right text-xs">
                <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-hero text-white shadow-soft hover:opacity-95"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Continue"} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">Create an account</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
