export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  route?: string;
  [key: string]: unknown;
}

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

function emit(level: LogLevel, message: string, context?: LogContext): void {
  const payload: LogPayload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context
  };

  const serialized = JSON.stringify(payload);
  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.info(serialized);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      emit("debug", message, context);
    }
  },
  info(message: string, context?: LogContext) {
    emit("info", message, context);
  },
  warn(message: string, context?: LogContext) {
    emit("warn", message, context);
  },
  error(message: string, context?: LogContext) {
    emit("error", message, context);
  }
};
