import { AuthForm } from "@/modules/auth/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="auth-shell no-scroll-page">
      <AuthForm mode="register" />
    </main>
  );
}
