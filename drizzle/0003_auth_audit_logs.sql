CREATE TABLE IF NOT EXISTS "auth_audit_logs" (
  "id" text PRIMARY KEY,
  "event" text NOT NULL,
  "status" text NOT NULL,
  "email" text,
  "user_id" text,
  "ip_address" text,
  "user_agent" text,
  "is_suspicious" boolean NOT NULL DEFAULT false,
  "risk_score" integer NOT NULL DEFAULT 0,
  "reason" text,
  "metadata" text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_auth_audit_logs_email_created_at"
ON "auth_audit_logs" ("email", "created_at");

CREATE INDEX IF NOT EXISTS "idx_auth_audit_logs_user_id_created_at"
ON "auth_audit_logs" ("user_id", "created_at");
