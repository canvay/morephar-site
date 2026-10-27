"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");

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
        <p className="text-lg font-semibold text-green-700">Thank you for your request!</p>
        <p className="mt-2 text-sm text-green-600">
          Our team will get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-primary hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="qf-name" className="mb-1 block text-sm font-medium text-ink">
            Name <span className="text-red-500">*</span>
          </label>
          <input id="qf-name" name="name" required className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="qf-email" className="mb-1 block text-sm font-medium text-ink">
            Email <span className="text-red-500">*</span>
          </label>
          <input id="qf-email" name="email" type="email" required className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="qf-phone" className="mb-1 block text-sm font-medium text-ink">Phone</label>
          <input id="qf-phone" name="phone" className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="qf-company" className="mb-1 block text-sm font-medium text-ink">Company</label>
          <input id="qf-company" name="company" className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary" />
        </div>
      </div>
      <div>
        <label htmlFor="qf-message" className="mb-1 block text-sm font-medium text-ink">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="qf-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your product, format and target output..."
          className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong — please try again or email us directly.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded bg-primary py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "sending" ? "Sending..." : "Request A Quote"}
      </button>
    </form>
  );
}
