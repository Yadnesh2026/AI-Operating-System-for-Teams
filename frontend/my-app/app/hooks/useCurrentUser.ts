"use client";

import { useEffect, useState } from "react";
import api from "../lib/axios";

export type CurrentUser = {
  name: string;
  email: string;
  profilePhoto?: string;
};

const STORAGE_KEY = "redsun-user-profile";

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (!window.localStorage.getItem("token")) return;

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore cached user data after client hydration.
        setUser(JSON.parse(saved) as CurrentUser);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    api.get("/profile").then(({ data }) => {
      const profile = data.user as CurrentUser;
      setUser(profile);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }).catch(() => {
      // Keep the cached login profile visible if the profile request is temporarily unavailable.
    });
  }, []);

  return user;
}
