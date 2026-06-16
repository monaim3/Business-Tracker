"use client";

import { useState } from "react";
import { createOrder } from "@/lib/actions";
import { formatCurrency, formatDateInput } from "@/lib/utils";
import Link from "next/link";

export function AddOrderForm() {
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const total = quantity * unitPrice;

  return (
    <form action={createOrder} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-semibold mb-1.5"
            style={{ color: "#0D2B2B" }}
          >
            Order Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={formatDateInput(new Date())}
            required
            className="input-field"
          />
        </div>

        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-semibold mb-1.5"
            style={{ color: "#0D2B2B" }}
          >
            Customer Name <span className="text-red-400">*</span>
          </label>
          <input
            id="customerName"
            name="customerName"
            placeholder="e.g. Fatema Begum"
            required
            autoFocus
            className="input-field"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold mb-1.5"
            style={{ color: "#0D2B2B" }}
          >
            Phone{" "}
            <span className="text-gray-400 font-normal text-xs">
              (optional)
            </span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="e.g. 01712345678"
            className="input-field"
          />
        </div>

        <div>
          <label
            htmlFor="productName"
            className="block text-sm font-semibold mb-1.5"
            style={{ color: "#0D2B2B" }}
          >
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            id="productName"
            name="productName"
            placeholder="e.g. Gold Ring 22K"
            required
            className="input-field"
          />
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-semibold mb-1.5"
            style={{ color: "#0D2B2B" }}
          >
            Quantity <span className="text-red-400">*</span>
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            required
            className="input-field"
          />
        </div>

        <div>
          <label
            htmlFor="unitPrice"
            className="block text-sm font-semibold mb-1.5"
            style={{ color: "#0D2B2B" }}
          >
            Unit Price (৳) <span className="text-red-400">*</span>
          </label>
          <input
            id="unitPrice"
            name="unitPrice"
            type="number"
            min={0}
            step="0.01"
            value={unitPrice || ""}
            onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            required
            className="input-field"
          />
        </div>
      </div>

      {/* Live total */}
      <div
        className="rounded-xl p-5 flex items-center justify-between"
        style={{ backgroundColor: "#E6F7F7", border: "1.5px solid #b0e0e0" }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "#0D2B2B" }}>
            Calculated Total
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {quantity} pcs × {formatCurrency(unitPrice)}
          </p>
        </div>
        <span className="text-3xl font-bold" style={{ color: "#2BBCBC" }}>
          {formatCurrency(total)}
        </span>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="btn-teal flex-1 h-11 text-base justify-center"
        >
          Save Order
        </button>
        <Link href="/orders" className="btn-outline h-11 px-6">
          Cancel
        </Link>
      </div>
    </form>
  );
}
