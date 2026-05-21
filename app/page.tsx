import Link from "next/link";
import { DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Página raíz `/` para el static export.
 * No hay servidor que redirija → emitimos un index.html con meta-refresh
 * al locale por defecto y un link manual de fallback (a11y / sin JS).
 */
export default function RootRedirect() {
  const target = `/${DEFAULT_LOCALE}/`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <link rel="canonical" href={target} />
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-(--color-muted) text-sm">
          Redirigiendo a{" "}
          <Link href={target} className="underline text-(--color-foreground)">
            NorteWalk
          </Link>
          …
        </p>
      </main>
    </>
  );
}
