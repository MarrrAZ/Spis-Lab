"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Membuat akun asisten baru. Memakai Service Role Key (lewat createAdminClient)
// karena membuat user login hanya bisa dilakukan dengan hak admin.
export async function createAccount(formData) {
  const fullName = formData.get("full_name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!fullName || !email || !password) {
    return { error: "Semua kolom wajib diisi." };
  }
  if (password.length < 6) {
    return { error: "Kata sandi minimal 6 karakter." };
  }

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return { error: error.message };

  const { error: profileError } = await admin.from("profiles").insert({
    id: data.user.id,
    full_name: fullName,
    email,
  });

  if (profileError) return { error: profileError.message };

  revalidatePath("/admin/akun");
  return { success: true };
}

export async function deleteAccount(id) {
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { error: error.message };

  revalidatePath("/admin/akun");
  return { success: true };
}

export async function listAccounts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) return [];
  return data;
}
