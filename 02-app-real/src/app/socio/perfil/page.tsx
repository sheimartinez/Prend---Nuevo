"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import SocioShell from "@/components/socio/SocioShell";

export default function PerfilPage() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  async function load() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;

    setUser(user);

    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);
    setFullName(profileData?.full_name || "");
    setUsername(profileData?.username || "");
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!user) return;

    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      username,
    });

    alert("Perfil actualizado");
  }

  return (
    <SocioShell>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Mi perfil</h1>

        <div className="bg-white border rounded-2xl p-6 space-y-4">
          <div>
            <label>Nombre</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            onClick={save}
            className="w-full bg-[#76A889] text-white p-3 rounded-xl"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </SocioShell>
  );
}