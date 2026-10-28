"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const options = [
  { locale: "en", label: "EN" },
  { locale: "zh-CN", label: "中文" },
] as const;

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-full border border-white/25 bg-white/10 p-0.5"
      role="group"
      aria-label="Language"
    >
      {options.map(({ locale, label }) => (
        <Link
          key={locale}
          href={`/${locale}${rest ? `/${rest}` : ""}`}
          className={`rounded-full px-3 py-1 text-xs font-semibold leading-none transition ${
            locale === lang
              ? "bg-primary text-white shadow"
              : "text-gray-200 hover:bg-white/15 hover:text-white"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
