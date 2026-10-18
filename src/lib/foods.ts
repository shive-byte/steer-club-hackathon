// Approximate values per typical household portion, rounded.
// Based on ICMR-NIN Indian Food Composition Tables (IFCT 2017) for cooked/edible portions.
export type Nutrients = { kcal: number; protein: number; carbs: number; fat: number; fibre: number };
export type Food = { id: string; name: string; group: string; portion: string; emoji: string; n: Nutrients };

export const GROUPS = [
  { id: "grain", label: "Rice / Roti", hint: "Your base" },
  { id: "pulse", label: "Dal / Protein", hint: "Plant & lean protein" },
  { id: "veg", label: "Vegetables", hint: "Colour & fibre" },
  { id: "fruit", label: "Fruit", hint: "Natural sweetness" },
  { id: "dairy", label: "Curd", hint: "Gut-friendly" },
  { id: "nuts", label: "Nuts / Seeds", hint: "Good fats" },
] as const;

export const FOODS: Food[] = [
  { id: "rice", name: "Steamed rice", group: "grain", portion: "1 katori (150 g)", emoji: "🍚", n: { kcal: 195, protein: 4, carbs: 43, fat: 0.4, fibre: 0.6 } },
  { id: "brownrice", name: "Brown rice", group: "grain", portion: "1 katori (150 g)", emoji: "🍚", n: { kcal: 180, protein: 4, carbs: 37, fat: 1.4, fibre: 2.7 } },
  { id: "roti", name: "Whole-wheat roti", group: "grain", portion: "1 medium (40 g)", emoji: "🫓", n: { kcal: 110, protein: 3.5, carbs: 20, fat: 1.5, fibre: 3 } },
  { id: "bajra", name: "Bajra / jowar roti", group: "grain", portion: "1 medium (40 g)", emoji: "🫓", n: { kcal: 115, protein: 3.5, carbs: 22, fat: 1.8, fibre: 3.5 } },
  { id: "dal", name: "Toor / moong dal", group: "pulse", portion: "1 katori (150 ml)", emoji: "🥣", n: { kcal: 140, protein: 8, carbs: 20, fat: 3, fibre: 4 } },
  { id: "chana", name: "Chana / chole", group: "pulse", portion: "1 katori (150 g)", emoji: "🫘", n: { kcal: 210, protein: 10, carbs: 30, fat: 5, fibre: 8 } },
  { id: "rajma", name: "Rajma", group: "pulse", portion: "1 katori (150 g)", emoji: "🫘", n: { kcal: 190, protein: 10, carbs: 28, fat: 4, fibre: 7 } },
  { id: "chicken", name: "Chicken curry", group: "pulse", portion: "1 katori (150 g)", emoji: "🍗", n: { kcal: 210, protein: 22, carbs: 4, fat: 11, fibre: 1 } },
  { id: "sabzi", name: "Mixed veg sabzi", group: "veg", portion: "1 katori (150 g)", emoji: "🥦", n: { kcal: 110, protein: 3, carbs: 12, fat: 5, fibre: 4 } },
  { id: "palak", name: "Palak / leafy greens", group: "veg", portion: "1 katori (150 g)", emoji: "🥬", n: { kcal: 90, protein: 4, carbs: 8, fat: 4.5, fibre: 4 } },
  { id: "salad", name: "Kachumber salad", group: "veg", portion: "1 small plate (100 g)", emoji: "🥗", n: { kcal: 25, protein: 1, carbs: 5, fat: 0.2, fibre: 1.8 } },
  { id: "banana", name: "Banana", group: "fruit", portion: "1 medium (100 g)", emoji: "🍌", n: { kcal: 105, protein: 1.2, carbs: 27, fat: 0.3, fibre: 2.5 } },
  { id: "guava", name: "Guava", group: "fruit", portion: "1 medium (100 g)", emoji: "🍐", n: { kcal: 55, protein: 1.5, carbs: 11, fat: 0.5, fibre: 5 } },
  { id: "papaya", name: "Papaya", group: "fruit", portion: "1 bowl (150 g)", emoji: "🧡", n: { kcal: 50, protein: 0.8, carbs: 12, fat: 0.2, fibre: 2.5 } },
  { id: "curd", name: "Curd (dahi)", group: "dairy", portion: "1 katori (100 g)", emoji: "🥛", n: { kcal: 60, protein: 3.5, carbs: 4.5, fat: 3, fibre: 0 } },
  { id: "raita", name: "Cucumber raita", group: "dairy", portion: "1 katori (120 g)", emoji: "🥒", n: { kcal: 70, protein: 3.5, carbs: 6, fat: 3, fibre: 0.5 } },
  { id: "almonds", name: "Almonds", group: "nuts", portion: "8–10 nuts (15 g)", emoji: "🌰", n: { kcal: 90, protein: 3, carbs: 3, fat: 8, fibre: 2 } },
  { id: "peanuts", name: "Roasted peanuts", group: "nuts", portion: "1 small handful (20 g)", emoji: "🥜", n: { kcal: 115, protein: 5, carbs: 4, fat: 9.5, fibre: 1.7 } },
  { id: "flax", name: "Flax / chia seeds", group: "nuts", portion: "1 tbsp (10 g)", emoji: "✨", n: { kcal: 53, protein: 1.8, carbs: 3, fat: 4.2, fibre: 2.7 } },
];

