"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Users, BookOpen, CreditCard, MessageCircle, Archive, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SocioShell from "@/components/socio/SocioShell";

export default function ClubSocioPage({ params }: { params: Promise<{ id: string }> }) {
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

  const cards = [
    {
      title: "Comunidad",
      text: "Publicaciones internas, comentarios y participación privada.",
      href: `/socio/club/${clubId}/comunidad`,
      icon: Users,
      primary: true,
    },
    {
      title: "Biblioteca",
      text: "Guías, documentos, contenido educativo y cultura interna.",
      href: `/socio/club/${clubId}/biblioteca`,
      icon: BookOpen,
    },
    {
      title: "Cuota social",
      text: "Estado de cuota, vencimiento e historial de pagos.",
      href: `/socio/club/${clubId}/cuota`,
      icon: CreditCard,
    },
    {
      title: "Mensajes",
      text: "Comunicación privada entre el socio y el club.",
      href: `/socio/club/${clubId}/mensajes`,
      icon: MessageCircle,
    },
    {
      title: "Solicitudes internas",
      text: "Consultas y registros internos sin lógica de compra.",
      href: `/socio/club/${clubId}/solicitudes`,
      icon: Archive,
    },
  ];

  return (
    <SocioShell clubId={clubId}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <section
          style={{
            background: "white",
            border: "1px solid #E5E1DA",
            borderRadius: 32,
            padding: 32,
            marginBottom: 28,
            boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>Panel socio</p>

          <h1 style={{ margin: "8px 0 0", fontSize: 42, fontWeight: 800 }}>
            {club?.name ?? "Club"}
          </h1>

          <p style={{ color: "#6B7280", maxWidth: 650, marginTop: 10 }}>
            Espacio privado para socios registrados. Accedé a comunidad, contenido,
            cuota social y comunicaciones internas.
          </p>

          <div
            style={{
              marginTop: 22,
              display: "inline-block",
              background: "#F8F4EC",
              border: "1px solid #E5E1DA",
              borderRadius: 18,
              padding: "12px 18px",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>Estado</p>
            <p style={{ margin: 0, fontWeight: 700, textTransform: "capitalize" }}>
              {membership?.status ?? "active"}
            </p>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                style={{
                  display: "block",
                  textDecoration: "none",
                  background: card.primary ? "#76A889" : "white",
                  color: card.primary ? "white" : "#172033",
                  border: card.primary ? "1px solid #76A889" : "1px solid #E5E1DA",
                  borderRadius: 28,
                  padding: 26,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                }}
              >
                <Icon size={30} color={card.primary ? "white" : "#76A889"} />

                <h2 style={{ margin: "18px 0 8px", fontSize: 22, fontWeight: 800 }}>
                  {card.title}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: card.primary ? "rgba(255,255,255,0.9)" : "#6B7280",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {card.text}
                </p>

                <ArrowRight
                  style={{ marginTop: 20 }}
                  color={card.primary ? "white" : "#76A889"}
                />
              </Link>
            );
          })}
        </section>
      </div>
    </SocioShell>
  );
}