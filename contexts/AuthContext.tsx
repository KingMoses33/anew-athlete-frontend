import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type UserRole = "athlete" | "coach";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  sport?: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  socialLogin: (provider: "google" | "facebook" | "apple") => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  login: async () => false,
  signup: async () => false,
  socialLogin: async () => false,
  logout: async () => {},
});

const AUTH_KEY = "@athletes_anew_user";
export const bookingsKey = (userId: string) => `@athletes_anew_bookings_${userId}`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then((val) => {
      if (val) {
        try {
          setUser(JSON.parse(val));
        } catch {
          setUser(null);
        }
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    if (!email.includes("@")) return false;
    const mockUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: "athlete",
      location: "New York, NY",
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    return true;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, _password: string, role: UserRole): Promise<boolean> => {
      if (!email.includes("@") || name.length < 2) return false;
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role,
        location: "",
      };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return true;
    },
    []
  );

  const socialLogin = useCallback(
    async (provider: "google" | "facebook" | "apple"): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 900));
      const mockNames: Record<string, string> = {
        google: "Google User",
        facebook: "Facebook User",
        apple: "Apple User",
      };
      const mockEmails: Record<string, string> = {
        google: "user@gmail.com",
        facebook: "user@facebook.com",
        apple: "user@privaterelay.appleid.com",
      };
      const newUser: User = {
        id: `${provider}_${Date.now()}`,
        name: mockNames[provider],
        email: mockEmails[provider],
        role: "athlete",
        location: "",
      };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return true;
    },
    []
  );

  const logout = useCallback(async () => {
    if (user) {
      await AsyncStorage.removeItem(bookingsKey(user.id));
    }
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, login, signup, socialLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
