import { create } from "zustand";

type SettingsStore = {
  isOpen: boolean;
  open: () => void;
  onClose: () => void;
};

export const userSettings = create<SettingsStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
