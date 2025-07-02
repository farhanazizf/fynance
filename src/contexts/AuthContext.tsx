import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth } from "../lib/firebase";
import type { User, Category } from "../types";
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
  const [needsFamilySetup, setNeedsFamilySetup] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [categoriesInitialized, setCategoriesInitialized] = useState<
    Set<string>
  >(new Set());

  // Initialize default categories for new users (with duplicate prevention)
  const initializeUserCategories = async (familyId: string) => {
    // Prevent duplicate initialization for the same family
    if (categoriesInitialized.has(familyId)) {
      console.log("Categories already initialized for family:", familyId);
      return;
    }

    try {
      const existingCategories = await categoryService.getAll(familyId);

      // Remove duplicates if they exist
      if (existingCategories.length > 0) {
        await removeDuplicateCategories(familyId, existingCategories);
      }

      // Check again after cleanup
      const cleanCategories = await categoryService.getAll(familyId);

      if (cleanCategories.length === 0) {
        await createDefaultCategories(familyId);
        console.log("Default categories initialized for family:", familyId);
      }

      // Mark as initialized
      setCategoriesInitialized((prev) => new Set(prev).add(familyId));
    } catch (error) {
      console.error("Error initializing categories:", error);
      // Don't throw error, just log it - categories can be created later
    }
  };

  // Remove duplicate categories
  const removeDuplicateCategories = async (
    _familyId: string,
    categories: Category[]
  ) => {
    try {
      // Group categories by name and type
      const categoryMap = new Map<string, Category[]>();

      categories.forEach((category) => {
        const key = `${category.name.toLowerCase()}-${category.type}`;
        if (!categoryMap.has(key)) {
          categoryMap.set(key, []);
        }
        categoryMap.get(key)!.push(category);
      });

      // Find duplicates and remove extras
      const deletePromises: Promise<void>[] = [];

      categoryMap.forEach((categoriesWithSameName) => {
        if (categoriesWithSameName.length > 1) {
          // Keep the first one, delete the rest
          const [keep, ...duplicates] = categoriesWithSameName;
          console.log(
            `Found ${duplicates.length} duplicates for category: ${keep.name}`
          );

          duplicates.forEach((duplicate) => {
            deletePromises.push(categoryService.delete(duplicate.id));
          });
        }
      });

      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`Removed ${deletePromises.length} duplicate categories`);
      }
    } catch (error) {
      console.error("Error removing duplicate categories:", error);
    }
  };

  // Set up family for user
  const setupFamily = async (familyId: string) => {
    if (firebaseUser) {
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || undefined,
        familyId,
      };

      // Store family ID in localStorage for persistence
      localStorage.setItem(`familyId_${firebaseUser.uid}`, familyId);

      setUser(userData);
      setNeedsFamilySetup(false);

      // Initialize default categories if needed
      try {
        await initializeUserCategories(familyId);
      } catch (error) {
        console.error("Error initializing categories:", error);
      }
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
        async (user: FirebaseUser | null) => {
          if (user) {
            setFirebaseUser(user);

            // Check if user has a stored family ID
            const storedFamilyId = localStorage.getItem(`familyId_${user.uid}`);

            if (storedFamilyId) {
              // User has a family ID, set up the user data
              const userData = {
                uid: user.uid,
                email: user.email!,
                displayName: user.displayName || undefined,
                familyId: storedFamilyId,
              };

              setUser(userData);
              setNeedsFamilySetup(false);

              // Initialize default categories if needed (don't await to avoid blocking auth)
              initializeUserCategories(storedFamilyId).catch(console.error);
            } else {
              // User needs family setup
              setNeedsFamilySetup(true);
              setUser(null);
            }
          } else {
            setFirebaseUser(null);
            setUser(null);
            setNeedsFamilySetup(false);
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
    needsFamilySetup,
    setupFamily,
    firebaseUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
