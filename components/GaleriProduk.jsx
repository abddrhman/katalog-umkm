"use client";

import { useState } from "react";

export default function GaleriProduk({ fotoUtama, fotoTambahan = [], nama }) {
  // Parsing jika fotoTambahan bertipe JSON string atau array, atau gabungan URL foto
  let daftarSemuaFoto = [];

  if (fotoUtama) {
    daftarSemuaFoto.push(fotoUtama);
  }

  if (Array.isArray(fotoTambahan)) {
    fotoTambahan.forEach((f) => {
      if (f && typeof f === "string" && !daftarSemuaFoto.includes(f)) {
        daftarSemuaFoto.push(f);
      }
    });
  } else if (typeof fotoTambahan === "string" && fotoTambahan.trim()) {
    try {
      const parsed = JSON.parse(fotoTambahan);
      if (Array.isArray(parsed)) {
        parsed.forEach((f) => {
          if (f && !daftarSemuaFoto.includes(f)) daftarSemuaFoto.push(f);
        });
      } else {
        // jika dipisah koma atau baris baru
        fotoTambahan
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((f) => {
            if (!daftarSemuaFoto.includes(f)) daftarSemuaFoto.push(f);
          });
      }
    } catch {
      fotoTambahan
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((f) => {
          if (!daftarSemuaFoto.includes(f)) daftarSemuaFoto.push(f);
        });
    }
  }

  // Jika tidak ada foto sama sekali
  if (daftarSemuaFoto.length === 0) {
    daftarSemuaFoto = ["/produk/kopi.svg"];
  }

  const [fotoAktif, setFotoAktif] = useState(daftarSemuaFoto[0]);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-garis bg-permukaan">
        <img
          src={fotoAktif}
          alt={nama}
          className="aspect-square w-full object-cover transition-all duration-200"
        />
      </div>

      {daftarSemuaFoto.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {daftarSemuaFoto.map((foto, index) => {
            const isDipilih = foto === fotoAktif;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setFotoAktif(foto)}
                aria-label={`Lihat foto ${index + 1}`}
                className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                  isDipilih
                    ? "border-utama ring-2 ring-utama/30"
                    : "border-garis opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={foto}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

