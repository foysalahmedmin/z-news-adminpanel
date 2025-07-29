import api from "@/lib/api";
import type { AuthResponse } from "@/types/response.type";

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
};

export type ForgetPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  password: string;
};

// POST - Sign In
export async function signIn(payload: SignInPayload): Promise<AuthResponse> {
  const response = await api.post("/api/auth/signin", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data as AuthResponse;
}

// POST - Sign Up
export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const response = await api.post("/api/auth/signup", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data as AuthResponse;
}

// POST - Sign Out
export async function signOut(): Promise<AuthResponse> {
  const response = await api.post("/api/auth/signout", null, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data as AuthResponse;
}

// POST - Refresh Token
export async function refreshToken(): Promise<AuthResponse> {
  const response = await api.post("/api/auth/refresh-token", null, {
    withCredentials: true,
  });
  return response.data as AuthResponse;
}

// PATCH - Change Password
export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<AuthResponse> {
  const response = await api.patch("/api/auth/change-password", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data as AuthResponse;
}

// POST - Forget Password
export async function forgetPassword(
  payload: ForgetPasswordPayload,
): Promise<AuthResponse> {
  const response = await api.post("/api/auth/forget-password", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data as AuthResponse;
}

// PATCH - Reset Password
export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<AuthResponse> {
  const response = await api.patch("/api/auth/reset-password", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data as AuthResponse;
}

// POST - Email Verification Source
export async function emailVerificationSource(): Promise<AuthResponse> {
  const response = await api.post("/api/auth/email-verification-source", null, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data as AuthResponse;
}

// POST - Email Verification
export async function emailVerification(): Promise<AuthResponse> {
  const response = await api.post("/api/auth/email-verification", null, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data as AuthResponse;
}
