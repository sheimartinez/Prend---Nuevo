"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SocioNav from "@/components/SocioNav";

export default function ClubSocioPage({ params }: any) {
  const supabase = createClient();
  const clubId = params.id;

  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClub() {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", clubId)
        .maybeSingle();

      if (error) {
        console.log("Error cargando club:", error.message);
      }

      setClub(data);
      setLoading(false);
    }

    loadClub();
  }, [clubId]);

  if (loading) {
    return <div className="p-4">Cargando club...</div>;
  }

  return (
    <main className="min-h-screen bg-[#FBF9F6] pb-24">
      <section className="max-w-2xl mx-auto p-4">
        <p className="text-sm text-gray-500">Panel socio</p>

        <h1 className="text-3xl font-bold text-[#1E293B]">
          {club?.name ?? "Club"}
        </h1>

        <p className="mt-2 text-gray-600">
          Espacio privado para socios registrados del club.
        </p>

        <div className="mt-6 grid gap-4">
          <Link
            href={`/socio/club/${clubId}/comunidad`}
            className="block bg-[#76A889] text-white rounded-2xl p-5 font-semibold text-center"
          >
            Entrar a la comunidad
          </Link>

          <div className="bg-white border rounded-2xl p-5">
            <h2 className="font-semibold text-[#1E293B]">
              Contenido interno
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Próximamente: biblioteca, documentos y avisos del club.
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <h2 className="font-semibold text-[#1E293B]">
              Cuota social
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Próximamente: estado de cuota e historial.
            </p>
          </div>
        </div>
      </section>

      <SocioNav />
    </main>
  );
}