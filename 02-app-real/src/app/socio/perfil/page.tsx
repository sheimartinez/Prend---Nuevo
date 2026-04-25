import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SocioNav from "@/components/SocioNav";

export default async function Perfil() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>

      <div className="bg-zinc-900 p-4 rounded-xl">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Nombre:</strong> {profile?.full_name}</p>
      </div>

      <SocioNav />
    </div>
  );
}