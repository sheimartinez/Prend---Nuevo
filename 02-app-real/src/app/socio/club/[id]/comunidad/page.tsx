import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SocioNav from "@/components/SocioNav";
import {
  createCommunityPost,
  toggleCommunityLike,
  createCommunityComment,
} from "./actions";

export default async function ComunidadSocioPage({ params }: any) {
  const supabase = createServerComponentClient({ cookies });

  const clubId = params.id;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", clubId)
    .single();

  const { data: posts } = await supabase
    .from("community_posts")
    .select(`
      id,
      content,
      image_url,
      created_at,
      user_id,
      profiles (
        full_name,
        avatar_url
      ),
      community_post_likes (
        id,
        user_id
      ),
      community_comments (
        id,
        content,
        created_at,
        user_id,
        profiles (
          full_name,
          avatar_url
        )
      )
    `)
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <section className="p-4 max-w-2xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-zinc-400">Comunidad privada</p>
          <h1 className="text-2xl font-bold">{club?.name}</h1>
        </div>

        <form
          action={createCommunityPost}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6"
        >
          <input type="hidden" name="club_id" value={clubId} />

          <label className="block text-sm text-zinc-400 mb-2">
            Compartí algo con la comunidad
          </label>

          <textarea
            name="content"
            required
            placeholder="Escribí una publicación interna..."
            className="w-full min-h-28 bg-black border border-zinc-700 rounded-xl p-3 text-white outline-none"
          />

          <button
            type="submit"
            className="mt-3 w-full rounded-xl bg-white text-black py-3 font-semibold"
          >
            Publicar
          </button>
        </form>

        <div className="space-y-5">
          {posts?.map((post: any) => {
            const likes = post.community_post_likes ?? [];
            const comments = post.community_comments ?? [];
            const userLiked = likes.some((like: any) => like.user_id === user?.id);

            return (
              <article
                key={post.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                    {post.profiles?.avatar_url ? (
                      <img
                        src={post.profiles.avatar_url}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">
                        {post.profiles?.full_name?.[0] ?? "S"}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {post.profiles?.full_name ?? "Socio"}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Publicación interna
                    </p>
                  </div>
                </div>

                <p className="text-zinc-100 whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 mt-4 text-sm text-zinc-400">
                  <form action={toggleCommunityLike}>
                    <input type="hidden" name="post_id" value={post.id} />
                    <input type="hidden" name="club_id" value={clubId} />

                    <button type="submit">
                      {userLiked ? "❤️" : "🤍"} {likes.length}
                    </button>
                  </form>

                  <span>💬 {comments.length}</span>
                </div>

                <div className="mt-4 space-y-3">
                  {comments.map((comment: any) => (
                    <div
                      key={comment.id}
                      className="bg-black border border-zinc-800 rounded-xl p-3"
                    >
                      <p className="text-sm font-semibold">
                        {comment.profiles?.full_name ?? "Socio"}
                      </p>
                      <p className="text-sm text-zinc-300">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>

                <form action={createCommunityComment} className="mt-4 flex gap-2">
                  <input type="hidden" name="post_id" value={post.id} />
                  <input type="hidden" name="club_id" value={clubId} />

                  <input
                    name="content"
                    required
                    placeholder="Comentar..."
                    className="flex-1 bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none"
                  />

                  <button
                    type="submit"
                    className="bg-white text-black rounded-xl px-4 text-sm font-semibold"
                  >
                    Enviar
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      </section>

      <SocioNav />
    </main>
  );
}