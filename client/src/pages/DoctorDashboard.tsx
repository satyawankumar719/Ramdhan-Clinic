import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Calendar, Users, Clock, CheckCircle2, X, Video, FileText, Siren, Stethoscope, TrendingUp, MapPin, Phone
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAppointments } from "@/hooks/use-appointments";
import apiClient from "@/apiConfig/apiClient";

interface Emergency {
  _id: string;
  patient: { name: string; phone?: string };
  doctor?: { name: string };
  location: string;
  phone: string;
  symptoms: string;
  status: "pending" | "assigned" | "in-progress" | "resolved" | "cancelled";
  createdAt: string;
}

export default function DoctorDashboard() {
  const { appointments, isLoading, updateAppointmentStatus } = useAppointments('doctor');
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const todayAppointments = appointments.filter(apt => apt.status === 'confirmed' || apt.status === 'pending');
  
  // Active emergencies that need doctor's attention
  const activeEmergencies = emergencies.filter(
    e => e.status === "pending" || e.status === "assigned" || e.status === "in-progress"
  );

  const fetchEmergencies = async () => {
    try {
      setIsEmergencyLoading(true);
      const res = await apiClient.get("/emergency");
      if (res.data.success) {
        setEmergencies(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch emergencies:", err);
    } finally {
      setIsEmergencyLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      setUpdatingId(id);
      await updateAppointmentStatus(id, 'confirmed');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
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

  const handleUpdateEmergencyStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await apiClient.put(`/emergency/${id}`, { status });
      await fetchEmergencies();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout role="doctor">
      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: Calendar, label: "Today", value: todayAppointments.length.toString(), sub: "appointments", color: "from-cyan-500 to-teal-500" },
          { icon: Users, label: "Patients", value: appointments.length.toString(), sub: "this month", color: "from-indigo-500 to-blue-500" },
          { icon: Siren, label: "Emergencies", value: activeEmergencies.length.toString(), sub: "active requests", color: "from-rose-500 to-red-500" },
          { icon: TrendingUp, label: "Satisfaction", value: "4.9", sub: "/5 avg", color: "from-emerald-500 to-green-500" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border bg-card p-5 shadow-soft"
          >
            <div className={`mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="text-[11px] text-muted-foreground">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Schedule */}
        <div className="lg:col-span-2 rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Today's Appointments</h3>
            <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</div>
          </div>
          <div className="mt-5 space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading... Please wait</div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No Appointments today</div>
            ) : (
              todayAppointments.slice(0, 5).map((apt, i) => (
                <motion.div
                  key={apt._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                    apt.status === "confirmed" ? "border-primary bg-primary/5 shadow-soft" : "bg-background"
                  }`}
                >
                  <div className="w-16 text-sm font-semibold text-foreground/80">{apt.date.split('· ')[1] || apt.date}</div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
                    <Stethoscope className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{apt.patient?.name || 'Patient'}</div>
                    <div className="text-xs text-muted-foreground">{apt.reason}</div>
                  </div>
                  {apt.status === "completed" && <span className="rounded-full bg-success/15 px-3 py-1 text-[11px] font-semibold text-success">Completed</span>}
                  {apt.status === "confirmed" && (<>
                    <button className="inline-flex items-center gap-1 rounded-full bg-hero px-3 py-1 text-[11px] font-semibold text-white">
                      <Video className="h-3 w-3" /> Join Now
                    </button>
                    <button 
                      onClick={() => handleDecline(apt._id)}
                      disabled={updatingId === apt._id}
                      className="inline-flex items-center justify-center rounded-xl border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-secondary disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5 text-red-600" />
                    </button></>
                  )}
                  {apt.status === "pending" && <span className="rounded-full bg-warning/15 px-3 py-1 text-[11px] font-semibold text-warning">Waiting</span>}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Controls (Requests & Emergencies) */}
        <div className="space-y-6">
          {/* New Requests Panel */}
          <div className="rounded-3xl border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">New Requests</h3>
              <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning">{pendingAppointments.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {isLoading ? (
                <div className="text-center py-4 text-sm text-muted-foreground">Loading... Please wait</div>
              ) : pendingAppointments.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">No new requests</div>
              ) : (
                pendingAppointments.slice(0, 3).map((apt, i) => (
                  <motion.div
                    key={apt._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border bg-background p-4"
                  >
                    <div className="text-sm font-semibold">{apt.patient?.name || 'Patient'}</div>
                    <div className="text-xs text-muted-foreground">{apt.reason}</div>
                    <div className="mt-1 text-[11px] text-primary">{apt.date}</div>
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => handleAccept(apt._id)}
                        disabled={updatingId === apt._id}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-hero py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> 
                        {updatingId === apt._id ? 'Please wait...' : 'Accept'}
                      </button>
                      <button 
                        onClick={() => handleDecline(apt._id)}
                        disabled={updatingId === apt._id}
                        className="inline-flex items-center justify-center rounded-xl border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-secondary disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Dynamic Emergency Live Container */}
          {activeEmergencies.length === 0 ? (
            <div className="rounded-3xl border bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white shadow-soft">
              <div className="flex items-center gap-2">
                <Siren className="h-5 w-5 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest">Emergency Status</span>
              </div>
              <h4 className="mt-3 font-display text-lg font-bold">No emergency calls right now</h4>
              <p className="text-xs opacity-90 mt-1">If there is a critical care or home visit requirement, we will dispatch an alert card here at once.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1 text-red-600">
                <Siren className="h-4 w-4 animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-wider">Active Emergencies ({activeEmergencies.length})</span>
              </div>
              {activeEmergencies.slice(0, 2).map((emergency) => (
                <motion.div
                  key={emergency._id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-3xl border border-red-200 bg-red-50/50 p-5 shadow-soft dark:bg-red-950/20 dark:border-red-900/40"
                >
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-red-700 dark:text-red-400">{emergency.patient?.name}</h4>
                      <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                        {emergency.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(emergency.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-foreground/90 mb-4">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="truncate">{emergency.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>{emergency.phone}</span>
                    </div>
                    <div className="bg-white/80 dark:bg-background/80 rounded-xl p-2.5 mt-2 border border-red-100/70 dark:border-red-900/20">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Symptoms</div>
                      <p className="font-medium text-red-950 dark:text-red-200">{emergency.symptoms}</p>
                    </div>
                  </div>

                  {/* Actions mapping based on state machine */}
                  <div className="flex gap-2">
                    {emergency.status === "pending" && (
                      <>
                        <button
                          disabled={updatingId !== null}
                          onClick={() => handleUpdateEmergencyStatus(emergency._id, "assigned")}
                          className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold shadow-sm transition disabled:opacity-50"
                        >
                          Accept Call
                        </button>
                        <button
                          disabled={updatingId !== null}
                          onClick={() => handleUpdateEmergencyStatus(emergency._id, "cancelled")}
                          className="rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 px-3 py-2 text-xs font-bold transition disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {(emergency.status === "assigned" || emergency.status === "in-progress") && (
                      <>
                        {emergency.status === "assigned" && (
                          <button
                            disabled={updatingId !== null}
                            onClick={() => handleUpdateEmergencyStatus(emergency._id, "in-progress")}
                            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 text-xs font-bold transition disabled:opacity-50"
                          >
                            Mark: In Progress
                          </button>
                        )}
                        <button
                          disabled={updatingId !== null}
                          onClick={() => handleUpdateEmergencyStatus(emergency._id, "resolved")}
                          className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold transition disabled:opacity-50"
                        >
                          Resolve Call
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          { icon: FileText, label: "Write Prescription" },
          { icon: Calendar, label: "Block Schedule" },
          { icon: Users, label: "Patient Records" },
          { icon: Clock, label: "Set Availability" },
        ].map((a) => (
          <motion.button
            key={a.label}
            whileHover={{ y: -3 }}
            className="flex items-center gap-3 rounded-2xl border bg-card p-4 text-left shadow-soft transition"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <a.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">{a.label}</span>
          </motion.button>
        ))}
      </div>
    </DashboardLayout>
  );
}