"use client";

import Link from "next/link";
import { useKeranjang } from "@/lib/keranjang-context";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export default function HalamanKeranjang() {
  const { items, totalHarga, ubahJumlah, hapusItem, kosongkanKeranjang } = useKeranjang();

  const handlePesanSemuaWhatsApp = () => {
    if (items.length === 0) return;

    let pesan = `Halo ${toko.nama}, saya ingin memesan produk berikut:\n\n`;
    items.forEach((item, index) => {
      pesan += `${index + 1}. ${item.nama} (${item.jumlah}x) - ${formatRupiah(item.harga * item.jumlah)}`;
      if (item.varian) {
        pesan += ` [Catatan: ${item.varian}]`;
      }
      pesan += "\n";
    });

    pesan += `\n*Total Pembayaran: ${formatRupiah(totalHarga)}*`;
    pesan += `\n\nMohon konfirmasi ketersediaan dan cara pembayarannya. Terima kasih!`;

    const url = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-6 py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-garis pb-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Keranjang Belanja</h1>
          <p className="mt-1 text-sm text-teks-lembut">
            Kelola daftar pesanan Anda sebelum dikirim ke WhatsApp toko.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-semibold text-utama underline underline-offset-4"
        >
          ← Lanjut Belanja
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-garis bg-permukaan p-12 text-center">
          <span className="text-4xl">🛒</span>
          <p className="mt-3 font-semibold text-teks">Keranjang belanja Anda masih kosong</p>
          <p className="mt-1 text-sm text-teks-lembut">
            Silakan pilih produk menarik dari katalog kami.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center rounded-lg bg-utama px-5 py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap"
          >
            Lihat Katalog
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Daftar Produk dalam Keranjang */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.varian}`}
                className="flex items-center gap-4 rounded-2xl border border-garis bg-latar p-4"
              >
                <img
                  src={item.foto_url || "/produk/kopi.svg"}
                  alt={item.nama}
                  className="h-20 w-20 rounded-xl bg-permukaan object-cover"
                />
                <div className="flex flex-1 flex-col gap-1">
                  <h2 className="font-semibold text-teks">{item.nama}</h2>
                  {item.varian && (
                    <p className="text-xs text-teks-lembut">Catatan: {item.varian}</p>
                  )}
                  <p className="text-sm font-bold text-harga">
                    {formatRupiah(item.harga)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => hapusItem(item.id, item.varian)}
                    className="text-xs text-bahaya hover:underline"
                  >
                    Hapus
                  </button>

                  <div className="inline-flex items-center rounded-lg border border-garis bg-latar">
                    <button
                      type="button"
                      onClick={() => ubahJumlah(item.id, item.varian, item.jumlah - 1)}
                      className="flex h-8 w-8 items-center justify-center font-bold text-teks-lembut hover:text-teks"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-teks">
                      {item.jumlah}
                    </span>
                    <button
                      type="button"
                      onClick={() => ubahJumlah(item.id, item.varian, item.jumlah + 1)}
                      className="flex h-8 w-8 items-center justify-center font-bold text-teks-lembut hover:text-teks"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={kosongkanKeranjang}
              className="self-start text-xs text-teks-lembut underline hover:text-bahaya"
            >
              Kosongkan seluruh keranjang
            </button>
          </div>

          {/* Ringkasan Belanja */}
          <div className="h-fit rounded-2xl border border-garis bg-permukaan p-6">
            <h2 className="text-lg font-bold text-teks">Ringkasan Pesanan</h2>
            <div className="mt-4 flex flex-col gap-2 border-b border-garis pb-4 text-sm">
              <div className="flex justify-between text-teks-lembut">
                <span>Total Item</span>
                <span>{items.reduce((acc, curr) => acc + curr.jumlah, 0)} pcs</span>
              </div>
              <div className="flex justify-between font-bold text-teks">
                <span>Total Harga</span>
                <span className="text-harga">{formatRupiah(totalHarga)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePesanSemuaWhatsApp}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-utama px-5 py-3.5 font-bold text-white shadow-sm hover:bg-utama-gelap transition-colors"
            >
              Pesan Semua via WhatsApp
            </button>
            <p className="mt-2 text-center text-xs text-teks-lembut">
              Rincian semua produk akan dikirim sekaligus ke nomor WhatsApp toko.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

