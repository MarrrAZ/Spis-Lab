"use client";

import { useState, useTransition } from "react";
import { createAbdimas, updateAbdimas, deleteAbdimas } from "@/lib/actions/abdimas";
import { Field, inputClass } from "@/components/admin/form-field";

function AbdimasForm({ initial, onDone }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      const action = initial ? updateAbdimas.bind(null, initial.id) : createAbdimas;
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
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-white/10 bg-spis p-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <Field label="Judul Kegiatan">
          <input name="title" defaultValue={initial?.title} required className={inputClass} />
        </Field>
      </div>
      <Field label="Lokasi">
        <input name="location" defaultValue={initial?.location || ""} className={inputClass} />
      </Field>
      <Field label="Tanggal Kegiatan">
        <input name="activity_date" type="date" defaultValue={initial?.activity_date || ""} className={inputClass} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Tautan (dokumentasi, berita, dsb.)">
          <input name="link" defaultValue={initial?.link || ""} className={inputClass} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Deskripsi">
          <textarea name="description" defaultValue={initial?.description || ""} rows={3} className={inputClass} />
        </Field>
      </div>

      {error && <p className="md:col-span-2 text-sm text-maroon">{error}</p>}

      <div className="md:col-span-2 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-maroon px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Saving…" : initial ? "Save Changes" : "New Activity"}
        </button>
        {initial && (
          <button type="button" onClick={onDone} className="px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white/70 hover:text-white">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function AbdimasRow({ item }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) return <AbdimasForm initial={item} onDone={() => setEditing(false)} />;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-spis p-4">
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-white">{item.title}</p>
        <p className="font-mono text-[11px] uppercase tracking-wider text-white/60">
          {item.location || "-"} {item.activity_date ? `· ${item.activity_date}` : ""}
        </p>
      </div>
      <button onClick={() => setEditing(true)} className="font-mono text-xs uppercase tracking-wider text-white/70 hover:text-white">
        Edit
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          if (confirm(`Hapus "${item.title}"?`)) startTransition(() => deleteAbdimas(item.id));
        }}
        className="font-mono text-xs uppercase tracking-wider text-maroon hover:opacity-80 disabled:opacity-60"
      >
        Delete
      </button>
    </div>
  );
}

export function AbdimasManager({ initialItems }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-4">
      {showForm ? (
        <AbdimasForm onDone={() => setShowForm(false)} />
      ) : (
        <button onClick={() => setShowForm(true)} className="border border-maroon px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-maroon hover:bg-maroon hover:text-white">
          + New Activity
        </button>
      )}
      <div className="space-y-3 pt-2">
        {initialItems.length === 0 && <p className="text-sm text-white/70">Belum ada data.</p>}
        {initialItems.map((item) => (
          <AbdimasRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
