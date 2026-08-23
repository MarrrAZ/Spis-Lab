"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { login } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-spis-bright py-3 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-spis-bright disabled:opacity-60"
    >
      {pending ? "Memproses…" : "Masuk"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, {});

  return (
    <main className="flex min-h-screen items-center justify-center bg-spis px-6 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/logo/spis-full-white.png"
            alt="SPIS Lab"
            width={200}
            height={50}
            className="mx-auto h-9 w-auto"
          />
          <h1 className="mt-6 font-display text-xl font-semibold">
            Login Assistant
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-white/50">
            SPIS Lab · Admin Panel
          </p>
        </div>

        <form action={formAction} className="space-y-4 border border-spis-bright bg-spis p-8">
          <div>
            <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-white/50">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 w-full border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none focus:border-spis-bright"
              placeholder="nama@student.telkomuniversity.ac.id"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-white/50">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 w-full border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none focus:border-spis-bright"
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
          className="mt-6 block text-center font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white"
        >
          ← Kembali ke website
        </Link>
      </div>
    </main>
  );
}
