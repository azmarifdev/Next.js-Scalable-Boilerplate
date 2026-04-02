"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthForm } from "@/modules/auth/hooks/useAuthForm";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations("auth");
  const { form, serverError, onSubmit } = useAuthForm({ mode });
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    formRef.current?.setAttribute("data-hydrated", "true");
  }, []);

  const {
    register,
    formState: { errors, isSubmitting }
  } = form;

  const actionPath =
    mode === "login"
      ? "/api/v1/auth/login?redirect=/dashboard"
      : "/api/v1/auth/register?redirect=/dashboard";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      method="post"
      action={actionPath}
      className="card form-grid auth-card"
      data-hydrated="false"
    >
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
