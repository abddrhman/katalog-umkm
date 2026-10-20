"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";
import { useKeranjang } from "@/lib/keranjang-context";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [catatan, setCatatan] = useState("");
  const [sudahDitambah, setSudahDitambah] = useState(false);

  const { tambahItem } = useKeranjang();

  const handleKurang = () => {
    if (jumlah > 1) setJumlah((prev) => prev - 1);
  };

  const handleTambah = () => {
    setJumlah((prev) => prev + 1);
  };

  const totalHarga = produk.harga * jumlah;

  let teksPesan = `Halo, saya ingin memesan:\n- Produk: ${produk.nama}\n- Jumlah: ${jumlah}\n- Total: ${formatRupiah(totalHarga)}`;
  if (catatan.trim()) {
    teksPesan += `\n- Catatan: ${catatan.trim()}`;
  }

  const href = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(teksPesan)}`;

  const handleTambahKeranjang = () => {
    tambahItem(produk, jumlah, catatan.trim());
    setSudahDitambah(true);
    setTimeout(() => setSudahDitambah(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-teks">Jumlah pesanan</label>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={handleKurang}
              disabled={jumlah <= 1}
              aria-label="Kurangi jumlah"
              className="flex h-10 w-10 items-center justify-center text-lg font-bold text-teks-lembut hover:text-teks disabled:opacity-30"
            >
              -
            </button>
            <span className="w-10 text-center font-semibold text-teks">{jumlah}</span>
            <button
              type="button"
              onClick={handleTambah}
              aria-label="Tambah jumlah"
              className="flex h-10 w-10 items-center justify-center text-lg font-bold text-teks-lembut hover:text-teks"
            >
              +
            </button>
          </div>
          <span className="text-sm text-teks-lembut">
            Total: <strong className="text-harga">{formatRupiah(totalHarga)}</strong>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="catatan-varian" className="text-sm font-medium text-teks">
          Varian / Catatan (opsional)
        </label>
        <input
          id="catatan-varian"
          type="text"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Contoh: ukuran L, pedas manis, dsb."
          className="max-w-md rounded-lg border border-garis bg-latar px-3 py-2 text-sm outline-none focus:border-utama"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleTambahKeranjang}
          className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-5 py-3 font-semibold text-teks hover:border-utama hover:text-utama sm:w-auto transition-colors"
        >
          {sudahDitambah ? "✓ Masuk Keranjang" : "+ Tambah ke Keranjang"}
        </button>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:flex-none"
        >
          Pesan Langsung
        </a>
      </div>
    </div>
  );
}
