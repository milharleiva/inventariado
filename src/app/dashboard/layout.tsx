import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-black">Inventario</h1>
            <form action="/api/logout" method="POST">
              <button type="submit" className="text-red-600 hover:text-red-800 text-sm">
                Cerrar sesión
              </button>
            </form>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-black hover:text-blue-600">Inicio</Link>
            <Link href="/dashboard/productos" className="text-black hover:text-blue-600">Productos</Link>
            <Link href="/dashboard/espacios" className="text-black hover:text-blue-600">Espacios</Link>
            <Link href="/dashboard/inventario" className="text-black hover:text-blue-600">Inventario</Link>
            <Link href="/dashboard/reporte" className="text-black hover:text-blue-600">Reporte</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}