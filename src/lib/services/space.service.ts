interface Space {
  id: string;
  nombre: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateSpaceDto {
  nombre: string;
}

interface UpdateSpaceDto {
  nombre?: string;
}

class SpaceService {
  async getAll(): Promise<Space[]> {
    const res = await fetch("/api/espacios");
    return res.json();
  }

  async getById(id: string): Promise<Space> {
    const res = await fetch(`/api/espacios/${id}`);
    return res.json();
  }

  async create(data: CreateSpaceDto): Promise<Space> {
    const res = await fetch("/api/espacios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async update(id: string, data: UpdateSpaceDto): Promise<Space> {
    const res = await fetch(`/api/espacios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async delete(id: string): Promise<void> {
    await fetch(`/api/espacios/${id}`, { method: "DELETE" });
  }
}

export const spaceService = new SpaceService();
export type { Space, CreateSpaceDto, UpdateSpaceDto };