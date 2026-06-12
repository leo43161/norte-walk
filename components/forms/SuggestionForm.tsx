"use client";

import { useState } from "react";

import { submitSuggestion } from "@/lib/api";
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

/**
 * Formulario de sugerencias del home: "¿Qué te gustaría conocer del Norte?".
 * Mensaje obligatorio + email opcional para sumar a la lista de aviso.
 */
export default function SuggestionForm({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const t = dict.suggest;
  const f = dict.forms;

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    if (!message.trim()) return;
    setStatus("sending");
    setError(null);
    try {
      await submitSuggestion({
        message: message.trim(),
        email: email.trim() || undefined,
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
    <form onSubmit={onSubmit} className="relative space-y-3" noValidate>
      <Honeypot value={hp} onChange={setHp} />
      <Field label={t.title} htmlFor="sg-message" required>
        <textarea
          id="sg-message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.placeholder}
          className={textareaClass}
          maxLength={2000}
        />
      </Field>
      <Field label={t.emailLabel} htmlFor="sg-email" hint={f.optional}>
        <input
          id="sg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={f.emailPlaceholder}
          autoComplete="email"
          className={inputClass}
        />
      </Field>
      {error && <FormError message={error} />}
      <SubmitButton submitting={status === "sending"} idleLabel={t.cta} busyLabel={f.sending} />
    </form>
  );
}
