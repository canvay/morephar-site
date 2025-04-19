import ProductCard from "./ProductCard";
export default function FeaturedProducts({ data }: any) {
  return (
    <div className="max-w-[1400px] p-6 m-auto grid grid-cols-5 gap-6 overflow-auto mt-4">
      {data.products.map((product: any, index: number) => {
        return <ProductCard key={index} data={product} />;
      })}
    </div>
  );
}
