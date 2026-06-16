"use client";

import { useState, useMemo, useTransition } from "react";
import type { Expense } from "@prisma/client";
import { deleteExpense } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2, Loader2, Search, Calendar } from "lucide-react";

export function SpendTable({ expenses }: { expenses: Expense[] }) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = useMemo(() => expenses.filter((e) => {
    const q = search.toLowerCase();
    return (
      (!q || e.itemName.toLowerCase().includes(q) || (e.note ?? "").toLowerCase().includes(q)) &&
      (!dateFilter || new Date(e.date).toISOString().split("T")[0] === dateFilter)
    );
  }), [expenses, search, dateFilter]);

  // Group by date for display
  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    filtered.forEach((e) => {
      const key = new Date(e.date).toISOString().split("T")[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  function handleDelete(id: number) {
    if (!confirm("Delete this expense?")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteExpense(id);
      setDeletingId(null);
    });
  }

  const totalSpend = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input-field pl-9 w-full sm:w-auto"
          />
        </div>
        {dateFilter && (
          <button onClick={() => setDateFilter("")}
            className="text-xs self-center px-2" style={{ color: "#2BBCBC" }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Total banner */}
      {filtered.length > 0 && (
        <div className="rounded-xl px-5 py-3 flex items-center justify-between text-sm"
          style={{ backgroundColor: "#E6F7F7", border: "1px solid #b0e0e0" }}>
          <span className="text-gray-500">{filtered.length} entries</span>
          <span className="font-bold text-lg" style={{ color: "#1A9090" }}>
            Total Spend: {formatCurrency(totalSpend)}
          </span>
        </div>
      )}

      {/* Grouped table */}
      {grouped.length === 0 ? (
        <div className="section-card py-16 text-center text-gray-400">
          <div className="text-3xl mb-2">💸</div>
          <p>No expenses found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([dateKey, items]) => {
            const dayTotal = items.reduce((s, e) => s + e.amount, 0);
            return (
              <div key={dateKey} className="section-card overflow-hidden">
                {/* Date header */}
                <div className="px-5 py-3 flex items-center justify-between"
                  style={{ backgroundColor: "#f4fafa", borderBottom: "1px solid #d0eded" }}>
                  <span className="text-sm font-bold" style={{ color: "#0D2B2B" }}>
                    📅 {formatDate(dateKey)}
                  </span>
                  <span className="text-sm font-bold" style={{ color: "#1A9090" }}>
                    {formatCurrency(dayTotal)}
                  </span>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: "#2BBCBC" }}>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Item</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider hidden sm:table-cell">Note</th>
                      <th className="px-5 py-2.5 text-right text-xs font-semibold text-white uppercase tracking-wider">Amount</th>
                      <th className="px-5 py-2.5 text-center text-xs font-semibold text-white uppercase tracking-wider">Del</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((exp, i) => (
                      <tr key={exp.id}
                        className="transition-colors hover:bg-[#E6F7F7]"
                        style={{
                          borderBottom: "1px solid #edf7f7",
                          backgroundColor: i % 2 === 1 ? "#f9fefe" : "#ffffff",
                          opacity: deletingId === exp.id ? 0.4 : 1,
                        }}>
                        <td className="px-5 py-3 text-gray-400 text-xs font-mono">{exp.id}</td>
                        <td className="px-5 py-3 font-semibold text-gray-900">{exp.itemName}</td>
                        <td className="px-5 py-3 text-gray-400 hidden sm:table-cell">{exp.note || "—"}</td>
                        <td className="px-5 py-3 text-right font-bold" style={{ color: "#1A9090" }}>
                          {formatCurrency(exp.amount)}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => handleDelete(exp.id)}
                            disabled={isPending}
                            className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                          >
                            {deletingId === exp.id
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Trash2 className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
