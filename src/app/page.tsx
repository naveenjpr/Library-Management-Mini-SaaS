import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center gap-8 p-10 bg-white dark:bg-black shadow rounded-lg">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Library SaaS Platform
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 text-center">
          Manage seats, members, and bookings for your library.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-2 rounded bg-black text-white hover:bg-zinc-800 transition"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="px-6 py-2 rounded border border-black text-black hover:bg-black hover:text-white transition"
          >
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
