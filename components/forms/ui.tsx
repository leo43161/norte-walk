"use client";

/* =====================================================================
 * Primitivas compartidas de formularios (sugerencias, waitlist, ayuda,
 * sumate). Mantienen el look de los inputs del BookingWidget y centralizan
 * honeypot, tracking y estados de envío.
 * ===================================================================== */

export const inputClass =
  "block w-full rounded-lg border border-(--color-border) bg-white px-3 py-2.5 text-sm text-(--color-foreground) shadow-xs outline-none transition-colors focus:border-(--color-stone-600) focus:ring-2 focus:ring-(--color-stone-300)";

export const textareaClass = `${inputClass} min-h-[112px] resize-y`;

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 flex items-baseline justify-between gap-2 text-xs font-medium text-(--color-ink-700)"
      >
        <span>
          {label}
          {required && <span className="ml-0.5 text-(--color-accent-600)">*</span>}
        </span>
        {hint && <span className="font-normal text-(--color-muted)">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

/**
 * Campo trampa para bots. Invisible y fuera del tab-order; un humano no lo
 * completa. Si llega con valor, el backend descarta el envío.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
      <label>
        Dejar en blanco
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

export function SubmitButton({
  submitting,
  idleLabel,
  busyLabel,
}: {
  submitting: boolean;
  idleLabel: string;
  busyLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-(--color-accent-500) px-5 py-3 text-[15px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(211,84,0,0.65)] transition-colors hover:bg-(--color-accent-600) disabled:cursor-not-allowed disabled:opacity-60"
    >
      {submitting ? busyLabel : idleLabel}
    </button>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-xl border border-(--color-accent-500)/30 bg-(--color-accent-500)/5 px-3 py-2.5 text-sm font-medium text-(--color-accent-700)"
    >
      {message}
    </p>
  );
}

/** Panel de éxito reutilizable tras enviar un formulario. */
export function FormDone({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-(--color-stone-300)/70 bg-(--color-stone-100)/60 p-6 text-center">
      <div
        aria-hidden
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--color-stone-600)/15 text-2xl"
      >
        ✓
      </div>
      <h3 className="font-display mt-3 text-xl text-(--color-stone-800)">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-(--color-stone-500)">{body}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/**
 * Lee, en cliente, el path actual y los UTM de la URL para adjuntarlos a los
 * envíos de formularios (atribución). Se llama dentro del submit handler —
 * que sólo corre en el browser — así que no toca el render ni la hidratación.
 */
export interface Tracking {
  source_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export function readTracking(): Tracking {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    source_url: window.location.pathname.slice(0, 255),
    utm_source: p.get("utm_source") || undefined,
    utm_medium: p.get("utm_medium") || undefined,
    utm_campaign: p.get("utm_campaign") || undefined,
  };
}
