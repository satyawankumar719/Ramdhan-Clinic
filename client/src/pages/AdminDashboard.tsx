import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Stethoscope, Calendar, TrendingUp,
  Plus, Search, CheckCircle2, XCircle
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import apiClient from "@/apiConfig/apiClient";

interface StatCardProps {
  icon: any;
  label: string;
  value: string;
  color: string;
  trend?: string;
}

const StatCard = ({ icon: Icon, label, value, color, trend }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
    className="rounded-2xl border bg-card p-5 shadow-soft"
  >
    <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-soft`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="font-display text-2xl font-bold">{value}</div>
    {trend && <div className="text-[11px] text-primary mt-1">{trend}</div>}
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    emergencies: 0
  });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, doctorsRes, appointmentsRes] = await Promise.all([
        apiClient.get("/api/dashboard/stats"),
        apiClient.get("/api/doctors"),
        apiClient.get("/api/appointments")
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (doctorsRes.data.success) setDoctors(doctorsRes.data.data);
      if (appointmentsRes.data.success) setAppointments(appointmentsRes.data.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hero"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Admin Overview</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full border bg-background text-sm"
              />
            </div>
            <button className="flex items-center gap-2 rounded-full bg-hero px-4 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-90">
              <Plus className="h-4 w-4" /> Add Doctor
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            icon={Users} 
            label="Total Patients" 
            value={stats.patients.toString()} 
            color="from-cyan-500 to-teal-500" 
          />
          <StatCard 
            icon={Stethoscope} 
            label="Total Doctors" 
            value={stats.doctors.toString()} 
            color="from-indigo-500 to-blue-500" 
          />
          <StatCard 
            icon={Calendar} 
            label="Appointments" 
            value={stats.appointments.toString()} 
            color="from-amber-500 to-orange-500" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Emergencies" 
            value={stats.emergencies.toString()} 
            color="from-emerald-500 to-green-500" 
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Doctors */}
          <div className="rounded-3xl border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">Doctors</h3>
              <span className="text-sm text-muted-foreground">{doctors.length} total</span>
            </div>
            <div className="space-y-3">
              {doctors.map((doctor, i) => (
                <motion.div 
                  key={doctor._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border bg-background p-3"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-hero text-white text-xs font-bold">
                    {doctor.name.split(" ").map((p: string) => p[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{doctor.name}</div>
                    <div className="text-[11px] text-muted-foreground">{doctor.specialization || "General Medicine"}</div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[10px] font-semibold text-success">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="rounded-3xl border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">Recent Appointments</h3>
              <span className="text-sm text-muted-foreground">{appointments.length} total</span>
            </div>
            <div className="space-y-3">
              {appointments.slice(0, 5).map((apt, i) => (
                <motion.div 
                  key={apt._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border bg-background p-3"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">
                      {apt.patient?.name || "Patient"} · {apt.doctor?.name || "Doctor"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{apt.spec} · {apt.date}</div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                    apt.status === 'confirmed' ? 'bg-success/10 text-success' :
                    apt.status === 'completed' ? 'bg-primary/10 text-primary' :
                    apt.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {apt.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
