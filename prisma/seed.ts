import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  const email = "admin@test.com";
  const password = "Admin123!";
  const nombre = "Administrador";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Usuario ya existe:", existing.email);
    return;
  }

  const user = await prisma.user.create({
    data: { email, password, nombre },
  });
  console.log("Usuario creado:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());