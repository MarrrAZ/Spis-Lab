"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function paths() {
  revalidatePath("/abdimas");
  revalidatePath("/admin/abdimas");
  revalidatePath("/");
}

function payloadFrom(formData) {
  return {
    title: formData.get("title"),
    location: formData.get("location") || null,
    activity_date: formData.get("activity_date") || null,
    description: formData.get("description") || null,
    link: formData.get("link") || null,
  };
}

export async function createAbdimas(formData) {
  const supabase = createClient();
  const { error } = await supabase.from("abdimas").insert(payloadFrom(formData));
  if (error) return { error: error.message };
  paths();
  return { success: true };
}

export async function updateAbdimas(id, formData) {
  const supabase = createClient();
  const { error } = await supabase.from("abdimas").update(payloadFrom(formData)).eq("id", id);
  if (error) return { error: error.message };
  paths();
  return { success: true };
}

export async function deleteAbdimas(id) {
  const supabase = createClient();
  const { error } = await supabase.from("abdimas").delete().eq("id", id);
  if (error) return { error: error.message };
  paths();
  return { success: true };
}
