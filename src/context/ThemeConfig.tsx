"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ThemeConfig {
  color: string;
  radius: string;
}

interface ThemeConfigContextProps {
  config: ThemeConfig;
  setConfig: (config: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeConfigContextProps | undefined>(
  undefined
);

const getLocalStorageItem = (
  key: string,
  defaultValue: ThemeConfig
): ThemeConfig => {
  if (typeof window !== "undefined" && window.localStorage) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }
  return defaultValue;
};

const setLocalStorageItem = (key: string, value: ThemeConfig): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const applyTheme = (config: ThemeConfig): void => {
  const { color, radius } = config;
  document.body.style.setProperty("--radius", `${radius}rem`);

  const themeClasses = Array.from(document.body.classList).filter((className) =>
    className.startsWith("theme-")
  );
  document.body.classList.remove(...themeClasses);
  document.body.classList.add(color);
};

export const ThemeConfigProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeTheme = async () => {
      const initialConfig = getLocalStorageItem("config", {
        color: "theme-neutral",
        radius: "0.5",
      });
      setConfig(initialConfig);
      setLoading(false);
    };

    initializeTheme();
  }, []);

  useEffect(() => {
    if (config) {
      applyTheme(config);
      setLocalStorageItem("config", config);
    }
  }, [config]);

  if (loading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ config: config!, setConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeConfigContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeConfigProvider");
  }
  return context;
};
