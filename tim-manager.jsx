"use client";

import { useState, useTransition } from "react";
import { createMember, updateMember, deleteMember } from "@/lib/actions/members";
import { PhotoUpload } from "@/components/photo-upload";
import { Field, inputClass } from "@/components/admin/form-field";

function MemberForm({ initial, onDone }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      const action = initial
        ? updateMember.bind(null, initial.id)
        : createMember;
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
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-spis bg-white p-6 md:grid-cols-2">
      <Field label="Kategori">
        <select name="category" defaultValue={initial?.category || "asisten"} className={inputClass} required>
          <option value="dosen">Dosen</option>
          <option value="asisten">Asisten</option>
        </select>
      </Field>
      <Field label="Nama Lengkap">
        <input name="name" defaultValue={initial?.name} required className={inputClass} />
      </Field>
      <Field label="Jabatan / Peran">
        <input
          name="position"
          defaultValue={initial?.position || ""}
          placeholder="Kepala Laboratorium, Asisten Riset, dsb."
          className={inputClass}
        />
      </Field>
      <Field label="Email">
        <input name="email" type="email" defaultValue={initial?.email || ""} className={inputClass} />
      </Field>
      <Field label="Angkatan (khusus asisten)">
        <input
          name="angkatan"
          defaultValue={initial?.angkatan || ""}
          placeholder="2022"
          className={inputClass}
        />
      </Field>
      <Field label="Jurusan (khusus asisten)">
        <input
          name="jurusan"
          defaultValue={initial?.jurusan || ""}
          placeholder="Teknik Telekomunikasi"
          className={inputClass}
        />
      </Field>
      <Field label="Urutan Tampil (angka kecil = lebih dulu)">
        <input
          name="order_index"
          type="number"
          defaultValue={initial?.order_index ?? 0}
          className={inputClass}
        />
      </Field>
      <div className="md:col-span-2">
        <Field label="Foto">
          <PhotoUpload defaultValue={initial?.photo_url || ""} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Keterangan Singkat">
          <textarea name="bio" defaultValue={initial?.bio || ""} rows={3} className={inputClass} />
        </Field>
      </div>

      {error && <p className="md:col-span-2 text-sm text-maroon">{error}</p>}

      <div className="md:col-span-2 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-maroon px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Saving…" : initial ? "Save Changes" : "New Member"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onDone}
            className="px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-slate hover:text-ink"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function MemberRow({ member }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return <MemberForm initial={member} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-spis bg-white p-4">
      {member.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={member.photo_url} alt={member.name} className="h-12 w-12 object-cover" />
      ) : (
        <div className="h-12 w-12 bg-paper-2" />
      )}
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-ink">{member.name}</p>
        <p className="font-mono text-[11px] uppercase tracking-wider text-slate-light">
          {member.category} · {member.position || "-"}
        </p>
      </div>
      <button
        onClick={() => setEditing(true)}
        className="font-mono text-xs uppercase tracking-wider text-slate hover:text-ink"
      >
        Edit
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          if (confirm(`Hapus ${member.name} dari daftar?`)) {
            startTransition(() => deleteMember(member.id));
          }
        }}
        className="font-mono text-xs uppercase tracking-wider text-maroon hover:opacity-80 disabled:opacity-60"
      >
        Delete
      </button>
    </div>
  );
}

export function TimManager({ initialMembers }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      {showForm ? (
        <MemberForm onDone={() => setShowForm(false)} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="border border-maroon px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-maroon hover:bg-maroon hover:text-white"
        >
          + New Member
        </button>
      )}

      <div className="space-y-3 pt-2">
        {initialMembers.length === 0 && (
          <p className="text-sm text-white/70">Belum ada anggota.</p>
        )}
        {initialMembers.map((m) => (
          <MemberRow key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
}
