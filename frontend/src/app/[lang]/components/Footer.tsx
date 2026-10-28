import Link from "next/link";
import { BsTelephone, BsEnvelope, BsGeoAlt, BsYoutube, BsTwitterX } from "react-icons/bs";
import type { NavCategory } from "./Navbar";
import { getDictionary } from "../utils/dictionary";

export default function Footer({
  categories,
  contact,
  lang = "en",
}: {
  categories: NavCategory[];
  contact: { tel?: string; email?: string; address?: string };
  lang?: string;
}) {
  const dict = getDictionary(lang);
  const tel = contact?.tel || "0(800) 123-456";
  const email = contact?.email || "info@morephar.com";
  const address = contact?.address || dict.addressValue;

  return (
    <footer className="bg-ink text-gray-300">
      <div className="max-w-[1400px] m-auto grid grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/Morephare_wordmark_dark.svg"
            alt="Morephare"
            width={186}
            height={40}
            className="mb-4 h-9 w-auto"
          />
          <p className="text-sm leading-6">{dict.footerBlurb}</p>
          <div className="mt-5 flex gap-3 text-lg">
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-primary transition-colors">
              <BsYoutube />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-primary transition-colors">
              <BsTwitterX />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">{dict.closerLook}</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href={`/${lang}/about`} className="hover:text-primary transition-colors">{dict.aboutUs}</Link></li>
            <li><Link href={`/${lang}/contact`} className="hover:text-primary transition-colors">{dict.requestQuote}</Link></li>
            <li><Link href={`/${lang}/product`} className="hover:text-primary transition-colors">{dict.allEquipment}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">{dict.equipment}</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.documentId}>
                <Link href={`/${lang}/product/category/${c.slug}`} className="hover:text-primary transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">{dict.contactInfo}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <BsGeoAlt className="mt-0.5 shrink-0 text-primary" />
              <span>{address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <BsTelephone className="mt-0.5 shrink-0 text-primary" />
              <a href={`tel:${tel.replace(/[^+\d]/g, "")}`} className="hover:text-primary transition-colors">{tel}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <BsEnvelope className="mt-0.5 shrink-0 text-primary" />
              <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] m-auto flex flex-col justify-between gap-2 px-4 py-5 text-sm md:flex-row lg:px-6">
          <p>© {new Date().getFullYear()} morephar.com {dict.allRightsReserved}</p>
          <p>{dict.poweredBy}</p>
        </div>
      </div>
    </footer>
  );
}
