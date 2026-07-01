import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity, Calendar, Siren, Bot, Stethoscope, ShieldCheck, ArrowRight,
  HeartPulse, Sparkles, Clock, FileText, Users, Star, MapPin, Phone, Mail
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" } }),
};

const features = [
  { icon: Calendar, title: "Smart Appointments", desc: "Book, reschedule and approve consultations in seconds with automated reminders.", color: "from-cyan-500 to-teal-500" },
  { icon: Siren, title: "Emergency Home Visits", desc: "One-tap emergency requests routed to the nearest available doctor in real time.", color: "from-rose-500 to-red-500" },
  { icon: Bot, title: "AI Health Assistant", desc: "Describe symptoms in plain language and get triage, specialist suggestions and a pre-consult summary.", color: "from-indigo-500 to-blue-500" },
  { icon: FileText, title: "Digital Prescriptions", desc: "Doctors create structured prescriptions patients can access from anywhere, anytime.", color: "from-emerald-500 to-green-500" },
  { icon: Stethoscope, title: "Doctor Workspace", desc: "A focused daily schedule, patient context and quick actions to keep clinics flowing.", color: "from-amber-500 to-orange-500" },
  { icon: ShieldCheck, title: "Admin Analytics", desc: "Manage doctors, patients and clinic operations with rich reports and live dashboards.", color: "from-violet-500 to-fuchsia-500" },
];

const steps = [
  { n: "01", title: "Create your profile", desc: "Sign up as a patient, doctor or admin and complete your secure profile in under a minute." },
  { n: "02", title: "Book or get booked", desc: "Patients book appointments or trigger emergencies. Doctors review and confirm instantly." },
  { n: "03", title: "Consult & prescribe", desc: "Run consultations, share digital prescriptions and keep every record in one place." },
];

