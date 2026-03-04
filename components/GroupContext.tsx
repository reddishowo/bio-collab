"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

export function GroupProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = useState<UserState | null>(null);

  // Saat pertama kali web dibuka, cek apakah ada sesi yang tersimpan di browser
  useEffect(() => {
    const savedSession = localStorage.getItem("biocollab_session");
    if (savedSession) {
      setUserState(JSON.parse(savedSession));
    }
  }, []);

  const loginSession = (userName: string, groupCode: string, groupName: string) => {
    const newState = { userName, groupCode, groupName };
    setUserState(newState);
    localStorage.setItem("biocollab_session", JSON.stringify(newState)); // Simpan ke memori browser
  };

  const logoutSession = () => {
    setUserState(null);
    localStorage.removeItem("biocollab_session"); // Hapus dari memori browser
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