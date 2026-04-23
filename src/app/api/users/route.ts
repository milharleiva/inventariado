import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { email, password, nombre } = await request.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Usuario ya existe" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: { email, password, nombre },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}