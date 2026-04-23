import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MovementType } from "../../../generated/prisma/enums";

export async function GET() {
  const movements = await prisma.movement.findMany({
    include: { inventoryItem: { include: { product: true, space: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(movements);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { inventoryItemId, tipo, cantidad, nota } = data;

  const item = await prisma.inventoryItem.findUnique({ where: { id: inventoryItemId } });
  if (!item) return NextResponse.json({ error: "Item no encontrado" }, { status: 404 });

  const tipoEnum = tipo as MovementType;
  const nuevaCantidad =
    tipoEnum === MovementType.ENTRADA ? item.cantidad + cantidad : item.cantidad - cantidad;

  const [movement] = await prisma.$transaction([
    prisma.movement.create({ data: { inventoryItemId, tipo: tipoEnum, cantidad, nota } }),
    prisma.inventoryItem.update({
      where: { id: inventoryItemId },
      data: { cantidad: nuevaCantidad },
    }),
  ]);

  return NextResponse.json(movement, { status: 201 });
}