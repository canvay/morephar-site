import { BsTelephone, BsEnvelope, BsGeoAlt, BsClock } from "react-icons/bs";
import QuoteForm from "../components/QuoteForm";

export const metadata = { title: "Contact & Request A Quote | Morephare" };

export default function ContactRoute() {
  return (
    <div className="max-w-[1400px] m-auto px-4 py-12 lg:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink md:text-4xl">Request A Quote</h1>
        <div className="mx-auto mt-3 h-1 w-20 rounded bg-accent" />
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Tell us about your product and target output — our team will recommend
          the right equipment and get back to you within one business day.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Contact info cards */}
        <div className="space-y-4">
          {[
            { icon: BsTelephone, label: "Phone", value: "0(800) 123-456" },
            { icon: BsEnvelope, label: "Email", value: "info@morephar.com" },
            { icon: BsGeoAlt, label: "Address", value: "905 E. Salter Drive, Phoenix, AZ 85024" },
            { icon: BsClock, label: "Hours of Operation", value: "8:00 AM - 5:00 PM" },
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
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
