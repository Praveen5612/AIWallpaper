import { createContext, useContext, useState, ReactNode } from "react";
import type { Wallpaper } from "@shared/schema";

interface ModalContextType {
  isOpen: boolean;
  selectedWallpaper: Wallpaper | null;
  openModal: (wallpaper: Wallpaper) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  selectedWallpaper: null,
  openModal: () => {},
  closeModal: () => {},
});

export const useModalContext = () => useContext(ModalContext);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  const openModal = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper);
    setIsOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = ""; // Restore scrolling
  };

  return (
    <ModalContext.Provider value={{ isOpen, selectedWallpaper, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
