"use client";

import { useState } from "react";
import { getDictionary } from "../utils/dictionary";

type Status = "idle" | "sending" | "sent" | "error";

export default function QuoteForm({ lang = "en" }: { lang?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const dict = getDictionary(lang);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"}/api/lead-form-submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              name: fd.get("name"),
              email: fd.get("email"),
              phone: fd.get("phone"),
              company: fd.get("company"),
              message: fd.get("message"),
            },
          }),
        }
      );
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-700">{dict.formSuccessTitle}</p>
        <p className="mt-2 text-sm text-green-600">{dict.formSuccessText}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-primary hover:underline"
        >
          {dict.formSendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="qf-name" className="mb-1 block text-sm font-medium text-ink">
            {dict.formName} <span className="text-red-500">*</span>
          </label>
          <input id="qf-name" name="name" required className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="qf-email" className="mb-1 block text-sm font-medium text-ink">
            {dict.formEmail} <span className="text-red-500">*</span>
          </label>
          <input id="qf-email" name="email" type="email" required className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="qf-phone" className="mb-1 block text-sm font-medium text-ink">{dict.formPhone}</label>
          <input id="qf-phone" name="phone" className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="qf-company" className="mb-1 block text-sm font-medium text-ink">{dict.formCompany}</label>
          <input id="qf-company" name="company" className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary" />
        </div>
      </div>
      <div>
        <label htmlFor="qf-message" className="mb-1 block text-sm font-medium text-ink">
          {dict.formMessage} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="qf-message"
          name="message"
          required
          rows={5}
          placeholder={dict.formMessagePlaceholder}
          className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">{dict.formError}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded bg-primary py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "sending" ? dict.formSending : dict.formSubmit}
      </button>
    </form>
  );
}
