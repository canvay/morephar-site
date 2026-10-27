import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";
import type { ProductItem } from "../utils/get-products";

export default function ProductCard({
  data,
  lang = "en",
}: {
  data: ProductItem;
  lang?: string;
}) {
  const imgUrl = getStrapiMedia(data.cover?.url);
  const isNew = data.condition !== "Used";

  return (
    <Link
      href={`/${lang}/product/${data.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={data.cover?.alternativeText || data.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-4 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-content-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded px-2.5 py-1 text-xs font-semibold text-white ${
            isNew ? "bg-primary" : "bg-accent"
          }`}
        >
          {data.condition ?? "New"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3rem] text-base font-semibold text-ink transition group-hover:text-primary">
          {data.name}
        </h3>
        {data.model && <p className="mt-1 text-sm text-gray-500">Model: {data.model}</p>}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          Read more
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
