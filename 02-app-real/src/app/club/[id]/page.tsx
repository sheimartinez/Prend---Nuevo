import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import InternalHeader from '@/components/InternalHeader'
import ClearFeedbackUrl from '@/components/ClearFeedbackUrl'
import { ConfirmSubmitButton, SubmitButton } from '@/components/FormButtons'

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
  status?: string | null
}

type ProfileRow = {
  id: string
  email: string
}

type InvitationRow = {
  id: string
  email: string
  role: string
  status: string
  created_at: string
}

function getFeedbackMessage(success?: string, error?: string) {
  if (success === 'club_created') return { type: 'success' as const, text: 'Club creado correctamente.' }
  if (success === 'member_created') return { type: 'success' as const, text: 'Socio registrado correctamente.' }
  if (success === 'member_removed') return { type: 'success' as const, text: 'Socio quitado correctamente.' }
  if (success === 'role_updated') return { type: 'success' as const, text: 'Rol actualizado correctamente.' }
  if (success === 'invitation_created') return { type: 'success' as const, text: 'Invitación creada correctamente.' }
  if (success === 'invitation_cancelled') return { type: 'success' as const, text: 'Invitación cancelada correctamente.' }

  if (error === 'already_member') return { type: 'error' as const, text: 'Ese usuario ya pertenece al club.' }
  if (error === 'invitation_already_pending') return { type: 'error' as const, text: 'Ese email ya tiene una invitación pendiente.' }
  if (error === 'user_not_found') return { type: 'error' as const, text: 'No se encontró un usuario con ese email.' }
  if (error === 'not_admin') return { type: 'error' as const, text: 'No tienes permisos para realizar esta acción.' }
  if (error === 'cannot_remove_self') return { type: 'error' as const, text: 'No puedes quitarte a ti misma desde esta pantalla.' }
  if (error === 'cannot_remove_last_admin') return { type: 'error' as const, text: 'No puedes quitar al último admin del club.' }
  if (error === 'cannot_downgrade_last_admin') return { type: 'error' as const, text: 'No puedes cambiar el rol del último admin.' }
  if (error === 'member_not_found') return { type: 'error' as const, text: 'No se encontró esa membresía.' }
  if (error === 'invalid_role') return { type: 'error' as const, text: 'Rol inválido.' }
  if (error) return { type: 'error' as const, text: 'Ocurrió un error. Intenta nuevamente.' }

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

  const userEmail = user.email?.toLowerCase() ?? ''

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
    .select('id, user_id, role, status')
    .eq('club_id', id)
    .order('role', { ascending: true })

  if (membersError) {
    return <div>Error al cargar los miembros</div>
  }

  const memberRows = (members ?? []) as MembershipRow[]
  const userIds = memberRows.map((m) => m.user_id)

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

  const { data: invitationsData } = await supabase
    .from('invitations')
    .select('id, email, role, status, created_at')
    .eq('club_id', id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  const invitations = (invitationsData ?? []) as InvitationRow[]

  const isAdmin = membership.role === 'admin'
  const feedback = getFeedbackMessage(success, error)

  return (
    <>
      <InternalHeader userEmail={userEmail} />

      {feedback && <ClearFeedbackUrl />}

      <main className="min-h-screen bg-[#FBF9F6] p-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/dashboard" className="text-sm text-[#76A889]">
            ← Volver
          </Link>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1E293B]">{club.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Panel interno del club. Acceso privado para socios registrados.
              </p>
            </div>

            <span className="rounded-full border bg-white px-4 py-2 text-sm text-gray-600">
              Tu rol: {membership.role}
            </span>
          </div>

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
            <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Invitar socio</h2>

              <form
                action={`/club/${id}/invite-member`}
                method="post"
                className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px_auto]"
              >
                <input
                  name="email"
                  type="email"
                  placeholder="Email del socio"
                  required
                  className="rounded-lg border px-4 py-2"
                />

                <select name="role" className="rounded-lg border px-4 py-2">
                  <option value="socio">Socio</option>
                  <option value="admin">Admin</option>
                </select>

                <SubmitButton className="rounded-lg bg-[#76A889] px-4 py-2 text-white disabled:opacity-60">
                  Invitar
                </SubmitButton>
              </form>

              <p className="mt-2 text-xs text-gray-500">
                Crea una invitación privada. No es invitación pública ni venta.
              </p>
            </section>
          )}

          {isAdmin && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-[#1E293B]">
                Invitaciones pendientes
              </h2>

              <div className="mt-4 space-y-3">
                {invitations.length ? (
                  invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">{invitation.email}</p>
                        <p className="text-sm text-gray-500">
                          Rol: {invitation.role} · Estado: pendiente
                        </p>
                      </div>

                      <form action={`/club/${id}/cancel-invitation`} method="post">
                        <input type="hidden" name="invitation_id" value={invitation.id} />

                        <ConfirmSubmitButton
                          confirmMessage="¿Seguro que quieres cancelar esta invitación?"
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          Cancelar invitación
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border bg-white p-4 text-gray-500">
                    No hay invitaciones pendientes.
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-[#1E293B]">
              Miembros del club
            </h2>

            <div className="mt-4 space-y-3">
              {memberRows.length ? (
                memberRows.map((m) => {
                  const email = profilesMap.get(m.user_id) || m.user_id
                  const isCurrentUser = m.user_id === user.id
                  const nextRole = m.role === 'admin' ? 'socio' : 'admin'

                  return (
                    <div
                      key={m.id}
                      className="flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">{email}</p>
                        <p className="text-sm text-gray-500">
                          Rol: {m.role}
                          {m.status ? ` · Estado: ${m.status}` : ''}
                          {isCurrentUser ? ' · Tú' : ''}
                        </p>
                      </div>

                      {isAdmin && (
                        <div className="flex flex-wrap gap-2">
                          <form action={`/club/${id}/update-member-role`} method="post">
                            <input type="hidden" name="membership_id" value={m.id} />
                            <input type="hidden" name="role" value={nextRole} />

                            <ConfirmSubmitButton
                              confirmMessage={`¿Seguro que quieres cambiar el rol de ${email}?`}
                              className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                            >
                              {m.role === 'admin' ? 'Pasar a socio' : 'Hacer admin'}
                            </ConfirmSubmitButton>
                          </form>

                          {!isCurrentUser && (
                            <form action={`/club/${id}/remove-member`} method="post">
                              <input type="hidden" name="membership_id" value={m.id} />

                              <ConfirmSubmitButton
                                confirmMessage={`¿Seguro que quieres quitar a ${email} del club?`}
                                className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                              >
                                Quitar
                              </ConfirmSubmitButton>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="rounded-xl border bg-white p-4 text-gray-500">
                  Todavía no hay miembros para mostrar.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}