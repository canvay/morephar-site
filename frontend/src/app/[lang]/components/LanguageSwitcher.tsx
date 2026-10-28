"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsGlobe } from "react-icons/bs";
import { FaCheck, FaChevronDown } from "react-icons/fa";

const options = [
  { locale: "en", label: "English" },
  { locale: "zh-CN", label: "中文" },
] as const;

export default function LanguageSwitcher({
  lang,
  variant = "light",
}: {
  lang: string;
  /** light: 白色顶栏用；dark: 深色导航栏（移动端菜单）用 */
  variant?: "light" | "dark";
}) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.split("/").slice(2).join("/");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 点击外部 / Escape 关闭
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = options.find((o) => o.locale === lang);

  const triggerClass =
    variant === "dark"
      ? "border-white/25 bg-white/10 text-white hover:border-white/50 hover:bg-white/15"
      : "border-gray-200 text-ink hover:border-primary hover:text-primary";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className={`flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-sm font-medium transition-colors ${triggerClass}`}
      >
        <BsGlobe className="h-4 w-4" />
        <span>{current?.label ?? "English"}</span>
        <FaChevronDown
          className={`h-2.5 w-2.5 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded border border-gray-100 bg-white py-1 shadow-lg"
        >
          {options.map(({ locale, label }) => (
            <li key={locale} role="option" aria-selected={locale === lang}>
              <Link
                href={`/${locale}${rest ? `/${rest}` : ""}`}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 ${
                  locale === lang ? "font-semibold text-primary" : "text-ink"
                }`}
              >
                {label}
                {locale === lang && <FaCheck className="h-3 w-3" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
