"use client";

import { useState, useTransition } from "react";
import { createAccount, deleteAccount } from "@/lib/actions/accounts";
import { Field, inputClass } from "@/components/admin/form-field";

export function AkunManager({ initialAccounts, currentUserId }) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = e.target;
    startTransition(async () => {
      const res = await createAccount(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setError("");
        form.reset();
        setShowForm(false);
      }
    });
  }

  return (
    <div className="space-y-6">
      {showForm ? (
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-white/10 bg-spis p-6 md:grid-cols-2">
          <Field label="Nama Lengkap">
            <input name="full_name" required className={inputClass} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required className={inputClass} />
          </Field>
          <Field label="Password Awal">
            <input name="password" type="password" minLength={6} required className={inputClass} />
          </Field>
          {error && <p className="md:col-span-2 text-sm text-maroon">{error}</p>}
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="bg-maroon px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? "Creating…" : "Create Account"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white/70 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="border border-maroon px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-maroon hover:bg-maroon hover:text-white"
        >
          + New Account
        </button>
      )}

      <div className="space-y-3">
        {initialAccounts.map((acc) => (
          <AccountRow key={acc.id} account={acc} isSelf={acc.id === currentUserId} />
        ))}
      </div>
    </div>
  );
}

function AccountRow({ account, isSelf }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-spis p-4">
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-white">
          {account.full_name} {isSelf && <span className="text-white/60">(Anda)</span>}
        </p>
        <p className="font-mono text-[11px] text-white/60">{account.email}</p>
      </div>
      <button
        disabled={isPending || isSelf}
        title={isSelf ? "Tidak bisa menghapus akun sendiri" : "Hapus akun"}
        onClick={() => {
          if (confirm(`Hapus akun ${account.full_name}? Tindakan ini tidak bisa dibatalkan.`)) {
            startTransition(() => deleteAccount(account.id));
          }
        }}
        className="font-mono text-xs uppercase tracking-wider text-maroon hover:opacity-80 disabled:opacity-30"
      >
        Delete
      </button>
    </div>
  );
}
