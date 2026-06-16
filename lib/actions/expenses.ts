"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createExpense(formData: FormData) {
  const itemName = (formData.get("itemName") as string).trim();
  const amount = parseFloat(formData.get("amount") as string);
  const note = (formData.get("note") as string)?.trim() || null;
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.expense.create({ data: { date, itemName, amount, note } });

  revalidatePath("/");
  revalidatePath("/spend");
}

export async function deleteExpense(id: number) {
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/spend");
}

export async function updateExpense(id: number, formData: FormData) {
  const itemName = (formData.get("itemName") as string).trim();
  const amount = parseFloat(formData.get("amount") as string);
  const note = (formData.get("note") as string)?.trim() || null;
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.expense.update({ where: { id }, data: { date, itemName, amount, note } });

  revalidatePath("/");
  revalidatePath("/spend");
}

export async function getExpenses({
  page = 1,
  pageSize = 15,
  search = "",
  date = "",
}: { page?: number; pageSize?: number; search?: string; date?: string } = {}) {
  const skip = (page - 1) * pageSize;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (search) {
    where.OR = [
      { itemName: { contains: search, mode: "insensitive" } },
      { note: { contains: search, mode: "insensitive" } },
    ];
  }
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({ where, skip, take: pageSize, orderBy: { date: "desc" } }),
    prisma.expense.count({ where }),
  ]);

  return { expenses, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getTotalSpend() {
  const result = await prisma.expense.aggregate({ _sum: { amount: true } });
  return result._sum.amount ?? 0;
}
