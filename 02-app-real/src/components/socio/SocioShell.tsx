"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SocioShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const nav = [
    { name: "Inicio", href: "/socio" },
    { name: "Comunidad", href: "/socio" },
    { name: "Biblioteca", href: "/socio" },
    { name: "Mi cuenta", href: "/socio/perfil" },
  ];

  return (
    <div className="min-h-screen flex bg-[#FBF9F6]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6 hidden md:flex flex-col">
        <h1 className="text-xl font-bold text-[#1E293B] mb-8">
          Prendé
        </h1>

        <nav className="flex flex-col gap-2">
          {nav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm ${
                  active
                    ? "bg-[#76A889] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}