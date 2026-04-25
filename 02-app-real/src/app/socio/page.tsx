import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import SocioNav from "@/components/SocioNav";

export default async function SocioDashboard() {
  const supabase = createServerComponentClient({ cookies });

  const { data: memberships } = await supabase
    .from("memberships")
    .select("*, clubs(*)");

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Mis clubes</h1>

      <div className="space-y-4">
        {memberships?.map((m) => (
          <Link
            key={m.id}
            href={`/socio/club/${m.club_id}`}
            className="block p-4 bg-zinc-900 rounded-xl"
          >
            <h2 className="text-lg">{m.clubs?.name}</h2>
            <p className="text-sm text-gray-400">
              Estado: {m.role}
            </p>
          </Link>
        ))}
      </div>

      <SocioNav />
    </div>
  );
}