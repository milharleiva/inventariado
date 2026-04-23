import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  tabs?: { label: string; active: boolean; onClick: () => void }[];
  children?: ReactNode;
}

export function PageHeader({ title, action, tabs, children }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-black">{title}</h2>
        {children}
      </div>
      <div className="flex gap-4">
        {tabs?.map((tab, i) => (
          <button
            key={i}
            onClick={tab.onClick}
            className={`px-4 py-2 rounded ${tab.active ? "bg-blue-600 text-white" : "bg-white text-black border"}`}
          >
            {tab.label}
          </button>
        ))}
        {action && (
          <button
            onClick={action.onClick}
            className={`px-4 py-2 rounded ${action.variant === "secondary" ? "bg-gray-200 text-black hover:bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}