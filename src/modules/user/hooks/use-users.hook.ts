"use client";

import { useQuery } from "@tanstack/react-query";

import { userService } from "@/modules/user/services/user.service";

export function useUsers() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: userService.listUsers
  });

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError
  };
}
