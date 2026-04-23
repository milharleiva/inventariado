"use client";

import { useState, useEffect, useMemo } from "react";
import { jsPDF } from "jspdf";
import { inventoryService, spaceService, type InventoryItem, type Space } from "@/lib/services";

export default function ReportePage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [espaciosSeleccionados, setEspaciosSeleccionados] = useState<string[]>([]);
  const [filtroProducto, setFiltroProducto] = useState("");
  const [soloStock, setSoloStock] = useState(false);
  const [mostrarSelectorEspacios, setMostrarSelectorEspacios] = useState(false);

  useEffect(() => {
    Promise.all([
      inventoryService.getAllItems(),
      spaceService.getAll()
    ]).then(([itemsData, spacesData]) => {
      setItems(itemsData);
      setSpaces(spacesData);
      setEspaciosSeleccionados(spacesData.map(s => s.id));
    });
  }, []);

  const espaciosFiltrados = useMemo(() => {
    if (!filtroProducto) return spaces;
    const lower = filtroProducto.toLowerCase();
    return spaces.filter(s => s.nombre.toLowerCase().includes(lower));
  }, [spaces, filtroProducto]);

  const itemsFiltrados = useMemo(() => {
    return items.filter(item => {
      if (soloStock && item.cantidad === 0) return false;
      if (filtroProducto && !item.product.nombre.toLowerCase().includes(filtroProducto.toLowerCase())) return false;
      if (espaciosSeleccionados.length > 0 && !espaciosSeleccionados.includes(item.space.id)) return false;
      return true;
    });
  }, [items, filtroProducto, soloStock, espaciosSeleccionados]);

  const totalesPorEspacio = useMemo(() => {
    const totales: Record<string, number> = {};
    itemsFiltrados.forEach(item => {
      const espacio = item.space.nombre;
      totales[espacio] = (totales[espacio] || 0) + item.cantidad;
    });
    return totales;
  }, [itemsFiltrados]);

  const toggleEspacio = (spaceId: string) => {
    setEspaciosSeleccionados(prev => 
      prev.includes(spaceId)
        ? prev.filter(id => id !== spaceId)
        : [...prev, spaceId]
    );
  };

  const seleccionarTodosEspacios = () => {
    if (espaciosSeleccionados.length === spaces.length) {
      setEspaciosSeleccionados([]);
    } else {
      setEspaciosSeleccionados(spaces.map(s => s.id));
    }
  };

  function generarPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.text("Reporte de Inventario", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-CL")}`, pageWidth / 2, 22, { align: "center" });

    const filtros = [];
    if (filtroProducto) filtros.push(`Producto: ${filtroProducto}`);
    if (espaciosSeleccionados.length < spaces.length) filtros.push(`Espacios: ${espaciosSeleccionados.length}/${spaces.length} seleccionados`);
    if (soloStock) filtros.push("Solo con stock");
    
    if (filtros.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Filtros: ${filtros.join(" | ")}`, pageWidth / 2, 28, { align: "center" });
    }

    const itemsPorEspacio: Record<string, typeof itemsFiltrados> = {};
    itemsFiltrados.forEach(item => {
      const espacioNombre = item.space.nombre;
      if (!itemsPorEspacio[espacioNombre]) {
        itemsPorEspacio[espacioNombre] = [];
      }
      itemsPorEspacio[espacioNombre].push(item);
    });

    let y = 38;

    Object.entries(itemsPorEspacio).forEach(([espacioNombre, items]) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(espacioNombre, 15, y);
      
      const totalEspacio = items.reduce((sum, item) => sum + item.cantidad, 0);
      doc.text(`Total: ${totalEspacio}`, pageWidth - 15, y, { align: "right" });
      y += 4;
      
      doc.setDrawColor(60);
      doc.line(15, y, pageWidth - 15, y);
      y += 6;

      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text("Producto", 15, y);
      doc.text("Cant.", 120, y, { align: "right" });
      doc.text("Nuevos", 140, y, { align: "right" });
      doc.text("Usados", 160, y, { align: "right" });
      doc.text("Descripción", 70, y);
      y += 4;

      doc.setDrawColor(200);
      doc.line(15, y, pageWidth - 15, y);
      y += 5;

      doc.setTextColor(0);
      doc.setFontSize(9);

      items.forEach(item => {
        if (y > 270) {
          doc.addPage();
          y = 20;
          
          doc.setFontSize(10);
          doc.text(espacioNombre, 15, y);
          const totalEspacio = items.reduce((sum, i) => sum + i.cantidad, 0);
          doc.text(`Total: ${totalEspacio}`, pageWidth - 15, y, { align: "right" });
          y += 6;
          
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text("Producto", 15, y);
          doc.text("Cant.", 120, y, { align: "right" });
          doc.text("Nuevos", 140, y, { align: "right" });
          doc.text("Usados", 160, y, { align: "right" });
          doc.text("Descripción", 70, y);
          y += 4;
          
          doc.setDrawColor(200);
          doc.line(15, y, pageWidth - 15, y);
          y += 5;
          
          doc.setTextColor(0);
          doc.setFontSize(9);
        }

        const nombre = item.product.nombre.length > 30 ? item.product.nombre.substring(0, 27) + "..." : item.product.nombre;
        const desc = item.product.descripcion ? (item.product.descripcion.length > 25 ? item.product.descripcion.substring(0, 22) + "..." : item.product.descripcion) : "";
        
        doc.text(nombre, 15, y);
        doc.text(String(item.cantidad), 120, y, { align: "right" });
        doc.text(String(item.product.nuevos || 0), 140, y, { align: "right" });
        doc.text(String(item.product.usados || 0), 160, y, { align: "right" });
        doc.text(desc, 70, y);
        y += 6;
      });

      y += 3;
    });

    y += 5;
    doc.setDrawColor(100);
    doc.line(15, y, pageWidth - 15, y);
    y += 8;

    doc.setFontSize(11);
    doc.text(`Total items: ${itemsFiltrados.length}`, 15, y);
    doc.text(`Total unidades: ${itemsFiltrados.reduce((sum, item) => sum + item.cantidad, 0)}`, 90, y);

    const espacioKeys = Object.keys(totalesPorEspacio);
    if (espacioKeys.length > 0) {
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Totales por espacio:", 15, y);
      y += 6;
      doc.setTextColor(0);
      espacioKeys.forEach(espacio => {
        doc.text(`${espacio}: ${totalesPorEspacio[espacio]}`, 15, y);
        y += 5;
      });
    }

    doc.save(`inventario_${new Date().toISOString().split("T")[0]}.pdf`);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Reporte</h2>
        <button onClick={generarPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Exportar PDF
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-black mb-1">Filtrar por producto</label>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={filtroProducto}
              onChange={(e) => setFiltroProducto(e.target.value)}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div className="flex-1 min-w-[250px] relative">
            <label className="block text-sm text-black mb-1">
              Espacios ({espaciosSeleccionados.length}/{spaces.length})
            </label>
            <button
              type="button"
              onClick={() => setMostrarSelectorEspacios(!mostrarSelectorEspacios)}
              className="w-full p-2 border rounded bg-white text-black text-left flex justify-between items-center"
            >
              <span className="truncate">
                {espaciosSeleccionados.length === spaces.length
                  ? "Todos los espacios"
                  : espaciosSeleccionados.length === 0
                    ? "Ningún espacio seleccionado"
                    : `${espaciosSeleccionados.length} espacio(s) seleccionado(s)`}
              </span>
              <span className="text-gray-500">▼</span>
            </button>
            
            {mostrarSelectorEspacios && (
              <div className="absolute z-10 w-full mt-1 border rounded bg-white shadow-lg max-h-60 overflow-y-auto">
                <label className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer border-b">
                  <input
                    type="checkbox"
                    checked={espaciosSeleccionados.length === spaces.length}
                    onChange={seleccionarTodosEspacios}
                    className="w-4 h-4"
                  />
                  <span className="text-black font-medium">Seleccionar todos</span>
                </label>
                {spaces.map(space => (
                  <label
                    key={space.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={espaciosSeleccionados.includes(space.id)}
                      onChange={() => toggleEspacio(space.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-black">{space.nombre}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={soloStock} onChange={(e) => setSoloStock(e.target.checked)} className="w-5 h-5" />
              <span className="text-black">Solo con stock</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left text-black">Producto</th>
              <th className="p-3 text-left text-black">Espacio</th>
              <th className="p-3 text-center text-black">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {itemsFiltrados.length === 0 ? (
              <tr><td colSpan={3} className="p-3 text-center text-black">Sin resultados</td></tr>
            ) : itemsFiltrados.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-3 text-black">{item.product.nombre}</td>
                <td className="p-3 text-black">{item.space.nombre}</td>
                <td className="p-3 text-center text-black font-bold">{item.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-black text-sm">Total: {itemsFiltrados.length} items ({itemsFiltrados.reduce((sum, item) => sum + item.cantidad, 0)} unidades)</p>
        
        {Object.keys(totalesPorEspacio).length > 0 && (
          <div className="text-sm text-gray-600">
            {Object.entries(totalesPorEspacio).map(([espacio, total]) => (
              <span key={espacio} className="mr-3">{espacio}: <span className="font-bold text-black">{total}</span></span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}