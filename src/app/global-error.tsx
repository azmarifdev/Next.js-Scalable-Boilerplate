"use client";

import { useEffect } from "react";

import { logger } from "@/lib/observability/logger";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("ui:global-error", {
      message: error.message,
      digest: error.digest
    });
  }, [error]);

  return (
    <html>
      <body className="p-8">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground mt-2 text-sm">Please retry or check server logs.</p>
        <button
          className="mt-4 rounded-md border px-3 py-2 text-sm"
          onClick={() => reset()}
          type="button"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
