import { neon } from "@neondatabase/serverless";

export function getDbUrl(): string {
  const url = typeof process !== "undefined" ? process.env?.["DATABASE_URL"] : undefined;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is missing. Please set it in your .env file.");
  }
  return url;
}

export const getSql = () => neon(getDbUrl());

export interface InteractionRecord {
  id?: string;
  selected_items: Record<string, number>;
  total_kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  item_count: number;
  insights?: {
    wins?: string[];
    tries?: string[];
  };
  profile?: {
    sex?: string;
    age?: number;
    weight?: number;
    height?: number;
    activity?: number;
  } | null;
  created_at?: string;
}

export interface ConsultationRecord {
  id?: string;
  interaction_id?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  health_goal?: string | null;
  preferred_time?: string | null;
  notes?: string | null;
  plate_summary?: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fibre: number;
    items?: string[];
  } | null;
  created_at?: string;
}

export async function saveInteractionToDb(data: InteractionRecord): Promise<string> {
  const sql = getSql();
  const selectedJson = JSON.stringify(data.selected_items ?? {});
  const insightsJson = JSON.stringify(data.insights ?? {});
  const profileJson = data.profile ? JSON.stringify(data.profile) : null;

  const result = await sql`
    INSERT INTO plate_interactions (
      selected_items,
      total_kcal,
      protein,
      carbs,
      fat,
      fibre,
      item_count,
      insights,
      profile
    ) VALUES (
      ${selectedJson}::jsonb,
      ${data.total_kcal},
      ${data.protein},
      ${data.carbs},
      ${data.fat},
      ${data.fibre},
      ${data.item_count},
      ${insightsJson}::jsonb,
      ${profileJson}::jsonb
    )
    RETURNING id
  `;

  return (result[0] as { id: string }).id;
}

export async function saveConsultationToDb(data: ConsultationRecord): Promise<string> {
  const sql = getSql();
  const summaryJson = data.plate_summary ? JSON.stringify(data.plate_summary) : null;
  const interactionId = data.interaction_id || null;

  const result = await sql`
    INSERT INTO consultations (
      interaction_id,
      name,
      phone,
      email,
      health_goal,
      preferred_time,
      notes,
      plate_summary
    ) VALUES (
      ${interactionId},
      ${data.name.trim()},
      ${data.phone.trim()},
      ${data.email?.trim() || null},
      ${data.health_goal?.trim() || null},
      ${data.preferred_time?.trim() || null},
      ${data.notes?.trim() || null},
      ${summaryJson}::jsonb
    )
    RETURNING id
  `;

  return (result[0] as { id: string }).id;
}

export async function getLatestInteractions(limit = 10): Promise<InteractionRecord[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, selected_items, total_kcal, protein, carbs, fat, fibre, item_count, insights, profile, created_at
    FROM plate_interactions
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows as unknown as InteractionRecord[];
}

export async function getLatestConsultations(limit = 10): Promise<ConsultationRecord[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, interaction_id, name, phone, email, health_goal, preferred_time, notes, plate_summary, created_at
    FROM consultations
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows as unknown as ConsultationRecord[];
}
