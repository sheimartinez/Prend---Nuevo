import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-[#FBF9F6]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-8 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border bg-white px-4 py-2 text-sm text-gray-600">
            Gestión privada para clubes
          </p>

          <h1 className="text-5xl font-bold tracking-tight text-[#1E293B] sm:text-6xl">
            Prendé
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Plataforma interna para organizar socios, accesos e invitaciones de forma privada.
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
            No es e-commerce, no permite venta pública y no promueve consumo. Está pensada como herramienta administrativa privada para clubes registrados.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={user ? '/dashboard' : '/login'}
              className="rounded-lg bg-[#76A889] px-5 py-3 text-sm font-semibold text-white"
            >
              {user ? 'Ir al dashboard' : 'Ingresar'}
            </Link>

            <a
              href="#seguridad"
              className="rounded-lg border bg-white px-5 py-3 text-sm font-semibold text-[#1E293B]"
            >
              Ver enfoque
            </a>
          </div>
        </div>

        <div id="seguridad" className="mt-20 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="font-semibold text-[#1E293B]">Acceso privado</h2>
            <p className="mt-2 text-sm text-gray-500">
              Solo usuarios autenticados y miembros del club pueden acceder al panel interno.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="font-semibold text-[#1E293B]">Gestión de socios</h2>
            <p className="mt-2 text-sm text-gray-500">
              Administra miembros, roles e invitaciones desde un espacio cerrado.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="font-semibold text-[#1E293B]">Sin venta pública</h2>
            <p className="mt-2 text-sm text-gray-500">
              La plataforma no incluye marketplace, tienda ni promoción pública de productos.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}