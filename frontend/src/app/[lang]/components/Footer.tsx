"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { CgWebsite } from "react-icons/cg";
import { FaDiscord } from "react-icons/fa";
import { AiFillTwitterCircle, AiFillYoutube } from "react-icons/ai";

interface FooterLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
  social?: string;
}

interface CategoryLink {
  id: string;
  name: string;
  slug: string;
}

function FooterLink({ url, text }: FooterLink) {
  const path = usePathname();
  return (
    <li className="flex">
      <Link
        href={url}
        className={`hover:dark:text-violet-400 ${
          path === url && "dark:text-violet-400 dark:border-violet-400"
        }}`}
      >
        {text}
      </Link>
    </li>
  );
}

function CategoryLink({ name, slug }: CategoryLink) {
  return (
    <li className="flex">
      <Link href={`/blog/${slug}`} className="hover:dark:text-violet-400">
        {name}
      </Link>
    </li>
  );
}

function RenderSocialIcon({ social }: { social: string | undefined }) {
  switch (social) {
    case "WEBSITE":
      return <CgWebsite />;
    case "TWITTER":
      return <AiFillTwitterCircle />;
    case "YOUTUBE":
      return <AiFillYoutube />;
    case "DISCORD":
      return <FaDiscord />;
    default:
      return null;
  }
}

export default function Footer({
  logoUrl,
  logoText,
  menuLinks,
  categoryLinks,
  legalLinks,
  socialLinks,
}: {
  logoUrl: string | null;
  logoText: string | null;
  menuLinks: Array<FooterLink>;
  categoryLinks: Array<CategoryLink>;
  legalLinks: Array<FooterLink>;
  socialLinks: Array<FooterLink>;
}) {
  return (
    <footer className="py-6 dark:bg-black dark:text-gray-50">
      <div className="container px-6 mx-auto space-y-6 divide-y divide-gray-400 md:space-y-12 divide-opacity-50">
        <div className="grid grid-cols-12">
          <div className="pb-6 col-span-full md:pb-0 md:col-span-6">
            <Logo src={logoUrl}>
              {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
            </Logo>
          </div>

          <div className="col-span-6 text-center md:text-left md:col-span-3">
            <p className="pb-1 text-lg font-medium">Menu</p>
            <ul>
              {menuLinks.map((link: FooterLink) => (
                <FooterLink key={link.id} {...link} />
              ))}
            </ul>
          </div>
        </div>

        <div className="grid justify-center pt-6 lg:justify-between">
          © 2025 morephar.com All Rights Reserved. 905 E. Salter Drive, Phoenix,
          AZ 85024 | (623) 582-2800
        </div>
      </div>
    </footer>
  );
}
