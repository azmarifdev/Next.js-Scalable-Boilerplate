import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: true
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAuthUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isLoading = false;
    },
    clearAuthUser(state) {
      state.user = null;
      state.isLoading = false;
    }
  }
});

export const { setAuthLoading, setAuthUser, clearAuthUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
