import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Feed from "@/components/Feed";
import SocioNav from "@/components/SocioNav";
import Link from "next/link";

export default async function ClubSocio({ params }: any) {
  const supabase = createServerComponentClient({ cookies });

  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", params.id)
    .single();

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold">{club?.name}</h1>

      {/* BOTÓN COMUNIDAD */}
      <Link
        href={`/socio/club/${params.id}/comunidad`}
        className="block mt-4 bg-white text-black rounded-xl text-center py-3 font-semibold"
      >
        Entrar a la comunidad
      </Link>

      {/* FEED DEL CLUB */}
      <Feed clubId={params.id} />

      <SocioNav />
    </div>
  );
}