import { describe, it, expect } from "vitest";
import { totals, dailyNeeds, roundKcal } from "./foods";

describe("plate math", () => {
  it("sums portions", () => {
    const t = totals({ roti: 2, dal: 1 });
    expect(t.kcal).toBe(360);
    expect(t.protein).toBe(15);
  });
  it("rounds calories to 10", () => expect(roundKcal(363)).toBe(360));
  it("protein need is 0.83 g/kg", () =>
    expect(dailyNeeds({ sex: "f", age: 30, weight: 60, height: 160, activity: 1.375 }).protein).toBe(50));
});
