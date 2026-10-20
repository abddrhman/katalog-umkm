"use client";

import { useActionState, useState, useTransition } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { generateProductDescriptionAction } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [state, formAction, isPending] = useActionState(action, null);

  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");

  const [isAiLoading, startAiTransition] = useTransition();
  const [aiError, setAiError] = useState("");

  const handleBuatDeskripsiAi = () => {
    setAiError("");
    if (!nama.trim()) {
      setAiError("Isi nama produk terlebih dahulu.");
      return;
    }

    startAiTransition(async () => {
      const res = await generateProductDescriptionAction({
        nama,
        kategori,
      });

      if (res?.error) {
        setAiError(res.error);
      } else if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
      }
    });
  };

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {state?.error && (
        <div className="rounded-xl border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-teks">Deskripsi</label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAi}
            disabled={isAiLoading}
            className="text-xs font-semibold text-utama hover:underline disabled:opacity-50"
          >
            {isAiLoading ? "Sedang membuat deskripsi..." : "✨ Buat dengan AI"}
          </button>
        </div>
        {aiError && (
          <p className="text-xs text-bahaya">{aiError}</p>
        )}
        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
