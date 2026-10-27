import Link from "next/link";
import { BsTelephone, BsEnvelope, BsGeoAlt, BsYoutube, BsTwitterX } from "react-icons/bs";
import type { NavCategory } from "./Navbar";

export default function Footer({
  categories,
  contact,
}: {
  categories: NavCategory[];
  contact: { tel?: string; email?: string; address?: string };
}) {
  const tel = contact?.tel || "0(800) 123-456";
  const email = contact?.email || "info@morephar.com";
  const address = contact?.address || "905 E. Salter Drive, Phoenix, AZ 85024";

  return (
    <footer className="bg-ink text-gray-300">
      <div className="max-w-[1400px] m-auto grid grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <p className="mb-4 text-2xl font-bold text-white">
            <span className="text-primary">More</span>phare
          </p>
          <p className="text-sm leading-6">
            A leader in providing innovative production and packaging solutions
            for pharmaceutical, nutraceutical and food manufacturing — from
            small start-ups to large scale operations.
          </p>
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
          <h3 className="mb-4 font-semibold text-white">Closer Look</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Request A Quote</Link></li>
            <li><Link href="/product" className="hover:text-primary transition-colors">All Equipment</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Equipment</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.documentId}>
                <Link href={`/product/category/${c.slug}`} className="hover:text-primary transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Contact Info</h3>
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
          <p>© {new Date().getFullYear()} morephar.com All Rights Reserved.</p>
          <p>Powered by Next.js</p>
        </div>
      </div>
    </footer>
  );
}
