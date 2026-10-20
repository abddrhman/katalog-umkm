"use client";

import { createContext, useContext, useEffect, useState } from "react";

const KeranjangContext = createContext();

const STORAGE_KEY = "katalog_umkm_keranjang";

export function KeranjangProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ambil dari localStorage saat mount
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setItems(JSON.parse(data));
      }
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }
    setIsLoaded(true);
  }, []);

  // Simpan ke localStorage setiap ada perubahan
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Abaikan
      }
    }
  }, [items, isLoaded]);

  const tambahItem = (produk, jumlah = 1, varian = "") => {
    const hargaPakai = produk.harga_diskon || produk.harga;
    setItems((prev) => {
      const index = prev.findIndex(
        (i) => i.id === produk.id && i.varian === varian
      );
      if (index > -1) {
        const next = [...prev];
        next[index].jumlah += jumlah;
        return next;
      }
      return [
        ...prev,
        {
          id: produk.id,
          nama: produk.nama,
          harga: hargaPakai,
          foto_url: produk.foto_url,
          jumlah,
          varian,
        },
      ];
    });
  };

  const ubahJumlah = (id, varian, jumlahBaru) => {
    if (jumlahBaru <= 0) {
      hapusItem(id, varian);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.varian === varian
          ? { ...item, jumlah: jumlahBaru }
          : item
      )
    );
  };

  const hapusItem = (id, varian) => {
    setItems((prev) =>
      prev.filter((item) => !(item.id === id && item.varian === varian))
    );
  };

  const kosongkanKeranjang = () => {
    setItems([]);
  };

  const totalItem = items.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalHarga = items.reduce(
    (acc, curr) => acc + curr.harga * curr.jumlah,
    0
  );

  return (
    <KeranjangContext.Provider
      value={{
        items,
        totalItem,
        totalHarga,
        tambahItem,
        ubahJumlah,
        hapusItem,
        kosongkanKeranjang,
      }}
    >
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const context = useContext(KeranjangContext);
  if (!context) {
    throw new Error("useKeranjang must be used within KeranjangProvider");
  }
  return context;
}