const stats = [
  { k: "120k+", v: "Consultations" },
  { k: "4.9/5", v: "Patient rating" },
  { k: "<3 min", v: "Avg. response" },
  { k: "98%", v: "Satisfaction" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <div className="container relative mx-auto grid items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-xs font-medium backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-assisted clinic operations
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl"
            >
              Care that arrives <span className="text-gradient">faster</span>,
              clinics that <span className="text-gradient">run smoother</span>.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-5 max-w-xl text-lg text-muted-foreground"
            >
              Shiv Shakti Medical Healthcare connects patients, doctors and administrators in one calm
              platform — appointments, emergency home visits, prescriptions and an
              AI Health Assistant that listens before you wait.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="bg-hero text-white shadow-soft hover:opacity-95">
                <Link to="/signup">
                  Get started free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/patient/assistant">Try AI Assistant</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-10 grid grid-cols-4 gap-4"
            >
              {stats.map((s) => (
                <div key={s.v}>
                  <div className="font-display text-2xl font-bold text-foreground">{s.k}</div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[5/6] w-full max-w-md rounded-[2rem] bg-hero p-1 shadow-glow">
              <div className="relative h-full w-full overflow-hidden rounded-[1.85rem] bg-background/95 p-6">
                {/* doctor card */}
                <div className="flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-soft">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-hero text-white">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Dr. Ramdhan Parjapat</div>
                    <div className="text-xs text-muted-foreground">Medical Specialist</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[11px] font-semibold text-success">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live
                  </div>
                </div>

                {/* appointment */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="mt-5 rounded-2xl border bg-card p-4 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Next appointment</div>
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="mt-2 font-display text-lg font-bold">Today · 4:30 PM</div>
                  <div className="text-xs text-muted-foreground">Video consult with Dr. Ramdhan</div>
                  <div className="mt-3 flex gap-2">
                    <div className="rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">General Medicine</div>
                    <div className="rounded-lg bg-accent/10 px-2 py-1 text-[11px] font-medium text-accent">Follow-up</div>
                  </div>
                </motion.div>

                {/* AI bubble */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="mt-4 flex gap-2 rounded-2xl border bg-card p-3 shadow-soft"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-accent">AI Assistant</div>
                    <div className="text-xs text-foreground/80">
                      "Based on your symptoms, a General Practitioner visit is recommended. Shall I book one?"
                    </div>
                  </div>
                </motion.div>

                {/* emergency */}
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="mt-4 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 p-4 text-white shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-widest opacity-80">Emergency</div>
                    <Siren className="h-4 w-4" />
                  </div>
                  <div className="mt-1 font-display text-base font-bold">Home visit en-route</div>
                  <div className="text-[11px] opacity-90">Dr. Parveen · arriving in 7 min</div>
                </motion.div>
              </div>
            </div>

            {/* floating pills */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -left-4 top-10 hidden items-center gap-2 rounded-full border bg-background/90 px-3 py-2 shadow-soft backdrop-blur md:flex"
            >
              <HeartPulse className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">BP normal · 118/76</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute -right-4 bottom-16 hidden items-center gap-2 rounded-full border bg-background/90 px-3 py-2 shadow-soft backdrop-blur md:flex"
            >
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium">Avg wait · 2 min</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">Features</div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Everything a modern clinic needs
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for patients who want clarity, doctors who want focus and admins who want control.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-soft transition"
            >
              <div className={`mb-5 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-soft`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/5 transition group-hover:scale-150" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-soft py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</div>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
              From symptom to specialist in 3 steps
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative rounded-3xl border bg-card p-7 shadow-soft"
              >
                <div className="font-display text-5xl font-extrabold text-gradient">{s.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { role: "patient", title: "Patients", desc: "Manage your appointments, talk to the AI assistant and access prescriptions.", to: "/patient", icon: Users },
            { role: "doctor", title: "Doctors", desc: "See your daily schedule, accept requests and write digital prescriptions.", to: "/doctor", icon: Stethoscope },
            { role: "admin", title: "Admins", desc: "Monitor the entire clinic — doctors, patients, appointments and analytics.", to: "/admin", icon: ShieldCheck },
          ].map((r, i) => (
            <motion.div
              key={r.role}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border bg-card p-7 shadow-soft"
            >
              <div className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-hero text-white">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              <Link to={r.to} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Open portal <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-soft py-20">
        <div className="container mx-auto grid items-center gap-10 px-4 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Loved by clinics</div>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
              "Shiv Shakti made our front-desk feel invisible — in the best way."
            </h2>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-hero text-white font-bold">RP</div>
              <div>
                <div className="font-semibold">Dr. Ramdhan Parjapat</div>
                <div className="text-xs text-muted-foreground">Director · Shiv Shakti Medical Healthcare</div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border bg-card p-7 shadow-soft">
            <div className="flex gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-500" />)}
            </div>
            <p className="mt-4 text-muted-foreground">
              "Our no-show rate dropped 38% after we moved to Shiv Shakti platform. The AI triage is
              surprisingly thoughtful — it sends us context that actually matters before the
              consultation begins."
            </p>
            <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Activity className="h-4 w-4 text-primary" /> 6 months · 2 clinics</div>
              <div className="font-semibold text-primary">+38% retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
   {/* MAP SECTION */}
{/* MAP SECTION */}
<section id="location" className="container mx-auto px-4 py-20">
  <div className="grid gap-10 md:grid-cols-3 items-center">
    <div className="md:col-span-1">
      <div className="text-xs font-semibold uppercase tracking-widest text-primary">Visit Us</div>
      <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">
        Our Location
      </h2>
      <p className="mt-3 text-muted-foreground">
        Find us easily on the map or reach out directly for walk-in consultations and emergency support.
      </p>

      <div className="mt-8 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-sm">Clinic Address</div>
            <div className="text-sm text-muted-foreground mt-0.5">Shiv Shakti Medical Healthcare, Alipur road, Kond, Gharaunda, Karnal, Haryana, India</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-sm">Contact Number</div>
            <div className="text-sm text-muted-foreground mt-0.5">+91 8053200767</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-sm">Email Address</div>
            <div className="text-sm text-muted-foreground mt-0.5">contact@shivshaktihealthcare.com</div>
          </div>
        </div>
      </div>

      {/* FIXED MOBILE DEEP LINK BUTTON */}
      <div className="mt-6">
        <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Shiv+Shakti+Medical+Healthcare+Alipur+road+Kond+Gharaunda"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin className="h-4 w-4" /> Open in Google Maps
          </a>
        </Button>
      </div>
    </div>

    {/* Map Container */}
    <div className="md:col-span-2 w-full h-[350px] md:h-[400px] rounded-3xl overflow-hidden border bg-muted shadow-soft relative group">
      {/* Real Google Maps Iframe Generator for Gharaunda Location */}
      <iframe
        src="https://maps.google.com/maps?q=Alipur%20road,%20Kond,%20Gharaunda,%20Karnal,%20Haryana&t=&z=15&ie=UTF8&iwloc=&output=embed"
        className="w-full h-full border-0 contrast-[1.05] opacity-90 group-hover:opacity-100 transition-all duration-500"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Clinic Location Map"
      />
    </div>
  </div>
</section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[2rem] bg-hero p-10 text-white shadow-glow md:p-16"
        >
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
                Bring your clinic into the calm.
              </h2>
              <p className="mt-3 max-w-md text-white/85">
                Sign up free for 30 days. No card, no setup fees, no surprises.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/signup">Start free trial</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Link to="/login">I have an account</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
