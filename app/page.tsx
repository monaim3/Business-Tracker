import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { SummaryCards } from "@/components/SummaryCards";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowRight, ShoppingBag, Wallet } from "lucide-react";

export default async function HomePage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-6 w-1 rounded-full" style={{ backgroundColor: "#2BBCBC" }} />
          <h1 className="text-2xl font-bold" style={{ color: "#0D2B2B" }}>Dashboard</h1>
        </div>
        <p className="text-gray-400 text-sm pl-3">
          {formatDate(new Date())} — Today&apos;s overview
        </p>
      </div>

      {/* Summary cards */}
      <SummaryCards
        todayOrderCount={stats.todayOrderCount}
        todayRevenue={stats.todayRevenue}
        todayItemsSold={stats.todayItemsSold}
      />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/orders"
          className="flex items-center justify-between p-5 rounded-2xl bg-white transition-all hover:shadow-md group"
          style={{ border: "1px solid #d0eded" }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: "#E6F7F7" }}>
              <ShoppingBag className="h-5 w-5" style={{ color: "#2BBCBC" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#0D2B2B" }}>Manage Orders</p>
              <p className="text-xs text-gray-400">View, add, update orders</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#2BBCBC] transition-colors" />
        </Link>

        <Link href="/spend"
          className="flex items-center justify-between p-5 rounded-2xl bg-white transition-all hover:shadow-md group"
          style={{ border: "1px solid #d0eded" }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: "#E6F7F7" }}>
              <Wallet className="h-5 w-5" style={{ color: "#2BBCBC" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#0D2B2B" }}>Business Spend</p>
              <p className="text-xs text-gray-400">Track expenses</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#2BBCBC] transition-colors" />
        </Link>
      </div>

      {/* Recent orders */}
      <div className="section-card">
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #d0eded" }}>
          <div className="flex items-center gap-3">
            <div className="h-5 w-1 rounded-full" style={{ backgroundColor: "#2BBCBC" }} />
            <h2 className="font-semibold text-sm" style={{ color: "#0D2B2B" }}>Recent Orders</h2>
          </div>
          <Link href="/orders"
            className="text-xs font-medium flex items-center gap-1 transition-colors"
            style={{ color: "#2BBCBC" }}>
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="py-14 text-center">
            <div className="text-4xl mb-3">💍</div>
            <p className="font-semibold text-sm" style={{ color: "#0D2B2B" }}>No orders yet</p>
            <p className="text-xs text-gray-400 mt-1">Go to Orders page to add one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#2BBCBC" }}>
                  {["Customer","Product","Date","Total","Status"].map((h, i) => (
                    <th key={h} className={`px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider ${
                      i < 2 ? "text-left" : i === 3 ? "text-right" : i === 2 ? "text-left hidden md:table-cell" : "text-center"
                    }`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, i) => (
                  <tr key={order.id}
                    className="transition-colors hover:bg-[#E6F7F7]"
                    style={{ borderBottom:"1px solid #edf7f7", backgroundColor: i%2===1?"#f9fefe":"#fff" }}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{order.customerName}</td>
                    <td className="px-6 py-4 text-gray-600">{order.productName}</td>
                    <td className="px-6 py-4 text-gray-400 hidden md:table-cell">{formatDate(order.date)}</td>
                    <td className="px-6 py-4 text-right font-bold" style={{ color: "#1A9090" }}>{formatCurrency(order.totalPrice)}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
