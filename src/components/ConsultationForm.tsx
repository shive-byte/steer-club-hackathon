import { useState } from "react";
import { toast } from "sonner";
import { submitConsultation } from "@/lib/api-client";
import { track } from "@/lib/track";

interface ConsultationFormProps {
  interactionId?: string | null;
  plateSummary: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fibre: number;
    items?: string[];
  };
}

const HEALTH_GOALS = [
  "Weight Loss & Fat Loss",
  "Diabetes & Blood Sugar Control",
  "PCOS / PCOD & Hormones",
  "Cholesterol & Heart Health",
  "Muscle Gain & High Protein",
  "General Healthy Eating",
];

const PREFERRED_TIMES = [
  "Morning (9 AM – 12 PM)",
  "Afternoon (12 PM – 4 PM)",
  "Evening (4 PM – 8 PM)",
];

export function ConsultationForm({ interactionId, plateSummary }: ConsultationFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [healthGoal, setHealthGoal] = useState("Weight Loss & Fat Loss");
  const [preferredTime, setPreferredTime] = useState("Morning (9 AM – 12 PM)");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitConsultation({
        interaction_id: interactionId || null,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        health_goal: healthGoal,
        preferred_time: preferredTime,
        notes: notes.trim() || null,
        plate_summary: plateSummary,
      });

      if (res.success && res.id) {
        setSubmittedId(res.id);
        toast.success("Consultation booked! A Steer doctor will reach out soon.");
        track("Lead", {
          content_name: "consultation_booked",
          value: plateSummary.kcal,
        });
      } else {
        toast.error(res.error || "Could not submit your request. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Network error while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="rounded-3xl border border-primary/20 bg-card p-6 text-center shadow-soft animate-pop">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-3xl">
          🩺
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground">
          Consultation Requested!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you, <span className="font-semibold text-foreground">{name}</span>. A Steer doctor & clinical nutritionist will contact you at{" "}
          <span className="font-semibold text-foreground">{phone}</span> during your preferred slot ({preferredTime}).
        </p>

        <div className="mt-4 rounded-2xl bg-secondary/70 p-3 text-xs text-secondary-foreground">
          <div className="font-semibold">Linked Thali Summary:</div>
          <div className="mt-1">
            ~{plateSummary.kcal} kcal · {plateSummary.protein}g protein · {plateSummary.fibre}g fibre
          </div>
          {plateSummary.items && plateSummary.items.length > 0 && (
            <div className="mt-1 text-[11px] opacity-80">
              Items: {plateSummary.items.join(", ")}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {(() => {
            const rawPhone = (import.meta.env["VITE_WHATSAPP_NUMBER"] as string | undefined) || "+918730283029";
            const cleanPhone = rawPhone.replace(/\D/g, "");
            return (
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hi Steer Health! I just built my plate (~${plateSummary.kcal} kcal, ${plateSummary.protein}g protein) and requested a consultation for ${healthGoal}. My name is ${name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-bold text-white shadow-soft active:scale-95 transition"
              >
                <span>💬</span> Message Steer on WhatsApp
              </a>
            );
          })()}

          <button
            onClick={() => setSubmittedId(null)}
            className="mt-2 text-xs text-muted-foreground underline hover:text-foreground"
          >
            Submit another consultation inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="text-2xl">👩‍⚕️</span>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Get a Personal Doctor-Led Plan
          </h3>
          <p className="text-xs text-muted-foreground">
            Free 15-min consultation tailored to your plate results
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-muted/60 p-2.5 text-xs text-muted-foreground flex items-center justify-between">
        <span>🥗 Your Plate Analysis:</span>
        <span className="font-semibold text-foreground">
          ~{plateSummary.kcal} kcal · {plateSummary.protein}g protein
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-sm">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Phone Number / WhatsApp <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <span className="flex items-center rounded-xl border border-input bg-muted px-3 text-xs font-medium text-foreground">
              +91
            </span>
            <input
              type="tel"
              required
              inputMode="numeric"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Email <span className="text-[11px] font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            type="email"
            placeholder="priya@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            What is your main health goal?
          </label>
          <div className="flex flex-wrap gap-1.5">
            {HEALTH_GOALS.map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setHealthGoal(g)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  healthGoal === g
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Preferred Time for Call
          </label>
          <select
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {PREFERRED_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Any questions or notes for the doctor? <span className="text-[11px] font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Trying to reduce belly fat while eating vegetarian"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 rounded-full bg-primary py-3.5 text-base font-bold text-primary-foreground shadow-soft transition active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Saving & Requesting..." : "Book My Free Consultation →"}
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          🔒 Your details and plate info are kept 100% private. No spam, ever.
        </p>
      </form>
    </div>
  );
}
