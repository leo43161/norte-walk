/**
 * NorteWalk — generador de assets de marca para SEO/PWA.
 *
 * Rasteriza el símbolo del logo (3 picos crema + sol naranja sobre verde de
 * marca) a todos los formatos que necesita la indexación y la instalación PWA:
 *
 *   app/apple-icon.png                 180×180  (apple-touch, fondo opaco)
 *   app/favicon.ico                    48×48    (legacy, PNG embebido en ICO)
 *   public/web-app-manifest-192x192.png  192×192  (any + maskable)
 *   public/web-app-manifest-512x512.png  512×512  (any + maskable)
 *   public/og-image.png                1200×630 (social card por defecto)
 *
 * Es idempotente: corré `node scripts/generate-icons.mjs` cuando cambie la marca.
 *
 * Las SVG fuente son sólo formas (rect/circle/path) para los iconos, así sharp
 * (librsvg) las rasteriza sin depender de fuentes del sistema. La OG sí lleva
 * texto: usa familias web-safe (Georgia/sans) con fallback visual seguro.
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APP = join(ROOT, "app");
const PUBLIC = join(ROOT, "public");
mkdirSync(PUBLIC, { recursive: true });

// === Paleta de marca ===
const BRAND = {
  green: "#40513b",      // verde de marca (fondo de icono)
  greenDeep: "#28331f",  // verde profundo (gradiente OG)
  sun: "#e67e22",        // naranja de marca (sol)
  cream: "#e5d9b6",      // crema de marca (montañas)
  creamSoft: "#faf6ec",  // crema aireado (texto OG)
};

/** Símbolo del logo en coordenadas 0..500. `bold` engrosa para tamaños chicos. */
function markArt({ bold = true } = {}) {
  const stroke = bold ? 34 : 28;
  const sunR = bold ? 46 : 40.211;
  return `
    <circle cx="349.678" cy="140.613" r="${sunR}" fill="${BRAND.sun}"/>
    <path d="M 24.889 403.536 L 148.617 217.945 L 241.414 295.274 L 318.745 202.477 L 457.94 403.536"
          stroke="${BRAND.cream}" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="${stroke}"/>`;
}

/**
 * SVG de un icono cuadrado.
 *  - scale: fracción del lienzo que ocupa el arte 500×500 (margen = safe zone).
 *  - radius: radio de esquina (0 = full-bleed, para maskable).
 */
function iconSvg({ size = 512, scale = 0.84, radius = 0.22 } = {}) {
  const artPx = size * scale;
  const offset = (size - artPx) / 2;
  const k = artPx / 500;
  const rx = size * radius;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${rx}" fill="${BRAND.green}"/>
    <g transform="translate(${offset},${offset}) scale(${k})">${markArt()}</g>
  </svg>`);
}

/** Card social 1200×630 con marca, wordmark y claim orientado a búsquedas. */
function ogSvg() {
  const W = 1200;
  const H = 630;
  // Mark a la izquierda, dentro de un chip redondeado crema translúcido.
  const markSize = 260;
  const markX = 110;
  const markY = (H - markSize) / 2 - 40;
  const k = (markSize * 0.84) / 500;
  const off = markSize * 0.08;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${BRAND.green}"/>
        <stop offset="1" stop-color="${BRAND.greenDeep}"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <!-- sol decorativo grande, sutil -->
    <circle cx="1080" cy="120" r="240" fill="${BRAND.sun}" opacity="0.12"/>
    <!-- símbolo -->
    <g transform="translate(${markX},${markY})">
      <rect width="${markSize}" height="${markSize}" rx="${markSize * 0.22}" fill="${BRAND.cream}" opacity="0.10"/>
      <g transform="translate(${off},${off}) scale(${k})">${markArt()}</g>
    </g>
    <!-- texto -->
    <text x="${markX + markSize + 60}" y="248" font-family="Georgia, 'Times New Roman', serif" font-size="78" font-weight="600" fill="${BRAND.creamSoft}">NorteWalk</text>
    <text x="${markX + markSize + 62}" y="318" font-family="'Segoe UI', Arial, sans-serif" font-size="36" font-weight="600" fill="${BRAND.sun}">Free walking tours &amp; experiencias en Tucumán</text>
    <text x="${markX + markSize + 62}" y="372" font-family="'Segoe UI', Arial, sans-serif" font-size="29" fill="${BRAND.creamSoft}" opacity="0.85">Guías locales · Reservá online · Sin tarjetas</text>
  </svg>`);
}

/** Empaqueta un PNG dentro de un contenedor .ico de una sola imagen. */
function pngToIco(pngBuffer, side) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(side >= 256 ? 0 : side, 0); // width
  entry.writeUInt8(side >= 256 ? 0 : side, 1); // height
  entry.writeUInt8(0, 2);  // palette
  entry.writeUInt8(0, 3);  // reserved
  entry.writeUInt16LE(1, 4);  // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(pngBuffer.length, 8); // size
  entry.writeUInt32LE(22, 12); // offset (6 + 16)
  return Buffer.concat([header, entry, pngBuffer]);
}

async function render(svg, size) {
  return sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
}

async function main() {
  // --- Iconos PWA "any" (esquinas redondeadas) ---
  for (const size of [192, 512]) {
    const buf = await render(iconSvg({ size, scale: 0.82, radius: 0.22 }), size);
    writeFileSync(join(PUBLIC, `web-app-manifest-${size}x${size}.png`), buf);
    console.log(`✓ public/web-app-manifest-${size}x${size}.png`);
  }

  // --- Icono maskable 512 (full-bleed, arte dentro de safe zone) ---
  {
    const buf = await render(iconSvg({ size: 512, scale: 0.62, radius: 0 }), 512);
    writeFileSync(join(PUBLIC, "web-app-manifest-maskable-512x512.png"), buf);
    console.log("✓ public/web-app-manifest-maskable-512x512.png");
  }

  // --- Apple touch icon 180 (fondo opaco, iOS redondea) ---
  {
    const buf = await render(iconSvg({ size: 180, scale: 0.74, radius: 0 }), 180);
    writeFileSync(join(APP, "apple-icon.png"), buf);
    console.log("✓ app/apple-icon.png");
  }

  // --- favicon.ico de marca (48px PNG embebido) ---
  {
    const png = await render(iconSvg({ size: 48, scale: 0.86, radius: 0.18 }), 48);
    writeFileSync(join(APP, "favicon.ico"), pngToIco(png, 48));
    console.log("✓ app/favicon.ico");
  }

  // --- Social card 1200×630 ---
  {
    const buf = await sharp(ogSvg(), { density: 144 }).resize(1200, 630).png().toBuffer();
    writeFileSync(join(PUBLIC, "og-image.png"), buf);
    console.log("✓ public/og-image.png");
  }

  console.log("\nListo. Assets de marca regenerados.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
