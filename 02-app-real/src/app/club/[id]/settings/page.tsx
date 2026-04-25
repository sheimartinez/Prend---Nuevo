import { getClubSettings, upsertClubSettings } from "./actions";

export default async function ClubSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const settings = await getClubSettings(id);

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Configuración del Club</h1>

      <form action={upsertClubSettings} className="space-y-4">
        <input type="hidden" name="club_id" value={id} />

        <div>
          <label className="block text-sm">Nombre visible</label>
          <input
            name="display_name"
            defaultValue={settings?.display_name || ""}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Logo URL</label>
          <input
            name="logo_url"
            defaultValue={settings?.logo_url || ""}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm">Color principal</label>
            <input
              type="color"
              name="primary_color"
              defaultValue={settings?.primary_color || "#16a34a"}
            />
          </div>

          <div>
            <label className="block text-sm">Color secundario</label>
            <input
              type="color"
              name="secondary_color"
              defaultValue={settings?.secondary_color || "#0f172a"}
            />
          </div>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}