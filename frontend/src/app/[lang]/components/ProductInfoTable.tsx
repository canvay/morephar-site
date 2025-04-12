import React from "react";

interface ProductInfoTableProps {
  title: string;
  columns: { key: string; title: string }[];
  data: Record<string, any>[];
}

const ProductInfoTable: React.FC<ProductInfoTableProps> = ({
  title,
  columns,
  data,
}) => {
  return (
    <div className="product-table-group w-full my-8">
      <h2 className="text-center text-2xl font-semibold mb-4">{title}</h2>
      <div className="border-collapse w-full">
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="flex border-t border-gray-300 last:border-b"
            >
              {columns.map((column, idx) => {
                return (
                  <div key={idx} className="w-1/2 py-3 px-4">
                    {item[column.key]}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductInfoTable;
