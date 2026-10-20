"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { useFavorit } from "@/lib/favorit-context";
import { createClient } from "@supabase/supabase-js";

export default function HalamanFavorit() {
  const { favoritIds } = useFavorit();
  const [daftarProduk, setDaftarProduk] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function muatProdukFavorit() {
      if (favoritIds.length === 0) {
        setDaftarProduk([]);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/favorit?ids=${favoritIds.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          setDaftarProduk(data || []);
        }
      } catch {
        // Fallback
      }
      setIsLoading(false);
    }

    muatProdukFavorit();
  }, [favoritIds]);

  return (
    <div className="flex flex-col gap-6 py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-garis pb-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Produk Favorit</h1>
          <p className="mt-1 text-sm text-teks-lembut">
            Daftar produk yang Anda simpan di browser.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-semibold text-utama underline underline-offset-4"
        >
          ← Kembali ke katalog
        </Link>
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-teks-lembut">Memuat produk favorit...</p>
      ) : favoritIds.length === 0 || daftarProduk.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-garis bg-permukaan p-12 text-center">
          <span className="text-4xl">❤️</span>
          <p className="mt-3 font-semibold text-teks">Belum ada produk favorit</p>
          <p className="mt-1 text-sm text-teks-lembut">
            Tekan ikon hati pada produk yang Anda sukai untuk menyimpannya di sini.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center rounded-lg bg-utama px-5 py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap"
          >
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {daftarProduk.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

