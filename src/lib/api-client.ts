import { saveInteractionServerFn, saveConsultationServerFn } from "./server-actions";
import type { InteractionRecord, ConsultationRecord } from "./db";

export async function submitInteraction(
  data: InteractionRecord
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const res = await saveInteractionServerFn({ data });
    if (res?.success) return res;
  } catch (err) {
    console.warn("serverFn attempt failed, trying REST API fallback...", err);
  }

  // REST API fallback
  try {
    const response = await fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (apiErr: any) {
    console.error("REST fallback also failed:", apiErr);
    return { success: false, error: apiErr?.message || "Failed to save interaction" };
  }
}

export async function submitConsultation(
  data: ConsultationRecord
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const res = await saveConsultationServerFn({ data });
    if (res?.success) return res;
    if (res?.error) return res;
  } catch (err) {
    console.warn("serverFn attempt failed, trying REST API fallback...", err);
  }

  // REST API fallback
  try {
    const response = await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (apiErr: any) {
    console.error("REST fallback also failed:", apiErr);
    return { success: false, error: apiErr?.message || "Failed to save consultation" };
  }
}
