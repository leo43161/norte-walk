"use client";

import { useState } from "react";

import { submitJoin, type JoinBody } from "@/lib/api";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  Field,
  FormDone,
  FormError,
  Honeypot,
  SubmitButton,
  inputClass,
  readTracking,
  textareaClass,
} from "@/components/forms/ui";

type ApplicantType = NonNullable<JoinBody["applicant_type"]>;

/** Formulario de la página "Sumate": guías / prestadores / empresas. */
export default function JoinForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.join;
  const f = dict.forms;

  const [type, setType] = useState<ApplicantType>("guide");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [offering, setOffering] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const types: { value: ApplicantType; label: string }[] = [
    { value: "guide", label: t.typeGuide },
    { value: "provider", label: t.typeProvider },
    { value: "company", label: t.typeCompany },
  ];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    if (!contactName.trim() || !email.trim()) {
      setError(f.errorGeneric);
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      await submitJoin({
        applicant_type: type,
        contact_name: contactName.trim(),
        email: email.trim(),
        business_name: businessName.trim() || undefined,
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        website: website.trim() || undefined,
        offering: offering.trim() || undefined,
        message: message.trim() || undefined,
        locale,
        hp,
        ...readTracking(),
      });
      setStatus("done");
    } catch {
      setStatus("idle");
      setError(f.errorGeneric);
    }
  }

  if (status === "done") {
    return <FormDone title={t.doneTitle} body={t.doneBody} />;
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-4" noValidate>
      <Honeypot value={hp} onChange={setHp} />

      {/* Tipo de quien se suma */}
      <fieldset>
        <legend className="mb-1.5 text-xs font-medium text-(--color-ink-700)">{t.typeLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {types.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              aria-pressed={type === opt.value}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                type === opt.value
                  ? "border-(--color-stone-700) bg-(--color-stone-700) text-white"
                  : "border-(--color-border) bg-white text-(--color-ink-700) hover:border-(--color-stone-600)"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.businessLabel} htmlFor="jn-business">
          <input
            id="jn-business"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder={t.businessPlaceholder}
            className={inputClass}
          />
        </Field>
        <Field label={f.name} htmlFor="jn-name" required>
          <input
            id="jn-name"
            type="text"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder={f.namePlaceholder}
            autoComplete="name"
            className={inputClass}
          />
        </Field>
        <Field label={f.email} htmlFor="jn-email" required>
          <input
            id="jn-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={f.emailPlaceholder}
            autoComplete="email"
            className={inputClass}
          />
        </Field>
        <Field label={f.phone} htmlFor="jn-phone" hint={f.optional}>
          <input
            id="jn-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={f.phonePlaceholder}
            autoComplete="tel"
            className={inputClass}
          />
        </Field>
        <Field label={f.city} htmlFor="jn-city" hint={f.optional}>
          <input
            id="jn-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={f.cityPlaceholder}
            className={inputClass}
          />
        </Field>
        <Field label={t.websiteLabel} htmlFor="jn-website" hint={f.optional}>
          <input
            id="jn-website"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder={t.websitePlaceholder}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label={t.offeringLabel} htmlFor="jn-offering">
        <input
          id="jn-offering"
          type="text"
          value={offering}
          onChange={(e) => setOffering(e.target.value)}
          placeholder={t.offeringPlaceholder}
          className={inputClass}
        />
      </Field>

      <Field label={t.messageLabel} htmlFor="jn-message" hint={f.optional}>
        <textarea
          id="jn-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.messagePlaceholder}
          className={textareaClass}
          maxLength={2000}
        />
      </Field>

      {error && <FormError message={error} />}
      <SubmitButton submitting={status === "sending"} idleLabel={t.cta} busyLabel={f.sending} />
    </form>
  );
}
