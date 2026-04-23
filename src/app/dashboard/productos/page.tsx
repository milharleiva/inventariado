"use client";

import { useState, useEffect } from "react";
import { productService, spaceService, inventoryService, type Product } from "@/lib/services";

interface ProductoCarrito {
  nombre: string;
  descripcion: string;
  cantidad: number;
  nuevos: number;
  usados: number;
  notas: string;
  fechaIngreso: string;
  espacioId: string;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [espacios, setEspacios] = useState<{ id: string; nombre: string }[]>([]);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState<ProductoCarrito>({
    nombre: "", descripcion: "", cantidad: 0, nuevos: 0, usados: 0, notas: "", fechaIngreso: "", espacioId: ""
  });

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const [p, e] = await Promise.all([
      productService.getAll(),
      spaceService.getAll(),
    ]);
    setProductos(p);
    setEspacios(e);
    setLoading(false);
  }

  function agregarAlCarrito() {
    if (!nuevo.nombre.trim() || !nuevo.espacioId) return;
    setCarrito([...carrito, { ...nuevo }]);
    setNuevo({ nombre: "", descripcion: "", cantidad: 0, nuevos: 0, usados: 0, notas: "", fechaIngreso: "", espacioId: "" });
  }

  function quitarDelCarrito(index: number) {
    setCarrito(carrito.filter((_, i) => i !== index));
  }

  async function guardarTodos() {
    for (const p of carrito) {
      const { espacioId, ...productoData } = p;
      const prod = await productService.create(productoData);

      if (espacioId) {
        await inventoryService.createItem({
          productId: prod.id,
          spaceId: espacioId,
          cantidad: p.cantidad,
        });
      }
    }
    setCarrito([]);
    setShowForm(false);
    loadAll();
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await productService.delete(id);
    loadAll();
  }

  function productosFiltrados() {
    if (!filtro) return productos;
    return productos.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()));
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">Productos</h2>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Agregar
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="p-2 border rounded text-black w-full"
          />
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left text-black">Nombre</th>
                <th className="p-3 text-left text-black">Descripción</th>
                <th className="p-3 text-center text-black">Cant.</th>
                <th className="p-3 text-center text-black">Nuevos</th>
                <th className="p-3 text-center text-black">Usados</th>
                <th className="p-3 text-left text-black">Fecha</th>
                <th className="p-3 text-left text-black">Notas</th>
                <th className="p-3 text-center text-black w-16">Del</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-black">Cargando...</td></tr>
              ) : productosFiltrados().length === 0 ? (
                <tr><td colSpan={8} className="p-3 text-center text-black">Sin productos</td></tr>
              ) : productosFiltrados().map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3 text-black">{p.nombre}</td>
                  <td className="p-3 text-black">{p.descripcion || "-"}</td>
                  <td className="p-3 text-center text-black">{p.cantidad}</td>
                  <td className="p-3 text-center text-black">{p.nuevos}</td>
                  <td className="p-3 text-center text-black">{p.usados}</td>
                  <td className="p-3 text-black">{p.fechaIngreso || "-"}</td>
                  <td className="p-3 text-black">{p.notas || "-"}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleEliminar(p.id)} className="text-red-500 hover:text-red-700">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="w-96 bg-white p-4 rounded shadow h-fit sticky top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-black">Agregar Producto</h3>
            <button onClick={() => { setShowForm(false); setCarrito([]); }} className="text-gray-500 hover:text-black">×</button>
          </div>

          <div className="space-y-3">
            <input type="text" placeholder="Nombre *" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} className="w-full p-2 border rounded text-black" />
            <input type="text" placeholder="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} className="w-full p-2 border rounded text-black" />
            <div className="flex gap-2">
              <input type="number" placeholder="Cant." value={nuevo.cantidad || ""} onChange={(e) => setNuevo({ ...nuevo, cantidad: parseInt(e.target.value) || 0 })} className="w-full p-2 border rounded text-black" />
              <input type="number" placeholder="Nuevos" value={nuevo.nuevos || ""} onChange={(e) => setNuevo({ ...nuevo, nuevos: parseInt(e.target.value) || 0 })} className="w-full p-2 border rounded text-black" />
              <input type="number" placeholder="Usados" value={nuevo.usados || ""} onChange={(e) => setNuevo({ ...nuevo, usados: parseInt(e.target.value) || 0 })} className="w-full p-2 border rounded text-black" />
            </div>
            <select value={nuevo.espacioId} onChange={(e) => setNuevo({ ...nuevo, espacioId: e.target.value })} className="w-full p-2 border rounded text-black">
              <option value="">Asignar a espacio...</option>
              {espacios.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
            <input type="text" placeholder="Fecha ingreso" value={nuevo.fechaIngreso} onChange={(e) => setNuevo({ ...nuevo, fechaIngreso: e.target.value })} className="w-full p-2 border rounded text-black" />
            <textarea placeholder="Notas" value={nuevo.notas} onChange={(e) => setNuevo({ ...nuevo, notas: e.target.value })} className="w-full p-2 border rounded text-black" rows={2} />
            <button onClick={agregarAlCarrito} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Agregar al carrito</button>
          </div>

          {carrito.length > 0 && (
            <div className="border-t mt-4 pt-4">
              <p className="font-bold text-black mb-2">Carrito ({carrito.length})</p>
              <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {carrito.map((p, i) => (
                  <li key={i} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                    <div>
                      <div className="text-black">{p.nombre}</div>
                      <div className="text-black text-xs">Cant: {p.cantidad} | {espacios.find(e => e.id === p.espacioId)?.nombre}</div>
                    </div>
                    <button onClick={() => quitarDelCarrito(i)} className="text-red-500 hover:text-red-700">×</button>
                  </li>
                ))}
              </ul>
              <button onClick={guardarTodos} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Agregar {carrito.length} producto{carrito.length > 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}