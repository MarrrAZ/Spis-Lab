"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function paths() {
  revalidatePath("/tim");
  revalidatePath("/organigram");
  revalidatePath("/admin/tim");
  revalidatePath("/admin/organigram");
}

export async function createMember(formData) {
  const supabase = createClient();

  const payload = {
    category: formData.get("category"),
    name: formData.get("name"),
    position: formData.get("position") || null,
    bio: formData.get("bio") || null,
    email: formData.get("email") || null,
    angkatan: formData.get("angkatan") || null,
    jurusan: formData.get("jurusan") || null,
    photo_url: formData.get("photo_url") || null,
    order_index: Number(formData.get("order_index") || 0),
  };

  const { error } = await supabase.from("members").insert(payload);
  if (error) return { error: error.message };

  paths();
  return { success: true };
}

export async function updateMember(id, formData) {
  const supabase = createClient();

  const payload = {
    category: formData.get("category"),
    name: formData.get("name"),
    position: formData.get("position") || null,
    bio: formData.get("bio") || null,
    email: formData.get("email") || null,
    angkatan: formData.get("angkatan") || null,
    jurusan: formData.get("jurusan") || null,
    photo_url: formData.get("photo_url") || null,
    order_index: Number(formData.get("order_index") || 0),
  };

  const { error } = await supabase.from("members").update(payload).eq("id", id);
  if (error) return { error: error.message };

  paths();
  return { success: true };
}

export async function deleteMember(id) {
  const supabase = createClient();
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) return { error: error.message };

  paths();
  return { success: true };
}
