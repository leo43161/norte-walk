/* =====================================================================
 * NorteWalk — contenido de la página "Sobre nosotros" (About Us) por idioma.
 *
 * Copy de marca (no legal). Lo consume app/[locale]/nosotros/page.tsx.
 * ===================================================================== */

import type { Locale } from "@/lib/i18n";

export interface AboutPillar {
  /** Emoji decorativo. */
  icon: string;
  title: string;
  body: string;
}

export interface AboutSection {
  title: string;
  body: string[];
}

export interface AboutContent {
  metaTitle: string;
  metaDescription: string;
  /** Etiqueta corta arriba del titular del hero. */
  kicker: string;
  /** Titular grande del hero. */
  headline: string;
  sections: AboutSection[];
  pillarsTitle: string;
  pillars: AboutPillar[];
  /** CTA de cierre hacia el catálogo. */
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
}

const ABOUT: Record<Locale, AboutContent> = {
  es: {
    metaTitle: "Sobre NorteWalk",
    metaDescription:
      "Somos un equipo joven de tucumanos que crea tecnología para conectarte con guías locales habilitados. Conocé nuestra misión: turismo divertido, seguro y de calidad.",
    kicker: "Creamos tecnología para conectar historias",
    headline: "Redescubrí el Norte con ojos locales",
    sections: [
      {
        title: "El origen y el equipo",
        body: [
          "Somos un equipo joven de tucumanos apasionados por la tecnología, el turismo y nuestra cultura. Nos dimos cuenta de que la forma de recorrer y descubrir nuestras raíces necesitaba una evolución digital: un puente ágil que una a quienes quieren explorar Tucumán con quienes mejor la conocen. Así nació NorteWalk.",
        ],
      },
      {
        title: "Nuestra misión: divertido, seguro y de calidad",
        body: [
          "Nuestra misión es simple: transformar un simple paseo en una experiencia memorable, auténtica y, sobre todo, divertida. Queremos que camines las calles de Tucumán, te adentres en las yungas o pruebes nuestra gastronomía en los valles sintiéndote un tucumano más, de la mano de relatos que atrapan.",
          "Pero el entretenimiento no compite con la responsabilidad. En NorteWalk la seguridad y la calidad son nuestra prioridad absoluta. Por eso no somos un directorio abierto donde cualquiera publica: somos una plataforma que filtra y verifica que cada guía esté debidamente registrado y habilitado en la provincia. Cuando reservás con nosotros, sabés exactamente con quién vas a caminar.",
        ],
      },
    ],
    pillarsTitle: "Tres pilares que nos definen",
    pillars: [
      {
        icon: "🌱",
        title: "Frescura local",
        body: "Somos nativos digitales. Diseñamos una experiencia ágil, sin fricciones ni tarjetas de crédito previas, pensada para el viajero de hoy.",
      },
      {
        icon: "🛡️",
        title: "Turismo seguro",
        body: "Respetamos la normativa local y ponemos en valor el trabajo de los profesionales idóneos de la región.",
      },
      {
        icon: "🤝",
        title: "Impacto sostenible",
        body: "Creemos en el comercio justo. Impulsamos la economía local conectándote directo con el guía, fomentando el desarrollo de nuestra comunidad.",
      },
    ],
    ctaTitle: "¿Listo para conocer el norte?",
    ctaBody: "Elegí tu caminata, reservá tu cupo y viví Tucumán como un local. Empezar es gratis.",
    ctaButton: "Ver caminatas en Tucumán",
  },
  en: {
    metaTitle: "About NorteWalk",
    metaDescription:
      "We're a young team from Tucumán building technology to connect you with licensed local guides. Discover our mission: fun, safe and high-quality tourism.",
    kicker: "We build technology to connect stories",
    headline: "Rediscover the North through local eyes",
    sections: [
      {
        title: "Our origin and team",
        body: [
          "We are a young team of Tucumán locals passionate about technology, tourism and our culture. We realized that the way to explore and discover our roots needed a digital evolution: a nimble bridge connecting those who want to explore Tucumán with those who know it best. That's how NorteWalk was born.",
        ],
      },
      {
        title: "Our mission: fun, safe and high-quality",
        body: [
          "Our mission is simple: to turn an ordinary walk into a memorable, authentic and, above all, fun experience. We want you to walk the streets of Tucumán, venture into the yungas or taste our cuisine in the valleys feeling like one more local, guided by stories that grab you.",
          "But entertainment does not compete with responsibility. At NorteWalk, safety and quality are our absolute priority. That's why we are not an open directory where anyone can publish: we are a platform that filters and verifies that every guide is duly registered and licensed in the province. When you book with us, you know exactly who you'll be walking with.",
        ],
      },
    ],
    pillarsTitle: "Three pillars that define us",
    pillars: [
      {
        icon: "🌱",
        title: "Local freshness",
        body: "We are digital natives. We designed a nimble, friction-free experience with no upfront credit cards, made for today's traveler.",
      },
      {
        icon: "🛡️",
        title: "Safe tourism",
        body: "We respect local regulations and value the work of the region's qualified professionals.",
      },
      {
        icon: "🤝",
        title: "Sustainable impact",
        body: "We believe in fair trade. We boost the local economy by connecting you directly with the guide, fostering the development of our community.",
      },
    ],
    ctaTitle: "Ready to discover the North?",
    ctaBody: "Pick your walk, book your spot and live Tucumán like a local. Getting started is free.",
    ctaButton: "See walking tours in Tucumán",
  },
  pt: {
    metaTitle: "Sobre a NorteWalk",
    metaDescription:
      "Somos uma equipe jovem de Tucumán que cria tecnologia para conectar você com guias locais credenciados. Conheça nossa missão: turismo divertido, seguro e de qualidade.",
    kicker: "Criamos tecnologia para conectar histórias",
    headline: "Redescubra o Norte com olhos locais",
    sections: [
      {
        title: "Nossa origem e equipe",
        body: [
          "Somos uma equipe jovem de tucumanos apaixonados por tecnologia, turismo e nossa cultura. Percebemos que a forma de percorrer e descobrir nossas raízes precisava de uma evolução digital: uma ponte ágil que una quem quer explorar Tucumán com quem melhor a conhece. Foi assim que nasceu a NorteWalk.",
        ],
      },
      {
        title: "Nossa missão: divertido, seguro e de qualidade",
        body: [
          "Nossa missão é simples: transformar um simples passeio em uma experiência memorável, autêntica e, acima de tudo, divertida. Queremos que você caminhe pelas ruas de Tucumán, entre nas yungas ou prove nossa gastronomia nos vales sentindo-se mais um tucumano, conduzido por relatos que cativam.",
          "Mas o entretenimento não compete com a responsabilidade. Na NorteWalk, a segurança e a qualidade são nossa prioridade absoluta. Por isso não somos um diretório aberto onde qualquer um publica: somos uma plataforma que filtra e verifica que cada guia esteja devidamente registrado e habilitado na província. Quando você reserva conosco, sabe exatamente com quem vai caminhar.",
        ],
      },
    ],
    pillarsTitle: "Três pilares que nos definem",
    pillars: [
      {
        icon: "🌱",
        title: "Frescor local",
        body: "Somos nativos digitais. Desenhamos uma experiência ágil, sem fricções nem cartões de crédito prévios, pensada para o viajante de hoje.",
      },
      {
        icon: "🛡️",
        title: "Turismo seguro",
        body: "Respeitamos a normativa local e valorizamos o trabalho dos profissionais qualificados da região.",
      },
      {
        icon: "🤝",
        title: "Impacto sustentável",
        body: "Acreditamos no comércio justo. Impulsionamos a economia local conectando você diretamente com o guia, fomentando o desenvolvimento da nossa comunidade.",
      },
    ],
    ctaTitle: "Pronto para conhecer o norte?",
    ctaBody: "Escolha sua caminhada, reserve seu lugar e viva Tucumán como um local. Começar é grátis.",
    ctaButton: "Ver caminhadas em Tucumán",
  },
};

export function getAbout(locale: Locale): AboutContent {
  return ABOUT[locale] ?? ABOUT.es;
}
