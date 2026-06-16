import { AddOrderForm } from "@/components/AddOrderForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewOrderPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/orders"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#2BBCBC" }}>
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-7 w-1 rounded-full" style={{ backgroundColor: "#2BBCBC" }} />
          <h1 className="text-2xl font-bold" style={{ color: "#0D2B2B" }}>Add New Order</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1 pl-3">Record a new jewelry order for Monaax</p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8"
        style={{ border: "1px solid #d0eded", borderTop: "4px solid #2BBCBC", boxShadow: "0 2px 12px rgba(43,188,188,0.08)" }}>
        <AddOrderForm />
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        💡 Total price auto-calculated from Qty × Unit Price
      </p>
    </div>
  );
}
