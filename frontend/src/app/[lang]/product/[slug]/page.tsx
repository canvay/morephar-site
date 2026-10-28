import Link from "next/link";
import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import { getDictionary } from '@/app/[lang]/utils/dictionary';
import Product from '@/app/[lang]/views/product';

async function getProductBySlug(slug: string, lang: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/products`;
    const urlParamsObject = {
        filters: { slug },
        locale: lang && lang !== "en" ? lang : "en",
        populate: {
            cover: { fields: ["url", "alternativeText"] },
            categories: { fields: ["name", "slug"] },
            detail: {
                populate: {
                    pictures: {
                        fields: ["url", "alternativeText", "caption", "width", "height"],
                    },
                    information: "*",
                },
            },
        },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await params;
    const res = await getProductBySlug(slug, lang);
    const product = res.data?.[0];
    return { title: product ? `${product.name} | Morephare` : "Product | Morephare" };
}

export default async function ProductRoute(props: { params: Promise<{ lang: string; slug: string }> }) {
    const params = await props.params;
    const { lang, slug } = params;
    const dict = getDictionary(lang);
    const res = await getProductBySlug(slug, lang);

    if (res.error || res.data.length === 0) {
        return (
            <div className="max-w-[1400px] m-auto px-4 py-24 text-center lg:px-6">
                <h1 className="text-3xl font-bold text-ink">Page not found</h1>
                <Link href={`/${lang}/product`} className="mt-6 inline-block rounded bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
                    {dict.navAllEquipment}
                </Link>
            </div>
        );
    }

    const product = res.data[0];

    return (
        <div className="max-w-[1400px] m-auto px-4 py-8 lg:px-6">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
                <Link href={`/${lang}`} className="hover:text-primary">{dict.breadcrumbHome}</Link>
                <span className="mx-2">/</span>
                <Link href={`/${lang}/product`} className="hover:text-primary">{dict.navEquipment}</Link>
                <span className="mx-2">/</span>
                <span className="text-ink">{product.name}</span>
            </nav>
            <Product data={product} lang={lang} />
        </div>
    );
}
