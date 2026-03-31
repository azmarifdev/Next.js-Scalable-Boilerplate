"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { AuthPayload } from "@/modules/auth/types";
import {
  LoginFormValues,
  loginSchema,
  RegisterFormValues,
  registerSchema
} from "@/modules/auth/validation";
import { authService } from "@/services/auth.service";
import { AppDispatch } from "@/store";
import { setAuthUser } from "@/store/slices/authSlice";

interface UseAuthFormOptions {
  mode: "login" | "register";
}

export function useAuthForm({ mode }: UseAuthFormOptions) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [serverError, setServerError] = useState<string>("");

  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === "register" ? { name: "" } : {})
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError("");
    try {
      const payload = values as AuthPayload;
      const response =
        mode === "login" ? await authService.login(payload) : await authService.register(payload);
      dispatch(setAuthUser(response.user));
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed";
      setServerError(message);
    }
  });

  return {
    form,
    serverError,
    onSubmit
  };
}
