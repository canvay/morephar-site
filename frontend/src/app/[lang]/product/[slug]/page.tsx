import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import Product from '@/app/[lang]/views/product';

async function getProductBySlug(slug: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/products`;
    const urlParamsObject = {
        filters: { slug },
        populate: {
            detail: { populate: '*' },
        },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response;
}

export default async function ProductRoute(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;
    const res = await getProductBySlug(slug);

    if (res.error || res.data.length === 0) {
        return <h1>Page not found</h1>;
    }

    return <Product data={res.data[0]} />;
}
