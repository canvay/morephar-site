import Logo from "./Logo";
import Link from "next/link";
import { BsTelephone, BsEnvelope } from "react-icons/bs";

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
  return (
    <li className="flex">
      <Link href={url} className={`flex items-center`}>
        {text}
      </Link>
    </li>
  );
}

export default function Navbar({
  contact,
  links,
  logoUrl,
  logoText,
}: {
  contact: {
    tel: string;
    email: string;
  };
  links: Array<NavLink>;
  logoUrl: string | null;
  logoText: string | null;
}) {
  return (
    <div className="sticky top-0 bg-white z-100">
      {/* First row: Logo and contact info */}
      <div className="max-w-[1400px] m-auto p-6 hidden md:block">
        <div className="flex items-center justify-between gap-12 py-2">
          {/* logo */}
          <div className="">
            <div className="scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              <Link href="/">Morephare</Link>
            </div>
          </div>
          {/* search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                id="Search"
                className="w-full rounded border-gray-300 pe-10 shadow-sm sm:text-sm"
                placeholder="search..."
              />
              <span className="absolute inset-y-0 right-2 grid w-8 place-content-center">
                <button
                  type="button"
                  aria-label="Submit"
                  className="rounded-full p-1.5 text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </span>
            </div>
          </div>
          {/* contact */}
          <div className="flex items-center gap-4">
            <a className="flex items-center gap-2" href="tel:#">
              <div className="icon-box-icon mr-0 mr-lg-2">
                <BsTelephone className="w-6 h-6" />
              </div>
              <div className="">
                <h4 className="text-xs mb-1">Phone Number</h4>
                <p className="text-sm font-bold">0(800) 123-456</p>
              </div>
            </a>
            <div className="h-8 w-[1px] bg-gray-300"></div>
            <a className="flex items-center gap-2" href="tel:#">
              <div className="icon-box-icon mr-0 mr-lg-2">
                <BsEnvelope className="w-6 h-6" />
              </div>
              <div className="">
                <h4 className="text-xs mb-1">Email Address</h4>
                <p className="text-sm font-bold">morephar@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>
      {/* Second row: Navigation menu */}
      <div className="bg-black">
        <div className="max-w-[1400px] m-auto md:block ">
          <div className="px-6 py-4">
            <ul className="items-stretch space-x-12 lg:flex text-white">
              {links.map((item: NavLink) => (
                <NavLink key={item.id} {...item} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
