import path from "node:path";

import { copyTemplate, ensureEnvLocal, getProjectRoot, setEnvValue } from "./setup-utils.mjs";

const rootDir = getProjectRoot(import.meta.url);
const envLocalPath = await ensureEnvLocal(rootDir);

await setEnvValue(envLocalPath, "NEXT_PUBLIC_API_MODE", "graphql");
await setEnvValue(envLocalPath, "NEXT_PUBLIC_BACKEND_MODE", "external");
await setEnvValue(envLocalPath, "NEXT_PUBLIC_API_BASE_URL", "http://localhost:4000");

await copyTemplate(
  path.join(rootDir, "docs", "optional", "templates", "graphql.env.example"),
  path.join(rootDir, ".env.optional.graphql.example")
);
await copyTemplate(
  path.join(rootDir, "docs", "optional", "templates", "graphql-query.example.ts"),
  path.join(rootDir, "src", "services", "graphql", "examples", "query.example.ts")
);

console.log("GraphQL optional profile enabled.");
console.log("- Updated .env.local with NEXT_PUBLIC_API_MODE=graphql and external API defaults.");
console.log("- Copied templates: .env.optional.graphql.example and src/services/graphql/examples/query.example.ts");
console.log("- Next: point NEXT_PUBLIC_API_BASE_URL to your GraphQL backend.");
