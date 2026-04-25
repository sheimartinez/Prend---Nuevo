import Link from "next/link";
import SocioNav from "@/components/SocioNav";
import { createClient } from "@/lib/supabase/server";

export default async function SocioDashboard() {
  const supabase = await createClient();

  const { data: memberships } = await supabase
    .from("memberships")
    .select("id, club_id, role, status, clubs(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Mis clubes</h1>

      {!memberships || memberships.length === 0 ? (
        <div className="border rounded-xl p-4 text-gray-600">
          Todavía no perteneces a ningún club.
        </div>
      ) : (
        <div className="space-y-4">
          {memberships.map((m: any) => (
            <Link
              key={m.id}
              href={`/socio/club/${m.club_id}`}
              className="block p-4 border rounded-xl hover:bg-gray-50"
            >
              <h2 className="text-lg font-semibold">
                {m.clubs?.name || "Club"}
              </h2>

              <p className="text-sm text-gray-600">Rol: {m.role}</p>

              <p className="text-sm text-gray-600">
                Estado: {m.status || "active"}
              </p>
            </Link>
          ))}
        </div>
      )}

      <SocioNav />
    </div>
  );
}