"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookOpen, CreditCard, MessageCircle, User, Leaf } from "lucide-react";

export default function SocioShell({
  children,
  clubId,
}: {
  children: React.ReactNode;
  clubId?: string;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Inicio", href: "/socio", icon: Home },
    { label: "Comunidad", href: clubId ? `/socio/club/${clubId}/comunidad` : "/socio", icon: Users },
    { label: "Biblioteca", href: clubId ? `/socio/club/${clubId}/biblioteca` : "/socio", icon: BookOpen },
    { label: "Cuota", href: clubId ? `/socio/club/${clubId}/cuota` : "/socio", icon: CreditCard },
    { label: "Mensajes", href: clubId ? `/socio/club/${clubId}/mensajes` : "/socio", icon: MessageCircle },
    { label: "Perfil", href: "/socio/perfil", icon: User },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#F8F4EC", color: "#172033" }}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside
          style={{
            width: 260,
            background: "#12372A",
            color: "white",
            padding: 24,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Link
            href="/socio"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 26,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 40,
            }}
          >
            <Leaf size={28} />
            Prendé
          </Link>

          <nav style={{ display: "grid", gap: 10 }}>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href}
                  style={{
                    color: active ? "#12372A" : "rgba(255,255,255,0.85)",
                    background: active ? "white" : "transparent",
                    textDecoration: "none",
                    padding: "12px 14px",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section style={{ flex: 1 }}>
          <header
            style={{
              background: "white",
              borderBottom: "1px solid #E5E1DA",
              padding: "20px 40px",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>Área privada</p>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Panel socio</h1>
          </header>

          <div style={{ padding: 40 }}>{children}</div>
        </section>
      </div>
    </main>
  );
}