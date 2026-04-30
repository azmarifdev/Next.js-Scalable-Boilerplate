"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  type LoginFormValues,
  loginSchema,
  type RegisterFormValues,
  registerSchema
} from "@/modules/auth/auth.schema";
import type { AuthPayload } from "@/modules/auth/auth.types";
import { authService } from "@/modules/auth/services/auth.service";
import { useToast } from "@/providers/toast.provider";

interface UseAuthFormOptions {
  mode: "login" | "register";
}

function getCustomAuthConfigError(): string | null {
  const authProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER;
  const customAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_CUSTOM_AUTH === "true";
  const customAuthBaseUrl = process.env.NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL?.trim();

  if (authProvider === "custom-auth" && customAuthEnabled && !customAuthBaseUrl) {
    return "Custom auth is enabled but NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL is missing.";
  }

  return null;
}

export function useAuthForm({ mode }: UseAuthFormOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [serverError, setServerError] = useState<string>("");

  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === "register" ? { name: "" } : {})
    }
  });

  const authMutation = useMutation({
    mutationFn: async (payload: AuthPayload) => {
      return mode === "login" ? authService.login(payload) : authService.register(payload);
    },
    onSuccess: async (response) => {
      queryClient.setQueryData(["auth", "me"], response.user);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      notify(
        "success",
        mode === "login" ? "Signed in successfully" : "Account created successfully"
      );
      router.push(response.user.mfaRequired ? "/dashboard?mfa=required" : "/dashboard");
      router.refresh();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Authentication failed";
      setServerError(message);
      notify("error", message);
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError("");
    const configError = getCustomAuthConfigError();
    if (configError) {
      setServerError(configError);
      notify("error", configError);
      return;
    }
    const payload = values as AuthPayload;
    try {
      await authMutation.mutateAsync(payload);
    } catch {
      // Error is handled in mutation onError; prevent unhandled runtime overlay.
    }
  });

  return {
    form,
    serverError,
    onSubmit,
    isSubmitting: authMutation.isPending
  };
}
