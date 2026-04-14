import { API_PREFIX } from "@/lib/config/constants";
import type { AuthPayload, AuthResponse } from "@/modules/auth/auth.types";
import { apiClient } from "@/services/apiClient";
import type { User } from "@/types/user";

export const customAuthProvider = {
  login(payload: AuthPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, AuthPayload>(
      `${API_PREFIX}/auth/login`,
      payload,
      `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          user {
            id
            name
            email
            role
          }
        }
      }
      `,
      {
        email: payload.email,
        password: payload.password
      }
    );
  },

  register(payload: AuthPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, AuthPayload>(
      `${API_PREFIX}/auth/register`,
      payload,
      `
      mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password) {
          user {
            id
            name
            email
            role
          }
        }
      }
      `,
      {
        name: payload.name ?? "",
        email: payload.email,
        password: payload.password
      }
    );
  },

  getMe(): Promise<User> {
    return apiClient.get<User>(
      `${API_PREFIX}/auth/me`,
      `
      query Me {
        me {
          id
          name
          email
          role
        }
      }
      `
    );
  },

  logout(): Promise<{ cleared: boolean }> {
    return apiClient.post<{ cleared: boolean }>(
      `${API_PREFIX}/auth/logout`,
      undefined,
      `
      mutation Logout {
        logout {
          cleared
        }
      }
      `
    );
  },

  refreshToken(): Promise<{ refreshed: boolean }> {
    return apiClient.post<{ refreshed: boolean }>(
      `${API_PREFIX}/auth/refresh`,
      undefined,
      `
      mutation RefreshToken {
        refreshToken {
          refreshed
        }
      }
      `
    );
  }
};
