"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/pencapaian", label: "Pencapaian" },
  { href: "/abdimas", label: "Abdimas" },
  { href: "/rekrutmen", label: "Rekrutmen" },
  { href: "/organigram", label: "Organigram" },
  { href: "/tim", label: "Tim" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-lab flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center bg-ink text-signal">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M2 12h4l2-7 4 14 2-9 2 5h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-display text-sm font-semibold leading-tight text-ink">
            SPIS<span className="text-maroon"> LAB</span>
            <span className="block font-mono text-[10px] font-normal tracking-widest text-slate-light">
              TELKOM UNIVERSITY
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-xs uppercase tracking-wider transition-colors ${
                pathname === item.href
                  ? "text-maroon"
                  : "text-slate hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="border border-ink px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-signal"
          >
            Login Asisten
          </Link>
        </nav>

        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          aria-expanded={open}
        >
          <span className={`h-px w-6 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper md:hidden">
          <div className="container-lab flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3 font-mono text-xs uppercase tracking-wider text-slate"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="py-3 font-mono text-xs uppercase tracking-wider text-maroon"
            >
              Login Asisten →
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
