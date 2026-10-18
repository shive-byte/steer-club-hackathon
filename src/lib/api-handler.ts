import {
  saveInteractionToDb,
  saveConsultationToDb,
  getLatestInteractions,
  getLatestConsultations,
} from "./db";

export async function handleApiRequest(req: {
  url: string;
  method: string;
  body?: any;
}): Promise<{ status: number; headers: Record<string, string>; data: any }> {
  try {
    return await route(req);
  } catch (err: any) {
    console.warn("API request failed:", err?.message);
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      data: { success: false, error: "Saving is temporarily unavailable." },
    };
  }
}

async function route(req: { url: string; method: string; body?: any }) {
  const parsed = new URL(req.url, "http://localhost");
  const path = parsed.pathname;

  if (path === "/api/interactions") {
    if (req.method === "POST") {
      const id = await saveInteractionToDb(req.body);
      return {
        status: 201,
        headers: { "Content-Type": "application/json" },
        data: { success: true, id },
      };
    }
    if (req.method === "GET") {
      const items = await getLatestInteractions(20);
      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        data: { success: true, items },
      };
    }
  }

  if (path === "/api/consultations") {
    if (req.method === "POST") {
      if (!req.body?.name || !req.body?.phone) {
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          data: { success: false, error: "Name and phone number are required" },
        };
      }
      const id = await saveConsultationToDb(req.body);
      return {
        status: 201,
        headers: { "Content-Type": "application/json" },
        data: { success: true, id },
      };
    }
    if (req.method === "GET") {
      const items = await getLatestConsultations(20);
      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        data: { success: true, items },
      };
    }
  }

  return {
    status: 404,
    headers: { "Content-Type": "application/json" },
    data: { error: "Not found" },
  };
}
