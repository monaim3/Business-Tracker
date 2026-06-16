"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Expense } from "@prisma/client";
import { createExpense, deleteExpense, updateExpense } from "@/lib/actions/expenses";
import { formatCurrency, formatDate, formatDateInput } from "@/lib/utils";
import { Modal } from "./Modal";
import { Pagination } from "./Pagination";
import { Plus, Trash2, Loader2, Search, Calendar, Pencil } from "lucide-react";

interface Props {
  expenses: Expense[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  currentSearch: string;
  currentDate: string;
}

export function SpendSection({ expenses, total, totalPages, page, pageSize, currentSearch, currentDate }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const formRef = useRef<HTMLFormElement>(null);

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
      await createExpense(formData);
      setModalOpen(false);
      formRef.current?.reset();
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this expense?")) return;
    setDeletingId(id);
    startTransition(async () => { await deleteExpense(id); setDeletingId(null); });
  }

  function handleEdit(formData: FormData) {
    if (!editingExpense) return;
    startTransition(async () => {
      await updateExpense(editingExpense.id, formData);
      setEditingExpense(null);
    });
  }

  const inputCls = "w-full h-10 px-3 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors bg-white";
  const inputStyle = { border: "1.5px solid #d0eded" };
  const labelCls = "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search item..."
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            className={inputCls + " pl-9"} style={inputStyle} />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
          <input type="date" value={currentDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className={inputCls + " pl-9 sm:w-44"} style={inputStyle} />
        </div>
        {currentDate && (
          <button onClick={() => handleDateChange("")} className="text-xs self-center px-1" style={{color:"#2BBCBC"}}>
            ✕ Clear
          </button>
        )}
        <button onClick={() => setModalOpen(true)} className="btn-teal shrink-0 h-10">
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      {/* Table */}
      <div className="section-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#2BBCBC" }}>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Item</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider hidden sm:table-cell">Note</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">💸</span>
                      <span>No expenses found</span>
                    </div>
                  </td>
                </tr>
              ) : expenses.map((exp, i) => (
                <tr key={exp.id}
                  className="transition-colors hover:bg-[#E6F7F7]"
                  style={{ borderBottom:"1px solid #edf7f7", backgroundColor: i%2===1?"#f9fefe":"#fff", opacity: deletingId===exp.id?0.4:1 }}>
                  <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">{exp.id}</td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(exp.date)}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{exp.itemName}</td>
                  <td className="px-5 py-3.5 text-gray-400 hidden sm:table-cell">{exp.note||"—"}</td>
                  <td className="px-5 py-3.5 text-right font-bold" style={{color:"#1A9090"}}>{formatCurrency(exp.amount)}</td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setEditingExpense(exp)} disabled={isPending}
                        className="text-gray-300 hover:text-[#2BBCBC] transition-colors disabled:opacity-40">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={()=>handleDelete(exp.id)} disabled={isPending}
                        className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40">
                        {deletingId===exp.id?<Loader2 className="h-4 w-4 animate-spin"/>:<Trash2 className="h-4 w-4"/>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} />
      </div>

      {/* Edit Expense Modal */}
      <Modal isOpen={!!editingExpense} onClose={() => setEditingExpense(null)} title="Edit Expense">
        {editingExpense && (
          <form action={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date</label>
                <input name="date" type="date" defaultValue={formatDateInput(new Date(editingExpense.date))} required className={inputCls} style={inputStyle}/>
              </div>
              <div>
                <label className={labelCls}>Amount (৳) *</label>
                <input name="amount" type="number" min={0} step="0.01" defaultValue={editingExpense.amount} required autoFocus className={inputCls} style={inputStyle}/>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Item / Category *</label>
                <input name="itemName" defaultValue={editingExpense.itemName} required className={inputCls} style={inputStyle}/>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Note (optional)</label>
                <input name="note" defaultValue={editingExpense.note ?? ""} className={inputCls} style={inputStyle}/>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={isPending} className="btn-teal flex-1 h-11 justify-center disabled:opacity-60">
                {isPending ? "Saving..." : "💾 Save Changes"}
              </button>
              <button type="button" onClick={() => setEditingExpense(null)} className="btn-outline h-11 px-5">Cancel</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Expense Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Expense">
        <form ref={formRef} action={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date</label>
              <input name="date" type="date" defaultValue={formatDateInput(new Date())} required className={inputCls} style={inputStyle}/>
            </div>
            <div>
              <label className={labelCls}>Amount (৳) *</label>
              <input name="amount" type="number" min={0} step="0.01" placeholder="0" required autoFocus className={inputCls} style={inputStyle}/>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Item / Category *</label>
              <input name="itemName" placeholder="e.g. Poly, Domain, Packet..." required className={inputCls} style={inputStyle}/>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Note (optional)</label>
              <input name="note" placeholder="extra details..." className={inputCls} style={inputStyle}/>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={isPending}
              className="btn-teal flex-1 h-11 justify-center disabled:opacity-60">
              {isPending?"Saving...":"💸 Save Expense"}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline h-11 px-5">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
