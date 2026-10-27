import React from "react";
import ImageSlider2 from "../components/ImageSlider2";
import RichText from "../components/RichText";
import ProductInfoTable from "../components/ProductInfoTable";
import Link from "next/link";

interface ProductProps {
  data: {
    name?: string;
    model?: string | null;
    condition?: "New" | "Used" | null;
    detail: {
      title?: string;
      content?: string;
      pictures?: Array<{ url: string; alternativeText?: string | null }>;
      information?: Array<{ label: string; value: string }>;
    };
  };
}

const Product: React.FC<ProductProps> = ({ data }) => {
  const detail = data.detail ?? { pictures: [], information: [] };
  const pictures = detail.pictures ?? [];
  const condition = data.condition ?? "New";
  const isNew = condition !== "Used";

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8">
        <ImageSlider2 pictures={pictures} />
        {/* 右侧 - 商品介绍区域 */}
        <div className="w-full md:w-1/2">
          <span
            className={`inline-block rounded px-3 py-1 text-xs font-semibold text-white ${
              isNew ? "bg-primary" : "bg-accent"
            }`}
          >
            {condition}
          </span>
          <h1 className="text-3xl font-bold mb-2 mt-3 text-ink">
            {detail.title || data.name}
          </h1>
          {data.model && <p className="mb-4 text-gray-500">Model: {data.model}</p>}
          <RichText content={detail.content || ""} />
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary-dark"
            >
              Request A Quote
            </Link>
            <Link
              href="/en/product"
              className="rounded border-2 border-ink px-8 py-3 font-semibold text-ink transition hover:bg-ink hover:text-white"
            >
              Back to Equipment
            </Link>
          </div>
        </div>
      </div>
      {(detail.information?.length ?? 0) > 0 && (
        <div className="flex flex-col md:flex-row gap-8 mt-12">
          <ProductInfoTable
            title="Additional Information"
            columns={[
              { title: "label", key: "label" },
              { title: "value", key: "value" },
            ]}
            data={detail.information ?? []}
          />
        </div>
      )}
    </div>
  );
};

export default Product;
