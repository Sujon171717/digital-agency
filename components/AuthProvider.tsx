"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase";

const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "jubaer2026@gmail.com").trim().toLowerCase();

function authErrorMessage(err: unknown) {
  const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
  if (code === "auth/configuration-not-found" || code === "auth/operation-not-allowed") {
    return "Firebase Authentication is not enabled yet. Open the Firebase Console, click Get started under Authentication, then enable Email/Password.";
  }
  if (code === "auth/email-already-in-use" || code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Invalid email or password.";
  }
  if (err instanceof Error && err.message) return err.message;
  return "Login failed";
}

function isAdminUser(user: User | null) {
  if (!user?.email) return false;
  return user.email.toLowerCase() === adminEmail;
}

type Ctx = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fb = getFirebaseApp();
    if (!fb) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(fb.auth, (next) => {
      if (next && !isAdminUser(next)) {
        void signOut(fb.auth);
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(next);
      setLoading(false);
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      login: async (email, password) => {
        const fb = getFirebaseApp();
        if (!fb) throw new Error("Firebase is not configured.");
        const normalized = email.trim().toLowerCase();
        if (normalized !== adminEmail) {
          throw new Error("This account is not authorized for admin access.");
        }
        try {
          await signInWithEmailAndPassword(fb.auth, normalized, password);
        } catch (err) {
          const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
          if (code === "auth/configuration-not-found" || code === "auth/operation-not-allowed") {
            throw new Error(authErrorMessage(err));
          }
          try {
            await createUserWithEmailAndPassword(fb.auth, normalized, password);
          } catch (createErr) {
            throw new Error(authErrorMessage(createErr));
          }
        }
      },
      logout: async () => {
        const fb = getFirebaseApp();
        if (!fb) return;
        await signOut(fb.auth);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
