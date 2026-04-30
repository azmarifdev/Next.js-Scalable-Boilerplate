"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveApiEndpoint } from "@/lib/config/runtime";
import { useAuthForm } from "@/modules/auth/hooks/useAuthForm";

interface AuthFormProps {
  mode: "login" | "register";
}

function resolveAuthActionPath(mode: "login" | "register"): string {
  const authProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER;
  const customAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_CUSTOM_AUTH === "true";
  const customAuthBaseUrl = process.env.NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL?.replace(/\/$/, "");

  if (authProvider === "custom-auth" && customAuthEnabled) {
    if (!customAuthBaseUrl) {
      return "#";
    }

    return mode === "login"
      ? `${customAuthBaseUrl}/auth/login`
      : `${customAuthBaseUrl}/auth/register`;
  }

  return mode === "login"
    ? `${resolveApiEndpoint("/auth/login")}?redirect=/dashboard`
    : `${resolveApiEndpoint("/auth/register")}?redirect=/dashboard`;
}

function resolveNoJsConfigError(): string | null {
  const authProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER;
  const customAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_CUSTOM_AUTH === "true";
  const customAuthBaseUrl = process.env.NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL?.trim();

  if (authProvider === "custom-auth" && customAuthEnabled && !customAuthBaseUrl) {
    return "Custom auth configuration missing. Set NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL.";
  }

  return null;
}

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations("auth");
  const { form, serverError, onSubmit, isSubmitting } = useAuthForm({ mode });
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    formRef.current?.setAttribute("data-hydrated", "true");
  }, []);

  const {
    register,
    formState: { errors }
  } = form;

  const actionPath = resolveAuthActionPath(mode);
  const noJsConfigError = resolveNoJsConfigError();

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      method="post"
      action={actionPath}
      className="card form-grid auth-card"
      data-hydrated="false"
    >
      <Link href="/" className="auth-back-home" aria-label="Back to home page">
        Back to Home
      </Link>

      <div>
        <h1 className="card-title">{mode === "login" ? t("loginTitle") : t("registerTitle")}</h1>
        <p className="card-subtitle">
          {mode === "login" ? t("loginSubtitle") : t("registerSubtitle")}
        </p>
      </div>

      {mode === "register" ? (
        <Input
          placeholder={t("fields.fullName")}
          error={"name" in errors ? errors.name?.message : undefined}
          {...register("name")}
        />
      ) : null}

      <Input
        placeholder={t("fields.email")}
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        placeholder={t("fields.password")}
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      {serverError ? <p className="error-text">{serverError}</p> : null}
      {noJsConfigError ? <p className="error-text">{noJsConfigError}</p> : null}

      <Button type="submit" className="full-width" disabled={isSubmitting}>
        {isSubmitting
          ? t("loading")
          : mode === "login"
            ? t("actions.login")
            : t("actions.register")}
      </Button>

      <p className="help-text">
        {mode === "login" ? t("loginSwitchText") : t("registerSwitchText")}{" "}
        <Link href={mode === "login" ? "/register" : "/login"} className="link-inline">
          {mode === "login" ? t("actions.register") : t("actions.login")}
        </Link>
      </p>
    </form>
  );
}
