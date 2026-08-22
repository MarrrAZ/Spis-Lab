"use client";

import { useState, useTransition } from "react";
import {
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "@/lib/actions/achievements";
import { Field, inputClass } from "@/components/admin/form-field";

function AchievementForm({ initial, onDone }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      const action = initial
        ? updateAchievement.bind(null, initial.id)
        : createAchievement;
      const res = await action(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setError("");
        e.target.reset();
        onDone?.();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 border border-line bg-white p-6 md:grid-cols-2">
      <Field label="Jenis">
        <select name="type" defaultValue={initial?.type || "publikasi"} className={inputClass} required>
          <option value="publikasi">Publikasi</option>
          <option value="pendanaan">Pendanaan Riset</option>
        </select>
      </Field>
      <Field label="Tahun">
        <input name="year" type="number" defaultValue={initial?.year || ""} className={inputClass} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Judul">
          <input name="title" defaultValue={initial?.title} required className={inputClass} />
        </Field>
      </div>
      <Field label="Penulis / Tim Peneliti">
        <input name="authors" defaultValue={initial?.authors || ""} className={inputClass} />
      </Field>
      <Field label="Jurnal / Konferensi / Sumber Dana">
        <input name="venue" defaultValue={initial?.venue || ""} className={inputClass} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Tautan (DOI, halaman resmi, dsb.)">
          <input name="link" defaultValue={initial?.link || ""} className={inputClass} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Deskripsi Singkat">
          <textarea name="description" defaultValue={initial?.description || ""} rows={3} className={inputClass} />
        </Field>
      </div>

      {error && <p className="md:col-span-2 text-sm text-maroon">{error}</p>}

      <div className="md:col-span-2 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-maroon px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:bg-maroon-dark disabled:opacity-60"
        >
          {isPending ? "Menyimpan…" : initial ? "Simpan Perubahan" : "Tambah Pencapaian"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onDone}
            className="px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-slate hover:text-ink"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

function AchievementRow({ item }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return <AchievementForm initial={item} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="flex items-center gap-4 border border-line bg-white p-4">
      <span className="w-16 shrink-0 font-mono text-xs text-slate-light">{item.year ?? "—"}</span>
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-ink">{item.title}</p>
        <p className="font-mono text-[11px] uppercase tracking-wider text-slate-light">
          {item.type}
        </p>
      </div>
      <button onClick={() => setEditing(true)} className="font-mono text-xs uppercase tracking-wider text-slate hover:text-ink">
        Ubah
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          if (confirm(`Hapus "${item.title}"?`)) {
            startTransition(() => deleteAchievement(item.id));
          }
        }}
        className="font-mono text-xs uppercase tracking-wider text-maroon hover:text-maroon-dark disabled:opacity-60"
      >
        Hapus
      </button>
    </div>
  );
}

export function PencapaianManager({ initialItems }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      {showForm ? (
        <AchievementForm onDone={() => setShowForm(false)} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="border border-maroon px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-maroon hover:bg-maroon hover:text-white"
        >
          + Tambah Pencapaian
        </button>
      )}

      <div className="space-y-3 pt-2">
        {initialItems.length === 0 && (
          <p className="text-sm text-slate-light">Belum ada data.</p>
        )}
        {initialItems.map((item) => (
          <AchievementRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
