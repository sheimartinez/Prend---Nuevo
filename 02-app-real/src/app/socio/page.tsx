"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SocioNav from "@/components/SocioNav";

export default function SocioDashboard() {
  const supabase = createClient();

  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSocioData() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: membershipsData } = await supabase
        .from("memberships")
        .select("*")
        .eq("user_id", user.id);

      if (!membershipsData || membershipsData.length === 0) {
        setMemberships([]);
        setLoading(false);
        return;
      }

      const clubIds = membershipsData.map((m) => m.club_id);

      const { data: clubsData } = await supabase
        .from("clubs")
        .select("*")
        .in("id", clubIds);

      const merged = membershipsData.map((membership) => {
        const club = clubsData?.find((c) => c.id === membership.club_id);

        return {
          ...membership,
          club,
        };
      });

      setMemberships(merged);
      setLoading(false);
    }

    loadSocioData();
  }, []);

  if (loading) {
    return <div className="p-4">Cargando panel socio...</div>;
  }

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Mis clubes</h1>

      {memberships.length > 0 ? (
        <div className="space-y-4">
          {memberships.map((m) => (
            <Link
              key={m.id}
              href={`/socio/club/${m.club_id}`}
              className="block p-4 bg-zinc-900 text-white rounded-xl"
            >
              <h2 className="text-lg font-semibold">
                {m.club?.name ?? "Club"}
              </h2>

              <p className="text-sm text-gray-400">
                Rol: {m.role} · Estado: {m.status}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-4 border rounded-xl text-gray-500">
          Todavía no perteneces a ningún club.
        </div>
      )}

      <SocioNav />
    </div>
  );
}