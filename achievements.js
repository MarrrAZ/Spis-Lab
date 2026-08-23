"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function paths() {
  revalidatePath("/pencapaian");
  revalidatePath("/admin/pencapaian");
  revalidatePath("/");
}

function payloadFrom(formData) {
  return {
    type: formData.get("type"),
    title: formData.get("title"),
    authors: formData.get("authors") || null,
    venue: formData.get("venue") || null,
    year: formData.get("year") ? Number(formData.get("year")) : null,
    link: formData.get("link") || null,
    description: formData.get("description") || null,
  };
}

export async function createAchievement(formData) {
  const supabase = createClient();
  const { error } = await supabase.from("achievements").insert(payloadFrom(formData));
  if (error) return { error: error.message };
  paths();
  return { success: true };
}

export async function updateAchievement(id, formData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("achievements")
    .update(payloadFrom(formData))
    .eq("id", id);
  if (error) return { error: error.message };
  paths();
  return { success: true };
}

export async function deleteAchievement(id) {
  const supabase = createClient();
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) return { error: error.message };
  paths();
  return { success: true };
}
