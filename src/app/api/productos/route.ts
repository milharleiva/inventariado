import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const productos = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(productos);
}

export async function POST(request: Request) {
  const data = await request.json();
  const producto = await prisma.product.create({ data });
  return NextResponse.json(producto, { status: 201 });
}