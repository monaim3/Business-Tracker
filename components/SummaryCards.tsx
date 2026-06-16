import { ShoppingBag, TrendingUp, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  todayOrderCount: number;
  todayRevenue: number;
  todayItemsSold: number;
}

export function SummaryCards({ todayOrderCount, todayRevenue, todayItemsSold }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

      <div className="teal-card p-6 flex items-center gap-4">
        <div className="p-3.5 rounded-xl shrink-0" style={{ backgroundColor: "#2BBCBC" }}>
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Today's Orders</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#2BBCBC" }}>{todayOrderCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">orders placed today</p>
        </div>
      </div>

      <div className="teal-card p-6 flex items-center gap-4">
        <div className="p-3.5 rounded-xl shrink-0" style={{ backgroundColor: "#1A9090" }}>
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Today's Revenue</p>
          <p className="text-3xl font-bold mt-1 truncate" style={{ color: "#1A9090" }}>
            {formatCurrency(todayRevenue)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">total sales today</p>
        </div>
      </div>

      <div className="teal-card p-6 flex items-center gap-4">
        <div className="p-3.5 rounded-xl shrink-0" style={{ backgroundColor: "#3DCECE" }}>
          <Package className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Items Sold</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#2BBCBC" }}>{todayItemsSold}</p>
          <p className="text-xs text-gray-400 mt-0.5">pieces sold today</p>
        </div>
      </div>

    </div>
  );
}
