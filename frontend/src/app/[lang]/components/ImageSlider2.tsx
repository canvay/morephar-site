'use client'

import React from 'react'
import { Fade } from "react-slideshow-image";
import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";

interface Image {
    id?: number;
    alternativeText?: string | null;
    caption?: string | null;
    url: string;
}

interface Props {
    pictures: Image[]
    photosText?: string
}

const ImageSlider2: React.FC<Props> = ({
    pictures,
    photosText = "Photos available on request",
}) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    if (!pictures || pictures.length === 0) {
        return (
            <div className="w-full md:w-1/2">
                <div className="grid aspect-[1/1] w-full place-content-center rounded-lg bg-gray-100 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z" />
                    </svg>
                </div>
                <p className="mt-3 text-center text-sm text-gray-400">{photosText}</p>
            </div>
        );
    }
    return <div className="w-full md:w-1/2">
        <div className="slide-container h-[400px] mb-4">
            <Fade>
                {pictures.map((image: Image, index) => {
                    const imageUrl = getStrapiMedia(image.url);
                    return (
                        <div key={index} className="relative aspect-[1/1] w-full h-[400px]">
                            {imageUrl && (
                                <Image
                                    className="rounded-lg"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    priority={index === 0}
                                    alt={image.alternativeText || '产品图片'}
                                    src={imageUrl}
                                />
                            )}
                        </div>
                    );
                })}
            </Fade>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
            {pictures.map((image: Image, index) => {
                const imageUrl = getStrapiMedia(image.url);
                return (
                    <div
                        key={index}
                        className={`relative w-20 h-20 cursor-pointer border-2 rounded ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => setCurrentImageIndex(index)}
                    >
                        {imageUrl && (
                            <Image
                                className="rounded"
                                fill
                                style={{ objectFit: 'cover' }}
                                alt={image.alternativeText || '产品缩略图'}
                                src={imageUrl}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    </div>

}

export default ImageSlider2
