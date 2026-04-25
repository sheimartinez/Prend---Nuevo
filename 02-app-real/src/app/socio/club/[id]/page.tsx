import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SocioNav from "@/components/SocioNav";

export default async function Comunidad({ params }: any) {
  const supabase = createServerComponentClient({ cookies });

  const { data: posts } = await supabase
    .from("community_posts")
    .select("*")
    .eq("club_id", params.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Comunidad</h1>

      {posts?.map((post) => (
        <div key={post.id} className="bg-zinc-900 p-4 rounded-xl mb-4">
          {post.content}
        </div>
      ))}

      <SocioNav />
    </div>
  );
}