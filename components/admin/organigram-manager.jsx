"use client";

import { useState, useTransition } from "react";
import { createOrgEntry, deleteOrgEntry } from "@/lib/actions/organigram";
import { Field, inputClass } from "@/components/admin/form-field";

export function OrganigramManager({ initialEntries, members }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = e.target;
    startTransition(async () => {
      const res = await createOrgEntry(formData);
      if (res?.error) setError(res.error);
      else {
        setError("");
        form.reset();
      }
    });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="grid gap-4 border border-line bg-white p-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Field label="Pilih Orang">
            <select name="member_id" required className={inputClass} defaultValue="">
              <option value="" disabled>
                — pilih dari daftar Tim —
              </option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category})
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Jabatan dalam Struktur">
          <input name="position_label" placeholder="Kepala Laboratorium" required className={inputClass} />
        </Field>
        <Field label="Tingkat (1 = paling atas)">
          <input name="level" type="number" min="1" defaultValue="1" className={inputClass} />
        </Field>
        <div className="md:col-span-4">
          {error && <p className="mb-3 text-sm text-maroon">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="bg-maroon px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:bg-maroon-dark disabled:opacity-60"
          >
            {isPending ? "Menyimpan…" : "Tambah ke Struktur"}
          </button>
        </div>
        {members.length === 0 && (
          <p className="md:col-span-4 text-sm text-slate-light">
            Tambahkan dosen/asisten di menu <strong>Dosen &amp; Asisten</strong> terlebih dahulu
            sebelum menyusun organigram.
          </p>
        )}
      </form>

      <div className="space-y-3">
        {initialEntries.length === 0 && (
          <p className="text-sm text-slate-light">Struktur organisasi belum disusun.</p>
        )}
        {initialEntries.map((entry) => (
          <EntryRow key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function EntryRow({ entry }) {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-4 border border-line bg-white p-4">
      <span className="w-20 shrink-0 font-mono text-xs text-slate-light">
        Tingkat {entry.level}
      </span>
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-ink">
          {entry.members?.name ?? "—"}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-wider text-slate-light">
          {entry.position_label}
        </p>
      </div>
      <button
        disabled={isPending}
        onClick={() => {
          if (confirm("Hapus dari struktur organigram?")) {
            startTransition(() => deleteOrgEntry(entry.id));
          }
        }}
        className="font-mono text-xs uppercase tracking-wider text-maroon hover:text-maroon-dark disabled:opacity-60"
      >
        Hapus
      </button>
    </div>
  );
}
