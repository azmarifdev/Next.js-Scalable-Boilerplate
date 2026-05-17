import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

import { neon } from "@neondatabase/serverless";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return `scrypt$${salt.toString("base64")}$${derivedKey.toString("base64")}`;
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required for db:seed");
  process.exit(1);
}

if (process.env.NODE_ENV === "production" && process.env.ALLOW_DB_SEED !== "true") {
  console.error("Refusing to seed DB in production. Set ALLOW_DB_SEED=true to continue.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const now = new Date().toISOString();

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "password123";
const userEmail = process.env.SEED_USER_EMAIL ?? "user@example.com";
const userPassword = process.env.SEED_USER_PASSWORD ?? adminPassword;

const adminPasswordHash = await hashPassword(adminPassword);
const userPasswordHash = await hashPassword(userPassword);

await sql`
  INSERT INTO auth_users (id, name, email, role, password_hash, failed_login_attempts, created_at, updated_at)
  VALUES
    ('u_seed_admin', 'Template Admin', ${adminEmail}, 'admin', ${adminPasswordHash}, 0, ${now}, ${now}),
    ('u_seed_user', 'Template User', ${userEmail}, 'user', ${userPasswordHash}, 0, ${now}, ${now})
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    password_hash = EXCLUDED.password_hash,
    updated_at = EXCLUDED.updated_at;
`;

await sql`
  INSERT INTO users (id, name, email, age, created_at)
  VALUES
    ('u_seed_admin', 'Template Admin', ${adminEmail}, 31, ${now}),
    ('u_seed_user', 'Template User', ${userEmail}, 27, ${now})
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    age = EXCLUDED.age;
`;

console.info(`Database seeded: ${adminEmail} and ${userEmail}`);
