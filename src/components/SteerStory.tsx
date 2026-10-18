import { useState } from "react";

const STEPS = [
  { e: "🧪", t: "Diagnostics first", d: "Every member begins with full tests, including a gut microbiome test and a DEXA scan that shows your fat, muscle and bone, not only your weight." },
  { e: "👨‍⚕️", t: "Doctor consult", d: "A physician or endocrinologist goes through your results and tells you honestly whether the programme is right for you." },
  { e: "💬", t: "Continuous care", d: "You get your own doctor, care manager and behavioural dietician. Daily check-ins happen on WhatsApp, and an AI coach turns your meals, weight and lab results into progress trends." },
  { e: "🌱", t: "Habits that last", d: "Diet, fitness and mental health support work alongside any medicine. You leave with a personal long-term maintenance plan." },
];

const FAQS = [
  { q: "What are GLP-1 medicines like semaglutide and tirzepatide?", a: "They copy natural gut hormones that tell your brain you're full and help steady blood sugar. Many people feel less hungry and think about food less. They are prescription medicines and work best as part of a full programme, not as a shortcut." },
  { q: "Will I definitely be put on GLP-1 medicine?", a: "No. A Steer doctor prescribes it only when it is clinically right for you, based on your tests and history. Many members follow a plan built around diet, fitness and habits." },
  { q: "Will I lose muscle along with fat?", a: "Fast weight loss can take muscle with it. That's why Steer tracks body composition with DEXA, plans protein for Indian diets and adds strength training, so the weight you lose is mostly fat." },
  { q: "Do I have to give up roti, rice or my home food?", a: "No. Your dietician works with the food you already eat (thali, dal, sabzi, regional dishes) and adjusts portions and combinations rather than banning foods." },
  { q: "What happens when I stop the medicine?", a: "Weight often comes back if habits haven't changed. Steer builds those habits alongside any medicine and plans a gradual exit, then gives you a maintenance plan to keep the weight off." },
  { q: "Are there side effects?", a: "Some people feel nausea, bloating or constipation, mostly in the early weeks. Your doctor starts low, adjusts slowly and checks in often. These medicines aren't suitable for everyone, which is why screening comes first." },
  { q: "Is this only for people with a lot of weight to lose?", a: "Steer is for anyone working on weight, blood sugar, PCOS, cholesterol or overall metabolic health. The doctor consult decides the right level of support for you." },
  { q: "What does the free consultation involve?", a: "A 15-minute call where we understand your goals and history, explain the programme and tests, and answer your questions. No pressure and no obligation." },
];

export function SteerStory({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-card p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Why plates aren't the whole story</p>
        <h2 className="mt-1 font-display text-2xl font-bold leading-snug">Weight is metabolic, not just willpower.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Indian bodies tend to store more fat around the waist and develop insulin resistance at lower weights. Hormones, sleep, gut health and muscle all matter. Steer is India's doctor-led metabolic health club, built to help you lose weight and keep it off.
        </p>
      </div>

      <div className="rounded-3xl bg-card p-5 shadow-soft">
        <h2 className="font-display text-xl font-bold">How Steer works</h2>
        <ol className="mt-3 space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-xl">{s.e}</div>
              <div>
                <div className="text-sm font-bold">{i + 1}. {s.t}</div>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {!compact && (
        <div className="rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="font-display text-xl font-bold">Your questions, answered</h2>
          <div className="mt-3 divide-y divide-border">
            {FAQS.map((f, i) => (
              <div key={f.q} className="py-3">
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-start justify-between gap-3 text-left text-sm font-semibold">
                  <span>{f.q}</span>
                  <span className="text-primary">{open === i ? "−" : "+"}</span>
                </button>
                {open === i && <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">General information only, not medical advice. Prescription decisions are made by a doctor after assessment.</p>
        </div>
      )}
    </div>
  );
}
