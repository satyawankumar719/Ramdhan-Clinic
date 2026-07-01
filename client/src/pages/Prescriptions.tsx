import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText, Plus, Search, Calendar, X, CheckCircle2, Pill, ClipboardList
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
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

export default function Prescriptions({ role = "patient" }: { role?: "patient" | "doctor" }) {
  const { t, language } = useLanguage();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPrescription, setNewPrescription] = useState({
    patient: "",
    medicines: [""],
    notes: "",
  });
  const [patients, setPatients] = useState<any[]>([]);

  const fetchPrescriptions = async () => {
    try {
      const endpoint = role === "doctor" ? "/prescriptions/doctor" : "/prescriptions";
      const res = await apiClient.get(endpoint);
      if (res.data.success) {
        setPrescriptions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientsForDoctor = async () => {
    try {
      const apptsRes = await apiClient.get("/appointments/doctor");
      if (apptsRes.data.success && apptsRes.data.data) {
        const uniquePatientIds = new Set();
        const uniquePatients: any[] = [];
        apptsRes.data.data.forEach((appt: any) => {
          if (!uniquePatientIds.has(appt.patient._id)) {
            uniquePatientIds.add(appt.patient._id);
            uniquePatients.push(appt.patient);
          }
        });
        setPatients(uniquePatients);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    if (role === "doctor") {
      fetchPatientsForDoctor();
    }
  }, [role]);

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const medicines = newPrescription.medicines.filter(m => m.trim() !== "");
      const res = await apiClient.post("/prescriptions", {
        ...newPrescription,
        medicines,
      });
      if (res.data.success) {
        setShowCreateModal(false);
        fetchPrescriptions();
        setNewPrescription({ patient: "", medicines: [""], notes: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">{t("prescriptions")}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {role === "doctor" ? "Manage and issue digital prescriptions." : "View your prescribed medications and instructions."}
            </p>
          </div>
          {role === "doctor" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-full bg-hero px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:opacity-90 transition-all"
            >
              <Plus className="h-4 w-4" />
              {language === "hi" ? "नया पर्चा लिखें" : "Write Prescription"}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-hero border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {prescriptions.map((prescription, i) => (
              <motion.div
                key={prescription._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border bg-card p-5 shadow-soft hover:shadow-glow transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/50">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-hero/10 text-hero shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-foreground">
                        {role === "doctor" ? prescription.patient?.name : prescription.doctor?.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {new Date(prescription.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                    </div>
                  </div>

                  {/* Medicines Container */}
                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                      <Pill className="h-3.5 w-3.5 text-hero" />
                      {language === "hi" ? "दवाइयां" : "Prescribed Medicines"}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {prescription.medicines.map((medicine, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 rounded-xl bg-hero/5 text-hero border border-hero/20 text-xs font-semibold shadow-sm"
                        >
                          {medicine}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes Container */}
                {prescription.notes && (
                  <div className="mt-2 pt-3 border-t border-border/40">
                    <div className="rounded-xl bg-muted/40 border border-border/50 p-3">
                      <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1 mb-1.5">
                        <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
                        {t("notes")}
                      </div>
                      <div className="text-xs text-foreground/90 leading-relaxed font-medium">
                        {prescription.notes}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {prescriptions.length === 0 && (
              <div className="col-span-full text-center py-16 border border-dashed rounded-2xl bg-card/50">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
                <h3 className="text-lg font-semibold mb-1">{t("noPrescriptionsMessage")}</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  {role === "patient"
                    ? t("patientPrescriptionNote")
                    : t("doctorPrescriptionNote")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl w-full max-w-md p-6 shadow-glow border">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-hero" />
                {language === "hi" ? "नया पर्चा" : "New Prescription"}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePrescription} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {language === "hi" ? "रोगी चुनें" : "Select Patient"}
                </label>
                <select
                  value={newPrescription.patient}
                  onChange={(e) => setNewPrescription({ ...newPrescription, patient: e.target.value })}
                  className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hero/40 transition"
                  required
                >
                  <option value="">{language === "hi" ? "चुनें..." : "Select..."}</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {language === "hi" ? "दवाइयां" : "Medicines"}
                </label>
                <div className="max-h-40 overflow-y-auto pr-1 space-y-2">
                  {newPrescription.medicines.map((medicine, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={medicine}
                        onChange={(e) => {
                          const updated = [...newPrescription.medicines];
                          updated[idx] = e.target.value;
                          setNewPrescription({ ...newPrescription, medicines: updated });
                        }}
                        placeholder={language === "hi" ? "दवाई का नाम" : "Medicine name"}
                        className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-hero/40 transition"
                        required={idx === 0}
                      />
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = newPrescription.medicines.filter((_, i) => i !== idx);
                            setNewPrescription({ ...newPrescription, medicines: updated });
                          }}
                          className="p-2 rounded-xl text-destructive hover:bg-destructive/10 shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setNewPrescription({ ...newPrescription, medicines: [...newPrescription.medicines, ""] })}
                  className="text-hero text-xs font-bold flex items-center gap-1 mt-2 hover:opacity-80"
                >
                  <Plus className="h-3 w-3" /> {language === "hi" ? "और दवाई जोड़ें" : "Add more medicine"}
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {t("notes")}
                </label>
                <textarea
                  value={newPrescription.notes}
                  onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
                  placeholder={language === "hi" ? "अन्य निर्देश..." : "Additional instructions..."}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-hero/40 transition"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-hero px-4 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-90 flex items-center justify-center gap-1 transition"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {language === "hi" ? "बनाएं" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}