export default async function ClubAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-6 max-w-5xl">
      <a href={`/club/${id}`} className="text-sm text-green-700">
        ← Volver al club
      </a>

      <h1 className="text-2xl font-bold mt-4">Panel administrativo</h1>

      <p className="text-sm text-gray-600 mt-1">
        Herramientas privadas de gestión interna del club.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <a
          href={`/club/${id}/inventory`}
          className="border rounded-xl p-5 hover:bg-gray-50"
        >
          <h2 className="text-lg font-semibold">Disponibilidad interna</h2>
          <p className="text-sm text-gray-600 mt-1">
            Inventario, movimientos, historial y alertas internas.
          </p>
        </a>

        <a
          href={`/club/${id}/fees`}
          className="border rounded-xl p-5 hover:bg-gray-50"
        >
          <h2 className="text-lg font-semibold">Cuotas sociales</h2>
          <p className="text-sm text-gray-600 mt-1">
            Estado de cuenta, cuotas pendientes y registro de pagos internos.
          </p>
        </a>

        <a
          href={`/club/${id}/settings`}
          className="border rounded-xl p-5 hover:bg-gray-50"
        >
          <h2 className="text-lg font-semibold">Configuración del club</h2>
          <p className="text-sm text-gray-600 mt-1">
            Nombre visible, logo y colores del club.
          </p>
        </a>

        <a
          href={`/club/${id}`}
          className="border rounded-xl p-5 hover:bg-gray-50"
        >
          <h2 className="text-lg font-semibold">Socios e invitaciones</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gestión de miembros, roles e invitaciones privadas.
          </p>
        </a>

        <a
  href={`/club/${id}/bulk-invitations`}
  className="border rounded-xl p-5 hover:bg-gray-50"
>
  <h2 className="text-lg font-semibold">Invitaciones masivas</h2>
  <p className="text-sm text-gray-600 mt-1">
    Cargar varios emails, ver cupos y respetar el límite legal del club.
  </p>
</a>
      </div>
    </div>
  );
}