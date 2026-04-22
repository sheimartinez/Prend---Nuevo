import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from('memberships')
    .select('id, club_id, role, status')
    .eq('user_id', user.id)

  console.log('DASHBOARD USER ID:', user.id)
  console.log('DASHBOARD MEMBERSHIPS:', memberships)
  console.log('DASHBOARD MEMBERSHIPS ERROR:', membershipsError)

  if (membershipsError) {
    return <div>Error al cargar tus clubes</div>
  }

  if (!memberships || memberships.length === 0) {
    return (
      <main className="min-h-screen bg-[#FBF9F6] p-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-[#1E293B]">Dashboard</h1>
          <p className="mt-4 text-gray-600">Todavía no perteneces a ningún club.</p>

          <div className="mt-6">
            <Link
              href="/"
              className="rounded-lg bg-[#76A889] px-4 py-2 text-white"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const clubIds = memberships.map((membership) => membership.club_id)

  const { data: clubs, error: clubsError } = await supabase
    .from('clubs')
    .select('id, name, created_at')
    .in('id', clubIds)

  console.log('DASHBOARD CLUBS:', clubs)
  console.log('DASHBOARD CLUBS ERROR:', clubsError)

  if (clubsError) {
    return <div>Error al cargar los datos de los clubes</div>
  }

  return (
    <main className="min-h-screen bg-[#FBF9F6] p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-[#1E293B]">Mis clubes</h1>

        <div className="mt-8 grid gap-4">
          {clubs?.map((club) => {
            const membership = memberships.find((m) => m.club_id === club.id)

            return (
              <div key={club.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#1E293B]">
                  {club.name}
                </h2>

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
      </div>
    </main>
  )
}