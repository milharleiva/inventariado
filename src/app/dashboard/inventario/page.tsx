"use client";

import { useState, useEffect } from "react";
import { inventoryService, spaceService, type InventoryItem, type Space } from "@/lib/services";

export default function InventarioPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [espacios, setEspacios] = useState<Space[]>([]);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState<string>("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    const [i, e] = await Promise.all([
      inventoryService.getAllItems(),
      spaceService.getAll(),
    ]);
    setItems(i);
    setEspacios(e);
    if (e.length > 0) setEspacioSeleccionado(e[0].id);
  }

  async function handleMovement(itemId: string, tipo: "ENTRADA" | "SALIDA") {
    const cantidad = prompt(`${tipo === "ENTRADA" ? "Entrada" : "Salida"} (cantidad):`);
    if (!cantidad || parseInt(cantidad) <= 0) return;
    await inventoryService.createMovement({ inventoryItemId: itemId, tipo, cantidad: parseInt(cantidad) });
    loadAll();
  }

  const itemsDelEspacio = items.filter(item => {
    if (espacioSeleccionado && item.space.id !== espacioSeleccionado) return false;
    if (filtro) {
      const texto = filtro.toLowerCase();
      return item.product.nombre.toLowerCase().includes(texto);
    }
    return true;
  });

  const totalCantidad = itemsDelEspacio.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">Inventario</h2>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {espacios.map(e => (
          <button
            key={e.id}
            onClick={() => setEspacioSeleccionado(e.id)}
            className={`px-4 py-2 rounded ${espacioSeleccionado === e.id ? "bg-blue-600 text-white" : "bg-white border text-black"}`}
          >
            {e.nombre}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="p-2 border rounded text-black w-full max-w-xs"
        />
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left text-black">Producto</th>
              <th className="p-3 text-center text-black">Cant.</th>
              <th className="p-3 text-center text-black w-24">+</th>
              <th className="p-3 text-center text-black w-24">-</th>
            </tr>
          </thead>
          <tbody>
            {itemsDelEspacio.length === 0 ? (
              <tr><td colSpan={4} className="p-3 text-center text-black">Sin productos en este espacio</td></tr>
            ) : itemsDelEspacio.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-3 text-black">{item.product.nombre}</td>
                <td className="p-3 text-center text-black font-bold text-xl">{item.cantidad}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleMovement(item.id, "ENTRADA")} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">+</button>
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => handleMovement(item.id, "SALIDA")} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">-</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-black">
        Total: <span className="font-bold">{totalCantidad}</span> items
      </div>
    </div>
  );
}