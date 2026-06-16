"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayOrders, recentOrders] = await Promise.all([
    prisma.order.findMany({
      where: { date: { gte: today, lt: tomorrow } },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    todayOrderCount: todayOrders.length,
    todayRevenue: todayOrders.reduce((sum, o) => sum + o.totalPrice, 0),
    todayItemsSold: todayOrders.reduce((sum, o) => sum + o.quantity, 0),
    recentOrders,
  };
}
