import { createClient } from "@/lib/supabase/server";
import { upsertClubSettings } from "./actions";

export default async function SettingsPage({ params }: any) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("club_settings")
    .select("*")
    .eq("club_id", params.id)
    .single();

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Configuración visual</h1>

      <form action={upsertClubSettings} className="space-y-3">
        <input type="hidden" name="club_id" value={params.id} />

        <input
          name="display_name"
          placeholder="Nombre visible"
          defaultValue={data?.display_name || ""}
          className="input"
        />

        <input
          name="logo_url"
          placeholder="Logo URL"
          defaultValue={data?.logo_url || ""}
          className="input"
        />

        <input
          name="primary_color"
          type="color"
          defaultValue={data?.primary_color || "#76A889"}
        />

        <input
          name="secondary_color"
          type="color"
          defaultValue={data?.secondary_color || "#1E293B"}
        />

        <button className="btn">Guardar</button>
      </form>
    </div>
  );
}