"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Users, CreditCard, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SocioShell from "@/components/socio/SocioShell";

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

      const merged = membershipsData.map((membership) => ({
        ...membership,
        club: clubsData?.find((c) => c.id === membership.club_id),
      }));

      setMemberships(merged);
      setLoading(false);
    }

    loadSocioData();
  }, []);

  if (loading) {
    return (
      <SocioShell>
        <p>Cargando panel socio...</p>
      </SocioShell>
    );
  }

  return (
    <SocioShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm text-gray-500">Bienvenida a tu espacio privado</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-1">
            Mis clubes
          </h1>
        </div>

        {memberships.length === 0 ? (
          <div className="bg-white border border-[#E5E1DA] rounded-3xl p-6">
            <h2 className="font-semibold text-lg">Todavía no perteneces a ningún club</h2>
            <p className="text-sm text-gray-500 mt-2">
              Cuando un club te agregue o aceptes una invitación, aparecerá acá.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {memberships.map((m) => (
              <Link
                key={m.id}
                href={`/socio/club/${m.club_id}`}
                className="bg-white border border-[#E5E1DA] rounded-3xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Club privado</p>
                    <h2 className="text-2xl font-bold mt-1">
                      {m.club?.name ?? "Club"}
                    </h2>
                  </div>

                  <div className="h-11 w-11 rounded-2xl bg-[#76A889] text-white flex items-center justify-center">
                    <ArrowRight size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="rounded-2xl bg-[#FBF9F6] p-3">
                    <p className="text-xs text-gray-500">Rol</p>
                    <p className="font-semibold capitalize">{m.role}</p>
                  </div>

                  <div className="rounded-2xl bg-[#FBF9F6] p-3">
                    <p className="text-xs text-gray-500">Estado</p>
                    <p className="font-semibold capitalize">{m.status}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-5 mt-8">
          <div className="bg-white border border-[#E5E1DA] rounded-3xl p-5">
            <Users className="text-[#76A889]" />
            <h3 className="font-semibold mt-3">Comunidad privada</h3>
            <p className="text-sm text-gray-500 mt-1">
              Publicaciones, comentarios y novedades internas.
            </p>
          </div>

          <div className="bg-white border border-[#E5E1DA] rounded-3xl p-5">
            <CreditCard className="text-[#76A889]" />
            <h3 className="font-semibold mt-3">Cuota social</h3>
            <p className="text-sm text-gray-500 mt-1">
              Estado de cuota, vencimientos e historial.
            </p>
          </div>

          <div className="bg-white border border-[#E5E1DA] rounded-3xl p-5">
            <Bell className="text-[#76A889]" />
            <h3 className="font-semibold mt-3">Notificaciones</h3>
            <p className="text-sm text-gray-500 mt-1">
              Avisos importantes, mensajes y documentos nuevos.
            </p>
          </div>
        </div>
      </div>
    </SocioShell>
  );
}