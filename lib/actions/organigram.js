"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function paths() {
  revalidatePath("/organigram");
  revalidatePath("/admin/organigram");
}

export async function createOrgEntry(formData) {
  const supabase = createClient();
  const payload = {
    member_id: formData.get("member_id"),
    position_label: formData.get("position_label"),
    level: Number(formData.get("level") || 1),
    order_index: Number(formData.get("order_index") || 0),
  };
  const { error } = await supabase.from("organigram").insert(payload);
  if (error) return { error: error.message };
  paths();
  return { success: true };
}

export async function deleteOrgEntry(id) {
  const supabase = createClient();
  const { error } = await supabase.from("organigram").delete().eq("id", id);
  if (error) return { error: error.message };
  paths();
  return { success: true };
}
