"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function Pagination({ page, totalPages, total, pageSize }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`?${params.toString()}`);
  }

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build page numbers with ellipsis
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  if (totalPages <= 1) return (
    <div className="px-5 py-3 text-xs text-gray-400"
      style={{ backgroundColor: "#f4fafa", borderTop: "1px solid #d0eded" }}>
      {total} result{total !== 1 ? "s" : ""}
    </div>
  );

  return (
    <div className="px-5 py-3 flex items-center justify-between"
      style={{ backgroundColor: "#f4fafa", borderTop: "1px solid #d0eded" }}>
      <span className="text-xs text-gray-400">
        Showing {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-[#E6F7F7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`d${i}`} className="px-1 text-xs text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p as number)}
              className="h-8 w-8 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: p === page ? "#2BBCBC" : "transparent",
                color: p === page ? "#fff" : "#555",
              }}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-[#E6F7F7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
