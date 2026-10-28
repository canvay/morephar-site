import Link from "next/link";
import { getCategories, getProductCountByCategory, getProducts } from "../utils/get-products";
import { getDictionary, conditionLabel } from "../utils/dictionary";
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
  const dict = getDictionary(lang);

  const [products, categories, counts] = await Promise.all([
    getProducts({ categorySlug: sp.category, condition: sp.condition, q: sp.q, locale: lang }).catch(() => []),
    getCategories(lang).catch(() => []),
    getProductCountByCategory(lang).catch((): Record<string, number> => ({})),
  ]);

  const conditionLink = (condition?: string) => {
    const sp2 = new URLSearchParams();
    if (sp.category) sp2.set("category", sp.category);
    if (condition) sp2.set("condition", condition);
    const qs = sp2.toString();
    return `/${lang}/product${qs ? `?${qs}` : ""}`;
  };

  const activeCondition = sp.condition === "New" || sp.condition === "Used" ? sp.condition : "All";

  const heading = sp.q
    ? `${dict.searchLabel}: "${sp.q}"`
    : sp.condition === "Used"
      ? dict.usedEquipment
      : sp.condition === "New"
        ? dict.newEquipment
        : dict.productions;

  return (
    <div className="max-w-[1400px] m-auto px-4 py-8 lg:px-6">
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:w-64">
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-4 text-lg font-bold text-ink">{dict.categories}</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href={`/${lang}/product${sp.condition ? `?condition=${sp.condition}` : ""}`}
                  className={`block rounded px-3 py-2 transition ${
                    !sp.category ? "bg-primary/10 font-semibold text-primary" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {dict.allEquipment}
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

            <h3 className="mb-4 mt-8 text-lg font-bold text-ink">{dict.condition}</h3>
            <ul className="space-y-1.5 text-sm">
              {["All", "New", "Used"].map((c) => (
                <li key={c}>
                  <Link
                    href={conditionLink(c === "All" ? undefined : c)}
                    className={`block rounded px-3 py-2 transition ${
                      activeCondition === c ? "bg-primary/10 font-semibold text-primary" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c === "All" ? dict.allConditions : conditionLabel(dict, c)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="w-full">
          <h1 className="text-3xl font-bold text-ink">{heading}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {products.length} {products.length === 1 ? dict.itemAvailable : dict.itemsAvailable}
          </p>
          {products.length === 0 ? (
            <p className="py-16 text-center text-gray-500">{dict.noEquipmentFound}</p>
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
