"use client";

import { useState, useEffect } from "react";
import { spaceService, type Space } from "@/lib/services";

export default function EspaciosPage() {
  const [espacios, setEspacios] = useState<Space[]>([]);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [carrito, setCarrito] = useState<string[]>([]);
  const [nuevo, setNuevo] = useState("");

  useEffect(() => { loadEspacios(); }, []);

  async function loadEspacios() {
    const data = await spaceService.getAll();
    setEspacios(data);
  }

  function agregarAlCarrito() {
    if (!nuevo.trim()) return;
    if (carrito.includes(nuevo.trim())) return;
    setCarrito([...carrito, nuevo.trim()]);
    setNuevo("");
  }

  function quitarDelCarrito(index: number) {
    setCarrito(carrito.filter((_, i) => i !== index));
  }

  async function guardarTodos() {
    for (const nombre of carrito) {
      await spaceService.create({ nombre });
    }
    setCarrito([]);
    setShowForm(false);
    loadEspacios();
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar este espacio?")) return;
    await spaceService.delete(id);
    loadEspacios();
  }

  function espaciosFiltrados() {
    if (!filtro) return espacios;
    return espacios.filter(e => e.nombre.toLowerCase().includes(filtro.toLowerCase()));
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">Espacios</h2>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Agregar
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar espacio..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="p-2 border rounded text-black w-full"
          />
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full min-w-[300px]">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left text-black">Nombre</th>
                <th className="p-3 text-center text-black w-24">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {espaciosFiltrados().length === 0 ? (
                <tr><td colSpan={2} className="p-3 text-center text-black">Sin espacios</td></tr>
              ) : espaciosFiltrados().map(e => (
                <tr key={e.id} className="border-t">
                  <td className="p-3 text-black">{e.nombre}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleEliminar(e.id)} className="text-red-500 hover:text-red-700">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="w-80 bg-white p-4 rounded shadow h-fit sticky top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-black">Agregar Espacio</h3>
            <button onClick={() => { setShowForm(false); setCarrito([]); }} className="text-gray-500 hover:text-black">×</button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre (ej: Baño Damas)"
              value={nuevo}
              onChange={(e) => setNuevo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && agregarAlCarrito()}
              className="w-full p-2 border rounded text-black"
            />
            <button onClick={agregarAlCarrito} className="w-full bg-gray-200 text-black py-2 rounded hover:bg-gray-300">
              + Agregar al carrito
            </button>
          </div>

          {carrito.length > 0 && (
            <div className="border-t mt-4 pt-4">
              <p className="font-bold text-black mb-2">Carrito ({carrito.length})</p>
              <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {carrito.map((e, i) => (
                  <li key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-black">{e}</span>
                    <button onClick={() => quitarDelCarrito(i)} className="text-red-500 hover:text-red-700">×</button>
                  </li>
                ))}
              </ul>
              <button onClick={guardarTodos} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Agregar {carrito.length} espacio{carrito.length > 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}