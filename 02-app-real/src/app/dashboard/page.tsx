import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createClub } from './actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { count: clubsCount } = await supabase
    .from('clubs')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user?.id)

  const { data: clubs } = await supabase
    .from('clubs')
    .select('*')
    .eq('owner_id', user?.id)

  return (
    <main className="min-h-screen bg-[#FBF9F6] p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-[#1E293B]">Dashboard de Prendé</h1>
        <p className="mt-2 text-[#475569]">
          Ya estás dentro de la app real. Este panel ya está conectado a Supabase.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B]">Clubes registrados</h2>
            <p className="mt-2 text-3xl font-bold text-[#76A889]">
              {clubsCount ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B]">Estado</h2>
            <p className="mt-2 text-lg font-medium text-[#475569]">
              Conexión con Supabase activa
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B]">Siguiente paso</h2>
            <p className="mt-2 text-lg font-medium text-[#475569]">
              Empezar a cargar datos reales
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-[#1E293B]">
            Crear un club
          </h2>

          <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              name="name"
              placeholder="Nombre del club"
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-[#1E293B] outline-none focus:border-[#76A889]"
            />

            <button
              formAction={createClub}
              className="rounded-lg bg-[#76A889] px-4 py-3 font-semibold text-white hover:bg-[#639276]"
            >
              Crear Club
            </button>
          </form>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-[#1E293B]">
            Mis Clubs
          </h2>

          <div className="space-y-3">
            {clubs?.map((club) => (
              <div
                key={club.id}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
  <div>
    <p className="font-semibold text-[#1E293B]">{club.name}</p>
    <p className="mt-1 text-sm text-[#64748B]">ID: {club.id}</p>
  </div>

  <Link
  href={`/club/${club.id}`}
  className="rounded-lg bg-[#76A889] px-4 py-2 text-sm font-semibold text-white hover:bg-[#639276]"
>
  Entrar al club
</Link>
</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}