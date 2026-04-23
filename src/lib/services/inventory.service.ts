interface Product { 
  id: string; 
  nombre: string;
  descripcion?: string | null;
  nuevos?: number;
  usados?: number;
  notas?: string | null;
  fechaIngreso?: string | null;
}
interface Space { id: string; nombre: string }

interface InventoryItem {
  id: string;
  cantidad: number;
  product: Product;
  space: Space;
}

interface Movement {
  id: string;
  tipo: "ENTRADA" | "SALIDA";
  cantidad: number;
  nota: string | null;
  createdAt: string;
  inventoryItem: { product: Product; space: Space };
}

interface CreateInventoryItemDto {
  productId: string;
  spaceId: string;
  cantidad: number;
}

interface CreateMovementDto {
  inventoryItemId: string;
  tipo: "ENTRADA" | "SALIDA";
  cantidad: number;
  nota?: string;
}

class InventoryService {
  async getAllItems(): Promise<InventoryItem[]> {
    const res = await fetch("/api/inventario");
    return res.json();
  }

  async getAllMovements(): Promise<Movement[]> {
    const res = await fetch("/api/movimientos");
    return res.json();
  }

  async createItem(data: CreateInventoryItemDto): Promise<InventoryItem> {
    const res = await fetch("/api/inventario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async deleteItem(id: string): Promise<void> {
    await fetch(`/api/inventario/${id}`, { method: "DELETE" });
  }

  async createMovement(data: CreateMovementDto): Promise<Movement> {
    const res = await fetch("/api/movimientos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
}

export const inventoryService = new InventoryService();
export type { InventoryItem, Movement, CreateInventoryItemDto, CreateMovementDto };