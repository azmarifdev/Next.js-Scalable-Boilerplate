import "@/styles/globals.css";

import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";

import { validateRuntimeConfig } from "@/lib/config/validate";
import { AppProviders } from "@/providers";
import { THEME_STORAGE_KEY } from "@/providers/theme.provider";

import { rootMetadata } from "../../config/root-metadata";

export const metadata: Metadata = rootMetadata;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bn"
});

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  validateRuntimeConfig();
  const locale = await getLocale();
  const messages = await getMessages();
  const themeCookie = (await cookies()).get(THEME_STORAGE_KEY)?.value;
  const initialTheme = themeCookie === "light" ? "light" : "dark";

  return (
    <html
      lang={locale}
      data-theme={initialTheme}
      style={{ colorScheme: initialTheme }}
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${hindSiliguri.variable}`}
        data-theme={initialTheme}
        style={{ colorScheme: initialTheme }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
