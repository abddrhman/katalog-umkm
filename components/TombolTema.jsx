"use client";

import { useEffect, useState } from "react";

export default function TombolTema() {
  const [tema, setTema] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Cek localStorage atau prefers-color-scheme
    const temaTersimpan = localStorage.getItem("tema_katalog");
    if (temaTersimpan === "dark" || (!temaTersimpan && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTema("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTema("light");
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  const gantiTema = () => {
    if (tema === "light") {
      setTema("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("tema_katalog", "dark");
    } else {
      setTema("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tema_katalog", "light");
    }
  };

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  return (
    <button
      type="button"
      onClick={gantiTema}
      aria-label={tema === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-garis bg-permukaan text-base text-teks hover:border-utama hover:text-utama transition-colors"
    >
      {tema === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

