import { User } from "@/types/user";

export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
