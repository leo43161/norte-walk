/* =====================================================================
 * NorteWalk — contenido legal (Términos y Privacidad) por idioma.
 *
 * Versión PRELIMINAR para tener páginas reales en el deploy. Julito la
 * revisa/mejora después. El texto refleja el modelo real: NorteWalk es una
 * plataforma que conecta viajeros con guías locales; NO procesa pagos y NO
 * presta el servicio turístico (lo presta el guía/prestador).
 *
 * Estructura: documento con `intro` + secciones {id, heading, body[]}.
 * El `id` se usa como ancla y para la tabla de contenidos.
 * ===================================================================== */

import type { Locale } from "@/lib/i18n";

export interface LegalSection {
  id: string;
  heading: string;
  /** Párrafos. */
  body: string[];
}

export interface LegalDoc {
  /** Fecha legible de última actualización. */
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const UPDATED = "12/06/2026";

// ---------------------------------------------------------------------
// Términos y Condiciones
// ---------------------------------------------------------------------

const TERMS: Record<Locale, LegalDoc> = {
  es: {
    updated: UPDATED,
    intro:
      "Estos Términos y Condiciones regulan el uso de NorteWalk (el “Sitio”). Al navegar el Sitio, usar sus formularios o reservar una experiencia, aceptás estos términos. NorteWalk es una plataforma que conecta viajeros con guías y prestadores turísticos locales del norte argentino.",
    sections: [
      {
        id: "que-es",
        heading: "1. Qué es NorteWalk",
        body: [
          "NorteWalk es un directorio y plataforma de intermediación que muestra free walking tours, excursiones y experiencias ofrecidas por guías y prestadores independientes habilitados.",
          "NorteWalk no es una agencia de viajes ni presta directamente los servicios turísticos: facilita el contacto y la reserva entre el viajero y el guía o prestador, que es el responsable de la experiencia.",
        ],
      },
      {
        id: "reservas",
        heading: "2. Reservas",
        body: [
          "Al reservar, tu solicitud se envía al guía o prestador correspondiente, que confirma la salida y coordina los detalles con vos, habitualmente por WhatsApp.",
          "Los cupos, horarios y condiciones de cada experiencia los define el guía o prestador. Una reserva queda sujeta a su confirmación.",
        ],
      },
      {
        id: "pagos",
        heading: "3. Pagos",
        body: [
          "NorteWalk no procesa pagos online ni cobra al viajero por las experiencias. Cualquier pago se realiza directamente entre el viajero y el guía o prestador, según lo que acuerden.",
          "Las experiencias “a la gorra” (free walking tours) no tienen precio fijo: el viajero aporta al final lo que considere de acuerdo a su experiencia.",
        ],
      },
      {
        id: "responsabilidad",
        heading: "4. Responsabilidad",
        body: [
          "La prestación, calidad y seguridad de cada experiencia son responsabilidad exclusiva del guía o prestador que la ofrece.",
          "NorteWalk procura que la información publicada sea correcta, pero no garantiza la disponibilidad, exactitud ni los resultados de las experiencias, y no será responsable por daños derivados de la relación entre el viajero y el prestador.",
        ],
      },
      {
        id: "conducta",
        heading: "5. Uso del Sitio",
        body: [
          "Te comprometés a usar el Sitio de buena fe, a brindar datos veraces en los formularios y a no utilizarlo con fines ilícitos o que afecten a terceros.",
        ],
      },
      {
        id: "propiedad",
        heading: "6. Propiedad intelectual",
        body: [
          "La marca NorteWalk, su logo y los contenidos propios del Sitio pertenecen a NorteWalk. Las imágenes y descripciones de cada experiencia pueden pertenecer a sus respectivos guías o prestadores.",
        ],
      },
      {
        id: "cambios",
        heading: "7. Cambios y contacto",
        body: [
          "Podemos actualizar estos términos en cualquier momento; la versión vigente es la publicada en esta página. Ante cualquier consulta, escribinos desde la sección de Ayuda.",
        ],
      },
    ],
  },
  en: {
    updated: UPDATED,
    intro:
      "These Terms and Conditions govern the use of NorteWalk (the “Site”). By browsing the Site, using its forms or booking an experience, you accept these terms. NorteWalk is a platform that connects travelers with local guides and tourism providers in northern Argentina.",
    sections: [
      {
        id: "que-es",
        heading: "1. What NorteWalk is",
        body: [
          "NorteWalk is a directory and intermediation platform that lists free walking tours, excursions and experiences offered by independent, licensed guides and providers.",
          "NorteWalk is not a travel agency and does not directly provide the tourism services: it facilitates contact and booking between the traveler and the guide or provider, who is responsible for the experience.",
        ],
      },
      {
        id: "reservas",
        heading: "2. Bookings",
        body: [
          "When you book, your request is sent to the relevant guide or provider, who confirms the departure and coordinates details with you, usually via WhatsApp.",
          "Spots, times and conditions for each experience are set by the guide or provider. A booking is subject to their confirmation.",
        ],
      },
      {
        id: "pagos",
        heading: "3. Payments",
        body: [
          "NorteWalk does not process online payments nor charge travelers for experiences. Any payment is made directly between the traveler and the guide or provider, as agreed between them.",
          "Tip-based experiences (free walking tours) have no fixed price: the traveler contributes at the end what they consider fair.",
        ],
      },
      {
        id: "responsabilidad",
        heading: "4. Liability",
        body: [
          "The delivery, quality and safety of each experience are the sole responsibility of the guide or provider offering it.",
          "NorteWalk strives to keep published information accurate, but does not guarantee availability, accuracy or results, and is not liable for damages arising from the relationship between traveler and provider.",
        ],
      },
      {
        id: "conducta",
        heading: "5. Use of the Site",
        body: [
          "You agree to use the Site in good faith, to provide truthful information in the forms, and not to use it for unlawful purposes or in ways that harm third parties.",
        ],
      },
      {
        id: "propiedad",
        heading: "6. Intellectual property",
        body: [
          "The NorteWalk brand, its logo and the Site's own content belong to NorteWalk. Images and descriptions of each experience may belong to their respective guides or providers.",
        ],
      },
      {
        id: "cambios",
        heading: "7. Changes and contact",
        body: [
          "We may update these terms at any time; the current version is the one published on this page. For any questions, reach out from the Help section.",
        ],
      },
    ],
  },
  pt: {
    updated: UPDATED,
    intro:
      "Estes Termos e Condições regulam o uso da NorteWalk (o “Site”). Ao navegar no Site, usar seus formulários ou reservar uma experiência, você aceita estes termos. A NorteWalk é uma plataforma que conecta viajantes a guias e prestadores turísticos locais do norte argentino.",
    sections: [
      {
        id: "que-es",
        heading: "1. O que é a NorteWalk",
        body: [
          "A NorteWalk é um diretório e plataforma de intermediação que exibe free walking tours, excursões e experiências oferecidas por guias e prestadores independentes credenciados.",
          "A NorteWalk não é uma agência de viagens e não presta diretamente os serviços turísticos: facilita o contato e a reserva entre o viajante e o guia ou prestador, que é o responsável pela experiência.",
        ],
      },
      {
        id: "reservas",
        heading: "2. Reservas",
        body: [
          "Ao reservar, seu pedido é enviado ao guia ou prestador correspondente, que confirma a saída e combina os detalhes com você, normalmente por WhatsApp.",
          "As vagas, horários e condições de cada experiência são definidos pelo guia ou prestador. Uma reserva fica sujeita à confirmação dele.",
        ],
      },
      {
        id: "pagos",
        heading: "3. Pagamentos",
        body: [
          "A NorteWalk não processa pagamentos online nem cobra do viajante pelas experiências. Qualquer pagamento é feito diretamente entre o viajante e o guia ou prestador, conforme combinado entre eles.",
          "As experiências a gorjeta (free walking tours) não têm preço fixo: o viajante contribui no final o que considerar justo.",
        ],
      },
      {
        id: "responsabilidad",
        heading: "4. Responsabilidade",
        body: [
          "A prestação, qualidade e segurança de cada experiência são responsabilidade exclusiva do guia ou prestador que a oferece.",
          "A NorteWalk procura manter a informação publicada correta, mas não garante disponibilidade, exatidão ou resultados, e não se responsabiliza por danos decorrentes da relação entre viajante e prestador.",
        ],
      },
      {
        id: "conducta",
        heading: "5. Uso do Site",
        body: [
          "Você se compromete a usar o Site de boa-fé, a fornecer dados verdadeiros nos formulários e a não utilizá-lo para fins ilícitos ou que prejudiquem terceiros.",
        ],
      },
      {
        id: "propiedad",
        heading: "6. Propriedade intelectual",
        body: [
          "A marca NorteWalk, seu logo e os conteúdos próprios do Site pertencem à NorteWalk. As imagens e descrições de cada experiência podem pertencer aos respectivos guias ou prestadores.",
        ],
      },
      {
        id: "cambios",
        heading: "7. Alterações e contato",
        body: [
          "Podemos atualizar estes termos a qualquer momento; a versão vigente é a publicada nesta página. Em caso de dúvidas, escreva pela seção de Ajuda.",
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------
// Política de Privacidad
// ---------------------------------------------------------------------

const PRIVACY: Record<Locale, LegalDoc> = {
  es: {
    updated: UPDATED,
    intro:
      "En NorteWalk cuidamos tus datos. Esta política explica qué información recopilamos cuando usás el Sitio y sus formularios, para qué la usamos y con quién la compartimos.",
    sections: [
      {
        id: "datos",
        heading: "1. Qué datos recopilamos",
        body: [
          "Datos que nos das voluntariamente en los formularios: nombre, email, teléfono/WhatsApp, mensajes y, en una reserva, la experiencia, fecha e idioma elegidos.",
          "Datos técnicos básicos para seguridad y estadística: dirección IP, navegador y página de origen, además de parámetros de campaña (UTM) si llegaste desde un anuncio o enlace.",
        ],
      },
      {
        id: "uso",
        heading: "2. Para qué los usamos",
        body: [
          "Para gestionar tu reserva o consulta y ponerte en contacto con el guía o prestador correspondiente.",
          "Para avisarte sobre el lanzamiento si te anotaste en la lista de espera, y para mejorar las experiencias que ofrecemos en base a tus sugerencias.",
        ],
      },
      {
        id: "comparten",
        heading: "3. Con quién los compartimos",
        body: [
          "Compartimos los datos necesarios con el guía o prestador de la experiencia que reservás, para que pueda coordinar la salida con vos.",
          "No vendemos tus datos. Podemos usar servicios de terceros (por ejemplo, analítica web) que procesan datos en nuestro nombre.",
        ],
      },
      {
        id: "analitica",
        heading: "4. Cookies y analítica",
        body: [
          "Usamos herramientas de analítica (como Google Analytics) para entender cómo se usa el Sitio de forma agregada. Podés bloquear las cookies desde tu navegador.",
        ],
      },
      {
        id: "derechos",
        heading: "5. Tus derechos",
        body: [
          "Podés pedirnos acceder, corregir o eliminar tus datos en cualquier momento escribiéndonos desde la sección de Ayuda.",
        ],
      },
      {
        id: "contacto",
        heading: "6. Contacto",
        body: [
          "Ante cualquier consulta sobre tus datos, escribinos desde la sección de Ayuda del Sitio.",
        ],
      },
    ],
  },
  en: {
    updated: UPDATED,
    intro:
      "At NorteWalk we take care of your data. This policy explains what information we collect when you use the Site and its forms, what we use it for, and who we share it with.",
    sections: [
      {
        id: "datos",
        heading: "1. What data we collect",
        body: [
          "Data you give us voluntarily in the forms: name, email, phone/WhatsApp, messages and, in a booking, the experience, date and language chosen.",
          "Basic technical data for security and statistics: IP address, browser and referring page, plus campaign parameters (UTM) if you arrived from an ad or link.",
        ],
      },
      {
        id: "uso",
        heading: "2. What we use it for",
        body: [
          "To handle your booking or inquiry and put you in touch with the relevant guide or provider.",
          "To notify you about the launch if you joined the waitlist, and to improve the experiences we offer based on your suggestions.",
        ],
      },
      {
        id: "comparten",
        heading: "3. Who we share it with",
        body: [
          "We share the necessary data with the guide or provider of the experience you book, so they can coordinate the outing with you.",
          "We do not sell your data. We may use third-party services (for example, web analytics) that process data on our behalf.",
        ],
      },
      {
        id: "analitica",
        heading: "4. Cookies and analytics",
        body: [
          "We use analytics tools (such as Google Analytics) to understand how the Site is used in aggregate. You can block cookies from your browser.",
        ],
      },
      {
        id: "derechos",
        heading: "5. Your rights",
        body: [
          "You can ask us to access, correct or delete your data at any time by writing to us from the Help section.",
        ],
      },
      {
        id: "contacto",
        heading: "6. Contact",
        body: [
          "For any questions about your data, write to us from the Help section of the Site.",
        ],
      },
    ],
  },
  pt: {
    updated: UPDATED,
    intro:
      "Na NorteWalk cuidamos dos seus dados. Esta política explica quais informações coletamos quando você usa o Site e seus formulários, para que as usamos e com quem as compartilhamos.",
    sections: [
      {
        id: "datos",
        heading: "1. Quais dados coletamos",
        body: [
          "Dados que você nos fornece voluntariamente nos formulários: nome, email, telefone/WhatsApp, mensagens e, em uma reserva, a experiência, data e idioma escolhidos.",
          "Dados técnicos básicos para segurança e estatística: endereço IP, navegador e página de origem, além de parâmetros de campanha (UTM) se você chegou por um anúncio ou link.",
        ],
      },
      {
        id: "uso",
        heading: "2. Para que os usamos",
        body: [
          "Para gerenciar sua reserva ou consulta e colocar você em contato com o guia ou prestador correspondente.",
          "Para avisar sobre o lançamento se você entrou na lista de espera, e para melhorar as experiências com base nas suas sugestões.",
        ],
      },
      {
        id: "comparten",
        heading: "3. Com quem os compartilhamos",
        body: [
          "Compartilhamos os dados necessários com o guia ou prestador da experiência que você reserva, para que possa combinar a saída com você.",
          "Não vendemos seus dados. Podemos usar serviços de terceiros (por exemplo, analítica web) que processam dados em nosso nome.",
        ],
      },
      {
        id: "analitica",
        heading: "4. Cookies e analítica",
        body: [
          "Usamos ferramentas de analítica (como o Google Analytics) para entender como o Site é usado de forma agregada. Você pode bloquear os cookies pelo seu navegador.",
        ],
      },
      {
        id: "derechos",
        heading: "5. Seus direitos",
        body: [
          "Você pode pedir para acessar, corrigir ou excluir seus dados a qualquer momento escrevendo pela seção de Ajuda.",
        ],
      },
      {
        id: "contacto",
        heading: "6. Contato",
        body: [
          "Para qualquer dúvida sobre seus dados, escreva pela seção de Ajuda do Site.",
        ],
      },
    ],
  },
};

export function getTerms(locale: Locale): LegalDoc {
  return TERMS[locale] ?? TERMS.es;
}

export function getPrivacy(locale: Locale): LegalDoc {
  return PRIVACY[locale] ?? PRIVACY.es;
}
