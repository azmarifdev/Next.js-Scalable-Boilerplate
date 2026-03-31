import "@/styles/globals.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import enMessages from "@/i18n/messages/en.json";
import { APP_NAME } from "@/lib/constants";
import { AppProviders } from "@/providers";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Production-ready Next.js starter template"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
