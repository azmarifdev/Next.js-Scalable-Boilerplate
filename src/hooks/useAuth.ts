"use client";

import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { authService } from "@/services/auth.service";
import { RootState } from "@/store";
import { AppDispatch } from "@/store";
import { clearAuthUser } from "@/store/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  async function logout(): Promise<void> {
    await authService.logout();
    dispatch(clearAuthUser());
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    logout
  };
}
