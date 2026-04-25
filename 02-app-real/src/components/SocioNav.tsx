"use client";

import Link from "next/link";
import { Home, Users, Building, BookOpen, User } from "lucide-react";
import { useParams } from "next/navigation";

export default function SocioNav() {
  const params = useParams();
  const clubId = params?.id as string | undefined;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-zinc-800 flex justify-around py-3 md:hidden">
      <Link href="/socio" className="flex flex-col items-center text-xs text-zinc-300">
        <Home size={20} />
        Inicio
      </Link>

      <Link
        href={clubId ? `/socio/club/${clubId}/comunidad` : "/socio"}
        className="flex flex-col items-center text-xs text-zinc-300"
      >
        <Users size={20} />
        Comunidad
      </Link>

      <Link
        href={clubId ? `/socio/club/${clubId}` : "/socio"}
        className="flex flex-col items-center text-xs text-zinc-300"
      >
        <Building size={20} />
        Club
      </Link>

      <Link href="/socio/contenido" className="flex flex-col items-center text-xs text-zinc-300">
        <BookOpen size={20} />
        Contenido
      </Link>

      <Link href="/socio/perfil" className="flex flex-col items-center text-xs text-zinc-300">
        <User size={20} />
        Perfil
      </Link>
    </nav>
  );
}