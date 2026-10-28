import Link from "next/link";
import { BsTelephone, BsEnvelope, BsSearch } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { getDictionary } from "../utils/dictionary";
import LanguageSwitcher from "./LanguageSwitcher";

export interface NavCategory {
  documentId: string;
  name: string;
  slug: string;
}

export default function Navbar({
  contact,
  categories,
  logoText = "Morephare",
  lang = "en",
}: {
  contact: { tel?: string; email?: string };
  categories: NavCategory[];
  logoText?: string;
  lang?: string;
}) {
  const dict = getDictionary(lang);
  const tel = contact?.tel || "0(800) 123-456";
  const email = contact?.email || "info@morephar.com";

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar: logo / search / contact / quote */}
      <div className="max-w-[1400px] m-auto px-4 lg:px-6">
        <div className="flex items-center justify-between gap-6 py-4">
          <Link href={`/${lang}`} className="shrink-0" aria-label={logoText}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/Morephare_wordmark_primary.svg"
              alt={logoText}
              width={186}
              height={40}
              className="h-9 w-auto md:h-10"
            />
          </Link>

          <div className="hidden lg:block flex-1 max-w-md">
            <form action={`/${lang}/product`} method="get" className="relative">
              <input
                type="text"
                name="q"
                placeholder={dict.searchPlaceholder}
                className="w-full rounded border-gray-300 pe-10 shadow-sm sm:text-sm focus:border-primary focus:ring-primary"
              />
              <span className="absolute inset-y-0 right-2 grid w-8 place-content-center text-gray-500">
                <BsSearch className="size-4" />
              </span>
            </form>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <LanguageSwitcher lang={lang} />
            <a href={`tel:${tel.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2">
              <BsTelephone className="w-6 h-6 text-primary" />
              <span>
                <span className="block text-xs text-gray-500 leading-none mb-1">{dict.phoneNumber}</span>
                <span className="block text-sm font-bold text-ink">{tel}</span>
              </span>
            </a>
            <div className="h-8 w-px bg-gray-200" aria-hidden />
            <a href={`mailto:${email}`} className="hidden xl:flex items-center gap-2">
              <BsEnvelope className="w-6 h-6 text-primary" />
              <span>
                <span className="block text-xs text-gray-500 leading-none mb-1">{dict.emailAddress}</span>
                <span className="block text-sm font-bold text-ink">{email}</span>
              </span>
            </a>
            <Link
              href={`/${lang}/contact`}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded font-semibold text-sm transition-colors"
            >
              {dict.requestQuote}
            </Link>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="bg-ink text-white">
        <div className="max-w-[1400px] m-auto px-4 lg:px-6">
          {/* Desktop */}
          <ul className="hidden md:flex items-stretch gap-10 text-sm font-medium">
            <li>
              <Link href={`/${lang}`} className="flex items-center py-4 hover:text-primary transition-colors">
                {dict.navHome}
              </Link>
            </li>
            <li className="relative group">
              <Link
                href={`/${lang}/product`}
                className="flex items-center gap-1.5 py-4 hover:text-primary transition-colors"
              >
                {dict.navEquipment}
                <FaChevronDown className="w-3 h-3 opacity-70" />
              </Link>
              <div className="absolute left-0 top-full z-50 hidden group-hover:block w-72 rounded-b bg-white text-ink shadow-lg">
                <Link
                  href={`/${lang}/product`}
                  className="block border-b border-gray-100 px-5 py-3 font-semibold hover:bg-gray-50 hover:text-primary"
                >
                  {dict.navAllEquipment}
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.documentId}
                    href={`/${lang}/product/category/${c.slug}`}
                    className="block px-5 py-3 hover:bg-gray-50 hover:text-primary"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </li>
            <li>
              <Link href={`/${lang}/about`} className="flex items-center py-4 hover:text-primary transition-colors">
                {dict.navAbout}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/contact`} className="flex items-center py-4 hover:text-primary transition-colors">
                {dict.navContact}
              </Link>
            </li>
            <li className="ml-auto">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 py-4 text-sm text-gray-300 hover:text-primary transition-colors"
              >
                <BsEnvelope className="w-4 h-4" />
                {email}
              </a>
            </li>
          </ul>

          {/* Mobile */}
          <details className="md:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 py-3.5 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              {dict.menu}
            </summary>
            <div className="space-y-0.5 pb-4 text-sm">
              <Link href={`/${lang}`} className="block rounded px-2 py-2.5 hover:bg-white/10">{dict.navHome}</Link>
              <Link href={`/${lang}/product`} className="block rounded px-2 py-2.5 hover:bg-white/10">{dict.navAllEquipment}</Link>
              {categories.map((c) => (
                <Link key={c.documentId} href={`/${lang}/product/category/${c.slug}`} className="block rounded px-2 py-2.5 pl-6 text-gray-300 hover:bg-white/10 hover:text-white">
                  {c.name}
                </Link>
              ))}
              <Link href={`/${lang}/about`} className="block rounded px-2 py-2.5 hover:bg-white/10">{dict.navAbout}</Link>
              <Link href={`/${lang}/contact`} className="block rounded px-2 py-2.5 hover:bg-white/10">{dict.navContact}</Link>
            </div>
          </details>
        </div>
      </nav>
    </div>
  );
}
