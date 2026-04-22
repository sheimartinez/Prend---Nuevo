import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ClubPageProps = {
  params: Promise<{ id: string }>
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('memberships')
    .select('*')
    .eq('club_id', id)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return <div>Acceso no autorizado</div>
  }

  const { data: club } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', id)
    .single()

  const { data: members } = await supabase
    .from('memberships')
    .select('*')
    .eq('club_id', id)

  const isAdmin = membership.role === 'admin'

  return (
    <main className="min-h-screen bg-[#FBF9F6] p-8">
      <div className="mx-auto max-w-6xl">

        <Link href="/dashboard" className="text-sm text-[#76A889]">
          ← Volver
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-[#1E293B]">
          {club?.name}
        </h1>

        {/* 🔹 REGISTRAR SOCIO POR EMAIL */}
        {isAdmin && (
          <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Registrar socio</h2>

            <form
              action={`/club/${id}/add-member`}
              method="post"
              className="mt-4 flex flex-col gap-3"
            >

              <input
                name="email"
                type="email"
                placeholder="Email del socio"
                required
                className="rounded-lg border px-4 py-2"
              />

              <select
                name="role"
                className="rounded-lg border px-4 py-2"
              >
                <option value="member">Socio</option>
                <option value="admin">Admin</option>
              </select>

              <button className="rounded-lg bg-[#76A889] px-4 py-2 text-white">
                Registrar socio
              </button>
            </form>

            <p className="mt-2 text-xs text-gray-500">
              Solo para uso interno del club. No es invitación pública.
            </p>
          </div>
        )}

        {/* 🔹 LISTA DE MIEMBROS */}
        <div className="mt-8 space-y-3">
          {members?.map((m) => (
            <div key={m.id} className="rounded-xl border bg-white p-4">
              <p className="font-semibold">{m.user_id}</p>
              <p className="text-sm text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}