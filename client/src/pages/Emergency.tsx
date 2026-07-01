import { motion } from "framer-motion";
import {
  Siren, MapPin, Phone, AlertTriangle, Stethoscope, Clock, CheckCircle2, X, Activity, ExternalLink, Navigation
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useLanguage } from "@/store/LanguageContext";
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

export default function Emergency({ role = "patient" }: { role?: "patient" | "doctor" | "admin" }) {
  const { t, language } = useLanguage();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Emergency | null>(null);
  const [locationStatus, setLocationStatus] = useState<"fetching" | "success" | "error">("fetching");

  const [form, setForm] = useState({
    location: "",
    phone: "",
    symptoms: "",
  });

  // System directly tracks and sets coordinates in the background automatically
  useEffect(() => {
    if (role === "patient" && navigator.geolocation) {
      setLocationStatus("fetching");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

          setForm((prev) => ({
            ...prev,
            location: `Live: ${latitude}, ${longitude} - Map: ${mapsLink}`
          }));
          setLocationStatus("success");
        },
        (error) => {
          console.error("Error getting live location:", error);
          setLocationStatus("error");
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    }
  }, [role]);

 const fetchEmergencies = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/emergency");
      if (res.data.success) {
        setEmergencies(res.data.data);

        if (role === "patient" && res.data.data.length > 0) {
          const activeRequest = res.data.data.find(
            (item: Emergency) =>
              item.status === "pending" ||
              item.status === "assigned" ||
              item.status === "in-progress"
          );

          if (activeRequest) {
            setActive(true);
            setCurrentRequest(activeRequest);
          } else {
            setActive(false);
            setCurrentRequest(res.data.data[0]);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 10000);
    return () => clearInterval(interval);
  }, [role]);

  const handleEmergency = async () => {
    if (!form.location) {
      alert(language === "hi" ? "कृपया सिस्टम को अपनी लोकेशन ट्रैक करने दें" : "Please allow system to track your location");
      return;
    }
    if (!form.phone || !form.symptoms) {
      alert(language === "hi" ? "कृपया सभी विवरण भरें" : "Please fill in all details");
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post("/emergency", form);
      if (res.data.success) {
        setActive(true);
        fetchEmergencies();
      }
    } catch (err) {
      alert(language === "hi" ? "अपातकालीन अनुरोध भेजने में विफल" : "Failed to send emergency request");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiClient.put(`/emergency/${id}`, { status });
      fetchEmergencies();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: language === "hi" ? "डॉक्टर की स्वीकृति का इंतज़ार है" : "Awaiting Doctor's Acceptance" };
      case "assigned":
        return { bg: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: language === "hi" ? "डॉक्टर ने स्वीकार किया" : "Accepted by Doctor" };
      case "in-progress":
        return { bg: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 animate-pulse", label: language === "hi" ? "डॉक्टर रास्ते में हैं" : "Doctor On The Way" };
      case "resolved":
        return { bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: language === "hi" ? "समस्या का समाधान हो गया" : "Resolved / Visited" };
      case "cancelled":
        return { bg: "bg-rose-500/10 text-rose-600 border-rose-500/20", label: language === "hi" ? "अस्वीकृत / रद्द" : "Cancelled / Declined" };
      default:
        return { bg: "bg-muted text-muted-foreground", label: status };
    }
  };

  const parseLocationData = (locText: string) => {
    let address = locText;
    let mapUrl = "";
    let embedUrl = "";

    if (locText.includes(" - Map: ")) {
      const parts = locText.split(" - Map: ");
      address = parts[0];
      mapUrl = parts[1];

      const match = address.match(/Live:\s*([-\d.]+)\s*,\s*([-\d.]+)/);
      if (match && match[1] && match[2]) {
        embedUrl = `https://maps.google.com/maps?q=${match[1]},${match[2]}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      }
    } else {
      embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locText)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    return { address, mapUrl, embedUrl };
  };

  return (
    <DashboardLayout role={role}>
      {role === "patient" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-rose-600 to-red-700 p-8 text-white shadow-glow">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">{t("emergencyHomeVisit")}</span>
            </div>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight">{t("needDoctorNow")}</h1>
            <p className="mt-2 max-w-xl text-white/85">{t("sendDoctor")}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 mb-6">

              {/* SYSTEM LIVE LOCATION INDICATOR BLOCK (No manual entry text field) */}
              <div className="md:col-span-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Navigation className={`h-5 w-5 ${locationStatus === "fetching" ? "animate-spin text-amber-300" : locationStatus === "error" ? "text-rose-300" : "text-emerald-300"}`} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white/70">
                      {language === "hi" ? "सिस्टम ट्रैकिंग" : "System GPS Tracking"}
                    </div>
                    <div className="text-sm font-medium mt-0.5">
                      {locationStatus === "fetching" && (language === "hi" ? "आपकी लाइव लोकेशन ट्रैक की जा रही है..." : "Fetching your live coordinates...")}
                      {locationStatus === "success" && (language === "hi" ? "लाइव GPS लोकेशन लॉक कर दी गई है" : "Live GPS Location locked successfully")}
                      {locationStatus === "error" && (language === "hi" ? "लोकेशन एक्सेस की अनुमति दें" : "Please grant location access permission")}
                    </div>
                  </div>
                </div>
                {locationStatus === "success" && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block text-white/80">{t("phoneNumber")}</label>
                <input
                  type="tel"
                  disabled={active && currentRequest?.status !== "resolved" && currentRequest?.status !== "cancelled"}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block text-white/80">{t("symptoms")}</label>
                <input
                  disabled={active && currentRequest?.status !== "resolved" && currentRequest?.status !== "cancelled"}
                  value={form.symptoms}
                  onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                  placeholder={language === "hi" ? "सीने में दर्द, चक्कर आना..." : "Chest pain, dizziness..."}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleEmergency}
                disabled={loading || locationStatus !== "success" || (active && currentRequest?.status !== "resolved" && currentRequest?.status !== "cancelled")}
                className="relative grid h-32 w-32 place-items-center rounded-full bg-white text-rose-600 shadow-glow disabled:opacity-50 shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-rose-600 border-t-transparent"></div>
                ) : (
                  <Siren className="h-12 w-12" />
                )}
                {locationStatus === "success" && !active && (
                  <span className="absolute inset-0 -z-0 animate-pulse-ring rounded-full" />
                )}
              </motion.button>
              <div>
                <div className="font-display text-xl font-bold">
                  {active && currentRequest?.status !== "resolved" && currentRequest?.status !== "cancelled"
                    ? (language === "hi" ? "अनुरोध सक्रिय है" : "Emergency Request Active")
                    : t("tapToRequest")}
                </div>
                <div className="text-sm text-white/85 mt-0.5">
                  {active && currentRequest?.status === "in-progress"
                    ? (language === "hi" ? "डॉक्टर आपके स्थान पर आ रहे हैं" : "Dr. Parveen is arriving shortly")
                    : t("avgResponse")}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border bg-card p-6 shadow-soft">
              <h3 className="font-display text-lg font-semibold">{t("yourDetails")}</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border bg-background p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden w-full">
                    <div className="text-xs text-muted-foreground">{t("location")}</div>
                    <div className="text-sm font-semibold truncate">
                      {form.location ? (language === "hi" ? "📡 सिस्टम GPS द्वारा ट्रैक किया गया" : "📡 Tracked via System GPS") : (language === "hi" ? "लोकेशन खोजी जा रही है..." : "Locating...")}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border bg-background p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-success/10 text-success">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{t("onCallDoctor")}</div>
                    <div className="text-sm font-semibold">Dr. Parveen Parjapat</div>
                  </div>
                </div>
              </div>

              {currentRequest && (
                <div className="mt-5 pt-5 border-t border-border/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    <Activity className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                    {language === "hi" ? "लाइव डॉक्टर ट्रैकर" : "Live Response Status"}
                  </div>

                  <div className={`rounded-xl border p-3 text-xs font-semibold mb-3 flex items-center gap-2 ${getStatusStyles(currentRequest.status).bg}`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentRequest.status === 'cancelled' ? 'bg-red-400' : currentRequest.status === 'resolved' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${currentRequest.status === 'cancelled' ? 'bg-red-500' : currentRequest.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </span>
                    {getStatusStyles(currentRequest.status).label}
                  </div>

                  <div className="flex items-center justify-between px-2 mt-4 text-[10px] text-muted-foreground font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${currentRequest.status !== 'cancelled' ? 'bg-emerald-500' : 'bg-muted'}`} />
                      <span>Sent</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-border/60 mb-3 mx-1" />
                    <div className="flex flex-col items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${['assigned', 'in-progress', 'resolved'].includes(currentRequest.status) ? 'bg-blue-500' : 'bg-muted'}`} />
                      <span>Accepted</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-border/60 mb-3 mx-1" />
                    <div className="flex flex-col items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${['in-progress', 'resolved'].includes(currentRequest.status) ? 'bg-indigo-500 animate-pulse' : 'bg-muted'}`} />
                      <span>On Way</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-border/60 mb-3 mx-1" />
                    <div className="flex flex-col items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${currentRequest.status === 'resolved' ? 'bg-emerald-500' : 'bg-muted'}`} />
                      <span>Visited</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Doctor / Admin View Config */
        <div className="space-y-6">
          <h1 className="font-display text-3xl font-bold">
            {language === "hi" ? "अपातकालीन अनुरोध" : "Emergency Requests"}
          </h1>
          {isLoading && emergencies.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hero"></div>
            </div>
          ) : emergencies.length === 0 ? (
            <div className="rounded-3xl border bg-gradient-to-br from-emerald-50 to-green-50 p-12 text-center shadow-soft">
              <CheckCircle2 className="mx-auto h-16 w-16 text-success mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {language === "hi" ? "कोई अपातकालीन अनुरोध नहीं" : "No Active Emergency Requests"}
              </h3>
              <p className="text-muted-foreground">{t("emergencyAlert")}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
              {emergencies.map((emergency, i) => {
                const { address, mapUrl, embedUrl } = parseLocationData(emergency.location);

                return (
                  <motion.div
                    key={emergency._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-3xl border bg-card p-6 shadow-soft flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`grid h-10 w-10 place-items-center rounded-xl ${
                          emergency.status === "pending" ? "bg-warning/10 text-warning animate-bounce" :
                          emergency.status === "resolved" ? "bg-success/10 text-success" :
                          "bg-hero text-white"
                        }`}>
                          <Siren className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{emergency.patient.name}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(emergency.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                          emergency.status === "pending" ? "bg-warning/10 text-warning" :
                          emergency.status === "resolved" ? "bg-success/10 text-success" :
                          emergency.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                          "bg-primary/10 text-primary"
                        }`}>{emergency.status}</span>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="text-foreground/90 font-medium">
                            {address}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                          <a href={`tel:${emergency.phone}`} className="hover:underline text-primary font-medium">{emergency.phone}</a>
                        </div>
                        <div className="pt-2 border-t border-border/60">
                          <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wide mb-1">
                            {language === "hi" ? "लक्षण" : "Symptoms"}
                          </div>
                          <div className="text-foreground/80 bg-muted/40 rounded-xl p-2.5 border border-border/40 font-mono text-xs">
                            {emergency.symptoms}
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-[180px] rounded-2xl overflow-hidden border bg-muted relative mb-2">
                        <iframe
                          src={embedUrl}
                          className="w-full h-full border-0"
                          allowFullScreen={true}
                          loading="lazy"
                          title={`Emergency Location Map - ${emergency.patient.name}`}
                        />
                        {mapUrl && (
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2 bg-background/90 backdrop-blur px-3 py-1 rounded-xl text-[11px] font-bold shadow border border-border/50 flex items-center gap-1 text-rose-600 hover:bg-background transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" /> Navigation
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      {role === "doctor" && emergency.status === "pending" && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleUpdateStatus(emergency._id, "assigned")}
                            className="flex-1 rounded-xl bg-success py-2 text-xs font-semibold text-white hover:opacity-90 transition shadow-sm"
                          >
                            {language === "hi" ? "स्वीकार करें" : "Accept"}
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(emergency._id, "cancelled")}
                            className="flex-1 rounded-xl border py-2 text-xs font-semibold text-destructive hover:bg-destructive/5 transition"
                          >
                            {language === "hi" ? "अस्वीकार करें" : "Decline"}
                          </button>
                        </div>
                      )}
                      {role === "doctor" && (emergency.status === "assigned" || emergency.status === "in-progress") && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleUpdateStatus(emergency._id, "in-progress")}
                            className="flex-1 rounded-xl bg-primary py-2 text-xs font-semibold text-white hover:opacity-90 transition shadow-sm"
                          >
                            {language === "hi" ? "चल रहा है" : "In Progress"}
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(emergency._id, "resolved")}
                            className="flex-1 rounded-xl bg-success py-2 text-xs font-semibold text-white hover:opacity-90 transition shadow-sm"
                          >
                            {language === "hi" ? "हल करें" : "Resolve"}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
