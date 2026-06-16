"use client";

import { useState, useMemo, useTransition } from "react";
import type { Order } from "@prisma/client";
import { updateOrderStatus, deleteOrder } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2, Download, Search, Calendar, Loader2 } from "lucide-react";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = useMemo(() => orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      (!q || o.customerName.toLowerCase().includes(q) || o.productName.toLowerCase().includes(q)) &&
      (!dateFilter || new Date(o.date).toISOString().split("T")[0] === dateFilter)
    );
  }), [orders, search, dateFilter]);

  function handleStatusChange(id: number, status: string) {
    startTransition(async () => { await updateOrderStatus(id, status); });
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this order? Cannot be undone.")) return;
    setDeletingId(id);
    startTransition(async () => { await deleteOrder(id); setDeletingId(null); });
  }

  function exportCSV() {
    const headers = ["#","Date","Customer","Phone","Product","Qty","Unit Price","Total","Status"];
    const rows = filtered.map((o) => [o.id, formatDate(o.date), o.customerName, o.phone||"", o.productName, o.quantity, o.unitPrice.toFixed(2), o.totalPrice.toFixed(2), o.status]);
    const csv = [headers,...rows].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const blob = new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`monaax-orders-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  const statusCls: Record<string,string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-emerald-100 text-emerald-800",
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search customer or product..."
            value={search} onChange={e=>setSearch(e.target.value)}
            className="input-field pl-9" />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
          <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)}
            className="input-field pl-9 w-full sm:w-auto" />
        </div>
        {dateFilter && (
          <button onClick={()=>setDateFilter("")}
            className="text-xs self-center px-2 transition-colors" style={{color:"#2BBCBC"}}>
            ✕ Clear
          </button>
        )}
        <button onClick={exportCSV} className="btn-outline shrink-0 gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="section-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#2BBCBC" }}>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider hidden lg:table-cell">Unit Price</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Del</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">📦</span>
                      <span>No orders found</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((order, i) => (
                <tr key={order.id}
                  style={{
                    borderBottom: "1px solid #edf7f7",
                    backgroundColor: deletingId===order.id ? "#fff" : i%2===1 ? "#f9fefe" : "#fff",
                    opacity: deletingId===order.id ? 0.4 : 1,
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={e=>{ if(deletingId!==order.id) e.currentTarget.style.backgroundColor="#E6F7F7"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.backgroundColor=i%2===1?"#f9fefe":"#fff"; }}
                >
                  <td className="px-4 py-3.5 text-gray-400 text-xs font-mono">{order.id}</td>
                  <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(order.date)}</td>
                  <td className="px-4 py-3.5 font-semibold text-gray-900">{order.customerName}</td>
                  <td className="px-4 py-3.5 text-gray-400 hidden md:table-cell">{order.phone||"—"}</td>
                  <td className="px-4 py-3.5 text-gray-700">{order.productName}</td>
                  <td className="px-4 py-3.5 text-right text-gray-700">{order.quantity}</td>
                  <td className="px-4 py-3.5 text-right text-gray-400 hidden lg:table-cell">{formatCurrency(order.unitPrice)}</td>
                  <td className="px-4 py-3.5 text-right font-bold" style={{color:"#1A9090"}}>{formatCurrency(order.totalPrice)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <select value={order.status} disabled={isPending}
                      onChange={e=>handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 ${statusCls[order.status]??statusCls.Pending}`}>
                      <option value="Pending">⏳ Pending</option>
                      <option value="Shipped">🚚 Shipped</option>
                      <option value="Delivered">✅ Delivered</option>
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button onClick={()=>handleDelete(order.id)} disabled={isPending}
                      className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40">
                      {deletingId===order.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 flex items-center justify-between text-sm"
            style={{ backgroundColor: "#f4fafa", borderTop: "1px solid #d0eded" }}>
            <span className="text-gray-400 text-xs">
              {filtered.length} order{filtered.length!==1?"s":""}
              {search||dateFilter?" (filtered)":""}
            </span>
            <span className="font-bold" style={{color:"#1A9090"}}>
              Total: {formatCurrency(filtered.reduce((s,o)=>s+o.totalPrice,0))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
