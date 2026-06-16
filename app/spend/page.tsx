import { Suspense } from "react";
import { getExpenses, getTotalSpend } from "@/lib/actions/expenses";
import { SpendSection } from "@/components/SpendSection";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { page?: string; search?: string; date?: string };
}

export default async function SpendPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const search = searchParams.search || "";
  const date = searchParams.date || "";

  const [{ expenses, total, totalPages, pageSize }, grandTotal] = await Promise.all([
    getExpenses({ page, search, date }),
    getTotalSpend(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-6 w-1 rounded-full" style={{ backgroundColor: "#2BBCBC" }} />
          <h1 className="text-2xl font-bold" style={{ color: "#0D2B2B" }}>Business Spend</h1>
        </div>
        <p className="text-gray-400 text-sm pl-3">
          {total} entr{total !== 1 ? "ies" : "y"} —{" "}
          <span className="font-semibold" style={{ color: "#1A9090" }}>
            {formatCurrency(grandTotal)} total spend
          </span>
        </p>
      </div>

      <Suspense fallback={<div className="text-gray-400 text-sm">Loading...</div>}>
        <SpendSection
          expenses={expenses}
          total={total}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          currentSearch={search}
          currentDate={date}
        />
      </Suspense>
    </div>
  );
}
