import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const kategoriAktif = resolvedSearchParams?.kategori || "";
  const queryCari = resolvedSearchParams?.q || "";

  let daftarProduk = [];
  let semuaKategori = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();

    // Ambil daftar kategori unik untuk tombol filter
    const { data: produkKategori } = await supabase
      .from("produk")
      .select("kategori");
    
    if (produkKategori) {
      semuaKategori = [
        ...new Set(produkKategori.map((p) => p.kategori).filter(Boolean)),
      ];
    }

    // Bangun kueri produk
    let query = supabase.from("produk").select("*");

    if (kategoriAktif) {
      query = query.eq("kategori", kategoriAktif);
    }

    if (queryCari) {
      query = query.ilike("nama", `%${queryCari}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      pesanError = error.message || "Gagal memuat produk dari database.";
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat menghubungkan ke database.";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          {/* Form Pencarian */}
          <form method="GET" action="/" className="flex items-center gap-2">
            {kategoriAktif && (
              <input type="hidden" name="kategori" value={kategoriAktif} />
            )}
            <input
              type="search"
              name="q"
              defaultValue={queryCari}
              placeholder="Cari produk..."
              className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-sm outline-none focus:border-utama"
            />
            <button
              type="submit"
              className="rounded-lg bg-utama px-3 py-1.5 text-sm font-semibold text-white hover:bg-utama-gelap"
            >
              Cari
            </button>
            {queryCari && (
              <Link
                href={kategoriAktif ? `/?kategori=${encodeURIComponent(kategoriAktif)}` : "/"}
                className="text-xs text-teks-lembut underline hover:text-utama"
              >
                Reset
              </Link>
            )}
          </form>
        </div>

        {/* Filter Kategori */}
        {semuaKategori.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={queryCari ? `/?q=${encodeURIComponent(queryCari)}` : "/"}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                !kategoriAktif
                  ? "bg-utama text-white"
                  : "bg-permukaan text-teks-lembut hover:text-teks"
              }`}
            >
              Semua
            </Link>
            {semuaKategori.map((kat) => (
              <Link
                key={kat}
                href={
                  queryCari
                    ? `/?kategori=${encodeURIComponent(kat)}&q=${encodeURIComponent(queryCari)}`
                    : `/?kategori=${encodeURIComponent(kat)}`
                }
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  kategoriAktif === kat
                    ? "bg-utama text-white"
                    : "bg-permukaan text-teks-lembut hover:text-teks"
                }`}
              >
                {kat}
              </Link>
            ))}
          </div>
        )}

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
            <p className="font-semibold">Gagal memuat daftar produk</p>
            <p className="mt-1">{pesanError}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-12 text-center text-teks-lembut">
            {kategoriAktif || queryCari
              ? "Tidak ada produk yang sesuai dengan filter atau pencarian."
              : "Belum ada produk"}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
