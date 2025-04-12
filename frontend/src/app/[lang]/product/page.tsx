import React from "react";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import { getStrapiMedia } from "../utils/api-helpers";
import Image from "next/image";
import Link from "next/link";

async function getProducts() {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/products`;
  const urlParamsObject = {
    populate: ["cover"],
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response;
}

// 模拟产品数据
const productData = [
  {
    id: 1,
    name: "Can Seamer",
    model: "E-4266",
    image: "/products/can-seamer.jpg",
    condition: "New",
  },
  {
    id: 2,
    name: "CountRite™ Gummy Bagger",
    model: "",
    image: "/products/gummy-bagger.jpg",
    condition: "New",
  },
  {
    id: 3,
    name: "CountRite™ Gusseted Bag Counter",
    model: "",
    image: "/products/bag-counter.jpg",
    condition: "New",
  },
  {
    id: 4,
    name: "GoPacker 1000",
    model: "",
    image: "/products/gopacker.jpg",
    condition: "Used",
  },
  {
    id: 5,
    name: "New CPT SP50 Dual Fill Stick Packer",
    model: "",
    image: "/products/dual-fill.jpg",
    condition: "New",
  },
  {
    id: 6,
    name: "New CPT SP50 Powder Stick Pack/Bagger",
    model: "",
    image: "/products/powder-stick.jpg",
    condition: "New",
  },
];

export default async function PageRoute() {
  // const [filters, setFilters] = useState({
  //   new: false,
  //   used: false,
  // });

  const res = await getProducts();
  console.log("🚀 ~ PageRoute ~ res:", res);

  // 根据筛选条件过滤产品
  const filteredProducts = res.data || [];

  // 处理筛选条件变化
  const handleFilterChange = (filterName: "new" | "used") => {
    // setFilters((prev) => ({
    //   ...prev,
    //   [filterName]: !prev[filterName],
    // }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧筛选区域 */}
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <div className="p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Product Condition</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="condition-new"
                  className="mr-2"
                  // checked={filters.new}
                  // onChange={() => handleFilterChange("new")}
                />
                <label htmlFor="condition-new">New (6)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="condition-used"
                  className="mr-2"
                  // checked={filters.used}
                  // onChange={() => handleFilterChange("used")}
                />
                <label htmlFor="condition-used">Used (3)</label>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧产品展示区域 */}
        <div className="w-full md:w-3/4">
          <h1 className="text-4xl font-bold mb-6">Productions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product: any) => (
              <Link
                href={`/product/${product.slug}`}
                key={product.id}
                className="mb-16 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="relative w-48 h-48 mb-8">
                  <Image
                    src={getStrapiMedia(product.cover.url) as string}
                    alt={product.name}
                    className="object-contain"
                    fill
                  />
                </div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
