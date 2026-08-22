"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { WaveformBars } from "@/components/waveform";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-signal py-3 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:bg-white disabled:opacity-60"
    >
      {pending ? "Memproses…" : "Masuk"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, {});

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-paper">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <WaveformBars className="mx-auto h-10 w-24" />
          <h1 className="mt-6 font-display text-xl font-semibold">
            Login Asisten
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-slate-light">
            SPIS Lab · Panel Pengelola
          </p>
        </div>

        <form action={formAction} className="space-y-4 border border-line-dark bg-ink-2 p-8">
          <div>
            <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-slate-light">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 w-full border border-line-dark bg-transparent px-3 py-2.5 text-sm text-paper outline-none focus:border-signal"
              placeholder="nama@student.telkomuniversity.ac.id"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-slate-light">
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 w-full border border-line-dark bg-transparent px-3 py-2.5 text-sm text-paper outline-none focus:border-signal"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="border border-maroon bg-maroon/10 px-3 py-2 text-sm text-maroon">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <Link
          href="/"
          className="mt-6 block text-center font-mono text-xs uppercase tracking-wider text-slate-light hover:text-signal"
        >
          ← Kembali ke website
        </Link>
      </div>
    </main>
  );
}
