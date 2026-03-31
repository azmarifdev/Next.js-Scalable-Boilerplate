"use client";

import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

import { authService } from "@/services/auth.service";
import { AppDispatch } from "@/store";
import { clearAuthUser, setAuthLoading, setAuthUser } from "@/store/slices/authSlice";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const run = async (): Promise<void> => {
      dispatch(setAuthLoading(true));
      try {
        const me = await authService.getMe();
        dispatch(setAuthUser(me));
      } catch {
        dispatch(clearAuthUser());
      }
    };

    void run();
  }, [dispatch]);

  return children;
}
