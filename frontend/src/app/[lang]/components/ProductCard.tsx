import { getStrapiMedia } from "../utils/api-helpers";
import Image from "next/image";

export default function ProductCard({ data }: any) {
  return (
    <a href="#" className="group relative block overflow-hidden">
      <div className="relative w-48 h-48">
        <Image
          src={getStrapiMedia(data.cover.url) || ""}
          className="object-cover transition duration-500 group-hover:scale-105"
          alt={data.name}
          fill
        />
      </div>
      <div className="relative bg-white py-6">
        <h3 className="mt-1.5 text-lg font-medium text-gray-900">
          {data.name}
        </h3>
        {/* <form className="mt-4 flex gap-4">
          <button className="block w-full rounded-sm bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 transition hover:scale-105">
            Add to Cart
          </button>
          <button
            type="button"
            className="block w-full rounded-sm bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:scale-105"
          >
            Buy Now
          </button>
        </form> */}
      </div>
    </a>
  );
}
