import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  api,
  findDevelopmentOtp,
  type AuthResponse,
  type OtpChallenge,
} from "@/lib/api";

type AuthContextValue = {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  loginWithPassword: (identifier: string, password: string) => Promise<void>;
  requestLoginOtp: (identifier: string) => Promise<{ challenge: OtpChallenge; developmentOtp: string }>;
  loginWithOtp: (identifier: string, otp: string) => Promise<void>;
  requestForgotPasswordOtp: (identifier: string) => Promise<{ challenge: OtpChallenge; developmentOtp: string }>;
  resetForgottenPassword: (identifier: string, otp: string, newPassword: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const AUTH_KEY = "ybm_auth";
const TOKEN_KEY = "ybm_auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthResponse | null>(null);

  const clearCustomerCache = () => {
    ["cart", "profile", "addresses", "orders"].forEach((key) => {
      queryClient.removeQueries({ queryKey: [key] });
    });
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem(AUTH_KEY);
        window.localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => {
      clearCustomerCache();
      setUser(null);
    };
    window.addEventListener("ybm-auth-expired", handleExpiredSession);
    return () => window.removeEventListener("ybm-auth-expired", handleExpiredSession);
  }, []);

  const persistAuth = (auth: AuthResponse) => {
    if (user?.personId !== auth.personId) clearCustomerCache();
    window.localStorage.setItem(TOKEN_KEY, auth.token);
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    setUser(auth);
  };

  const loginWithPassword = async (identifier: string, password: string) => {
    persistAuth(await api.passwordLogin(identifier, password));
  };

  const requestLoginOtp = async (identifier: string) => {
    const challenge = await api.requestOtp(identifier, "LOGIN");
    return { challenge, developmentOtp: findDevelopmentOtp(challenge) };
  };

  const loginWithOtp = async (identifier: string, otp: string) => {
    persistAuth(await api.otpLogin(identifier, otp));
  };

  const requestForgotPasswordOtp = async (identifier: string) => {
    const challenge = await api.requestOtp(identifier, "FORGOT_PASSWORD");
    return { challenge, developmentOtp: findDevelopmentOtp(challenge) };
  };

  const resetForgottenPassword = async (
    identifier: string,
    otp: string,
    newPassword: string,
  ) => {
    await api.resetForgotPassword(identifier, otp, newPassword);
  };

  const logout = () => {
    clearCustomerCache();
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    loginWithPassword,
    requestLoginOtp,
    loginWithOtp,
    requestForgotPasswordOtp,
    resetForgottenPassword,
    logout,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
