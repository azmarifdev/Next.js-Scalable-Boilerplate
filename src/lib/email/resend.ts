import * as nodemailer from "nodemailer";
import { Resend } from "resend";

import { env } from "@/lib/config/env";
import { logger } from "@/lib/observability/logger";

let resendClient: Resend | null | undefined;
let nodemailerClient: nodemailer.Transporter | null | undefined;

function getResendClient(): Resend | null {
  if (resendClient !== undefined) {
    return resendClient;
  }

  resendClient = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
  return resendClient;
}

function getNodemailerClient(): nodemailer.Transporter | null {
  if (nodemailerClient !== undefined) {
    return nodemailerClient;
  }

  if (process.env.SMTP_URL) {
    nodemailerClient = nodemailer.createTransport(process.env.SMTP_URL);
  } else {
    nodemailerClient = null;
  }

  return nodemailerClient;
}

export interface TransactionalEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendTransactionalEmail(input: TransactionalEmailInput) {
  const resend = getResendClient();
  const fallback = getNodemailerClient();
  const from = input.from ?? env.EMAIL_FROM;

  if (!resend && !fallback) {
    throw new Error("Email provider is not configured");
  }

  if (!from) {
    throw new Error("From email address is required");
  }

  try {
    if (resend) {
      return await resend.emails.send({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text ?? ""
      });
    }
  } catch (error) {
    logger.warn("email:resend_failed_using_fallback", {
      error: error instanceof Error ? error.message : "Unknown error",
      to: input.to
    });
  }

  if (fallback) {
    return fallback.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text ?? ""
    });
  }

  throw new Error("Both primary and fallback email providers failed");
}
