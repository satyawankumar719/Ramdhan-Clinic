import { useState } from 'react';
import { motion } from "framer-motion";
import { Calendar, Video, Stethoscope, Plus, CheckCircle2, Clock, X, MapPin, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAppointments } from "@/hooks/use-appointments";
import BookAppointment from "@/components/BookAppointment";

const statusStyles: Record<string, string> = {
  confirmed: "bg-success/15 text-success",
  pending: "bg-warning/15 text-warning",
  completed: "bg-primary/15 text-primary",
  cancelled: "bg-destructive/15 text-destructive",
};

interface AppointmentsProps {
  role?: 'patient' | 'doctor';
}

export default function Appointments({ role = 'patient' }: AppointmentsProps) {
  const { appointments, isLoading, updateAppointmentStatus } = useAppointments(role);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await updateAppointmentStatus(id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter appointments into their respective structural categories
  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  // Reusable card template for appointments to keep code clean
  const renderAppointmentCard = (apt: any, i: number) => (
    <motion.div
      key={apt._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      whileHover={{ y: -2 }}
      className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-5 shadow-soft"
    >
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-hero text-white shrink-0">
        <Calendar className="h-5 w-5" />
      </div>
      <div className="min-w-[140px]">
        <div className="text-xs text-muted-foreground">When</div>
        <div className="text-sm font-semibold">{apt.date}</div>
      </div>
      <div className="min-w-[140px]">
        <div className="text-xs text-muted-foreground">{role === "patient" ? "Doctor" : "Patient"}</div>
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Stethoscope className="h-3.5 w-3.5 text-primary" />
          {role === "patient" ? apt.doctor?.name : apt.patient?.name}
        </div>
      </div>
      <div className="min-w-[120px]">
        <div className="text-xs text-muted-foreground">Specialty</div>
        <div className="text-sm font-semibold">{apt.spec}</div>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium">
        {apt.mode === "Video" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
        {apt.mode}
      </div>
      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${statusStyles[apt.status]}`}>
        {apt.status}
      </span>
      
      <div className="ml-auto flex items-center gap-2">
        {role === 'doctor' && apt.status === 'pending' && (
          <>
            <button 
              onClick={() => handleUpdateStatus(apt._id, 'confirmed')}
              disabled={updatingId === apt._id}
              className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success hover:bg-success/20 transition disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {updatingId === apt._id ? 'Confirming...' : 'Confirm'}
            </button>
            <button 
              onClick={() => handleUpdateStatus(apt._id, 'cancelled')}
              disabled={updatingId === apt._id}
              className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </>
        )}

        {apt.status === 'confirmed' && (
          <>
            <button className="inline-flex items-center gap-1 rounded-full bg-hero px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition">
              <Video className="h-3.5 w-3.5" /> Join
            </button>
            {role === 'doctor' && (
              <button 
                onClick={() => handleUpdateStatus(apt._id, 'completed')}
                disabled={updatingId === apt._id}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Complete
              </button>
            )}
            <button 
              onClick={() => handleUpdateStatus(apt._id, 'cancelled')}
              disabled={updatingId === apt._id}
              className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </>
        )}

        {apt.status === 'completed' && role === 'patient' && (
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition"
          >
            <Clock className="h-3.5 w-3.5" /> Re-book
          </button>
        )}

        {role === 'patient' && apt.status === 'pending' && (
          <button 
            onClick={() => handleUpdateStatus(apt._id, 'cancelled')}
            disabled={updatingId === apt._id}
            className="inline-flex items-center gap-1 rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <DashboardLayout role={role}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            {role === "patient" ? "All your past and upcoming consultations." : "Your schedule across all patients."}
          </p>
        </div>
        {role === "patient" && (
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-hero px-4 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" /> Book new
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground mt-6">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          Loading appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center mt-6">
          <Calendar className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 font-display text-xl font-semibold">No appointments yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {role === "patient" 
              ? "Start your health journey by booking your first appointment." 
              : "Your schedule is clear. No appointments scheduled yet."}
          </p>
          {role === "patient" && (
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="mt-6 inline-flex items-center gap-1 rounded-full bg-hero px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" /> Book your first appointment
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          
          {/* Confirmed Container */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold font-display flex items-center gap-2 text-success">
              <span className="h-2 w-2 rounded-full bg-success"></span>
              Confirmed Appointments ({confirmedAppointments.length})
            </h2>
            <div className="grid gap-3">
              {confirmedAppointments.length > 0 ? (
                confirmedAppointments.map((apt, i) => renderAppointmentCard(apt, i))
              ) : (
                <div className="text-sm text-muted-foreground border border-dashed rounded-2xl p-4 bg-card/40">
                  No confirmed appointments.
                </div>
              )}
            </div>
          </div>

          {/* Pending / Unconfirmed Container */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold font-display flex items-center gap-2 text-warning">
              <span className="h-2 w-2 rounded-full bg-warning"></span>
              Unconfirmed Requests ({pendingAppointments.length})
            </h2>
            <div className="grid gap-3">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((apt, i) => renderAppointmentCard(apt, i))
              ) : (
                <div className="text-sm text-muted-foreground border border-dashed rounded-2xl p-4 bg-card/40">
                  No pending validation requests.
                </div>
              )}
            </div>
          </div>

          {/* Cancelled Container */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold font-display flex items-center gap-2 text-destructive">
              <span className="h-2 w-2 rounded-full bg-destructive"></span>
              Cancelled Appointments ({cancelledAppointments.length})
            </h2>
            <div className="grid gap-3">
              {cancelledAppointments.length > 0 ? (
                cancelledAppointments.map((apt, i) => renderAppointmentCard(apt, i))
              ) : (
                <div className="text-sm text-muted-foreground border border-dashed rounded-2xl p-4 bg-card/40">
                  No cancelled history.
                </div>
              )}
            </div>
          </div>

          {/* Completed History (Optional fallback section) */}
          {completedAppointments.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold font-display flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/50"></span>
                Completed Consultations ({completedAppointments.length})
              </h2>
              <div className="grid gap-3">
                {completedAppointments.map((apt, i) => renderAppointmentCard(apt, i))}
              </div>
            </div>
          )}

        </div>
      )}

      <BookAppointment open={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </DashboardLayout>
  );
}