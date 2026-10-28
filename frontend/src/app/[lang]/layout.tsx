import type { Metadata } from "next";
import "./globals.css";
import { getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";
import { getCategories, type CategoryItem } from "./utils/get-products";

import { i18n } from "../../../i18n-config";
import Footer from "./components/Footer";
import Navbar, { type NavCategory } from "./components/Navbar";
import { FALLBACK_SEO } from "@/app/[lang]/utils/constants";

// 页面内容全部来自 Strapi（导航/页脚/产品），必须请求时渲染；
// 否则 Docker build 的静态预渲染阶段会因 Strapi 不可达而失败。
export const dynamic = "force-dynamic";


async function getGlobal(lang: string): Promise<any> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: [
      "metadata",
      "favicon",
      "contact",
      "navbar.navbarLogo.logoImg",
      "footer.footerLogo.logoImg",
    ],
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

async function getNavCategories(lang: string): Promise<NavCategory[]> {
  try {
    const categories: CategoryItem[] = await getCategories(lang);
    return categories.map((c) => ({ documentId: c.documentId, name: c.name, slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  const meta = await getGlobal(params.lang);

  if (!meta.data) return FALLBACK_SEO;

  const { metadata, favicon } = meta.data;
  const { url } = favicon;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    icons: {
      icon: [new URL(url, getStrapiURL())],
    },
  };
}

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const [global, categories] = await Promise.all([getGlobal(params.lang), getNavCategories(params.lang)]);
  // TODO: CREATE A CUSTOM ERROR PAGE
  if (!global.data) return null;

  const { contact, navbar } = global.data;

  const contactInfo = {
    tel: contact?.tel,
    email: contact?.email,
    address: contact?.address,
  };

  const logoText: string = navbar?.navbarLogo?.logoText || "Morephare";

  return (
    <html lang={params.lang}>
      <body>
        <Navbar contact={contactInfo} categories={categories} logoText={logoText} lang={params.lang} />
        <main className="bg-white min-h-[60vh]">
          {children}
        </main>
        <Footer categories={categories} contact={contactInfo} lang={params.lang} />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
