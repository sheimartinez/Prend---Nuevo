"use server";

import { createClient } from "@/lib/supabase/server";

export async function getClubSettings(clubId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("club_settings")
    .select("*")
    .eq("club_id", clubId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function upsertClubSettings(formData: FormData) {
  const supabase = await createClient();

  const club_id = formData.get("club_id") as string;

  const payload = {
    club_id,
    display_name: formData.get("display_name") as string,
    logo_url: formData.get("logo_url") as string,
    primary_color: formData.get("primary_color") as string,
    secondary_color: formData.get("secondary_color") as string,
  };

  const { error } = await supabase
    .from("club_settings")
    .upsert(payload, { onConflict: "club_id" });

  if (error) {
    console.error(error);
    throw new Error("Error updating settings");
  }
}