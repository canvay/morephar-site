"use client";
import { Fade } from "react-slideshow-image";
import { getStrapiMedia } from "../utils/api-helpers";
import Image from "next/image";

interface Image {
  id: number;
  attributes: {
    alternativeText: string | null;
    caption: string | null;
    url: string;
  };
}

interface SlidShowProps {
  files: {
    data: Image[];
  };
}

export default function Slideshow({ data }: { data: SlidShowProps }) {
  return (
    <div className="slide-container h-[500px]">
      <Fade>
        {data.files.data.map((fadeImage: Image, index) => {
          const imageUrl = getStrapiMedia(fadeImage.attributes.url);
          return (
            <div key={index} className="relative aspect-[16/7] w-full h-[500px]">
              {imageUrl && (
                <Image
                  className="rounded-lg"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                  alt={fadeImage.attributes.alternativeText || 'Slider image'}
                  src={imageUrl}
                />
              )}
            </div>
          );
        })}
      </Fade>
    </div>
  );
}
