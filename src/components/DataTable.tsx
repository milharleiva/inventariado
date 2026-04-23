interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({ data, columns, emptyMessage = "Sin datos", actions }: DataTableProps<T>) {
  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th key={String(col.key)} className={`p-3 text-black ${i === 0 ? "text-left" : i === columns.length - 1 ? "text-right" : "text-left"}`}>{col.label}</th>
            ))}
            {actions && columns.length === 1 && <th className="p-3 text-right text-black"></th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="p-3 text-center text-black">{emptyMessage}</td></tr>
          ) : data.map(item => (
            <tr key={item.id} className="border-t">
              {columns.map((col, i) => (
                <td key={String(col.key)} className={`p-3 text-black ${i === columns.length - 1 ? "text-right" : ""}`}>
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key as string] ?? "")}
                </td>
              ))}
              {actions && columns.length === 1 && <td className="p-3 text-right">{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}