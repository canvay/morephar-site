"use client";

import ImageSlider from "./ImageSlider";

interface SliderProps {
    files: {
        data: Array<{
            id: number;
            attributes: {
                alternativeText: string | null;
                caption: string | null;
                url: string;
            };
        }>;
    };
}

export default function Slider({ data }: { data: SliderProps }) {
    return (
        <section className="container mx-auto px-4 py-12">
            <ImageSlider data={data} />
        </section>
    );
}