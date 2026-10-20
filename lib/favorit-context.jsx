"use client";

import { createContext, useContext, useEffect, useState } from "react";

const FavoritContext = createContext();

const FAVORIT_STORAGE_KEY = "katalog_umkm_favorit";

export function FavoritProvider({ children }) {
  const [favoritIds, setFavoritIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem(FAVORIT_STORAGE_KEY);
      if (data) {
        setFavoritIds(JSON.parse(data));
      }
    } catch {
      // Abaikan jika localStorage tidak aktif
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORIT_STORAGE_KEY, JSON.stringify(favoritIds));
      } catch {
        // Abaikan
      }
    }
  }, [favoritIds, isLoaded]);

  const toggleFavorit = (id) => {
    setFavoritIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const isFavorit = (id) => favoritIds.includes(id);

  return (
    <FavoritContext.Provider
      value={{
        favoritIds,
        toggleFavorit,
        isFavorit,
        totalFavorit: favoritIds.length,
      }}
    >
      {children}
    </FavoritContext.Provider>
  );
}

export function useFavorit() {
  const context = useContext(FavoritContext);
  if (!context) {
    throw new Error("useFavorit must be used within FavoritProvider");
  }
  return context;
}

