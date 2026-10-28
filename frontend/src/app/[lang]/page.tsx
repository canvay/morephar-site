import Link from "next/link";
import { getProducts } from "./utils/get-products";
import { getDictionary } from "./utils/dictionary";
import ProductCard from "./components/ProductCard";

export default async function RootRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = await getProducts({ limit: 8, locale: lang });
  } catch {
    products = [];
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink via-[#1d4e66] to-primary">
        <div className="max-w-[1400px] m-auto px-4 py-20 md:py-28 lg:px-6">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
              {dict.heroTag}
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {dict.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-200">{dict.heroSub}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/${lang}/product`}
                className="rounded bg-primary px-7 py-3.5 font-semibold text-white transition hover:bg-primary-dark"
              >
                {dict.shopNow}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="rounded border-2 border-white/60 px-7 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                {dict.requestQuote}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newest equipment */}
      <section className="max-w-[1400px] m-auto px-4 py-16 lg:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-ink md:text-4xl">{dict.newestEquipment}</h2>
          <div className="mx-auto mt-3 h-1 w-20 rounded bg-accent" />
        </div>
        {products.length === 0 ? (
          <p className="py-12 text-center text-gray-500">{dict.noEquipmentYet}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.documentId} data={p} lang={lang} />
            ))}
          </div>
        )}
      </section>

      {/* CTA banner */}
      <section className="bg-primary">
        <div className="max-w-[1400px] m-auto flex flex-col items-center justify-between gap-6 px-4 py-12 md:flex-row lg:px-6">
          <h2 className="max-w-3xl text-center text-2xl font-bold text-white md:text-left md:text-3xl">
            {dict.ctaTitle}
          </h2>
          <Link
            href={`/${lang}/product`}
            className="shrink-0 rounded bg-white px-8 py-3.5 font-semibold text-primary shadow transition hover:bg-gray-100"
          >
            {dict.shopNow}
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="max-w-[1400px] m-auto grid grid-cols-1 items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:px-6">
        <div>
          <h2 className="text-3xl font-bold leading-snug text-ink md:text-4xl">{dict.aboutTitle}</h2>
          <div className="mt-3 h-1 w-20 rounded bg-accent" />
          <p className="mt-6 leading-7 text-gray-600">{dict.aboutP1}</p>
          <p className="mt-4 leading-7 text-gray-600">{dict.aboutP2}</p>
          <Link
            href={`/${lang}/about`}
            className="mt-8 inline-block rounded bg-ink px-7 py-3 font-semibold text-white transition hover:bg-ink/80"
          >
            {dict.readMore}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {dict.cards.map((item) => (
            <div key={item.title} className="rounded-lg border border-gray-200 p-6 transition hover:border-primary hover:shadow-md">
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clients */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-[1400px] m-auto px-4 lg:px-6">
          <h2 className="text-center text-2xl font-bold text-ink md:text-3xl">
            {dict.clientsTitle}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {dict.clientLabels.map((label) => (
              <div key={label} className="grid h-20 place-content-center rounded border border-gray-200 bg-white px-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banners */}
      <section className="max-w-[1400px] m-auto grid grid-cols-1 gap-6 px-4 py-16 md:grid-cols-2 lg:px-6">
        <div className="rounded-lg bg-gradient-to-r from-ink to-[#1d4e66] p-10 text-white">
          <h3 className="text-2xl font-bold">{dict.promo1Title}</h3>
          <p className="mt-3 text-gray-300">{dict.promo1Text}</p>
          <Link href={`/${lang}/contact`} className="mt-6 inline-block rounded bg-accent px-6 py-2.5 font-semibold text-white transition hover:brightness-110">
            {dict.learnMore}
          </Link>
        </div>
        <div className="rounded-lg bg-gradient-to-r from-primary to-primary-dark p-10 text-white">
          <h3 className="text-2xl font-bold">{dict.promo2Title}</h3>
          <p className="mt-3 text-gray-100">{dict.promo2Text}</p>
          <Link href={`/${lang}/contact`} className="mt-6 inline-block rounded bg-white px-6 py-2.5 font-semibold text-primary transition hover:bg-gray-100">
            {dict.getSupport}
          </Link>
        </div>
      </section>

      {/* Experience */}
      <section className="border-t border-gray-100 bg-white py-14">
        <div className="max-w-[1400px] m-auto px-4 text-center lg:px-6">
          <p className="mx-auto max-w-4xl text-lg leading-8 text-gray-600">{dict.experienceText}</p>
        </div>
      </section>
    </>
  );
}
