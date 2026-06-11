import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { keycloak } from "../../features/auth/services/keycloak";

export type AuthContextValue = {
  ready: boolean;
  authenticated: boolean;
  username: string;
  roles: string[];
  token?: string;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AutoAssistKeycloakProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    keycloak
      .init({ onLoad: "check-sso", pkceMethod: "S256", checkLoginIframe: false })
      .then((isAuthenticated) => {
        if (!active) return;
        setAuthenticated(isAuthenticated);
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        setAuthenticated(false);
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const interval = window.setInterval(() => {
      keycloak.updateToken(30).catch(() => keycloak.login());
    }, 20_000);
    return () => window.clearInterval(interval);
  }, [authenticated]);

  const value = useMemo<AuthContextValue>(() => {
    const parsed = keycloak.tokenParsed as
      | { preferred_username?: string; realm_access?: { roles?: string[] } }
      | undefined;
    return {
      ready,
      authenticated,
      username: parsed?.preferred_username ?? "utilizator",
      roles: parsed?.realm_access?.roles ?? [],
      token: keycloak.token,
      login: () => void keycloak.login({ redirectUri: `${window.location.origin}/dashboard` }),
      logout: () => void keycloak.logout({ redirectUri: window.location.origin }),
    };
  }, [ready, authenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

