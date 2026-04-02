import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required for db:seed");
  process.exit(1);
}

const sql = neon(databaseUrl);
const now = new Date().toISOString();

await sql`
  INSERT INTO auth_users (id, name, email, role, password_hash, failed_login_attempts, created_at, updated_at)
  VALUES
    ('u_seed_admin', 'Template Admin', 'admin@example.com', 'admin', 'scrypt$DfixAOmN/HyToJDXVsnsMQ==$0KALoYelUP+hzauO8lv/iA91bmhy/uKfTGetxpSlP3XxklctbE1d9ni1A103qH/cBRItXtPU6Yc1ZsO+moVNTw==', 0, ${now}, ${now}),
    ('u_seed_user', 'Template User', 'user@example.com', 'user', 'scrypt$DfixAOmN/HyToJDXVsnsMQ==$0KALoYelUP+hzauO8lv/iA91bmhy/uKfTGetxpSlP3XxklctbE1d9ni1A103qH/cBRItXtPU6Yc1ZsO+moVNTw==', 0, ${now}, ${now})
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
    ('u_seed_admin', 'Template Admin', 'admin@example.com', 31, ${now}),
    ('u_seed_user', 'Template User', 'user@example.com', 27, ${now})
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    age = EXCLUDED.age;
`;

console.info("Database seeded: admin@example.com and user@example.com");
