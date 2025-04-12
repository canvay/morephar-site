import React from "react";
import ImageSlider2 from "../components/ImageSlider2";
import RichText from "../components/RichText";
import ProductInfoTable from "../components/ProductInfoTable";

interface ProductProps {
  data: {
    detail: any;
  };
}

const Product: React.FC<ProductProps> = ({ data }) => {
  const detail = data.detail;
  const pictures = detail.pictures;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <ImageSlider2 pictures={pictures} />
        {/* 右侧 - 商品介绍区域 */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{detail.title}</h1>
          <RichText content={detail.content} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <ProductInfoTable
          title="Additional Information"
          columns={[
            {
              title: "label",
              key: "label",
            },
            {
              title: "value",
              key: "value",
            },
          ]}
          data={detail.information}
        />
      </div>
    </div>
  );
};

export default Product;
