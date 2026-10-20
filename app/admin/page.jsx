import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createClient } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await createClient();
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {error ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat produk: {error.message}
        </div>
      ) : !daftarProduk || daftarProduk.length === 0 ? (
        <div className="rounded-2xl border border-garis p-8 text-center text-sm text-teks-lembut">
          Belum ada produk. Silakan tambah produk baru.
        </div>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
