"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { createOrgEntry, deleteOrgEntry } from "@/lib/actions/organigram";
import { Field, inputClass } from "@/components/admin/form-field";

const LEVEL_LABELS = { "1": "Dosen", "2": "Asisten" };

export function OrganigramManager({ initialEntries, members }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const memberIdRef = useRef(null);

  const matchedMember = useMemo(
    () => members.find((m) => m.name.toLowerCase() === nameQuery.trim().toLowerCase()),
    [members, nameQuery]
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!matchedMember) {
      setError("Nama tidak ditemukan di daftar Dosen & Asisten. Pastikan nama diketik persis sama.");
      return;
    }
    const formData = new FormData(e.target);
    formData.set("member_id", matchedMember.id);
    const form = e.target;
    startTransition(async () => {
      const res = await createOrgEntry(formData);
      if (res?.error) setError(res.error);
      else {
        setError("");
        form.reset();
        setNameQuery("");
      }
    });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-white/10 bg-spis p-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Field label="Nama lengkap beserta gelar *jika ada">
            <input
              list="member-options"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Ketik nama, pilih dari saran…"
              required
              className={inputClass}
              autoComplete="off"
            />
            <datalist id="member-options">
              {members.map((m) => (
                <option key={m.id} value={m.name} />
              ))}
            </datalist>
          </Field>
        </div>
        <Field label="Jabatan dalam Struktur">
          <input name="position_label" placeholder="Kepala Laboratorium" required className={inputClass} />
        </Field>
        <Field label="Anda sebagai apa?">
          <select name="level" defaultValue="1" className={inputClass} required>
            <option value="1">Dosen</option>
            <option value="2">Asisten</option>
          </select>
        </Field>
        <div className="md:col-span-4">
          {error && <p className="mb-3 text-sm text-maroon">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="bg-maroon px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Add to Structure"}
          </button>
        </div>
        {members.length === 0 && (
          <p className="md:col-span-4 text-sm text-white/60">
            Tambahkan dosen/asisten di menu <strong>Dosen &amp; Asisten</strong> terlebih dahulu
            sebelum menyusun organigram.
          </p>
        )}
      </form>

      <div className="space-y-3">
        {initialEntries.length === 0 && (
          <p className="text-sm text-white/70">Struktur organisasi belum disusun.</p>
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
    <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-spis p-4">
      <span className="w-20 shrink-0 font-mono text-xs text-white/60">
        {LEVEL_LABELS[String(entry.level)] ?? `Tingkat ${entry.level}`}
      </span>
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-white">
          {entry.members?.name ?? "—"}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-wider text-white/60">
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
        className="font-mono text-xs uppercase tracking-wider text-maroon hover:opacity-80 disabled:opacity-60"
      >
        Delete
      </button>
    </div>
  );
}
