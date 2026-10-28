import { fetchAPI } from "./fetch-api";

export interface ProductItem {
  documentId: string;
  name: string;
  model?: string | null;
  condition?: "New" | "Used" | null;
  slug: string;
  cover?: { url: string; alternativeText?: string | null } | null;
  categories?: Array<{ documentId: string; name: string; slug: string }>;
}

export interface CategoryItem {
  documentId: string;
  name: string;
  slug: string;
  description?: string | null;
  products?: { count?: number } | unknown[];
}

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}` },
});

export async function getProducts(opts: {
  categorySlug?: string;
  condition?: string;
  q?: string;
  locale?: string;
  limit?: number;
} = {}): Promise<ProductItem[]> {
  const { categorySlug, condition, q, locale, limit } = opts;
  const filters: Record<string, unknown> = {};
  if (categorySlug) filters.categories = { slug: { $eq: categorySlug } };
  if (condition) filters.condition = { $eq: condition };
  if (q) filters.name = { $containsi: q };

  const res = await fetchAPI(
    "/products",
    {
      filters,
      sort: ["createdAt:desc"],
      pagination: { pageSize: limit ?? 100 },
      locale: locale && locale !== "en" ? locale : "en",
      populate: {
        cover: { fields: ["url", "alternativeText"] },
        categories: { fields: ["name", "slug"] },
      },
    },
    authHeaders()
  );
  return res.data ?? [];
}

export async function getProductCountByCategory(locale = "en"): Promise<Record<string, number>> {
  const res = await fetchAPI(
    "/categories",
    {
      pagination: { pageSize: 100 },
      locale: locale && locale !== "en" ? locale : "en",
      populate: { products: { fields: ["documentId"] } },
    },
    authHeaders()
  );
  const counts: Record<string, number> = {};
  for (const c of res.data ?? []) {
    counts[c.slug] = Array.isArray(c.products) ? c.products.length : 0;
  }
  return counts;
}

export async function getCategories(locale = "en"): Promise<CategoryItem[]> {
  const res = await fetchAPI(
    "/categories",
    {
      sort: ["name:asc"],
      pagination: { pageSize: 100 },
      locale: locale && locale !== "en" ? locale : "en",
    },
    authHeaders()
  );
  return res.data ?? [];
}
