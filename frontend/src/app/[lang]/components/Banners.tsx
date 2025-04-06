'use client';

import Image from 'next/image';
import { getStrapiMedia } from '../utils/api-helpers';

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.banner.map((item, index) => {
          const imageUrl = item.picture?.url;
          return (
            <div key={index} className="relative h-64 overflow-hidden rounded-lg">
              {imageUrl && (
                <Image
                  src={getStrapiMedia(imageUrl) || ''}
                  alt={item.title || ''}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold text-center px-4">
                  {item.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}