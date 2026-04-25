import SocioNav from "@/components/SocioNav";
import { createClient } from "@/lib/supabase/server";

export default async function PerfilSocioPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Mi perfil</h1>

      <div className="border rounded-xl p-4">
        <p className="text-sm text-gray-600">Email</p>
        <p className="font-medium">{user?.email || "Sin sesión"}</p>
      </div>

      <SocioNav />
    </div>
  );
}