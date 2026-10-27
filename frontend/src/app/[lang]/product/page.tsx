import Link from "next/link";
import { getCategories, getProductCountByCategory, getProducts } from "../utils/get-products";
import ProductCard from "../components/ProductCard";

export default async function PageRoute({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; condition?: string; q?: string }>;
}) {
  const { lang } = await params;
  const sp = await searchParams;

  const [products, categories, counts] = await Promise.all([
    getProducts({ categorySlug: sp.category, condition: sp.condition, q: sp.q }).catch(() => []),
    getCategories().catch(() => []),
    getProductCountByCategory().catch((): Record<string, number> => ({})),
  ]);

  const conditionLink = (condition?: string) => {
    const sp2 = new URLSearchParams();
    if (sp.category) sp2.set("category", sp.category);
    if (condition) sp2.set("condition", condition);
    const qs = sp2.toString();
    return `/${lang}/product${qs ? `?${qs}` : ""}`;
  };

  const conditionLabel = sp.condition === "New" || sp.condition === "Used" ? sp.condition : "All";

  return (
    <div className="max-w-[1400px] m-auto px-4 py-8 lg:px-6">
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:w-64">
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-4 text-lg font-bold text-ink">Categories</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href={`/${lang}/product${sp.condition ? `?condition=${sp.condition}` : ""}`}
                  className={`block rounded px-3 py-2 transition ${
                    !sp.category ? "bg-primary/10 font-semibold text-primary" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Equipment
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.documentId}>
                  <Link
                    href={`/${lang}/product/category/${c.slug}${sp.condition ? `?condition=${sp.condition}` : ""}`}
                    className={`flex items-center justify-between rounded px-3 py-2 transition ${
                      sp.category === c.slug ? "bg-primary/10 font-semibold text-primary" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-gray-400">{counts[c.slug] ?? 0}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mb-4 mt-8 text-lg font-bold text-ink">Condition</h3>
            <ul className="space-y-1.5 text-sm">
              {["All", "New", "Used"].map((c) => (
                <li key={c}>
                  <Link
                    href={conditionLink(c === "All" ? undefined : c)}
                    className={`block rounded px-3 py-2 transition ${
                      conditionLabel === c ? "bg-primary/10 font-semibold text-primary" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c === "All" ? "All Conditions" : c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="w-full">
          <h1 className="text-3xl font-bold text-ink">
            {sp.q ? `Search: "${sp.q}"` : sp.condition ? `${sp.condition} Equipment` : "Productions"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {products.length} {products.length === 1 ? "item" : "items"} available
          </p>
          {products.length === 0 ? (
            <p className="py-16 text-center text-gray-500">No equipment found.</p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.documentId} data={p} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
