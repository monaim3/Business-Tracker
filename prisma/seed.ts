import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  const users = [
    {
      email: process.env.SEED_USER1_EMAIL!,
      password: process.env.SEED_USER1_PASSWORD!,
      name: process.env.SEED_USER1_NAME ?? "Admin",
    },
    {
      email: process.env.SEED_USER2_EMAIL!,
      password: process.env.SEED_USER2_PASSWORD!,
      name: process.env.SEED_USER2_NAME ?? "Staff",
    },
  ];
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, password: hashed, name: u.name },
    });
    console.log(`✓ User: ${u.email}`);
  }
}

async function main() {
  await seedUsers();

  const expenses = [
    // 01-05-2026
    { date: new Date("2026-05-01"), itemName: "Domain", amount: 1000, note: null },

    // 10-05-2026
    { date: new Date("2026-05-10"), itemName: "Products",       amount: 4590, note: null },
    { date: new Date("2026-05-10"), itemName: "Poly",           amount: 100,  note: null },
    { date: new Date("2026-05-10"), itemName: "Ear Stand",      amount: 50,   note: null },
    { date: new Date("2026-05-10"), itemName: "Packet",         amount: 40,   note: null },
    { date: new Date("2026-05-10"), itemName: "Bubble Wrapper", amount: 150,  note: null },
    { date: new Date("2026-05-10"), itemName: "Costp",          amount: 120,  note: null },
    { date: new Date("2026-05-10"), itemName: "Vara",           amount: 310,  note: "160+150" },

    // 15-05-2026
    { date: new Date("2026-05-15"), itemName: "Dollar Buy", amount: 1020, note: null },

    // 09-06-2026
    { date: new Date("2026-06-09"), itemName: "Dollar Buy", amount: 1480, note: null },

    // 12-06-2026
    { date: new Date("2026-06-12"), itemName: "Dollar Buy", amount: 1300, note: null },

    // 16-06-2026
    { date: new Date("2026-06-16"), itemName: "Dollar Buy", amount: 600,  note: null },
  ];

  const result = await prisma.expense.createMany({ data: expenses });
  console.log(`✅ ${result.count} expenses inserted`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
