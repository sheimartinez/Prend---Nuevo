import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ClubPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    success?: string
    error?: string
  }>
}

type MembershipRow = {
  id: string
  user_id: string
  role: string
}

type ProfileRow = {
  id: string
  email: string
}

function getFeedbackMessage(success?: string, error?: string) {
  if (success === 'member_created') {
    return {
      type: 'success' as const,
      text: 'Socio registrado correctamente.',
    }
  }

  if (error === 'already_member') {
    return {
      type: 'error' as const,
      text: 'Ese usuario ya pertenece al club.',
    }
  }

  if (error === 'user_not_found') {
    return {
      type: 'error' as const,
      text: 'No se encontró un usuario con ese email.',
    }
  }

  if (error === 'not_admin') {
    return {
      type: 'error' as const,
      text: 'No tienes permisos para realizar esta acción.',
    }
  }

  if (error) {
    return {
      type: 'error' as const,
      text: 'Ocurrió un error al registrar el socio.',
    }
  }

  return null
}

export default async function ClubPage({
  params,
  searchParams,
}: ClubPageProps) {
  const { id } = await params
  const { success, error } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .select('*')
    .eq('club_id', id)
    .eq('user_id', user.id)
    .single()

  if (membershipError || !membership) {
    return <div>Acceso no autorizado</div>
  }

  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', id)
    .single()

  if (clubError || !club) {
    return <div>No se pudo cargar el club</div>
  }

  const { data: members, error: membersError } = await supabase
    .from('memberships')
    .select('id, user_id, role')
    .eq('club_id', id)

  if (membersError) {
    return <div>Error al cargar los miembros</div>
  }

  const userIds = (members as MembershipRow[] | null)?.map((m) => m.user_id) ?? []

  let profilesMap = new Map<string, string>()

  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds)

    if (profilesError) {
      return <div>Error al cargar los perfiles de los miembros</div>
    }

    profilesMap = new Map(
      ((profiles as ProfileRow[] | null) ?? []).map((p) => [p.id, p.email])
    )
  }

  const isAdmin = membership.role === 'admin'
  const feedback = getFeedbackMessage(success, error)

  return (
    <main className="min-h-screen bg-[#FBF9F6] p-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/dashboard" className="text-sm text-[#76A889]">
          ← Volver
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-[#1E293B]">
          {club.name}
        </h1>

        {feedback && (
          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {feedback.text}
          </div>
        )}

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
                <option value="socio">Socio</option>
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

        <div className="mt-8 space-y-3">
          {(members as MembershipRow[] | null)?.length ? (
            (members as MembershipRow[]).map((m) => (
              <div key={m.id} className="rounded-xl border bg-white p-4">
                <p className="font-semibold">
                  {profilesMap.get(m.user_id) || m.user_id}
                </p>
                <p className="text-sm text-gray-500">{m.role}</p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border bg-white p-4 text-gray-500">
              Todavía no hay miembros para mostrar.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}