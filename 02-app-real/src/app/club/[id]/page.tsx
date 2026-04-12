type ClubPageProps = {
  params: Promise<{ id: string }>
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-[#FBF9F6] p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-[#1E293B]">Panel del Club</h1>
        <p className="mt-2 text-[#475569]">
          Estás entrando al club con ID:
        </p>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-[#1E293B]">{id}</p>
        </div>
      </div>
    </main>
  )
}