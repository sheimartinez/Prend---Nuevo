import {
  createProduct,
  deleteProduct,
  getProducts,
  registerMovement,
  getMovements,
} from "./actions";

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await getProducts(id);
  const movements = await getMovements(id);

  const lowStockProducts = products.filter(
    (product: any) =>
      Number(product.stock || 0) <= Number(product.low_stock_threshold || 5)
  );

  return (
    <div className="p-6 max-w-5xl">
      <a href={`/club/${id}`} className="text-sm text-green-700">
        ← Volver al club
      </a>

      <h1 className="text-2xl font-bold mt-4">Disponibilidad interna</h1>

      <p className="text-sm text-gray-600 mt-1">
        Registro privado del club. No es tienda, venta pública ni checkout.
      </p>

      {lowStockProducts.length > 0 && (
        <div className="border border-red-300 bg-red-50 rounded-xl p-4 mt-6">
          <h2 className="font-semibold text-red-700">
            Alertas de cantidad baja
          </h2>

          <div className="mt-2 space-y-1">
            {lowStockProducts.map((product: any) => (
              <div key={product.id} className="text-sm text-red-700">
                {product.name}: cantidad actual {product.stock}
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        action={createProduct}
        className="border rounded-xl p-4 mt-6 space-y-4"
      >
        <input type="hidden" name="club_id" value={id} />

        <div>
          <label className="block text-sm font-medium">Ítem interno</label>
          <input
            name="name"
            required
            placeholder="Ej: Registro interno 01"
            className="w-full border rounded p-2"
          />
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium">
              Cantidad referencial
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue="0"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Alerta desde cantidad
            </label>
            <input
              name="low_stock_threshold"
              type="number"
              min="0"
              defaultValue="5"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Estado</label>
            <select name="status" className="w-full border rounded p-2">
              <option value="disponible">Disponible</option>
              <option value="no disponible">No disponible</option>
              <option value="en revisión">En revisión</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Categoría</label>
            <input
              name="category"
              placeholder="Ej: flores, semillas, insumos"
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Notas internas</label>
          <textarea
            name="notes"
            placeholder="Observaciones privadas del club"
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        <button className="bg-black text-white px-4 py-2 rounded">
          Agregar registro
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Registros internos</h2>

        {products.length === 0 ? (
          <div className="border rounded-xl p-4 mt-3 text-gray-600">
            Todavía no hay registros internos.
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {products.map((product: any) => {
              const isLowStock =
                Number(product.stock || 0) <=
                Number(product.low_stock_threshold || 5);

              return (
                <div
                  key={product.id}
                  className={`border rounded-xl p-4 ${
                    isLowStock ? "border-red-300 bg-red-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-semibold">{product.name}</div>

                      <div className="text-sm text-gray-600 mt-1">
                        Cantidad referencial: {product.stock}
                      </div>

                      <div className="text-sm text-gray-600">
                        Alerta desde: {product.low_stock_threshold || 5}
                      </div>

                      {isLowStock && (
                        <div className="text-sm text-red-700 font-medium mt-1">
                          Requiere revisión por cantidad baja
                        </div>
                      )}

                      <div className="text-sm text-gray-600">
                        Estado: {product.status || "en revisión"}
                      </div>

                      {product.category && (
                        <div className="text-sm text-gray-600">
                          Categoría: {product.category}
                        </div>
                      )}

                      {product.notes && (
                        <p className="text-sm text-gray-700 mt-2">
                          {product.notes}
                        </p>
                      )}

                      <form
                        action={registerMovement}
                        className="mt-4 border-t pt-3 flex flex-wrap gap-2"
                      >
                        <input type="hidden" name="club_id" value={id} />
                        <input
                          type="hidden"
                          name="product_id"
                          value={product.id}
                        />

                        <input
                          name="quantity"
                          type="number"
                          min="1"
                          placeholder="Cantidad"
                          className="border rounded p-2 w-28"
                        />

                        <input
                          name="notes"
                          placeholder="Nota interna"
                          className="border rounded p-2 flex-1 min-w-[180px]"
                        />

                        <button className="bg-gray-800 text-white px-3 py-2 rounded">
                          Registrar salida
                        </button>
                      </form>
                    </div>

                    <form action={deleteProduct}>
                      <input type="hidden" name="club_id" value={id} />
                      <input
                        type="hidden"
                        name="product_id"
                        value={product.id}
                      />
                      <button className="text-sm text-red-600">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Historial de movimientos</h2>

        {movements.length === 0 ? (
          <div className="border rounded-xl p-4 mt-3 text-gray-600">
            No hay movimientos registrados.
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {movements.map((m: any) => (
              <div key={m.id} className="border rounded-xl p-4">
                <div className="text-sm font-medium">
                  {m.products?.name || "Registro"}
                </div>

                <div className="text-sm text-gray-600">Tipo: {m.type}</div>

                <div className="text-sm text-gray-600">
                  Cantidad: {m.quantity}
                </div>

                {m.notes && (
                  <div className="text-sm text-gray-700 mt-1">
                    Nota: {m.notes}
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-2">
                  {new Date(m.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}