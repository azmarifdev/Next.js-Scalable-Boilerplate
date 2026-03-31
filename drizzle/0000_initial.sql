CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "age" integer,
  "created_at" timestamp DEFAULT now() NOT NULL
);
