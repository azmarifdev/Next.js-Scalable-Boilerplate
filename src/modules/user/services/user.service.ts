import { UserListItem } from "@/modules/user/types";

const mockUsers: UserListItem[] = [
  { id: "u_1", name: "Sarah Khan", email: "sarah@example.com", role: "admin" },
  { id: "u_2", name: "Alex Reed", email: "alex@example.com", role: "user" }
];

export const userService = {
  async listUsers(): Promise<UserListItem[]> {
    return Promise.resolve(mockUsers);
  }
};
