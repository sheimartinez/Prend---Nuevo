export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#FBF9F6] p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-[#1E293B]">Dashboard de Prendé</h1>
        <p className="mt-2 text-[#475569]">
          Ya estás dentro de la app real. Este va a ser el panel principal del SaaS.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B]">Socios activos</h2>
            <p className="mt-2 text-3xl font-bold text-[#76A889]">24</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B]">Cuotas pendientes</h2>
            <p className="mt-2 text-3xl font-bold text-[#E07A5F]">6</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B]">Avisos enviados</h2>
            <p className="mt-2 text-3xl font-bold text-[#6B8E23]">12</p>
          </div>
        </div>
      </div>
    </main>
  )
}