"use client";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface NavLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
}

interface MobileNavLink extends NavLink {
  closeMenu: () => void;
}

function NavLink({ url, text }: NavLink) {
  const path = usePathname();

  return (
    <li className="flex">
      <Link
        href={url}
        className={`flex items-center mx-4 -mb-1 border-b-2 dark:border-transparent ${path === url && "dark:text-violet-400 dark:border-violet-400"}`}
      >
        {text}
      </Link>
    </li>
  );
}

function MobileNavLink({ url, text, closeMenu }: MobileNavLink) {
  const path = usePathname();
  const handleClick = () => {
    closeMenu();
  };
  return (
    <a className="flex">
      <Link
        href={url}
        onClick={handleClick}
        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-100 hover:bg-gray-900 ${path === url && "dark:text-violet-400 dark:border-violet-400"}`}
      >
        {text}
      </Link>
    </a>
  );
}

export default function Navbar({
  links,
  logoUrl,
  logoText,
}: {
  links: Array<NavLink>;
  logoUrl: string | null;
  logoText: string | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };
  return (
    <div className="bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        {/* First row: Logo and contact info */}
        <div className="py-2 flex items-center justify-between border-b border-gray-700">
          <Logo src={logoUrl}>
            {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
          </Logo>
          <div className="hidden lg:flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+1 234 567 890</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>contact@example.com</span>
            </div>
          </div>
          <div className="hidden lg:flex">
            <button className="px-6 py-2 font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors duration-300">
              Contact Us
            </button>
          </div>
        </div>
        {/* Second row: Navigation menu */}
        <div className="py-4 flex justify-between items-center">
          <div className="items-center flex-shrink-0 hidden lg:flex justify-center">
            <ul className="items-stretch hidden space-x-8 lg:flex">
              {links.map((item: NavLink) => (
                <NavLink key={item.id} {...item} />
              ))}
            </ul>
          </div>

          <div className="hidden lg:flex items-center ml-auto relative">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200 flex items-center justify-center"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-100" />
            </button>
            <div
              className={`absolute right-full mr-2 transition-all duration-300 ease-in-out transform ${isSearchOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
            >
              <input
                type="search"
                placeholder="Search..."
                className="w-64 px-4 py-2 text-gray-900 bg-white border rounded-lg focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <Dialog
            as="div"
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75" />{" "}
            {/* Overlay */}
            <Dialog.Panel className="fixed inset-y-0 rtl:left-0 ltr:right-0 z-50 w-full overflow-y-auto bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-inset sm:ring-white/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Strapi</span>
                  {logoUrl && <img className="h-8 w-auto" src={logoUrl} alt="" />}
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-700">
                  <div className="space-y-2 py-6">
                    {links.map((item) => (
                      <MobileNavLink
                        key={item.id}
                        closeMenu={closeMenu}
                        {...item}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
          <button
            className="p-4 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-7 w-7 text-gray-100" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
