"use client";

import ImageSlider from "./ImageSlider";

interface SliderProps {
    files: Array<{
        id: number;
        alternativeText: string | null;
        caption: string | null;
        url: string;
    }>;
}

export default function Slider({ data }: { data: SliderProps }) {
    return (
        <section className="w-full h-[500px]">
            <ImageSlider data={data} />
        </section>
    );
}