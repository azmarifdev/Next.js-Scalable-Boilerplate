"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { authService } from "@/modules/auth/services/auth.service";
import { useToast } from "@/providers/ToastProvider";
import { AppDispatch } from "@/store";
import { RootState } from "@/store";
import { clearAuthUser } from "@/store/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      dispatch(clearAuthUser());
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      notify("success", "You have been logged out");
    },
    onError: (error) => {
      notify("error", error instanceof Error ? error.message : "Logout failed");
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated,
    logout: async () => logoutMutation.mutateAsync(),
    isLoggingOut: logoutMutation.isPending
  };
}
