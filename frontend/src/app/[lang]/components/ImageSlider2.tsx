'use client'

import React from 'react'
import { Fade } from "react-slideshow-image";
import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";

interface Image {
    id: number;
    alternativeText: string | null;
    caption: string | null;
    url: string;
}

interface Props {
    // Define your props here
    pictures: Image[]

}

const ImageSlider2: React.FC<Props> = ({
    pictures
}) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
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
