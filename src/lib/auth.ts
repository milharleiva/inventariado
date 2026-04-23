"use server";

import { prisma } from "./prisma";

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;
  return user.password === password;
}