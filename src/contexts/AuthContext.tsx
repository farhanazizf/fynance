import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth } from "../lib/firebase";
import type { User } from "../types";
import { AuthContext, type AuthContextType } from "./auth-context";
import { demoAuth, isDemoMode } from "../lib/demo-auth";
import { categoryService } from "../lib/firestore";
import { createDefaultCategories } from "../utils/defaultCategories";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize default categories for new users
  const initializeUserCategories = async (familyId: string) => {
    try {
      const existingCategories = await categoryService.getAll(familyId);
      if (existingCategories.length === 0) {
        await createDefaultCategories(familyId);
        console.log("Default categories initialized for family:", familyId);
      }
    } catch (error) {
      console.error("Error initializing categories:", error);
      // Don't throw error, just log it - categories can be created later
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode - check localStorage
      const demoUser = demoAuth.getCurrentUser();
      setUser(demoUser);
      setLoading(false);
    } else {
      // Firebase mode
      const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            const familyId = "family-001"; // In production, this would come from user profile
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || undefined,
              familyId,
            };

            setUser(userData);

            // Initialize default categories if needed (don't await to avoid blocking auth)
            initializeUserCategories(familyId).catch(console.error);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      return unsubscribe;
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      if (isDemoMode) {
        const demoUser = await demoAuth.signIn(email, password);
        setUser(demoUser);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (isDemoMode) {
        await demoAuth.signOut();
        setUser(null);
      } else {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
