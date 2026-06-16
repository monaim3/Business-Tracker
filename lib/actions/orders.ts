"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
  const customerName = formData.get("customerName") as string;
  const phone = formData.get("phone") as string;
  const productName = formData.get("productName") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const unitPrice = parseFloat(formData.get("unitPrice") as string);
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.order.create({
    data: {
      date,
      customerName: customerName.trim(),
      phone: phone?.trim() || null,
      productName: productName.trim(),
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
    },
  });

  revalidatePath("/");
  revalidatePath("/orders");
  redirect("/orders");
}

// Modal version — no redirect
export async function addOrder(formData: FormData) {
  const customerName = formData.get("customerName") as string;
  const phone = formData.get("phone") as string;
  const productName = formData.get("productName") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const unitPrice = parseFloat(formData.get("unitPrice") as string);
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.order.create({
    data: {
      date,
      customerName: customerName.trim(),
      phone: phone?.trim() || null,
      productName: productName.trim(),
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
    },
  });

  revalidatePath("/");
  revalidatePath("/orders");
}

export async function updateOrderStatus(id: number, status: string) {
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/");
  revalidatePath("/orders");
}

export async function updateOrder(id: number, formData: FormData) {
  const customerName = (formData.get("customerName") as string).trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const productName = (formData.get("productName") as string).trim();
  const quantity = parseInt(formData.get("quantity") as string);
  const unitPrice = parseFloat(formData.get("unitPrice") as string);
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.order.update({
    where: { id },
    data: { date, customerName, phone, productName, quantity, unitPrice, totalPrice: quantity * unitPrice },
  });

  revalidatePath("/");
  revalidatePath("/orders");
}

export async function deleteOrder(id: number) {
  await prisma.order.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/orders");
}

export async function getOrders({
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
      { customerName: { contains: search, mode: "insensitive" } },
      { productName: { contains: search, mode: "insensitive" } },
    ];
  }
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
