"use client";

import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";

interface BannersProps {
  data: {
    banner: Array<{
      picture: {
        url: string;
      };
      title: string;
    }>;
  };
}

export default function Banners({ data }: BannersProps) {
  if (!data?.banner?.length) return null;

  return (
    <section className="max-w-[1400px] p-6 m-auto grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
      {data.banner.map((item, index) => {
        const imageUrl = item.picture?.url;
        return (
          <div
            key={index}
            className="h-36 bg-gray-300 relative"
          >
            {imageUrl && (
              <Image
                src={getStrapiMedia(imageUrl) || ""}
                alt={item.title || ""}
                fill
                className="object-cover"
              />
            )}
          </div>
        );
      })}
    </section>
  );
}
