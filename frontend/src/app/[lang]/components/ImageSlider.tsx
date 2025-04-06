"use client";
import { Fade } from "react-slideshow-image";
import { getStrapiMedia } from "../utils/api-helpers";
import Image from "next/image";

interface Image {
  id: number;
  alternativeText: string | null;
  caption: string | null;
  url: string;
}

interface SlidShowProps {
  files: Image[];
}

export default function Slideshow({ data }: { data: SlidShowProps }) {
  return (
    <div className="slide-container h-[500px]">
      <Fade>
        {data.files.map((fadeImage: Image, index) => {
          const imageUrl = getStrapiMedia(fadeImage.url);
          return (
            <div key={index} className="relative aspect-[16/7] w-full h-[500px]">
              {imageUrl && (
                <Image
                  className="rounded-lg"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                  alt={fadeImage.alternativeText || 'Slider image'}
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
