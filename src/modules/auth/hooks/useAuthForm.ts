"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { authService } from "@/modules/auth/services/auth.service";
import type { AuthPayload } from "@/modules/auth/types";
import {
  type LoginFormValues,
  loginSchema,
  type RegisterFormValues,
  registerSchema
} from "@/modules/auth/validation";
import { useToast } from "@/providers/ToastProvider";
import type { AppDispatch } from "@/store";
import { setAuthUser } from "@/store/slices/authSlice";

interface UseAuthFormOptions {
  mode: "login" | "register";
}

export function useAuthForm({ mode }: UseAuthFormOptions) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
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
      dispatch(setAuthUser(response.user));
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      notify(
        "success",
        mode === "login" ? "Signed in successfully" : "Account created successfully"
      );
      router.push("/dashboard");
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
    const payload = values as AuthPayload;
    await authMutation.mutateAsync(payload);
  });

  return {
    form,
    serverError,
    onSubmit,
    isSubmitting: authMutation.isPending
  };
}
