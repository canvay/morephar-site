import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProducts } from "../../../utils/get-products";
import { getDictionary } from "../../../utils/dictionary";
import ProductCard from "../../../components/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const categories = await getCategories(lang).catch(() => []);
  const category = categories.find((c) => c.slug === slug);
  return { title: category ? `${category.name} | Morephare` : "Category | Morephare" };
}

export default async function CategoryRoute({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ condition?: string }>;
}) {
  const { lang, slug } = await params;
  const sp = await searchParams;
  const dict = getDictionary(lang);

  const categories = await getCategories(lang).catch(() => []);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const products = await getProducts({ categorySlug: slug, condition: sp.condition, locale: lang }).catch(() => []);

  return (
    <div className="max-w-[1400px] m-auto px-4 py-8 lg:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href={`/${lang}`} className="hover:text-primary">{dict.breadcrumbHome}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${lang}/product`} className="hover:text-primary">{dict.navEquipment}</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{category.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-ink md:text-4xl">{category.name}</h1>
      {category.description && (
        <p className="mt-3 max-w-3xl leading-7 text-gray-600">{category.description}</p>
      )}
      <p className="mt-2 text-sm text-gray-500">
        {products.length} {products.length === 1 ? dict.itemAvailable : dict.itemsAvailable}
      </p>

      {products.length === 0 ? (
        <p className="py-16 text-center text-gray-500">{dict.noEquipmentInCategory}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.documentId} data={p} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
