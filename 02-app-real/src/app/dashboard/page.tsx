import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClub } from './actions'
import InternalHeader from '@/components/InternalHeader'
import Pricing from '@/components/Pricing'
type DashboardPageProps = {
  searchParams: Promise<{
    success?: string
    error?: string
  }>
}

type MembershipRow = {
  id: string
  club_id: string
  role: string
  status?: string | null
}

type ClubRow = {
  id: string
  name: string
  created_at?: string
}

type InvitationRow = {
  id: string
  club_id: string
  email: string
  role: string
  status: string
  clubs?: { name: string } | { name: string }[] | null
}

function getDashboardMessage(success?: string, error?: string) {
  if (success === 'invitation_accepted') {
    return { type: 'success' as const, text: 'Invitación aceptada correctamente.' }
  }

  if (error === 'missing_club_name') {
    return { type: 'error' as const, text: 'Ingresa el nombre del club.' }
  }

  if (error === 'club_limit_reached') {
    return { type: 'error' as const, text: 'Tu cuenta ya pertenece a un club. El límite actual es 1 club por usuario.' }
  }

  if (error === 'create_club_failed') {
    return { type: 'error' as const, text: 'No se pudo crear el club.' }
  }

  if (error === 'create_admin_membership_failed') {
    return { type: 'error' as const, text: 'El club se creó, pero no se pudo asignar el admin.' }
  }

  if (error === 'accept_invitation_failed') {
    return { type: 'error' as const, text: 'No se pudo aceptar la invitación.' }
  }

  if (error) {
    return { type: 'error' as const, text: 'Ocurrió un error.' }
  }

  return null
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { success, error } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const userEmail = user.email?.toLowerCase() ?? ''

  const { data: memberships, error: membershipsError } = await supabase
    .from('memberships')
    .select('id, club_id, role, status')
    .eq('user_id', user.id)

  if (membershipsError) {
    return <div>Error al cargar tus clubes</div>
  }

  const membershipRows = (memberships ?? []) as MembershipRow[]
  const clubIds = membershipRows.map((membership) => membership.club_id)

  let clubs: ClubRow[] = []

  if (clubIds.length > 0) {
    const { data: clubsData, error: clubsError } = await supabase
      .from('clubs')
      .select('id, name, created_at')
      .in('id', clubIds)

    if (clubsError) {
      return <div>Error al cargar los datos de los clubes</div>
    }

    clubs = (clubsData ?? []) as ClubRow[]
  }

  const { data: invitationsData } = await supabase
    .from('invitations')
    .select(`
      id,
      club_id,
      email,
      role,
      status,
      clubs (
        name
      )
    `)
    .eq('email', userEmail)
    .eq('status', 'pending')

  const invitations = (invitationsData ?? []) as InvitationRow[]
  const feedback = getDashboardMessage(success, error)
  const canCreateClub = membershipRows.length === 0

  return (
    <>
      <InternalHeader userEmail={userEmail} />

      <main className="min-h-screen bg-[#FBF9F6] p-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1E293B]">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona tus clubes y accesos internos.
              </p>
            </div>
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

          {invitations.length > 0 && (
            <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1E293B]">
                Invitaciones pendientes
              </h2>

              <div className="mt-4 space-y-3">
                {invitations.map((invitation) => {
                  const clubName = Array.isArray(invitation.clubs)
                    ? invitation.clubs[0]?.name
                    : invitation.clubs?.name

                  return (
                    <div
                      key={invitation.id}
                      className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">{clubName || 'Club'}</p>
                        <p className="text-sm text-gray-500">
                          Invitación para entrar como {invitation.role}
                        </p>
                      </div>

                      <form action={`/invitations/${invitation.id}/accept`} method="post">
                        <button className="rounded-lg bg-[#76A889] px-4 py-2 text-sm text-white">
                          Aceptar invitación
                        </button>
                      </form>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {canCreateClub && (
            <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1E293B]">
                Crear club
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Crea el espacio privado de gestión interna de tu club.
              </p>

              <form action={createClub} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  name="name"
                  placeholder="Nombre del club"
                  required
                  className="rounded-lg border px-4 py-2"
                />

                <button className="rounded-lg bg-[#76A889] px-4 py-2 text-white">
                  Crear club
                </button>
              </form>

              <p className="mt-2 text-xs text-gray-500">
                Límite actual: 1 club por usuario.
              </p>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-[#1E293B]">Mis clubes</h2>

            {clubs.length === 0 ? (
              <div className="mt-4 rounded-2xl border bg-white p-6 text-gray-600">
                Todavía no perteneces a ningún club.
              </div>
            ) : (
              <div className="mt-4 grid gap-4">
                {clubs.map((club) => {
                  const membership = membershipRows.find((m) => m.club_id === club.id)

                  return (
                    <div key={club.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                      <h3 className="text-xl font-semibold text-[#1E293B]">
                        {club.name}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        Rol: {membership?.role}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Estado: {membership?.status}
                      </p>

                      <div className="mt-4">
                        <Link
                          href={`/club/${club.id}`}
                          className="rounded-lg bg-[#76A889] px-4 py-2 text-white"
                        >
                          Entrar al club
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
          <Pricing />
        </div>
      </main>
    </>
  )
}