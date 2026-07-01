import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Mail, Lock, User as UserIcon, ArrowRight, Stethoscope, Shield, User, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/AuthContext";

type Role = "patient" | "doctor" | "admin";
const roles: { id: Role; label: string; icon: any; route: string }[] = [
  { id: "patient", label: "Patient", icon: User, route: "/patient" },
 
];

export default function Signup() {
  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const nav = useNavigate();
  const { signup, isLoading, error, clearError, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      nav(`/${user.role}`, { replace: true });
    }
  }, [user, nav]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    try {
      await signup({ name, email, password, role, specialization });
      const route = roles.find((r) => r.id === role)!.route;
      nav(route);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-soft py-10">
      <div className="absolute inset-0 bg-mesh opacity-70" />
      <div className="container relative mx-auto max-w-xl px-4">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-hero text-white">
            <Activity className="h-4 w-4" />
          </div>
          <span className="font-display text-xl font-bold">Shiv Shakti+</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 rounded-3xl border bg-background/90 p-8 shadow-soft backdrop-blur"
        >
          <h1 className="font-display text-3xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join MediCare+ and bring care a little closer.
          </p>

          <div className="mt-6 grid  gap-2">
            {roles.map((r) => {
              const active = r.id === role;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`group rounded-2xl border p-4 text-left transition ${
                    active ? "border-primary bg-primary/5 shadow-soft" : "hover:bg-secondary"
                  }`}
                >
                  <div className={`mb-2 inline-grid h-9 w-9 place-items-center justify-center rounded-xl ${active ? "bg-hero text-white" : "bg-secondary"}`}>
                    <r.icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-semibold">{r.label}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {r.id === "patient" && "Book & consult"}
                  
                  </div>
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
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <Label>Full name</Label>
              <div className="relative mt-1.5">
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input required placeholder="Jane Doe" className="pl-9" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Email</Label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" required placeholder="jane@medicare.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="password" required placeholder="••••••••" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Confirm password</Label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="password" required placeholder="••••••••" className="pl-9" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            {role === "doctor" && (
              <div className="md:col-span-2">
                <Label>Specialization</Label>
                <Input placeholder="e.g. Cardiology, Pediatrics" className="mt-1.5" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
              </div>
            )}
            <div className="md:col-span-2">
              <Button type="submit" className="w-full bg-hero text-white shadow-soft hover:opacity-95" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already with us?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
