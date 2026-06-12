/**
 * Renderiza uno o varios bloques de Schema.org como JSON-LD.
 *
 * Server component: el `<script type="application/ld+json">` queda en el HTML
 * estático que ven los crawlers, sin costo de JS en cliente.
 *
 * Acepta un objeto o un array de objetos (cada uno = un grafo independiente).
 * Limpia recursivamente `undefined`/`null` para no emitir campos vacíos que
 * ensucian el validador de Google.
 */
function prune<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((v) => prune(v))
      .filter((v) => v !== undefined && v !== null) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined || v === null) continue;
      const cleaned = prune(v);
      if (
        cleaned === undefined ||
        cleaned === null ||
        (Array.isArray(cleaned) && cleaned.length === 0)
      ) {
        continue;
      }
      out[k] = cleaned;
    }
    return out as T;
  }
  return value;
}

export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify ya escapa comillas; reemplazamos `<` para evitar
          // que `</script>` dentro de un string rompa el documento.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(prune(item)).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
