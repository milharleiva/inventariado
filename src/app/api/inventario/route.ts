import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.inventoryItem.findMany({
    include: { product: true, space: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const data = await request.json();
  const item = await prisma.inventoryItem.create({ data });
  return NextResponse.json(item, { status: 201 });
}