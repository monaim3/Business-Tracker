"use client";

import { useRef, useTransition } from "react";
import { createExpense } from "@/lib/actions";
import { formatDateInput } from "@/lib/utils";

export function AddSpendForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createExpense(formData);
      formRef.current?.reset();
    });
  }

  const inputCls =
    "w-full h-10 px-3 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors bg-white"
  const labelCls = "block text-xs font-semibold uppercase tracking-wide mb-1.5 text-gray-500";

  return (
    <form ref={formRef} action={handleSubmit}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
        <div>
          <label className={labelCls}>Date</label>
          <input
            name="date"
            type="date"
            defaultValue={formatDateInput(new Date())}
            required
            className={inputCls}
            style={{ border: "1.5px solid #d0eded" }}
          />
        </div>

        <div>
          <label className={labelCls}>Item / Category</label>
          <input
            name="itemName"
            placeholder="e.g. Poly, Domain..."
            required
            className={inputCls}
            style={{ border: "1.5px solid #d0eded" }}
          />
        </div>

        <div>
          <label className={labelCls}>Amount (৳)</label>
          <input
            name="amount"
            type="number"
            min={0}
            step="0.01"
            placeholder="0"
            required
            className={inputCls}
            style={{ border: "1.5px solid #d0eded" }}
          />
        </div>

        <div>
          <label className={labelCls}>Note (optional)</label>
          <div className="flex gap-2">
            <input
              name="note"
              placeholder="extra info..."
              className={inputCls + " flex-1"}
              style={{ border: "1.5px solid #d0eded" }}
            />
            <button
              type="submit"
              disabled={isPending}
              className="btn-teal shrink-0 h-10 px-4 disabled:opacity-60"
            >
              {isPending ? "..." : "+ Add"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
