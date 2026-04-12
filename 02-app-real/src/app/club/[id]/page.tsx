import { createClient } from '@/lib/supabase/server'

type ClubPageProps = {
  params: Promise<{ id: string }>
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: club } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', id)
    .single()

  return (
    <main className="min-h-screen bg-[#FBF9F6] p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-[#1E293B]">
          {club?.name ?? 'Club no encontrado'}
        </h1>
        <p className="mt-2 text-[#475569]">
          Este es el panel interno del club.
        </p>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-[#64748B]">ID del club</p>
          <p className="mt-1 text-lg font-semibold text-[#1E293B]">{id}</p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-[#1E293B]">Feed del Club</h2>
    <p className="mt-1 text-sm text-[#64748B]">
      Acá van a aparecer publicaciones del club y de sus socios.
    </p>

    <div className="mt-6 space-y-4">
      <div className="rounded-xl border border-neutral-200 p-4">
        <p className="font-semibold text-[#1E293B]">Club Prendé Demo</p>
        <p className="mt-2 text-[#475569]">
          Bienvenidos al espacio interno del club. Acá vamos a compartir avisos,
          novedades y publicaciones.
        </p>

        <div className="mt-4 flex gap-4 text-sm text-[#64748B]">
          <span>❤️ 12 Me gusta</span>
          <span>💬 4 comentarios</span>
        </div>
      </div>
    </div>
  </div>

  <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-[#1E293B]">Resumen rápido</h2>
    <div className="mt-4 space-y-3 text-sm text-[#475569]">
      <p>📢 Avisos generales del club</p>
      <p>🪴 Próximamente</p>
      <p>📊 Estadísticas internas</p>
      <p>💬 Comunidad privada</p>
    </div>
  </div>
  <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
  <h2 className="text-xl font-semibold text-[#1E293B]">Próximamente</h2>
  <div className="mt-4 space-y-4">
    <div className="rounded-xl bg-[#FBF9F6] p-4">
      <p className="font-semibold text-[#1E293B]">Genética nueva</p>
      <p className="mt-1 text-sm text-[#64748B]">
        Se viene una nueva incorporación al club en las próximas semanas.
      </p>
    </div>

    <div className="rounded-xl bg-[#FBF9F6] p-4">
      <p className="font-semibold text-[#1E293B]">Accesorios legales</p>
      <p className="mt-1 text-sm text-[#64748B]">
        Próximamente se suman nuevos productos a la tienda legal interna.
      </p>
    </div>
  </div>
</div>
<div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
  <h2 className="text-xl font-semibold text-[#1E293B]">Noticias</h2>
  <div className="mt-4 space-y-4">
    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="text-sm font-semibold text-[#76A889]">Actualidad</p>
      <p className="mt-1 font-semibold text-[#1E293B]">
        Cambios regulatorios en la región
      </p>
      <p className="mt-1 text-sm text-[#64748B]">
        Acá vamos a mostrar novedades relevantes sobre cannabis, regulación y clubes.
      </p>
    </div>

    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="text-sm font-semibold text-[#76A889]">Comunidad</p>
      <p className="mt-1 font-semibold text-[#1E293B]">
        Noticias del ecosistema cannábico
      </p>
      <p className="mt-1 text-sm text-[#64748B]">
        Este bloque después se puede conectar a noticias reales o contenido curado.
      </p>
    </div>
  </div>
</div>
</div>
      </div>
    </main>
  )
}