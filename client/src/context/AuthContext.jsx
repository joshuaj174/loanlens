import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../lib/api.js";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const token =
    localStorage.getItem(
      "loanlens_token"
    );

  useEffect(() => {
    const loadCurrentUser =
      async () => {
        const savedToken =
          localStorage.getItem(
            "loanlens_token"
          );

        if (!savedToken) {
          setLoading(false);
          return;
        }

        try {
          const response =
            await api.get(
              "/auth/me",
              {
                headers: {
                  Authorization:
                    `Bearer ${savedToken}`,
                },
              }
            );

          setUser(
            response.data.user
          );
        } catch (error) {
          console.error(
            "Session restore failed:",
            error
          );

          localStorage.removeItem(
            "loanlens_token"
          );

          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    loadCurrentUser();
  }, []);

  const register =
    async ({
      name,
      email,
      password,
    }) => {
      const response =
        await api.post(
          "/auth/register",
          {
            name,
            email,
            password,
          }
        );

      const {
        token:
          receivedToken,
        user:
          registeredUser,
      } = response.data;

      localStorage.setItem(
        "loanlens_token",
        receivedToken
      );

      setUser(
        registeredUser
      );

      return registeredUser;
    };

  const login =
    async ({
      email,
      password,
    }) => {
      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      const {
        token:
          receivedToken,
        user:
          loggedInUser,
      } = response.data;

      localStorage.setItem(
        "loanlens_token",
        receivedToken
      );

      setUser(
        loggedInUser
      );

      return loggedInUser;
    };

  const logout = () => {
    localStorage.removeItem(
      "loanlens_token"
    );

    setUser(null);
  };

  const value = {
    user,
    loading,
    token,
    isAuthenticated:
      Boolean(user),
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}