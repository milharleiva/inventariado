import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const espacios = await prisma.space.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(espacios);
}

export async function POST(request: Request) {
  const data = await request.json();
  const espacio = await prisma.space.create({ data });
  return NextResponse.json(espacio, { status: 201 });
}