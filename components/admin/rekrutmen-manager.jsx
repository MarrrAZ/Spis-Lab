"use client";

import { useState, useTransition } from "react";
import {
  createRecruitment,
  updateRecruitment,
  deleteRecruitment,
} from "@/lib/actions/recruitment";
import { Field, inputClass } from "@/components/admin/form-field";

function RecruitmentForm({ initial, onDone }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      const action = initial
        ? updateRecruitment.bind(null, initial.id)
        : createRecruitment;
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
      <div className="md:col-span-2">
        <Field label="Judul">
          <input name="title" defaultValue={initial?.title} required className={inputClass} />
        </Field>
      </div>
      <Field label="Batas Pendaftaran">
        <input name="deadline" type="date" defaultValue={initial?.deadline || ""} className={inputClass} />
      </Field>
      <Field label="Status">
        <label className="mt-2.5 flex items-center gap-2 text-sm text-slate">
          <input
            type="checkbox"
            name="is_open"
            defaultChecked={initial ? initial.is_open : true}
            className="h-4 w-4"
          />
          Pendaftaran dibuka
        </label>
      </Field>
      <div className="md:col-span-2">
        <Field label="Tautan Formulir Pendaftaran">
          <input name="link" defaultValue={initial?.link || ""} className={inputClass} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Deskripsi">
          <textarea name="description" defaultValue={initial?.description || ""} rows={3} className={inputClass} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Persyaratan (satu baris untuk satu poin)">
          <textarea name="requirements" defaultValue={initial?.requirements || ""} rows={4} className={inputClass} />
        </Field>
      </div>

      {error && <p className="md:col-span-2 text-sm text-maroon">{error}</p>}

      <div className="md:col-span-2 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-maroon px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:bg-maroon-dark disabled:opacity-60"
        >
          {isPending ? "Menyimpan…" : initial ? "Simpan Perubahan" : "Tambah Info Rekrutmen"}
        </button>
        {initial && (
          <button type="button" onClick={onDone} className="px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-slate hover:text-ink">
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

function RecruitmentRow({ item }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) return <RecruitmentForm initial={item} onDone={() => setEditing(false)} />;

  return (
    <div className="flex items-center gap-4 border border-line bg-white p-4">
      <span
        className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 ${
          item.is_open ? "bg-maroon text-white" : "bg-paper-2 text-slate-light"
        }`}
      >
        {item.is_open ? "Dibuka" : "Ditutup"}
      </span>
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-ink">{item.title}</p>
      </div>
      <button onClick={() => setEditing(true)} className="font-mono text-xs uppercase tracking-wider text-slate hover:text-ink">
        Ubah
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          if (confirm(`Hapus "${item.title}"?`)) startTransition(() => deleteRecruitment(item.id));
        }}
        className="font-mono text-xs uppercase tracking-wider text-maroon hover:text-maroon-dark disabled:opacity-60"
      >
        Hapus
      </button>
    </div>
  );
}

export function RekrutmenManager({ initialItems }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-4">
      {showForm ? (
        <RecruitmentForm onDone={() => setShowForm(false)} />
      ) : (
        <button onClick={() => setShowForm(true)} className="border border-maroon px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-maroon hover:bg-maroon hover:text-white">
          + Tambah Info Rekrutmen
        </button>
      )}
      <div className="space-y-3 pt-2">
        {initialItems.length === 0 && <p className="text-sm text-slate-light">Belum ada data.</p>}
        {initialItems.map((item) => (
          <RecruitmentRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
