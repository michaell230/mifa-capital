import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
          <span className="text-emerald-500">Mifa Capital</span>
          <br /> Manajemen Aset Masa Depan
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">
          Pantau portofolio, arus kas, dan simpan data finansial sensitif Anda secara terpusat, aman, dan efisien.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/auth/login"
            className="rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
          >
            Mulai Sekarang
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-zinc-800 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            Buat Akun
          </Link>
        </div>
      </div>
    </div>
  );
}
