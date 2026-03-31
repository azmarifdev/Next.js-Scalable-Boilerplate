"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialLoginButton } from "@/modules/auth/components/SocialLoginButton";
import { useAuthForm } from "@/modules/auth/hooks/useAuthForm";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const { form, serverError, onSubmit } = useAuthForm({ mode });

  const {
    register,
    formState: { errors, isSubmitting }
  } = form;

  return (
    <form onSubmit={onSubmit} className="card form-grid auth-card">
      <div>
        <h1 className="card-title">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="card-subtitle">
          {mode === "login" ? "Log in to continue." : "Start with your new account."}
        </p>
      </div>

      {mode === "register" ? (
        <Input
          placeholder="Full name"
          error={"name" in errors ? errors.name?.message : undefined}
          {...register("name")}
        />
      ) : null}

      <Input
        placeholder="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        placeholder="Password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      {serverError ? <p className="error-text">{serverError}</p> : null}

      <Button type="submit" className="full-width" disabled={isSubmitting}>
        {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}
      </Button>
      <SocialLoginButton />

      <p className="help-text">
        {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/register" : "/login"} className="link-inline">
          {mode === "login" ? "Register" : "Login"}
        </Link>
      </p>
    </form>
  );
}
