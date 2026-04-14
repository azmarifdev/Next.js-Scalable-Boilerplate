"use client";

import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

import { authService } from "@/modules/auth/services/auth.service";
import { AppDispatch } from "@/store";
import { clearAuthUser, setAuthLoading, setAuthUser } from "@/store/slices/authSlice";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const dispatch = useDispatch<AppDispatch>();
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    retry: false
  });

  useEffect(() => {
    dispatch(setAuthLoading(meQuery.isLoading));

    if (meQuery.data) {
      dispatch(setAuthUser(meQuery.data));
      return;
    }

    if (meQuery.isError) {
      dispatch(clearAuthUser());
    }
  }, [dispatch, meQuery.data, meQuery.isError, meQuery.isLoading]);

  return children;
}
