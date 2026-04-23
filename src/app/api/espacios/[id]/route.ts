import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const espacio = await prisma.space.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!espacio) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(espacio);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const espacio = await prisma.space.update({ where: { id }, data });
  return NextResponse.json(espacio);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.space.delete({ where: { id } });
  return NextResponse.json({ success: true });
}