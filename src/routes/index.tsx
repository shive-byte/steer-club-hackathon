import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FOODS, GROUPS, totals, roundKcal, roundG, insights, dailyNeeds, type Profile } from "@/lib/foods";
import { track, ctaUrl } from "@/lib/track";
import { submitInteraction } from "@/lib/api-client";
import { ConsultationForm } from "@/components/ConsultationForm";
import { SteerStory } from "@/components/SteerStory";
import { AdHook } from "@/components/AdHook";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Build Your Plate — a 60-second Indian meal check by Steer" },
      { name: "description", content: "Tap together your thali and see estimated calories, protein, carbs, fat and fibre — with warm, doctor-led tips. No login." },
      { property: "og:title", content: "Build Your Plate 🍛 — how balanced is your thali?" },
      { property: "og:description", content: "60-second interactive nutrition check for Indian meals, by Steer. Free, no login." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEER_URL = "https://www.steer.health/";
type Step = "intro" | "build" | "result";

function Index() {
  const [step, setStep] = useState<Step>("intro");
  const [sel, setSel] = useState<Record<string, number>>({});
  const [tab, setTab] = useState<string>("grain");
  const [interactionId, setInteractionId] = useState<string | null>(null);
  const count = Object.values(sel).reduce((a, b) => a + b, 0);
  const t = useMemo(() => totals(sel), [sel]);

  const handleSeePlate = async () => {
    setStep("result");
    track("ViewContent", { content_name: "plate_result", value: roundKcal(t.kcal) });
    window.scrollTo(0, 0);

    // Save interaction to Neon DB
    const { wins, tries } = insights(t, sel);
    try {
      const res = await submitInteraction({
        selected_items: sel,
        total_kcal: roundKcal(t.kcal),
        protein: roundG(t.protein),
        carbs: roundG(t.carbs),
        fat: roundG(t.fat),
        fibre: roundG(t.fibre),
        item_count: count,
        insights: { wins, tries },
      });
      if (res?.success && res.id) {
        setInteractionId(res.id);
      }
    } catch (err) {
      console.error("Failed to record plate interaction:", err);
    }
  };

  const bump = (id: string, d: number) =>
    setSel((s) => ({ ...s, [id]: Math.max(0, Math.min(6, (s[id] ?? 0) + d)) }));

  return (
    <main className="min-h-[100dvh] bg-warm font-sans text-foreground">
      <AdHook onStart={() => { setStep("build"); track("Lead", { content_name: "plate_start_from_hook" }, false); }} />
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col px-5 pb-28 pt-5">
        <header className="flex items-center justify-between">
          <span className="font-display text-xl font-extrabold text-primary">steer</span>
          <span className="rounded-full bg-card/70 px-3 py-1 text-xs text-muted-foreground">Doctor-led • No login</span>
        </header>

        {step === "intro" && (
          <section className="flex flex-1 flex-col justify-center text-center">
            <div className="mx-auto mb-6 grid h-44 w-44 place-items-center rounded-full bg-card text-7xl shadow-soft">🍛</div>
            <h1 className="font-display text-4xl font-extrabold leading-tight">How balanced is your thali?</h1>
            <p className="mt-3 text-muted-foreground">Tap together today's lunch. In 60 seconds, see what's on your plate — and one easy upgrade.</p>
            <button
              onClick={() => { setStep("build"); track("Lead", { content_name: "plate_start" }, false); }}
              className="mt-8 rounded-full bg-primary py-4 text-lg font-bold text-primary-foreground shadow-soft active:scale-95 transition"
            >
              Build my plate →
            </button>
            <p className="mt-4 text-xs text-muted-foreground">Estimates based on ICMR-NIN Indian food data.</p>
            <div className="mt-8 grid grid-cols-3 gap-2 text-xs">
              {[["🧪", "DEXA + gut tests"], ["👨‍⚕️", "Your own doctor"], ["💬", "Daily WhatsApp care"]].map(([e, l]) => (
                <div key={l} className="rounded-2xl bg-card p-3 shadow-soft"><div className="text-2xl">{e}</div><div className="mt-1 font-medium">{l}</div></div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Curious about semaglutide or tirzepatide? Build your plate, then get clear answers from doctors.</p>
          </section>
        )}

        {step === "build" && (
          <section className="mt-5 flex flex-1 flex-col">
            <Plate sel={sel} />
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {GROUPS.map((g) => {
                const has = FOODS.some((f) => f.group === g.id && (sel[f.id] ?? 0) > 0);
                return (
                  <button key={g.id} onClick={() => setTab(g.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${tab === g.id ? "bg-foreground text-background" : "bg-card text-foreground"}`}>
                    {has && "✓ "}{g.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{GROUPS.find((g) => g.id === tab)?.hint}</p>
            <ul className="mt-3 space-y-2">
              {FOODS.filter((f) => f.group === tab).map((f) => {
                const q = sel[f.id] ?? 0;
                return (
                  <li key={f.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
                    <span className="text-3xl">{f.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.portion}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {q > 0 && <button aria-label={`Less ${f.name}`} onClick={() => bump(f.id, -1)} className="h-9 w-9 rounded-full bg-secondary text-lg font-bold">−</button>}
                      {q > 0 && <span className="w-4 text-center font-bold">{q}</span>}
                      <button aria-label={`More ${f.name}`} onClick={() => bump(f.id, 1)} className="h-9 w-9 rounded-full bg-primary text-lg font-bold text-primary-foreground">+</button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="fixed inset-x-0 bottom-0 bg-background/90 backdrop-blur">
              <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-3">
                <div className="flex-1 text-sm">
                  <div className="font-bold">~{roundKcal(t.kcal)} kcal</div>
                  <div className="text-xs text-muted-foreground">{count} item{count === 1 ? "" : "s"} · {roundG(t.protein)} g protein</div>
                </div>
                <button disabled={count === 0}
                  onClick={handleSeePlate}
                  className="rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground disabled:opacity-40">
                  See my plate
                </button>
              </div>
            </div>
          </section>
        )}

        {step === "result" && (
          <Result
            sel={sel}
            interactionId={interactionId}
            onEdit={() => setStep("build")}
          />
        )}
      </div>
    </main>
  );
}

function Plate({ sel }: { sel: Record<string, number> }) {
  const items = FOODS.flatMap((f) => Array.from({ length: sel[f.id] ?? 0 }, (_, i) => ({ k: f.id + i, e: f.emoji })));
  return (
    <div className="mx-auto grid h-48 w-48 place-items-center rounded-full border-8 border-card bg-muted shadow-soft">
      {items.length === 0 ? (
        <span className="px-6 text-center text-sm text-muted-foreground">Your plate is empty — tap + below</span>
      ) : (
        <div className="flex max-w-[9rem] flex-wrap justify-center gap-1 text-3xl">
          {items.slice(0, 12).map((i) => <span key={i.k} className="animate-pop">{i.e}</span>)}
        </div>
      )}
    </div>
  );
}

function Result({
  sel,
  interactionId,
  onEdit,
}: {
  sel: Record<string, number>;
  interactionId: string | null;
  onEdit: () => void;
}) {
  const t = totals(sel);
  const { wins, tries } = insights(t, sel);
  const [p, setP] = useState<Profile>({ sex: "f", age: 30, weight: 60, height: 160, activity: 1.375 });
  const [showNeeds, setShowNeeds] = useState(false);
  const needs = dailyNeeds(p);
  const macroKcal = t.protein * 4 + t.carbs * 4 + t.fat * 9 || 1;
  const bars = [
    { l: "Carbs", v: t.carbs, c: "bg-chart-3", pct: (t.carbs * 4) / macroKcal },
    { l: "Protein", v: t.protein, c: "bg-chart-2", pct: (t.protein * 4) / macroKcal },
    { l: "Fat", v: t.fat, c: "bg-chart-1", pct: (t.fat * 9) / macroKcal },
  ];

  const plateSummary = {
    kcal: roundKcal(t.kcal),
    protein: roundG(t.protein),
    carbs: roundG(t.carbs),
    fat: roundG(t.fat),
    fibre: roundG(t.fibre),
    items: FOODS.filter((f) => (sel[f.id] ?? 0) > 0).map(
      (f) => `${f.emoji} ${f.name} (x${sel[f.id]})`
    ),
  };

  return (
    <section className="mt-5 space-y-4">
      <div className="rounded-3xl bg-card p-5 text-center shadow-soft">
        <p className="text-sm text-muted-foreground">Your plate, roughly</p>
        <div className="font-display text-5xl font-extrabold">~{roundKcal(t.kcal)}<span className="text-xl"> kcal</span></div>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full">
          {bars.map((b) => <div key={b.l} className={b.c} style={{ width: `${b.pct * 100}%` }} />)}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
          {[...bars, { l: "Fibre", v: t.fibre, c: "bg-chart-5" }].map((b) => (
            <div key={b.l}>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><span className={`h-2 w-2 rounded-full ${b.c}`} />{b.l}</div>
              <div className="font-bold">{roundG(b.v)} g</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">Estimates vary with recipe, oil and portion size.</p>
      </div>

      <div className="rounded-3xl bg-card p-5 shadow-soft">
        <h2 className="font-display text-xl font-bold">What's working 🌿</h2>
        <ul className="mt-2 space-y-1.5 text-sm">{wins.map((w) => <li key={w}>• {w}</li>)}</ul>
        {tries.length > 0 && (<>
          <h2 className="mt-4 font-display text-xl font-bold">Easy next steps</h2>
          <ul className="mt-2 space-y-1.5 text-sm">{tries.map((w) => <li key={w}>→ {w}</li>)}</ul>
        </>)}
        <div className="mt-4 rounded-2xl bg-secondary p-3 text-sm">
          <b>A balanced Indian plate idea:</b> 2 rotis + 1 katori dal + 1 katori sabzi + salad + curd ≈ 500 kcal, ~20 g protein, ~12 g fibre.
        </div>
      </div>

      <div className="rounded-3xl bg-card p-5 shadow-soft">
        <button onClick={() => setShowNeeds((v) => !v)} className="flex w-full items-center justify-between font-display text-lg font-bold">
          How does this fit my day? <span>{showNeeds ? "−" : "+"}</span>
        </button>
        {showNeeds && (
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex gap-2">
              {(["f", "m"] as const).map((s) => (
                <button key={s} onClick={() => setP({ ...p, sex: s })} className={`flex-1 rounded-full py-2 ${p.sex === s ? "bg-foreground text-background" : "bg-muted"}`}>{s === "f" ? "Female" : "Male"}</button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([["age", "Age"], ["weight", "Kg"], ["height", "Cm"]] as const).map(([k, l]) => (
                <label key={k} className="text-xs text-muted-foreground">{l}
                  <input type="number" inputMode="numeric" value={p[k]} onChange={(e) => setP({ ...p, [k]: Number(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-base text-foreground" />
                </label>
              ))}
            </div>
            <select value={p.activity} onChange={(e) => setP({ ...p, activity: Number(e.target.value) })} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-base">
              <option value={1.2}>Mostly sitting</option>
              <option value={1.375}>Lightly active</option>
              <option value={1.55}>Moderately active</option>
              <option value={1.725}>Very active</option>
            </select>
            <div className="rounded-2xl bg-secondary p-3">
              Daily estimate: <b>{needs.kcalLow}–{needs.kcalHigh} kcal</b>, about <b>{needs.protein} g protein</b> and <b>{needs.fibre} g fibre</b>.
              This plate gives roughly <b>{Math.round((t.protein / needs.protein) * 100)}%</b> of your protein for the day.
            </div>
            <p className="text-[11px] text-muted-foreground">A general guide (Mifflin-St Jeor, ICMR-NIN 2020). Not medical advice — your needs may differ with health conditions or pregnancy.</p>
          </div>
        )}
      </div>

      <SteerStory />

      <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-soft">
        <h2 className="font-display text-xl font-bold">Your plate is a starting point.</h2>
        <p className="mt-1 text-sm opacity-90">In a free 15-minute call, a Steer expert looks at this plate with you, explains whether tests, diet changes or GLP-1 care fit your goals, and answers your questions.</p>
      </div>

      {/* Consultation Booking Form with Neon Postgres Storage */}
      <ConsultationForm
        interactionId={interactionId}
        plateSummary={plateSummary}
      />

      <div className="rounded-3xl bg-secondary/50 p-6 text-center border border-border shadow-soft">
        <h3 className="font-display text-xl font-bold text-foreground">Want to learn more about Steer Health?</h3>
        <p className="mt-2 text-xs text-muted-foreground">Doctor-led care plans, metabolic health programs, and personalized nutrition.</p>
        <a href={ctaUrl(STEER_URL)} target="_blank" rel="noopener"
          onClick={() => track("Contact", { content_name: "steer_cta", value: roundKcal(t.kcal) })}
          className="mt-4 block rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-soft active:scale-95 transition">
          Visit steer.health ↗
        </a>
      </div>

      <button onClick={onEdit} className="w-full py-2 text-sm font-medium text-muted-foreground underline">Edit my plate</button>
    </section>
  );
}
