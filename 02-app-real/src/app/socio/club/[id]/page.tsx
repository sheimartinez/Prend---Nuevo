"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  CreditCard,
  MessageCircle,
  Archive,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SocioShell from "@/components/socio/SocioShell";

export default function ClubSocioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: clubId } = use(params);
  const supabase = createClient();

  const [club, setClub] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClub() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      const { data: clubData } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", clubId)
        .maybeSingle();

      setClub(clubData);

      if (user) {
        const { data: membershipData } = await supabase
          .from("memberships")
          .select("*")
          .eq("club_id", clubId)
          .eq("user_id", user.id)
          .maybeSingle();

        setMembership(membershipData);
      }

      setLoading(false);
    }

    loadClub();
  }, [clubId]);

  if (loading) {
    return (
      <SocioShell clubId={clubId}>
        <p>Cargando club...</p>
      </SocioShell>
    );
  }

  return (
    <SocioShell clubId={clubId}>
      <div className="max-w-6xl mx-auto">
        <section className="bg-white border border-[#E5E1DA] rounded-[2rem] p-6 md:p-8 shadow-sm mb-8">
          <p className="text-sm text-gray-500">Panel socio</p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h1 className="text-4xl font-bold mt-1">
                {club?.name ?? "Club"}
              </h1>

              <p className="text-gray-500 mt-2 max-w-xl">
                Espacio privado para socios registrados. Accedé a comunidad,
                contenido, cuota social y comunicaciones internas.
              </p>
            </div>

            <div className="rounded-2xl bg-[#FBF9F6] px-4 py-3">
              <p className="text-xs text-gray-500">Estado</p>
              <p className="font-semibold capitalize">
                {membership?.status ?? "activo"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          <Link
            href={`/socio/club/${clubId}/comunidad`}
            className="bg-[#76A889] text-white rounded-3xl p-6 shadow-sm hover:shadow-md transition"
          >
            <Users size={26} />
            <h2 className="font-bold text-xl mt-4">Comunidad</h2>
            <p className="text-sm opacity-90 mt-2">
              Publicaciones internas, comentarios y participación privada.
            </p>
            <ArrowRight className="mt-5" />
          </Link>

          <Link
            href={`/socio/club/${clubId}/biblioteca`}
            className="bg-white border border-[#E5E1DA] rounded-3xl p-6 shadow-sm hover:shadow-md transition"
          >
            <BookOpen size={26} className="text-[#76A889]" />
            <h2 className="font-bold text-xl mt-4">Biblioteca</h2>
            <p className="text-sm text-gray-500 mt-2">
              Guías, documentos, contenido educativo y cultura interna.
            </p>
            <ArrowRight className="mt-5 text-[#76A889]" />
          </Link>

          <Link
            href={`/socio/club/${clubId}/cuota`}
            className="bg-white border border-[#E5E1DA] rounded-3xl p-6 shadow-sm hover:shadow-md transition"
          >
            <CreditCard size={26} className="text-[#76A889]" />
            <h2 className="font-bold text-xl mt-4">Cuota social</h2>
            <p className="text-sm text-gray-500 mt-2">
              Estado de cuota, vencimiento e historial de pagos.
            </p>
            <ArrowRight className="mt-5 text-[#76A889]" />
          </Link>

          <Link
            href={`/socio/club/${clubId}/mensajes`}
            className="bg-white border border-[#E5E1DA] rounded-3xl p-6 shadow-sm hover:shadow-md transition"
          >
            <MessageCircle size={26} className="text-[#76A889]" />
            <h2 className="font-bold text-xl mt-4">Mensajes</h2>
            <p className="text-sm text-gray-500 mt-2">
              Comunicación privada entre el socio y el club.
            </p>
            <ArrowRight className="mt-5 text-[#76A889]" />
          </Link>

          <Link
            href={`/socio/club/${clubId}/solicitudes`}
            className="bg-white border border-[#E5E1DA] rounded-3xl p-6 shadow-sm hover:shadow-md transition"
          >
            <Archive size={26} className="text-[#76A889]" />
            <h2 className="font-bold text-xl mt-4">Solicitudes internas</h2>
            <p className="text-sm text-gray-500 mt-2">
              Consultas y registros internos sin lógica de compra.
            </p>
            <ArrowRight className="mt-5 text-[#76A889]" />
          </Link>
        </section>
      </div>
    </SocioShell>
  );
}