"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { i18n } from "../../../../i18n-config";

const labels: Record<string, string> = {
  en: "EN",
  de: "DE",
  cs: "CS",
  "zh-CN": "中文",
};

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      {i18n.locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${rest ? `/${rest}` : ""}`}
          className={`rounded px-2 py-1 transition ${
            locale === lang
              ? "bg-white/20 text-white"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          {labels[locale] ?? locale}
        </Link>
      ))}
    </div>
  );
}
