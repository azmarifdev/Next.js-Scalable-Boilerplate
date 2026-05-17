"use client";

import { AuthForm } from "@/modules/auth/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="auth-shell no-scroll-page">
      <AuthForm mode="login" />
    </main>
  );
}
