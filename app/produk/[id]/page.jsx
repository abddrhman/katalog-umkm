import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import KartuProduk from "@/components/KartuProduk";
import GaleriProduk from "@/components/GaleriProduk";
import { formatRupiah } from "@/lib/format";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  let produk = null;
  let produkTerkait = [];

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      produk = data;

      // Ambil produk lain dari kategori yang sama (maksimal 3, bukan produk yang sedang dibuka)
      if (produk.kategori) {
        const { data: terkait } = await supabase
          .from("produk")
          .select("*")
          .eq("kategori", produk.kategori)
          .neq("id", id)
          .limit(3);

        produkTerkait = terkait || [];
      }
    }
  } catch {
    // Biarkan produk tetap null jika terjadi error koneksi
  }

  if (!produk) {
    notFound();
  }

  const isHabis =
    produk.stok === 0 ||
    produk.status_stok === "habis" ||
    produk.tersedia === false;

  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
      <article className="grid gap-8 md:grid-cols-2">
        <div className="relative">
          <GaleriProduk
            fotoUtama={produk.foto_url}
            fotoTambahan={produk.foto_tambahan || produk.galeri}
            nama={produk.nama}
          />
          {isHabis && (
            <span className="absolute top-3 right-3 z-10 rounded-lg bg-bahaya px-3 py-1 text-sm font-bold text-white shadow-md">
              Habis
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            Kembali ke katalog
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-sm text-teks-lembut">{produk.kategori}</p>
            {isHabis && (
              <span className="rounded-md bg-bahaya/10 px-2 py-0.5 text-xs font-bold text-bahaya">
                Stok Habis
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            {produk.nama}
          </h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {produk.deskripsi}
          </p>

          {isHabis ? (
            <div className="rounded-xl border border-garis bg-permukaan p-4 text-center">
              <p className="font-semibold text-bahaya">Produk Sedang Habis</p>
              <p className="mt-1 text-xs text-teks-lembut">
                Maaf, produk ini saat ini tidak dapat dipesan karena stok sedang kosong.
              </p>
            </div>
          ) : (
            <TombolWhatsApp produk={produk} />
          )}
        </div>
      </article>

      {/* Bagian Produk Terkait */}
      {produkTerkait.length > 0 && (
        <section aria-labelledby="judul-produk-terkait" className="flex flex-col gap-5 border-t border-garis pt-8">
          <h2 id="judul-produk-terkait" className="text-xl font-bold">
            Produk terkait
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
