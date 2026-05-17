"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, ReactNode } from "react";

interface UserState {
  userName: string;
  groupCode: string;
  groupName: string;
}

interface GroupContextType {
  userState: UserState | null;
  loginSession: (userName: string, groupCode: string, groupName: string) => void;
  logoutSession: () => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);
const SESSION_KEY = "biocollab_session";
const SESSION_EVENT = "biocollab-session";

function subscribeToSession(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SESSION_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SESSION_EVENT, callback);
  };
}

function getSessionSnapshot() {
  return localStorage.getItem(SESSION_KEY);
}

function getServerSessionSnapshot() {
  return null;
}

export function GroupProvider({ children }: { children: ReactNode }) {
  const sessionSnapshot = useSyncExternalStore(subscribeToSession, getSessionSnapshot, getServerSessionSnapshot);
  const userState = useMemo<UserState | null>(() => {
    if (!sessionSnapshot) return null;

    try {
      return JSON.parse(sessionSnapshot);
    } catch {
      return null;
    }
  }, [sessionSnapshot]);

  const loginSession = (userName: string, groupCode: string, groupName: string) => {
    const newState = { userName, groupCode, groupName };
    localStorage.setItem(SESSION_KEY, JSON.stringify(newState)); // Simpan ke memori browser
    window.dispatchEvent(new Event(SESSION_EVENT));
  };

  const logoutSession = () => {
    localStorage.removeItem(SESSION_KEY); // Hapus dari memori browser
    window.dispatchEvent(new Event(SESSION_EVENT));
  };

  return (
    <GroupContext.Provider value={{ userState, loginSession, logoutSession }}>
      {children}
    </GroupContext.Provider>
  );
}

// Hook kustom agar mudah dipanggil di page mana saja
export const useGroupSession = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroupSession harus digunakan di dalam GroupProvider");
  }
  return context;
};
