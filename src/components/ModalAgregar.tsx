"use client";

import { useState } from "react";
import { productService, spaceService } from "@/lib/services";

interface Props {
  onCerrar: () => void;
  onActualizar: () => void;
}

export default function ModalAgregar({ onCerrar, onActualizar }: Props) {
  const [productos, setProductos] = useState("");
  const [espacios, setEspacios] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const listaProductos = productos.split("\n").map(p => p.trim()).filter(p => p);
    const listaEspacios = espacios.split("\n").map(e => e.trim()).filter(e => e);

    for (const nombre of listaProductos) {
      if (!nombre) continue;

      const resProd = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      const prodData = await resProd.json();

      for (const nomEspacio of listaEspacios) {
        if (!nomEspacio) continue;

        const resEspacio = await fetch("/api/espacios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nomEspacio }),
        });
        const espData = await resEspacio.json();

        await fetch("/api/inventario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: prodData.id,
            spaceId: espData.id,
            cantidad: parseInt(cantidad) || 1,
          }),
        });
      }
    }

    setLoading(false);
    onActualizar();
    onCerrar();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-bold text-black mb-4">Agregar Stock</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-black mb-1">Productos (uno por línea)</label>
            <textarea
              value={productos}
              onChange={(e) => setProductos(e.target.value)}
              placeholder="Papel Higiénico&#10;Jabón&#10;Toallas"
              rows={5}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-black mb-1">Espacios (uno por línea)</label>
            <textarea
              value={espacios}
              onChange={(e) => setEspacios(e.target.value)}
              placeholder="Baño Damas&#10;Baño Varones&#10;Oficina"
              rows={3}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-black mb-1">Cantidad inicial</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-24 p-2 border rounded text-black text-center"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onCerrar} className="px-4 py-2 rounded border hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Guardando..." : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}