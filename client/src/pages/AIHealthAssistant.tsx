import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Stethoscope, ArrowRight, User } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAI, type Message, type Summary } from "@/hooks/use-ai";
import { useAuth } from "@/store/AuthContext";
import { useDoctors } from "@/hooks/use-doctors";

const initialMessage: Message = {
  from: "ai",
  text: "Hi there 👋 I'm your AI Health Assistant. Describe how you're feeling and I'll suggest the right specialist and prepare a summary for your doctor.",
  chips: ["Chest pain", "Headache 3 days", "Skin rash", "Persistent cough"],
};

const initialSummary: Summary = {
  patient: "Patient",
  chiefComplaint: "Not yet provided",
  duration: "Not yet determined",
  severity: "Not yet determined",
  other: "No additional details",
  suggested: "General Physician",
};

export default function AIHealthAssistant() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState<Summary>(initialSummary);
  const { user } = useAuth();
  const { doctors } = useDoctors();
  const { loading, sendMessage, reset, recommendedDoctors } = useAI();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setSummary(prev => ({ ...prev, patient: user.name }));
    }
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim()) return;

    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");

    try {
      const aiResponse = await sendMessage(text, messages);
      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text: aiResponse.response,
          chips: aiResponse.chips,
        },
      ]);
      setSummary(aiResponse.summary);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleReset = async () => {
    setMessages([initialMessage]);
    setSummary(initialSummary);
    await reset();
  };

  return (
    <DashboardLayout role="patient">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat */}
        <div className="lg:col-span-2 flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-3xl border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-hero text-white animate-pulse-ring">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">AI Health Assistant</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  Online · responses are guidance, not diagnosis
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="hidden items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary md:flex hover:bg-primary/20"
              >
                Reset
              </button>
              <div className="hidden items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary md:flex">
                <Sparkles className="h-3 w-3" /> v2
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.from === "user" ? "justify-end" : ""}`}
                >
                  {m.from === "ai" && (
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-hero text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${m.from === "user" ? "items-end" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        m.from === "ai"
                          ? "bg-secondary text-foreground"
                          : "bg-hero text-white shadow-soft"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.chips && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.chips.map((c) => (
                          <button
                            key={c}
                            onClick={() => send(c)}
                            className="rounded-full border bg-background px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {m.from === "user" && (
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-hero text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-secondary px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: i * 0.15,
                      }}
                      className="h-1.5 w-1.5 rounded-full bg-primary"
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t bg-background/60 p-4 backdrop-blur"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms…"
              className="flex-1 rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="grid h-11 w-11 place-items-center rounded-full bg-hero text-white shadow-soft transition hover:opacity-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-display text-base font-semibold">Pre-consult summary</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              We'll send this to your doctor before the consultation.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <Row k="Patient" v={summary.patient} />
              <Row k="Chief complaint" v={summary.chiefComplaint} />
              <Row k="Duration" v={summary.duration} />
              <Row k="Severity" v={summary.severity} />
              <Row k="Other" v={summary.other} />
              <Row k="Suggested" v={summary.suggested} highlight />
            </div>
          </div>

          <div className="rounded-3xl border bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-6">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <h3 className="font-display text-base font-semibold">Recommended specialists</h3>
            </div>
            <div className="mt-4 space-y-3">
              {(() => {
                const displayDoctors = recommendedDoctors.length > 0 ? recommendedDoctors : doctors;
                if (displayDoctors.length > 0) {
                  return displayDoctors.slice(0, 2).map((d) => (
                    <button
                      key={d._id}
                      className="flex w-full items-center gap-3 rounded-2xl border bg-background p-3 text-left hover:shadow-soft"
                    >
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-hero text-white text-xs font-bold">
                        {d.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{d.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {d.specialization || "General Practice"}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </button>
                  ));
                }
                return (
                  <div className="text-center py-4 text-xs text-muted-foreground">
                    No doctors available yet
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
      <span className="text-xs text-muted-foreground">{k}</span>
      <span
        className={`text-right text-sm font-medium ${
          highlight ? "text-primary" : ""
        }`}
      >
        {v}
      </span>
    </div>
  );
}
