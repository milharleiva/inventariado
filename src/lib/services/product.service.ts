interface Product {
  id: string;
  nombre: string;
  descripcion: string | null;
  cantidad: number;
  nuevos: number;
  usados: number;
  notas: string | null;
  fechaIngreso: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductDto {
  nombre: string;
  descripcion?: string;
  cantidad?: number;
  nuevos?: number;
  usados?: number;
  notas?: string;
  fechaIngreso?: string;
}

interface UpdateProductDto {
  nombre?: string;
  descripcion?: string;
  cantidad?: number;
  nuevos?: number;
  usados?: number;
  notas?: string;
  fechaIngreso?: string;
}

class ProductService {
  async getAll(): Promise<Product[]> {
    const res = await fetch("/api/productos");
    return res.json();
  }

  async getById(id: string): Promise<Product> {
    const res = await fetch(`/api/productos/${id}`);
    return res.json();
  }

  async create(data: CreateProductDto): Promise<Product> {
    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const res = await fetch(`/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async delete(id: string): Promise<void> {
    await fetch(`/api/productos/${id}`, { method: "DELETE" });
  }
}

export const productService = new ProductService();
export type { Product, CreateProductDto, UpdateProductDto };