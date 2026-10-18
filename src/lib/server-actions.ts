import { createServerFn } from "@tanstack/react-start";
import {
  saveInteractionToDb,
  saveConsultationToDb,
  type InteractionRecord,
  type ConsultationRecord,
} from "./db";

export const saveInteractionServerFn = createServerFn({ method: "POST" })
  .validator((data: InteractionRecord) => data)
  .handler(async ({ data }) => {
    try {
      const id = await saveInteractionToDb(data);
      return { success: true, id };
    } catch (error: any) {
      console.error("Error saving interaction to Neon DB:", error);
      return { success: false, error: error?.message || "Failed to save interaction" };
    }
  });

export const saveConsultationServerFn = createServerFn({ method: "POST" })
  .validator((data: ConsultationRecord) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.name || !data.phone) {
        return { success: false, error: "Name and phone number are required" };
      }
      const id = await saveConsultationToDb(data);
      return { success: true, id };
    } catch (error: any) {
      console.error("Error saving consultation to Neon DB:", error);
      return { success: false, error: error?.message || "Failed to save consultation" };
    }
  });