export function totals(sel: Record<string, number>): Nutrients {
  const t = { kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 };
  for (const f of FOODS) {
    const q = sel[f.id] ?? 0;
    (Object.keys(t) as (keyof Nutrients)[]).forEach((k) => (t[k] += f.n[k] * q));
  }
  return t;
}

// Round to avoid false precision
export const roundKcal = (v: number) => Math.round(v / 10) * 10;
export const roundG = (v: number) => Math.round(v);

export type Profile = { sex: "f" | "m"; age: number; weight: number; height: number; activity: number };

// Mifflin-St Jeor BMR x activity; protein per ICMR-NIN 2020 RDA ~0.83 g/kg; fibre ~ 30 g/2000 kcal.
export function dailyNeeds(p: Profile) {
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "m" ? 5 : -161);
  const kcal = bmr * p.activity;
  return {
    kcalLow: Math.round((kcal * 0.9) / 50) * 50,
    kcalHigh: Math.round((kcal * 1.1) / 50) * 50,
    protein: Math.round(p.weight * 0.83),
    fibre: Math.round((kcal / 2000) * 30),
  };
}

export function insights(t: Nutrients, sel: Record<string, number>) {
  const groups = new Set(FOODS.filter((f) => (sel[f.id] ?? 0) > 0).map((f) => f.group));
  const wins: string[] = [];
  const tries: string[] = [];
  const kcal = t.kcal || 1;
  const pPct = (t.protein * 4) / kcal;
  if (groups.size >= 4) wins.push(`Lovely variety — ${groups.size} food groups on one plate.`);
  if (pPct >= 0.15) wins.push("Solid protein share for a meal — great for staying full.");
  if (t.fibre >= 8) wins.push("Good fibre here, which supports steady energy and digestion.");
  if (groups.has("veg")) wins.push("Veggies on the plate — that's colour, minerals and fibre.");
  if (!groups.has("pulse") && pPct < 0.15) tries.push("Add dal, chana, or chicken for an easy protein lift.");
  if (!groups.has("veg")) tries.push("A side of sabzi or kachumber adds fibre with few calories.");
  if (!groups.has("dairy")) tries.push("A small katori of curd brings protein and probiotics.");
  if (t.carbs * 4 > kcal * 0.65) tries.push("Grains lead this plate — try swapping one roti or half the rice for more dal or veg.");
  if (!groups.has("nuts") && !groups.has("fruit")) tries.push("A fruit or a few nuts make a simple snack pairing later.");
  if (wins.length === 0) wins.push("Every plate is a starting point — you've already taken the first step by looking.");
  return { wins: wins.slice(0, 3), tries: tries.slice(0, 3) };
}
