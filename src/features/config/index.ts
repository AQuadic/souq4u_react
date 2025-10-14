import { create } from "zustand";

export interface Config {
  store_type?: string;
  address?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
}

interface ConfigState {
  config: Config | null;
  setConfig: (config: Config | null) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
}));

export const useConfig = () => {
  const config = useConfigStore((state) => state.config);
  return config;
};
