"use client";

import { useState } from "react";

export default function TombolBagikan({ produk }) {
  const [pesanUmpanBalik, setPesanUmpanBalik] = useState("");

  const handleBagikan = async () => {
    const url = window.location.href;
    const judul = produk?.nama || "Produk";
    const teks = `Lihat produk ${judul} di katalog kami!`;

    // Coba Web Share API terlebih dahulu (khusus mobile / browser pendukung)
    if (navigator.share) {
      try {
        await navigator.share({
          title: judul,
          text: teks,
          url: url,
        });
        setPesanUmpanBalik("Berhasil dibagikan");
        setTimeout(() => setPesanUmpanBalik(""), 2500);
        return;
      } catch (err) {
        // Jika dibatalkan oleh pengguna (AbortError), jangan lakukan copy clipboard
        if (err.name === "AbortError") return;
      }
    }

    // Fallback ke Clipboard API
    try {
      await navigator.clipboard.writeText(url);
      setPesanUmpanBalik("Link tersalin");
      setTimeout(() => setPesanUmpanBalik(""), 2500);
    } catch {
      // Fallback manual jika clipboard API diblokir
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setPesanUmpanBalik("Link tersalin");
      setTimeout(() => setPesanUmpanBalik(""), 2500);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleBagikan}
        className="inline-flex items-center gap-1.5 rounded-lg border border-garis bg-latar px-3.5 py-2 text-xs font-semibold text-teks hover:border-utama hover:text-utama transition-colors"
      >
        <span>🔗 Bagikan Produk</span>
      </button>

      {pesanUmpanBalik && (
        <span className="text-xs font-semibold text-utama animate-fade-in">
          ✓ {pesanUmpanBalik}
        </span>
      )}
    </div>
  );
}

