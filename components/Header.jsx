"use client";

import Link from "next/link";
import { toko } from "@/lib/toko";
import { useKeranjang } from "@/lib/keranjang-context";
import { useFavorit } from "@/lib/favorit-context";
import TombolTema from "@/components/TombolTema";

export default function Header() {
  const { totalItem } = useKeranjang();
  const { totalFavorit } = useFavorit();

  return (
    <header className="sticky top-0 z-40 border-b border-garis bg-latar/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link
            href="/tentang"
            className="text-sm font-semibold text-teks-lembut hover:text-utama transition-colors"
          >
            Tentang
          </Link>

          <Link
            href="/favorit"
            className="relative inline-flex items-center gap-1.5 rounded-xl border border-garis bg-permukaan px-3 py-1.5 text-sm font-semibold text-teks hover:border-utama hover:text-utama transition-colors"
          >
            <span>❤️ Favorit</span>
            {totalFavorit > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bahaya text-xs font-bold text-white">
                {totalFavorit}
              </span>
            )}
          </Link>

          <Link
            href="/keranjang"
            className="relative inline-flex items-center gap-2 rounded-xl border border-garis bg-permukaan px-3.5 py-1.5 text-sm font-semibold text-teks hover:border-utama hover:text-utama transition-colors"
          >
            <span>🛒 Keranjang</span>
            {totalItem > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-utama text-xs font-bold text-white">
                {totalItem}
              </span>
            )}
          </Link>

          <TombolTema />
        </div>
      </div>
    </header>
  );
}
