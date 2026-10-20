import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const kategoriAktif = resolvedSearchParams?.kategori || "";
  const queryCari = resolvedSearchParams?.q || "";
  const urutanAktif = resolvedSearchParams?.urutan || "terbaru";

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

    // Terapkan pengurutan di tingkat database (query)
    if (urutanAktif === "termurah") {
      query = query.order("harga", { ascending: true });
    } else if (urutanAktif === "termahal") {
      query = query.order("harga", { ascending: false });
    } else {
      // default: terbaru
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      pesanError = error.message || "Gagal memuat produk dari database.";
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat menghubungkan ke database.";
  }

  const buildUrl = ({ kategori = kategoriAktif, q = queryCari, urutan = urutanAktif } = {}) => {
    const params = new URLSearchParams();
    if (kategori) params.set("kategori", kategori);
    if (q) params.set("q", q);
    if (urutan && urutan !== "terbaru") params.set("urutan", urutan);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

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

          <div className="flex flex-wrap items-center gap-3">
            {/* Pilihan Urutan */}
            <form method="GET" action="/" className="flex items-center gap-1.5 text-sm">
              {kategoriAktif && <input type="hidden" name="kategori" value={kategoriAktif} />}
              {queryCari && <input type="hidden" name="q" value={queryCari} />}
              <label htmlFor="select-urutan" className="text-xs font-semibold text-teks-lembut">
                Urutkan:
              </label>
              <select
                id="select-urutan"
                name="urutan"
                defaultValue={urutanAktif}
                className="rounded-lg border border-garis bg-latar px-2.5 py-1.5 text-sm text-teks outline-none focus:border-utama"
              >
                <option value="terbaru">Terbaru</option>
                <option value="termurah">Termurah</option>
                <option value="termahal">Termahal</option>
              </select>
              <button
                type="submit"
                className="rounded-lg border border-garis bg-latar px-2.5 py-1.5 text-xs font-semibold hover:border-utama hover:text-utama"
              >
                Terapkan
              </button>
            </form>

            {/* Form Pencarian */}
            <form method="GET" action="/" className="flex items-center gap-2">
              {kategoriAktif && <input type="hidden" name="kategori" value={kategoriAktif} />}
              {urutanAktif && urutanAktif !== "terbaru" && (
                <input type="hidden" name="urutan" value={urutanAktif} />
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
              {(queryCari || kategoriAktif || urutanAktif !== "terbaru") && (
                <Link
                  href="/"
                  className="text-xs text-teks-lembut underline hover:text-utama"
                >
                  Reset
                </Link>
              )}
            </form>
          </div>
        </div>

        {/* Filter Kategori */}
        {semuaKategori.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl({ kategori: "" })}
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
                href={buildUrl({ kategori: kat })}
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
