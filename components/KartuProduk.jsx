"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { useFavorit } from "@/lib/favorit-context";

export default function KartuProduk({ produk }) {
  const { isFavorit, toggleFavorit } = useFavorit();
  const terfavorit = isFavorit(produk.id);

  const isHabis =
    produk.stok === 0 ||
    produk.status_stok === "habis" ||
    produk.tersedia === false;

  // Cek harga diskon / coret
  const hargaDiskon =
    produk.harga_diskon && produk.harga_diskon < produk.harga
      ? produk.harga_diskon
      : null;
  const hargaTampil = hargaDiskon || produk.harga;
  const hargaCoret = hargaDiskon ? produk.harga : null;

  // Cek badge (Baru / Terlaris / Promo)
  const badge =
    produk.badge ||
    (produk.terlaris ? "Terlaris" : null) ||
    (produk.is_baru || produk.baru ? "Baru" : null);

  const handleKlikFavorit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorit(produk.id);
  };

  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
    >
      <div className="relative aspect-square w-full bg-permukaan">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className={`h-full w-full object-cover transition-opacity ${
            isHabis ? "opacity-60 grayscale" : ""
          }`}
        />

        {/* Tombol Favorit */}
        <button
          type="button"
          onClick={handleKlikFavorit}
          aria-label={terfavorit ? "Hapus dari favorit" : "Tambah ke favorit"}
          className="absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-latar/80 backdrop-blur-sm text-sm shadow-sm transition-transform hover:scale-110 active:scale-95"
        >
          {terfavorit ? "❤️" : "🤍"}
        </button>

        {/* Badge Habis atau Badge Khusus */}
        {isHabis ? (
          <span className="absolute top-2 right-2 rounded-md bg-bahaya px-2 py-0.5 text-xs font-bold text-white shadow-sm">
            Habis
          </span>
        ) : (
          badge && (
            <span
              className={`absolute top-2 right-2 rounded-md px-2 py-0.5 text-xs font-bold text-white shadow-sm ${
                badge.toLowerCase() === "terlaris"
                  ? "bg-amber-600"
                  : "bg-utama"
              }`}
            >
              {badge}
            </span>
          )
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-xs text-teks-lembut">{produk.kategori}</p>
        <h3 className="font-semibold leading-snug group-hover:text-utama">{produk.nama}</h3>
        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          <p className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
            {formatRupiah(hargaTampil)}
          </p>
          {hargaCoret && (
            <span className="text-xs text-teks-lembut line-through">
              {formatRupiah(hargaCoret)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
