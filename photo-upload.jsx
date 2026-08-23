"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Input file yang meng-upload langsung ke Supabase Storage (bucket "photos")
// dan mengisi hidden input `photo_url` dengan URL publik hasilnya, supaya
// bisa ikut terkirim bersama form (Server Action).
export function PhotoUpload({ name = "photo_url", defaultValue = "" }) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("photos").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (err) {
      setError(err.message || "Gagal mengunggah foto.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-4">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Pratinjau" className="h-16 w-16 object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center bg-white/10 font-mono text-[10px] text-white/60">
            Foto
          </div>
        )}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="text-xs text-white/70 file:mr-3 file:border-0 file:bg-spis-bright file:px-3 file:py-1.5 file:font-mono file:text-[11px] file:uppercase file:text-white"
          />
          {uploading && <p className="mt-1 text-xs text-white/60">Mengunggah…</p>}
          {error && <p className="mt-1 text-xs text-maroon">{error}</p>}
        </div>
      </div>
    </div>
  );
}
