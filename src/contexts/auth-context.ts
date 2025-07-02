import { createContext } from "react";
import type { User } from "../types";
import type { User as FirebaseUser } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  needsFamilySetup: boolean;
  setupFamily: (familyId: string) => Promise<void>;
  firebaseUser: FirebaseUser | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
