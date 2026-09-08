"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function paths() {
  revalidatePath("/rekrutmen");
  revalidatePath("/admin/rekrutmen");
  revalidatePath("/");
}

function payloadFrom(formData) {
  return {
    title: formData.get("title"),
    description: formData.get("description") || null,
    requirements: formData.get("requirements") || null,
    deadline: formData.get("deadline") || null,
    is_open: formData.get("is_open") === "on",
    link: formData.get("link") || null,
  };
}

export async function createRecruitment(formData) {
  const supabase = createClient();
  const { error } = await supabase.from("recruitment").insert(payloadFrom(formData));
  if (error) return { error: error.message };
  paths();
  return { success: true };
}

export async function updateRecruitment(id, formData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("recruitment")
    .update(payloadFrom(formData))
    .eq("id", id);
  if (error) return { error: error.message };
  paths();
  return { success: true };
}

export async function deleteRecruitment(id) {
  const supabase = createClient();
  const { error } = await supabase.from("recruitment").delete().eq("id", id);
  if (error) return { error: error.message };
  paths();
  return { success: true };
}
