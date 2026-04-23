interface BaseFormProps {
  onCancel: () => void;
  onSubmit: (data: unknown) => Promise<void>;
  loading: boolean;
  submitLabel?: string;
}

interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "textarea";
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function BaseForm({ onCancel, onSubmit, loading, submitLabel = "Guardar", children, fields }: BaseFormProps & { children?: React.ReactNode; fields: FormField[] }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }} className="bg-white p-6 rounded shadow mb-6">
      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-black mb-1">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                placeholder={field.placeholder}
                required={field.required}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
            )}
          </div>
        ))}
        {children}
      </div>
      <div className="flex gap-2 mt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">Cancelar</button>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}