import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Calendar, Siren, Bot, FileText, HeartPulse, TrendingUp, Plus, X,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAppointments } from "@/hooks/use-appointments";
import BookAppointment from "@/components/BookAppointment";
import { useLanguage } from "@/store/LanguageContext";
import apiClient from "@/apiConfig/apiClient";

interface Prescription {
  _id: string;
  patient?: { _id: string; name: string; email: string };
  doctor?: { _id: string; name: string; specialization?: string };
  medicines: string[];
  notes?: string;
  createdAt: string;
}

export default function PatientDashboard() {
  const { appointments, isLoading: isAppointmentsLoading, updateAppointmentStatus } = useAppointments("patient");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPrescriptionLoading, setIsPrescriptionLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status !== "completed" && apt.status !== "cancelled"
  );

  const fetchPrescriptions = async () => {
    try {
      const endpoint = "/prescriptions";
      const res = await apiClient.get(endpoint);
      if (res.data.success) {
        setPrescriptions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPrescriptionLoading(false);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      setUpdatingId(id);
      await updateAppointmentStatus(id, 'cancelled');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <DashboardLayout role="patient">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-hero to-hero/80 p-6 text-white bg-hero shadow-glow sm:p-8"
      >
        <div className="relative z-10">
          <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
            {language === "hi" ? "नमस्ते" : "Good afternoon"}
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            {language === "hi" ? "आज आप कैसा महसूस कर रहे हैं?" : "How are you feeling today?"}
          </h1>
          <p className="mt-2 max-w-xl text-white/85 text-sm sm:text-base">
            {upcomingAppointments.length > 0 
              ? (language === "hi" ? `आपका ${upcomingAppointments.length} अपॉइंटमेंट कन्फर्म हुआ है।` : `You have ${upcomingAppointments.length} confirmed appointment coming up.`)
              : (language === "hi" ? "कोई अपॉइंटमेंट नहीं। अभी बुक करें!" : "No upcoming confirmed appointments. Book one now!")
            }
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-soft hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" /> {language === "hi" ? "अपॉइंटमेंट बुक करें" : "Book Appointment"}
            </button>
            <Link to="/patient/assistant" className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
              <Bot className="h-4 w-4" /> {language === "hi" ? "AI से बात करें" : "Talk to AI Assistant"}
            </Link>
            <Link to="/patient/emergency" className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
              <Siren className="h-4 w-4" /> {language === "hi" ? "आपातकालीन" : "Emergency"}
            </Link>
          </div>
        </div>
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
      </motion.div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Calendar, label: language === "hi" ? "आगामी" : "Upcoming", value: upcomingAppointments.length.toString(), sub: language === "hi" ? "इस हफ्ते" : "this week", color: "from-cyan-500 to-teal-500" },
          { icon: FileText, label: t("prescriptions"), value: prescriptions.length.toString(), sub: language === "hi" ? "सक्रिय" : "active", color: "from-emerald-500 to-green-500" },
          { icon: TrendingUp, label: language === "hi" ? "स्वास्थ्य स्कोर" : "Health score", value: "82", sub: "+4 vs last mo", color: "from-indigo-500 to-blue-500" },
          { icon: HeartPulse, label: language === "hi" ? "औसत प्रतीक्षा" : "Avg wait", value: "2m 40s", sub: language === "hi" ? "इस महीने" : "this month", color: "from-amber-500 to-orange-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border bg-card p-5 shadow-soft"
          >
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-soft`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="font-display text-2xl font-bold">{stat.value}</div>
            <div className="text-[11px] text-muted-foreground">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Appointments */}
        <div className="lg:col-span-2 rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">{language === "hi" ? "आगामी अपॉइंटमेंट" : "Upcoming appointments"}</h3>
            <Link to="/patient/appointments" className="text-xs font-semibold text-primary">{language === "hi" ? "सभी देखें →" : "View all →"}</Link>
          </div>
          <div className="mt-4 space-y-3">
            {isAppointmentsLoading ? (
              <div className="text-center py-8 text-muted-foreground">{language === "hi" ? "लोड हो रहा है..." : "Loading appointments..."}</div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {language === "hi" ? "कोई आगामी अपॉइंटमेंट नहीं" : "No upcoming appointments"}
                <div className="mt-4">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="text-primary hover:underline text-xs font-medium"
                  >
                    {language === "hi" ? "अपना पहला अपॉइंटमेंट बुक करें" : "Book your first appointment"}
                  </button>
                </div>
              </div>
            ) : (
              upcomingAppointments.slice(0, 3).map((apt, i) => (
                <motion.div
                  key={apt._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border bg-background p-4 transition hover:shadow-soft"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <div className="text-sm font-semibold">{apt.doctor?.name || t("doctor")}</div>
                    <div className="text-xs text-muted-foreground">{apt.spec} · {apt.date}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    apt.status === "confirmed" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                  }`}>{apt.status}</span>
                  <button 
                    onClick={() => handleDecline(apt._id)}
                    disabled={updatingId === apt._id}
                    className="inline-flex items-center justify-center rounded-xl border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-secondary disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Prescriptions */}
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">{language === "hi" ? "सक्रिय पर्चे" : "Active prescriptions"}</h3>
            <Link to="/patient/prescriptions" className="text-xs font-semibold text-primary">{language === "hi" ? "सभी देखें →" : "View all →"}</Link>
          </div>
          <div className="mt-4 space-y-3">
            {isPrescriptionLoading ? (
              <div className="text-center py-8 text-muted-foreground">{language === "hi" ? "लोड हो रहा है..." : "Loading prescriptions..."}</div>
            ) : prescriptions.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {language === "hi" ? "अभी तक कोई पर्चा नहीं है" : "No active prescriptions yet"}
              </div>
            ) : (
              prescriptions.slice(0, 3).map((prescription, i) => (
                <motion.div
                  key={prescription._id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border bg-background p-4 transition hover:shadow-soft"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{prescription.doctor?.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {prescription.medicines.slice(0, 3).map((medicine, j) => (
                      <span key={j} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium max-w-[120px] truncate">
                        {medicine}
                      </span>
                    ))}
                    {prescription.medicines.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary/60 text-[10px] font-medium text-muted-foreground">
                        +{prescription.medicines.length - 3}
                      </span>
                    )}
                  </div>
                  {prescription.notes && (
                    <div className="pt-3 mt-2 border-t border-border/60">
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                        {t("notes")}
                      </div>
                      <div className="text-sm text-foreground/80 truncate">{prescription.notes}</div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant teaser */}
      <Link to="/patient/assistant">
        <motion.div
          whileHover={{ y: -3 }}
          className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 overflow-hidden rounded-3xl border bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-teal-500/10 p-6 shadow-soft"
        >
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-hero text-white animate-pulse-ring">
            <Bot className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">{language === "hi" ? "AI स्वास्थ्य सहायक" : "AI Health Assistant"}</div>
            <h3 className="font-display text-lg font-bold mt-1">{language === "hi" ? "साधारण भाषा में अपने लक्षणों का वर्णन करें" : "Describe your symptoms in plain language"}</h3>
            <p className="text-sm text-muted-foreground mt-1">{language === "hi" ? "हम सही विशेषज्ञ का सुझाव देंगे और डॉक्टर के लिए सार तैयार करेंगे।" : "We'll suggest the right specialist and prepare a summary for the doctor."}</p>
          </div>
        </motion.div>
      </Link>

      <BookAppointment open={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </DashboardLayout>
  );
}