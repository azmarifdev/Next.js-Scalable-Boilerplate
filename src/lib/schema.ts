import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  age: integer("age"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
