import crypto from "crypto"
import db from "@/lib/db/sqlite"

export type AnalyticsEvent = {
  id: string
  concept: string
  eventType: string
  sessionId?: string | null
  path?: string | null
  createdAt: string
  payload?: Record<string, unknown> | null
}

type InsertInput = {
  concept: string
  eventType: string
  sessionId?: string | null
  path?: string | null
  payload?: Record<string, unknown> | null
}

const insertStmt = db.prepare(`
INSERT INTO analytics_events (
  id,
  concept,
  event_type,
  session_id,
  path,
  created_at,
  payload_json
) VALUES (
  @id,
  @concept,
  @event_type,
  @session_id,
  @path,
  @created_at,
  @payload_json
)
`)

const selectStmt = db.prepare(`
SELECT
  id,
  concept,
  event_type,
  session_id,
  path,
  created_at,
  payload_json
FROM analytics_events
WHERE concept = ?
ORDER BY created_at ASC
`)

export function insertAnalyticsEvent(input: InsertInput): AnalyticsEvent {
  const event: AnalyticsEvent = {
    id: crypto.randomUUID(),
    concept: input.concept,
    eventType: input.eventType,
    sessionId: input.sessionId ?? null,
    path: input.path ?? null,
    createdAt: new Date().toISOString(),
    payload: input.payload ?? null,
  }

  console.log("[eventStore] inserting:", event)

  const result = insertStmt.run({
    id: event.id,
    concept: event.concept,
    event_type: event.eventType,
    session_id: event.sessionId,
    path: event.path,
    created_at: event.createdAt,
    payload_json: event.payload ? JSON.stringify(event.payload) : null,
  })

  console.log("[eventStore] insert result:", result)

  const check = selectStmt.all(event.concept) as any[]
  console.log("[eventStore] rows after insert for concept:", event.concept, check)

  return event
}

export function getEventsByConcept(concept: string): AnalyticsEvent[] {
  const rows = selectStmt.all(concept) as any[]
  console.log("[eventStore] reading concept:", concept, "rows:", rows)

  return rows.map((row) => ({
    id: row.id,
    concept: row.concept,
    eventType: row.event_type,
    sessionId: row.session_id,
    path: row.path,
    createdAt: row.created_at,
    payload: row.payload_json ? JSON.parse(row.payload_json) : null,
  }))
}