"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/auth";

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.toString(),
    password: password.toString(),
  });

  if (error) {
    return { error: error.message || "Email atau password salah." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePasswordAction(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak cocok." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login untuk mengganti password." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru.toString(),
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { success: "Password berhasil diperbarui." };
}

export async function createProductAction(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login untuk menambah produk." };
  }

  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga");
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka valid dan tidak boleh negatif." };
  }

  const { error } = await supabase.from("produk").insert([
    {
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    },
  ]);

  if (error) {
    return { error: error.message || "Gagal menyimpan produk ke database." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProductAction(id, prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login untuk mengubah produk." };
  }

  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga");
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka valid dan tidak boleh negatif." };
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message || "Gagal mengubah produk di database." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}

export async function deleteProductAction(id) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Anda harus login untuk menghapus produk.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error(error.message || "Gagal menghapus produk dari database.");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
}

export async function generateProductDescriptionAction({ nama, kategori }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login untuk menggunakan fitur ini." };
  }

  if (!nama) {
    return { error: "Nama produk wajib diisi terlebih dahulu untuk membuat deskripsi." };
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      error:
        "GEMINI_API_KEY belum diatur di environment variable server (.env.local).",
    };
  }

  const prompt = `Buatlah deskripsi produk yang menarik, singkat, dan menjual dalam 2-3 kalimat berbahasa Indonesia untuk produk UMKM berikut:\nNama Produk: ${nama}\nKategori: ${kategori || "-"}\nDeskripsi:`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        error:
          data.error?.message || "Gagal membuat deskripsi dengan Gemini API.",
      };
    }

    const deskripsi =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!deskripsi) {
      return { error: "AI tidak mengembalikan teks deskripsi." };
    }

    return { success: true, deskripsi };
  } catch (err) {
    return {
      error: err.message || "Terjadi kesalahan saat memanggil Gemini API.",
    };
  }
}


