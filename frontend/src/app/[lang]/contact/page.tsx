import { BsTelephone, BsEnvelope, BsGeoAlt, BsClock } from "react-icons/bs";
import { getDictionary } from "../utils/dictionary";
import QuoteForm from "../components/QuoteForm";

export default async function ContactRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <div className="max-w-[1400px] m-auto px-4 py-12 lg:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink md:text-4xl">{dict.contactTitle}</h1>
        <div className="mx-auto mt-3 h-1 w-20 rounded bg-accent" />
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">{dict.contactSub}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Contact info cards */}
        <div className="space-y-4">
          {[
            { icon: BsTelephone, label: dict.phoneNumber, value: "0(800) 123-456" },
            { icon: BsEnvelope, label: dict.emailAddress, value: "info@morephar.com" },
            { icon: BsGeoAlt, label: dict.address, value: dict.addressValue },
            { icon: BsClock, label: dict.hours, value: dict.hoursValue },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 rounded-lg border border-gray-200 p-5">
              <div className="grid size-12 shrink-0 place-content-center rounded-full bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
                <p className="font-semibold text-ink">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="rounded-lg border border-gray-200 p-8 lg:col-span-2">
          <QuoteForm lang={lang} />
        </div>
      </div>
    </div>
  );
}
