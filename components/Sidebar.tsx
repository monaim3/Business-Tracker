"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, ShoppingBag, Wallet, LogOut } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/spend", label: "Business Spend", icon: Wallet },
];

interface Props {
  userName: string;
  userEmail: string;
}

export function Sidebar({ userName, userEmail }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 bg-white flex flex-col z-40"
      style={{ borderRight: "1.5px solid #d0eded" }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1.5px solid #d0eded" }}
      >
        <Link href="/">
          <Image
            src="/Monaax.png"
            alt="Monaax"
            width={130}
            height={38}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#E6F7F7] text-[#2BBCBC]"
                  : "text-[#4a4a4a] hover:bg-[#E6F7F7] hover:text-[#2BBCBC]"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${
                  active ? "text-[#2BBCBC]" : "text-gray-400"
                }`}
              />
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2BBCBC]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div
        className="px-4 py-4 space-y-3"
        style={{ borderTop: "1.5px solid #d0eded" }}
      >
        <div className="flex items-center gap-2.5 px-1">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
            style={{ backgroundColor: "#2BBCBC" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">
              {userName}
            </p>
            <p className="text-[10px] text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
