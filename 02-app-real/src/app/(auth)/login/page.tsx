import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex bg-[#FBF9F6] min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#1E293B]">
            Ingresar a Prendé
          </h2>
          <p className="mt-2 text-center text-sm text-[#475569]">
            Plataforma de gestión para Clubes
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-lg border-0 py-3 px-4 text-[#1E293B] ring-1 ring-inset ring-neutral-300 placeholder:text-[#94A3B8] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#76A889] sm:text-sm sm:leading-6"
                placeholder="Correo Electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-lg border-0 py-3 px-4 text-[#1E293B] ring-1 ring-inset ring-neutral-300 placeholder:text-[#94A3B8] focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#76A889] sm:text-sm sm:leading-6"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              formAction={login}
              className="flex w-full justify-center rounded-lg bg-[#76A889] px-3 py-3 text-sm font-semibold text-white hover:bg-[#639276] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76A889] transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              formAction={signup}
              className="flex w-full justify-center rounded-lg border border-[#76A889] bg-transparent px-3 py-3 text-sm font-semibold text-[#76A889] hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76A889] transition-colors"
            >
              Crear Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
