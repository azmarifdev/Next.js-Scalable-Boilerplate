import { redirect } from "next/navigation";

import { appConfig } from "@/lib/config/app-config";
import { AuthForm } from "@/modules/auth/components/AuthForm";

export default function RegisterPage() {
  if (appConfig.authProvider === "nextauth") {
    redirect("/login");
  }

  return (
    <main className="auth-shell">
      <AuthForm mode="register" />
    </main>
  );
}
