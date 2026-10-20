import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Tentang Kami - ${toko.nama}`,
  description: `Profil dan kontak resmi ${toko.nama}`,
};

export default function HalamanTentang() {
  return (
    <div className="mx-auto max-w-3xl py-10 sm:py-14">
      <div className="flex flex-col gap-8">
        <div>
          <Link
            href="/"
            className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            ← Kembali ke katalog
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl text-teks">
            Tentang {toko.nama}
          </h1>
          <p className="mt-2 text-lg text-teks-lembut">{toko.tagline}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Informasi Lokasi & Jam Operasional */}
          <div className="rounded-2xl border border-garis bg-latar p-6">
            <h2 className="text-base font-bold text-teks">Lokasi & Jam Buka</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-teks-lembut">
              <div>
                <strong className="text-teks block">Alamat Toko:</strong>
                <span>{toko.alamat}</span>
              </div>
              <div>
                <strong className="text-teks block">Jam Operasional:</strong>
                <span>{toko.jamBuka}</span>
              </div>
            </div>
          </div>

          {/* Kontak & Pemesanan */}
          <div className="rounded-2xl border border-garis bg-latar p-6">
            <h2 className="text-base font-bold text-teks">Kontak & Pemesanan</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-teks-lembut">
              <div>
                <strong className="text-teks block">WhatsApp Resmi:</strong>
                <span>+{toko.nomorWhatsApp}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${toko.nomorWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-utama px-4 py-2 text-xs font-semibold text-white hover:bg-utama-gelap transition-colors"
                >
                  Hubungi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Profil Singkat */}
        <div className="rounded-2xl border border-garis bg-permukaan p-6 sm:p-8">
          <h2 className="text-lg font-bold text-teks">Komitmen Kami</h2>
          <p className="mt-3 leading-relaxed text-teks-lembut">
            {toko.nama} hadir untuk memberikan produk terbaik berkualitas tinggi langsung ke tangan pelanggan. Setiap produk dikerjakan dengan cermat oleh perajin dan dapur lokal, dengan dedikasi menjaga cita rasa dan keaslian bahan. Kami melayani pemesanan langsung dengan respon cepat dan ramah melalui WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}

