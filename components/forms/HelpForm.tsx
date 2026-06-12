"use client";

import { useState } from "react";

import { submitHelp } from "@/lib/api";
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

/** Formulario de la página de Ayuda: consulta/contacto vía email o WhatsApp. */
export default function HelpForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.help;
  const f = dict.forms;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    if (!message.trim() || (!email.trim() && !phone.trim())) {
      setError(f.errorGeneric);
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      await submitHelp({
        message: message.trim(),
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        subject: subject.trim() || undefined,
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={f.name} htmlFor="hp-name" hint={f.optional}>
          <input
            id="hp-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={f.namePlaceholder}
            autoComplete="name"
            className={inputClass}
          />
        </Field>
        <Field label={t.subjectLabel} htmlFor="hp-subject" hint={f.optional}>
          <input
            id="hp-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t.subjectPlaceholder}
            className={inputClass}
          />
        </Field>
        <Field label={f.email} htmlFor="hp-email">
          <input
            id="hp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={f.emailPlaceholder}
            autoComplete="email"
            className={inputClass}
          />
        </Field>
        <Field label={f.phone} htmlFor="hp-phone">
          <input
            id="hp-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={f.phonePlaceholder}
            autoComplete="tel"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label={t.messageLabel} htmlFor="hp-message" required>
        <textarea
          id="hp-message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.messagePlaceholder}
          className={textareaClass}
          maxLength={3000}
        />
      </Field>

      <p className="text-xs text-(--color-muted)">{t.contactHint}</p>
      {error && <FormError message={error} />}
      <SubmitButton submitting={status === "sending"} idleLabel={t.cta} busyLabel={f.sending} />
    </form>
  );
}
