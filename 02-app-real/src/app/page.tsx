export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 px-6">
      
      <h1 className="text-3xl font-bold mb-4 text-center">
        Gestión privada para clubes
      </h1>

      <h2 className="text-xl font-semibold mb-2">Prendé</h2>

      <p className="max-w-xl text-gray-600 text-center mb-6">
        Plataforma interna para organizar socios, accesos e invitaciones de forma privada.
      </p>

      <p className="max-w-xl text-sm text-gray-500 text-center mb-10">
        No es e-commerce, no permite venta pública y no promueve consumo.
        Está pensada como herramienta administrativa privada para clubes registrados.
      </p>

      <div className="flex gap-4">
        <a
          href="/dashboard"
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Ingresar
        </a>

        <a
          href="#"
          className="border px-6 py-2 rounded-lg"
        >
          Ver enfoque
        </a>
      </div>

      <div className="mt-12 max-w-2xl space-y-4">
        <div>
          <h3 className="font-semibold">Acceso privado</h3>
          <p className="text-sm text-gray-600">
            Solo usuarios autenticados y miembros del club pueden acceder al panel interno.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Gestión de socios</h3>
          <p className="text-sm text-gray-600">
            Administra miembros, roles e invitaciones desde un espacio cerrado.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Sin venta pública</h3>
          <p className="text-sm text-gray-600">
            La plataforma no incluye marketplace, tienda ni promoción pública de productos.
          </p>
        </div>
      </div>

    </div>
  );
}