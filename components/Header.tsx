import Link from "next/link";
import Image from "next/image";
import { PlusCircle } from "lucide-react";

export function Header() {
  return (
    <header
      className="bg-white sticky top-0 z-50"
      style={{
        borderBottom: "2px solid #2BBCBC",
        boxShadow: "0 2px 12px rgba(43,188,188,0.10)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center">
            <Image
              src="/Monaax.png"
              alt="Monaax"
              width={150}
              height={45}
              priority
              className="object-contain"
            />
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-[#0D2B2B] hover:text-[#2BBCBC] hover:bg-[#E6F7F7] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/orders"
              className="px-3 py-2 rounded-lg text-sm font-medium text-[#0D2B2B] hover:text-[#2BBCBC] hover:bg-[#E6F7F7] transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/spend"
              className="px-3 py-2 rounded-lg text-sm font-medium text-[#0D2B2B] hover:text-[#2BBCBC] hover:bg-[#E6F7F7] transition-colors"
            >
              Spend
            </Link>
            <Link
              href="/orders/new"
              className="btn-teal ml-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Order</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
