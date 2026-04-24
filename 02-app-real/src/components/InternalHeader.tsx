import Link from 'next/link'

type InternalHeaderProps = {
  userEmail?: string
}

export default function InternalHeader({ userEmail }: InternalHeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <Link href="/dashboard" className="text-xl font-bold text-[#1E293B]">
          Prendé
        </Link>

        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="hidden rounded-full border bg-[#FBF9F6] px-3 py-1 text-sm text-gray-600 sm:inline">
              {userEmail}
            </span>
          )}

          <form action="/logout" method="post">
            <button className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}