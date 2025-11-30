import React, { createContext, useContext, useState, ReactNode } from "react";
import { storage } from "../utils/storage";

interface TtsSettings {
  enabled: boolean;
}

interface TtsContextType {
  settings: TtsSettings;
  updateSettings: (newSettings: Partial<TtsSettings>) => Promise<void>;
}

const TtsContext = createContext<TtsContextType | undefined>(undefined);

const TTS_SETTINGS_KEY = "@tts_settings";

export const TtsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<TtsSettings>({ enabled: false });

  const updateSettings = async (newSettings: Partial<TtsSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    try {
      await storage.setUserInfo({ ...(await storage.getUserInfo()) || {}, ttsSettings: updatedSettings });
    } catch (error) {
      console.error("Error updating TTS settings:", error);
    }
  };

  return <TtsContext.Provider value={{ settings, updateSettings }}>{children}</TtsContext.Provider>;
};

export const useTtsContext = () => {
  const context = useContext(TtsContext);
  if (!context) {
    throw new Error("useTtsContext must be used within TtsProvider");
  }
  return context;
};

