"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Order } from "@prisma/client";
import { addOrder, updateOrderStatus, deleteOrder, updateOrder } from "@/lib/actions/orders";
import { formatCurrency, formatDate, formatDateInput } from "@/lib/utils";
import { Modal } from "./Modal";
import { Pagination } from "./Pagination";
import {
  Plus,
  Trash2,
  Loader2,
  Search,
  Calendar,
  Download,
  Pencil,
} from "lucide-react";

interface Props {
  orders: Order[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  currentSearch: string;
  currentDate: string;
}

export function OrdersSection({
  orders,
  total,
  totalPages,
  page,
  pageSize,
  currentSearch,
  currentDate,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const total_calc = qty * price;
  const [editQty, setEditQty] = useState(1);
  const [editPrice, setEditPrice] = useState(0);
  const editTotal = editQty * editPrice;

  // Debounce search → URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) params.set("search", searchInput);
      else params.delete("search");
      params.delete("page");
      router.push(`?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function handleDateChange(val: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("date", val);
    else params.delete("date");
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      await addOrder(formData);
      setModalOpen(false);
      setQty(1);
      setPrice(0);
    });
  }

  function handleStatusChange(id: number, status: string) {
    startTransition(async () => {
      await updateOrderStatus(id, status);
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this order?")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteOrder(id);
      setDeletingId(null);
    });
  }

  function openEdit(order: Order) {
    setEditingOrder(order);
    setEditQty(order.quantity);
    setEditPrice(order.unitPrice);
  }

  function handleEdit(formData: FormData) {
    if (!editingOrder) return;
    startTransition(async () => {
      await updateOrder(editingOrder.id, formData);
      setEditingOrder(null);
    });
  }

  function exportCSV() {
    const headers = [
      "#",
      "Date",
      "Customer",
      "Phone",
      "Product",
      "Qty",
      "Unit Price",
      "Total",
      "Status",
    ];
    const rows = orders.map((o) => [
      o.id,
      formatDate(o.date),
      o.customerName,
      o.phone || "",
      o.productName,
      o.quantity,
      o.unitPrice.toFixed(2),
      o.totalPrice.toFixed(2),
      o.status,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monaax-orders-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const statusCls: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-emerald-100 text-emerald-800",
  };

  const inputCls =
    "w-full h-10 px-3 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors bg-white";
  const inputStyle = { border: "1.5px solid #d0eded" };
  const labelCls =
    "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";

  return (
    <div className="space-y-4">
      {/* Filters + Add */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customer or product..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={inputCls + " pl-9"}
            style={inputStyle}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
          <input
            type="date"
            value={currentDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className={inputCls + " pl-9 sm:w-44"}
            style={inputStyle}
          />
        </div>
        {currentDate && (
          <button
            onClick={() => handleDateChange("")}
            className="text-xs self-center px-1"
            style={{ color: "#2BBCBC" }}
          >
            ✕ Clear
          </button>
        )}
        <button onClick={exportCSV} className="btn-outline shrink-0 gap-2 h-10">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-teal shrink-0 h-10"
        >
          <Plus className="h-4 w-4" />
          Add Order
        </button>
      </div>

      {/* Table */}
      <div className="section-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#2BBCBC" }}>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider hidden md:table-cell">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider hidden lg:table-cell">
                  Unit ৳
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">📦</span>
                      <span>No orders found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-[#E6F7F7]"
                    style={{
                      borderBottom: "1px solid #edf7f7",
                      backgroundColor: i % 2 === 1 ? "#f9fefe" : "#fff",
                      opacity: deletingId === order.id ? 0.4 : 1,
                    }}
                  >
                    <td className="px-4 py-3.5 text-gray-400 text-xs font-mono">
                      {order.id}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 hidden md:table-cell">
                      {order.phone || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      {order.productName}
                    </td>
                    <td className="px-4 py-3.5 text-right text-gray-700">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-3.5 text-right text-gray-400 hidden lg:table-cell">
                      {formatCurrency(order.unitPrice)}
                    </td>
                    <td
                      className="px-4 py-3.5 text-right font-bold"
                      style={{ color: "#1A9090" }}
                    >
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <select
                        value={order.status}
                        disabled={isPending}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none disabled:opacity-60 ${statusCls[order.status] ?? statusCls.Pending}`}
                      >
                        <option value="Pending"> Pending</option>
                        <option value="Shipped"> Shipped</option>
                        <option value="Delivered"> Delivered</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(order)}
                          disabled={isPending}
                          className="text-gray-300 hover:text-[#2BBCBC] transition-colors disabled:opacity-40"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={isPending}
                          className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          {deletingId === order.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
        />
      </div>

      {/* Edit Order Modal */}
      <Modal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        title="Edit Order"
      >
        {editingOrder && (
          <form action={handleEdit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Order Date</label>
                <input name="date" type="date" defaultValue={formatDateInput(new Date(editingOrder.date))} required className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls}>Customer Name *</label>
                <input name="customerName" defaultValue={editingOrder.customerName} required autoFocus className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls}>Phone (optional)</label>
                <input name="phone" type="tel" defaultValue={editingOrder.phone ?? ""} className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls}>Product Name *</label>
                <input name="productName" defaultValue={editingOrder.productName} required className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls}>Quantity *</label>
                <input name="quantity" type="number" min={1} value={editQty}
                  onChange={(e) => setEditQty(Math.max(1, parseInt(e.target.value) || 1))}
                  required className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls}>Unit Price (৳) *</label>
                <input name="unitPrice" type="number" min={0} step="0.01" value={editPrice || ""}
                  onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00" required className={inputCls} style={inputStyle} />
              </div>
            </div>
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: "#E6F7F7", border: "1px solid #b0e0e0" }}>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total</p>
                <p className="text-xs text-gray-400">{editQty} × {formatCurrency(editPrice)}</p>
              </div>
              <span className="text-2xl font-bold" style={{ color: "#2BBCBC" }}>{formatCurrency(editTotal)}</span>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={isPending} className="btn-teal flex-1 h-11 justify-center disabled:opacity-60">
                {isPending ? "Saving..." : "💾 Save Changes"}
              </button>
              <button type="button" onClick={() => setEditingOrder(null)} className="btn-outline h-11 px-5">Cancel</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Order Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setQty(1);
          setPrice(0);
        }}
        title="Add New Order"
      >
        <form action={handleAdd} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Order Date</label>
              <input
                name="date"
                type="date"
                defaultValue={formatDateInput(new Date())}
                required
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls}>Customer Name *</label>
              <input
                name="customerName"
                placeholder="Fatema Begum"
                required
                autoFocus
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls}>Phone (optional)</label>
              <input
                name="phone"
                type="tel"
                placeholder="017XXXXXXXX"
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls}>Product Name *</label>
              <input
                name="productName"
                placeholder="Gold Ring 22K"
                required
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls}>Quantity *</label>
              <input
                name="quantity"
                type="number"
                min={1}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, parseInt(e.target.value) || 1))
                }
                required
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls}>Unit Price (৳) *</label>
              <input
                name="unitPrice"
                type="number"
                min={0}
                step="0.01"
                value={price || ""}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ backgroundColor: "#E6F7F7", border: "1px solid #b0e0e0" }}
          >
            <div>
              <p className="text-xs text-gray-500 font-medium">Total</p>
              <p className="text-xs text-gray-400">
                {qty} × {formatCurrency(price)}
              </p>
            </div>
            <span className="text-2xl font-bold" style={{ color: "#2BBCBC" }}>
              {formatCurrency(total_calc)}
            </span>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="btn-teal flex-1 h-11 justify-center disabled:opacity-60"
            >
              {isPending ? "Saving..." : "💍 Save Order"}
            </button>
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setQty(1);
                setPrice(0);
              }}
              className="btn-outline h-11 px-5"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
