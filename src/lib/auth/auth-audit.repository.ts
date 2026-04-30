import { and, desc, eq, gte, sql } from "drizzle-orm";

import { getDrizzleClient } from "@/lib/db/providers/drizzle";
import { authAuditLogs } from "@/lib/db/schema";
import { logger } from "@/lib/observability/logger";

export type AuthAuditEvent =
  | "login"
  | "register"
  | "logout"
  | "refresh"
  | "login_failed"
  | "register_failed";

export type AuthAuditStatus = "success" | "failure";

export interface AuthAuditInput {
  event: AuthAuditEvent;
  status: AuthAuditStatus;
  email?: string | null;
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  isSuspicious?: boolean;
  riskScore?: number;
  reason?: string | null;
  metadata?: Record<string, unknown>;
}

export interface AuthRiskAssessment {
  isSuspicious: boolean;
  riskScore: number;
  reasons: string[];
}

const RECENT_FAILURE_WINDOW_MS = 10 * 60 * 1000;
const NEW_DEVICE_WINDOW_MS = 24 * 60 * 60 * 1000;

function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) {
    return null;
  }

  return email.toLowerCase();
}

function normalizeIp(ipAddress: string | null | undefined): string | null {
  if (!ipAddress) {
    return null;
  }

  if (ipAddress.includes(",")) {
    return ipAddress.split(",")[0]?.trim() ?? null;
  }

  return ipAddress.trim();
}

export async function writeAuthAuditLog(input: AuthAuditInput): Promise<void> {
  const db = getDrizzleClient();
  if (!db) {
    return;
  }

  try {
    await db.insert(authAuditLogs).values({
      id: `aal_${crypto.randomUUID()}`,
      event: input.event,
      status: input.status,
      email: normalizeEmail(input.email),
      userId: input.userId ?? null,
      ipAddress: normalizeIp(input.ipAddress),
      userAgent: input.userAgent ?? null,
      isSuspicious: input.isSuspicious ?? false,
      riskScore: input.riskScore ?? 0,
      reason: input.reason ?? null,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null
    });
  } catch (error) {
    logger.warn("auth:audit:write_failed", {
      event: input.event,
      status: input.status,
      error: error instanceof Error ? error.message : "Unknown audit write error"
    });
  }
}

async function countRecentFailuresByEmail(email: string): Promise<number> {
  const db = getDrizzleClient();
  if (!db) {
    return 0;
  }

  const since = new Date(Date.now() - RECENT_FAILURE_WINDOW_MS);
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(authAuditLogs)
    .where(
      and(
        eq(authAuditLogs.event, "login_failed"),
        eq(authAuditLogs.status, "failure"),
        eq(authAuditLogs.email, email),
        gte(authAuditLogs.createdAt, since)
      )
    );

  return result?.count ?? 0;
}

async function getRecentSuccessfulLoginByEmail(email: string): Promise<{
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
} | null> {
  const db = getDrizzleClient();
  if (!db) {
    return null;
  }

  const since = new Date(Date.now() - NEW_DEVICE_WINDOW_MS);
  const [latest] = await db
    .select({
      ipAddress: authAuditLogs.ipAddress,
      userAgent: authAuditLogs.userAgent,
      createdAt: authAuditLogs.createdAt
    })
    .from(authAuditLogs)
    .where(
      and(
        eq(authAuditLogs.event, "login"),
        eq(authAuditLogs.status, "success"),
        eq(authAuditLogs.email, email),
        gte(authAuditLogs.createdAt, since)
      )
    )
    .orderBy(desc(authAuditLogs.createdAt))
    .limit(1);

  return latest ?? null;
}

export async function assessLoginRisk(input: {
  email: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<AuthRiskAssessment> {
  const email = normalizeEmail(input.email);
  if (!email) {
    return { isSuspicious: false, riskScore: 0, reasons: [] };
  }

  const ipAddress = normalizeIp(input.ipAddress);
  const userAgent = input.userAgent ?? null;

  let riskScore = 0;
  const reasons: string[] = [];

  try {
    const recentFailures = await countRecentFailuresByEmail(email);
    if (recentFailures >= 3) {
      riskScore += 55;
      reasons.push("multiple_recent_failures");
    }

    const lastSuccess = await getRecentSuccessfulLoginByEmail(email);
    if (lastSuccess) {
      const newIp = Boolean(
        ipAddress && lastSuccess.ipAddress && ipAddress !== lastSuccess.ipAddress
      );
      const newUserAgent = Boolean(
        userAgent && lastSuccess.userAgent && userAgent !== lastSuccess.userAgent
      );

      if (newIp) {
        riskScore += 30;
        reasons.push("new_ip_address");
      }

      if (newUserAgent) {
        riskScore += 20;
        reasons.push("new_user_agent");
      }
    }
  } catch (error) {
    logger.warn("auth:risk:assessment_failed", {
      email,
      error: error instanceof Error ? error.message : "Unknown risk assessment error"
    });
    return { isSuspicious: false, riskScore: 0, reasons: [] };
  }

  return {
    isSuspicious: riskScore >= 50,
    riskScore,
    reasons
  };
}
