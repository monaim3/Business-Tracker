import { Suspense } from "react";
import { getOrders } from "@/lib/actions/orders";
import { OrdersSection } from "@/components/OrdersSection";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { page?: string; search?: string; date?: string };
}

export default async function OrdersPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const search = searchParams.search || "";
  const date = searchParams.date || "";

  const { orders, total, totalPages, pageSize } = await getOrders({ page, search, date });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-6 w-1 rounded-full" style={{ backgroundColor: "#2BBCBC" }} />
          <h1 className="text-2xl font-bold" style={{ color: "#0D2B2B" }}>Orders</h1>
        </div>
        <p className="text-gray-400 text-sm pl-3">
          {total} total order{total !== 1 ? "s" : ""}
        </p>
      </div>

      <Suspense fallback={<div className="text-gray-400 text-sm">Loading...</div>}>
        <OrdersSection
          orders={orders}
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
