import { createFee, getFees, getMembers, markFeeAsPaid } from "./actions";

export default async function FeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const members = await getMembers(id);
  const fees = await getFees(id);

  const pendingFees = fees.filter((fee: any) => fee.status !== "pagada");

  return (
    <div className="p-6 max-w-5xl">
      <a href={`/club/${id}/admin`} className="text-sm text-green-700">
        ← Volver al panel administrativo
      </a>

      <h1 className="text-2xl font-bold mt-4">Cuotas sociales</h1>

      <p className="text-sm text-gray-600 mt-1">
        Estado de cuenta interno del club. Registro privado de cuotas sociales.
      </p>

      {pendingFees.length > 0 && (
        <div className="border border-red-300 bg-red-50 rounded-xl p-4 mt-6">
          <h2 className="font-semibold text-red-700">
            Cuotas pendientes
          </h2>

          <p className="text-sm text-red-700 mt-1">
            Hay {pendingFees.length} cuota(s) pendiente(s) de regularización.
          </p>
        </div>
      )}

      <form action={createFee} className="border rounded-xl p-4 mt-6 space-y-4">
        <input type="hidden" name="club_id" value={id} />

        <div>
          <label className="block text-sm font-medium">Socio</label>
          <select name="member_id" required className="w-full border rounded p-2">
            <option value="">Seleccionar socio</option>
            {members.map((member: any) => (
              <option key={member.id} value={member.id}>
                {member.user_id} — {member.role}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium">Monto UYU</label>
            <input
              name="amount"
              type="number"
              min="1"
              required
              placeholder="800"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Vencimiento</label>
            <input
              name="due_date"
              type="date"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Notas</label>
            <input
              name="notes"
              placeholder="Ej: cuota abril"
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded">
          Registrar cuota
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Estado de cuenta</h2>

        {fees.length === 0 ? (
          <div className="border rounded-xl p-4 mt-3 text-gray-600">
            Todavía no hay cuotas registradas.
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {fees.map((fee: any) => (
              <div
                key={fee.id}
                className={`border rounded-xl p-4 ${
                  fee.status !== "pagada" ? "border-red-300 bg-red-50" : ""
                }`}
              >
                <div className="font-semibold">Monto: ${fee.amount} UYU</div>

                <div className="text-sm text-gray-600">
                  Estado: {fee.status}
                </div>

                {fee.due_date && (
                  <div className="text-sm text-gray-600">
                    Vencimiento: {fee.due_date}
                  </div>
                )}

                {fee.notes && (
                  <div className="text-sm text-gray-700 mt-1">
                    Nota: {fee.notes}
                  </div>
                )}

                {fee.paid_at && (
                  <div className="text-sm text-gray-600">
                    Pagada el: {new Date(fee.paid_at).toLocaleString()}
                  </div>
                )}

                {fee.status !== "pagada" && (
                  <form action={markFeeAsPaid} className="mt-3">
                    <input type="hidden" name="club_id" value={id} />
                    <input type="hidden" name="fee_id" value={fee.id} />
                    <button className="bg-gray-800 text-white px-3 py-2 rounded">
                      Marcar como pagada
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}