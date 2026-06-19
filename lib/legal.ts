/* =====================================================================
 * NorteWalk — contenido legal por idioma.
 *
 * Documentos redactados por el equipo legal (Julito) — reflejan el modelo
 * real: NorteWalk es una plataforma de intermediación (marketplace) que
 * conecta viajeros con guías locales habilitados; NO procesa pagos y NO
 * presta el servicio turístico (lo presta el guía/prestador).
 *
 * El texto autoritativo y legalmente vinculante es el ESPAÑOL (jurisdicción:
 * Tribunales Ordinarios de San Miguel de Tucumán, ley argentina). Las versiones
 * en inglés y portugués son traducciones de cortesía y llevan una `notice` que
 * lo aclara.
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
  /** Aviso destacado al inicio (ej: traducción de cortesía). Opcional. */
  notice?: string;
  intro: string;
  sections: LegalSection[];
}

const UPDATED_ES = "Junio de 2026";
const UPDATED_EN = "June 2026";
const UPDATED_PT = "Junho de 2026";

const NOTICE_EN =
  "This is a courtesy translation. The legally binding version is the Spanish one, governed by Argentine law and the courts of San Miguel de Tucumán.";
const NOTICE_PT =
  "Esta é uma tradução de cortesia. A versão juridicamente vinculante é a versão em espanhol, regida pela lei argentina e pelos tribunais de San Miguel de Tucumán.";

// ---------------------------------------------------------------------
// Términos y Condiciones generales de uso
// ---------------------------------------------------------------------

const TERMS: Record<Locale, LegalDoc> = {
  es: {
    updated: UPDATED_ES,
    intro:
      "Bienvenido a NorteWalk. Estos Términos y Condiciones (los «Términos») regulan el acceso, navegación y uso del sitio web nortewalk.com.ar (la «Plataforma»), de titularidad de NorteWalk. Al acceder, registrarte o concretar una reserva a través de la Plataforma, el usuario (el «Usuario» o «Turista») declara conocer de forma expresa, plena y sin reservas el presente reglamento, adquiriendo fuerza de contrato de adhesión vinculante. Si no estás de acuerdo con estos Términos, deberás abstenerte de utilizar la Plataforma.",
    sections: [
      {
        id: "naturaleza",
        heading: "1. Naturaleza jurídica: modelo de intermediación",
        body: [
          "Rol tecnológico exclusivo: NorteWalk es una plataforma digital que opera exclusivamente como un canal tecnológico de intermediación. Su propósito es conectar a guías de turismo locales independientes y debidamente acreditados en su jurisdicción (los «Guías») con Usuarios interesados en realizar recorridos turísticos y culturales en la provincia de Tucumán.",
          "Inexistencia de vínculo comercial directo: NorteWalk no reviste el carácter de agencia de viajes, empresa de turismo tradicional, operadora de transporte terrestre, ni proveedora directa de servicios turísticos o de aventura. NorteWalk no organiza, no diseña, no dirige ni ejecuta las excursiones publicadas en su catálogo digital.",
        ],
      },
      {
        id: "reservas",
        heading: "2. Reservas, condiciones operativas y modalidad de pago",
        body: [
          "Rol de la reserva: el proceso de reserva web gestiona y asegura la disponibilidad de un cupo máximo estipulado por el Guía para una determinada experiencia.",
          "Modalidad de pago directo: el Usuario comprende que la Plataforma no actúa como pasarela de cobros ni procesa pagos vinculados a las excursiones en esta etapa.",
          "Caminatas de libre pago (Free Walking Tours): carecen de tarifa fija u obligatoria. El Usuario entregará directamente al Guía, de manera discrecional y voluntaria, una gratificación económica proporcional a la calidad percibida al concluir la caminata.",
          "Experiencias de precio cerrado: el valor exhibido corresponde al costo final por persona definido por el prestador de la actividad. El abono se perfeccionará exclusivamente de forma presencial y directa al Guía el día de la salida.",
          "Política de asistencia y tolerancia (No-Show): si el Turista decidiera no asistir, asumirá la obligación de cancelar la reserva con un mínimo de tres (3) horas de antelación. La reiteración de tres (3) inasistencias injustificadas habilitará a NorteWalk a dar de baja o suspender la cuenta del Usuario de forma permanente. Los Guías podrán cancelar o reprogramar una salida por cuestiones de fuerza mayor o por no cumplir el cupo mínimo técnico requerido, debiendo dar aviso por los canales de contacto provistos con un mínimo de cuatro (4) horas de antelación.",
        ],
      },
      {
        id: "responsabilidad",
        heading: "3. Independencia y deslinde de responsabilidad",
        body: [
          "Autonomía y aptitud de los Guías: cada Guía ejerce su actividad profesional de manera autónoma, independiente y por cuenta propia. Los Guías no mantienen relación de dependencia, subordinación, sociedad, representación jurídica ni alianza exclusiva con NorteWalk. La Plataforma se limita a aplicar filtros cualitativos de verificación documental sobre las credenciales locales de los prestadores en Tucumán al momento de su alta, pero el control operativo inmediato de la salida en territorio recae con exclusividad en el Guía profesional.",
          "Exclusión de responsabilidad por siniestros o contingencias: en la máxima medida permitida por el ordenamiento civil aplicable en la República Argentina, NorteWalk, sus fundadores, desarrolladores y agentes quedan eximidos de toda responsabilidad civil, penal, contractual o extracontractual por cualquier clase de daño directo, indirecto, patrimonial o extrapatrimonial, lesiones corporales, accidentes de tránsito, pérdidas de equipaje, sustracción de objetos de valor o fallecimiento acaecidos con motivo de la realización, transporte, desarrollo físico o cancelación de los recorridos turísticos contratados.",
          "Ámbito terrestre y vía pública: el Usuario declara conocer, comprender y aceptar que las actividades se desarrollan principalmente en cascos históricos urbanos, senderos naturales o espacios públicos expuestos a variaciones climáticas, irregularidades del terreno y factores de circulación general fuera del control de NorteWalk. El Usuario asume bajo su propio riesgo y cargo la responsabilidad física de su participación en las experiencias.",
          "Indemnidad y vía de reclamación: en caso de suscitarse algún conflicto, mala praxis, disconformidad o daño con ocasión de la salida, el Usuario se obliga a mantener indemne a NorteWalk y a dirigir sus acciones o reclamos formales únicamente hacia el Guía prestador que estuvo a cargo de la salida, quien actúa como único contratante final del servicio.",
        ],
      },
      {
        id: "contenido",
        heading: "4. Contenido, reseñas y propiedad intelectual",
        body: [
          "Sistema de valoración por la comunidad: tras finalizar la excursión, el Turista podrá emitir opiniones y calificaciones numéricas sobre el servicio. Queda estrictamente vedada la publicación de lenguaje obsceno, injurioso, difamatorio, discriminatorio o que constituya acoso. NorteWalk conserva la potestad absoluta de auditar y suprimir opiniones que violen estas directrices de convivencia ética (ver la Política de Opiniones y Reseñas).",
          "Derechos sobre la Plataforma: el diseño general, códigos de programación, algoritmos, bases de datos, textos, logotipos corporativos y el dominio nortewalk.com.ar constituyen propiedad intelectual protegida de NorteWalk. Su reproducción o explotación no autorizada dará lugar a las acciones civiles y penales correspondientes.",
        ],
      },
      {
        id: "ley",
        heading: "5. Actualizaciones y ley aplicable",
        body: [
          "NorteWalk se reserva la facultad unilateral de modificar o reescribir los presentes Términos en cualquier momento para adaptarlos a innovaciones técnicas, normativas turísticas o cambios comerciales en el mercado. Las modificaciones entrarán en vigencia inmediatamente tras su publicación en la web.",
          "Cualquier divergencia jurídica derivada de la interpretación, validez o cumplimiento de este documento se regirá por las leyes de la República Argentina y será sometida en forma exclusiva a la competencia territorial de los Tribunales Ordinarios de San Miguel de Tucumán, renunciando las partes a cualquier otro fuero o jurisdicción que pudiera corresponderles por razón de domicilio.",
        ],
      },
    ],
  },
  en: {
    updated: UPDATED_EN,
    notice: NOTICE_EN,
    intro:
      "Welcome to NorteWalk. These Terms and Conditions (the “Terms”) govern access to, navigation of and use of the website nortewalk.com.ar (the “Platform”), owned by NorteWalk. By accessing, registering or completing a booking through the Platform, the user (the “User” or “Traveler”) expressly, fully and unreservedly declares that they are aware of these rules, which acquire the force of a binding adhesion contract. If you do not agree with these Terms, you must refrain from using the Platform.",
    sections: [
      {
        id: "naturaleza",
        heading: "1. Legal nature: intermediation model",
        body: [
          "Exclusive technological role: NorteWalk is a digital platform that operates solely as a technological intermediation channel. Its purpose is to connect independent local tour guides, duly accredited in their jurisdiction (the “Guides”), with Users interested in taking tourist and cultural tours in the province of Tucumán.",
          "No direct commercial relationship: NorteWalk is not a travel agency, a traditional tourism company, a ground transport operator, nor a direct provider of tourist or adventure services. NorteWalk does not organize, design, direct or carry out the excursions listed in its digital catalog.",
        ],
      },
      {
        id: "reservas",
        heading: "2. Bookings, operating conditions and payment",
        body: [
          "Role of the booking: the web booking process manages and secures the availability of a maximum number of spots set by the Guide for a given experience.",
          "Direct payment model: the User understands that the Platform does not act as a payment gateway nor process payments tied to the excursions at this stage.",
          "Tip-based walks (Free Walking Tours): they have no fixed or mandatory fee. The User will give the Guide directly, at their own discretion and voluntarily, a monetary gratuity proportional to the perceived quality at the end of the walk.",
          "Fixed-price experiences: the displayed value is the final cost per person set by the activity provider. Payment is settled exclusively in person and directly to the Guide on the day of the outing.",
          "Attendance and tolerance policy (No-Show): if the Traveler decides not to attend, they assume the obligation to cancel the booking at least three (3) hours in advance. Three (3) repeated unjustified no-shows will entitle NorteWalk to permanently deactivate or suspend the User’s account. Guides may cancel or reschedule an outing for reasons of force majeure or for failing to meet the minimum required group size, giving notice through the provided contact channels at least four (4) hours in advance.",
        ],
      },
      {
        id: "responsabilidad",
        heading: "3. Independence and limitation of liability",
        body: [
          "Autonomy and aptitude of the Guides: each Guide carries out their professional activity autonomously, independently and on their own account. The Guides have no employment, subordination, partnership, legal representation or exclusive alliance relationship with NorteWalk. The Platform merely applies qualitative documentary verification filters on the providers’ local credentials in Tucumán at the time of onboarding, but immediate operational control of the outing on the ground rests exclusively with the professional Guide.",
          "Exclusion of liability for accidents or contingencies: to the maximum extent permitted by the applicable civil law of the Republic of Argentina, NorteWalk, its founders, developers and agents are released from all civil, criminal, contractual or non-contractual liability for any kind of direct or indirect damage, financial or non-financial, bodily injury, traffic accidents, lost luggage, theft of valuables or death occurring in connection with the performance, transport, physical conduct or cancellation of the contracted tourist tours.",
          "Land and public-space scope: the User declares that they know, understand and accept that the activities take place mainly in historic urban centers, natural trails or public spaces exposed to weather variations, uneven terrain and general traffic factors beyond NorteWalk’s control. The User assumes, at their own risk and expense, physical responsibility for their participation in the experiences.",
          "Indemnity and channel for claims: should any conflict, malpractice, dissatisfaction or damage arise on the occasion of the outing, the User undertakes to hold NorteWalk harmless and to direct their actions or formal claims solely to the providing Guide who was in charge of the outing, who acts as the sole final contractor of the service.",
        ],
      },
      {
        id: "contenido",
        heading: "4. Content, reviews and intellectual property",
        body: [
          "Community rating system: after the excursion ends, the Traveler may post reviews and numerical ratings about the service. Posting obscene, insulting, defamatory, discriminatory or harassing language is strictly forbidden. NorteWalk retains full authority to audit and remove reviews that breach these ethical conduct guidelines (see the Reviews Policy).",
          "Rights over the Platform: the general design, programming code, algorithms, databases, texts, corporate logos and the domain nortewalk.com.ar are protected intellectual property of NorteWalk. Their unauthorized reproduction or exploitation will give rise to the corresponding civil and criminal actions.",
        ],
      },
      {
        id: "ley",
        heading: "5. Updates and applicable law",
        body: [
          "NorteWalk reserves the unilateral right to modify or rewrite these Terms at any time to adapt them to technical innovations, tourism regulations or commercial changes in the market. Changes take effect immediately upon publication on the website.",
          "Any legal dispute arising from the interpretation, validity or performance of this document shall be governed by the laws of the Republic of Argentina and submitted exclusively to the territorial jurisdiction of the Ordinary Courts of San Miguel de Tucumán, with the parties waiving any other venue or jurisdiction that might correspond to them by reason of domicile.",
        ],
      },
    ],
  },
  pt: {
    updated: UPDATED_PT,
    notice: NOTICE_PT,
    intro:
      "Bem-vindo à NorteWalk. Estes Termos e Condições (os “Termos”) regulam o acesso, a navegação e o uso do site nortewalk.com.ar (a “Plataforma”), de titularidade da NorteWalk. Ao acessar, cadastrar-se ou concretizar uma reserva através da Plataforma, o usuário (o “Usuário” ou “Turista”) declara conhecer de forma expressa, plena e sem reservas o presente regulamento, adquirindo força de contrato de adesão vinculante. Se não concordar com estes Termos, deverá abster-se de usar a Plataforma.",
    sections: [
      {
        id: "naturaleza",
        heading: "1. Natureza jurídica: modelo de intermediação",
        body: [
          "Papel tecnológico exclusivo: a NorteWalk é uma plataforma digital que opera exclusivamente como um canal tecnológico de intermediação. Seu propósito é conectar guias de turismo locais independentes e devidamente credenciados em sua jurisdição (os “Guias”) com Usuários interessados em realizar passeios turísticos e culturais na província de Tucumán.",
          "Inexistência de vínculo comercial direto: a NorteWalk não é uma agência de viagens, empresa de turismo tradicional, operadora de transporte terrestre, nem prestadora direta de serviços turísticos ou de aventura. A NorteWalk não organiza, não desenha, não dirige nem executa as excursões publicadas em seu catálogo digital.",
        ],
      },
      {
        id: "reservas",
        heading: "2. Reservas, condições operacionais e pagamento",
        body: [
          "Papel da reserva: o processo de reserva web gerencia e garante a disponibilidade de um número máximo de vagas estipulado pelo Guia para uma determinada experiência.",
          "Modalidade de pagamento direto: o Usuário compreende que a Plataforma não atua como gateway de cobrança nem processa pagamentos vinculados às excursões nesta etapa.",
          "Caminhadas a gorjeta (Free Walking Tours): não têm tarifa fixa ou obrigatória. O Usuário entregará diretamente ao Guia, de maneira discricionária e voluntária, uma gratificação econômica proporcional à qualidade percebida ao concluir a caminhada.",
          "Experiências de preço fechado: o valor exibido corresponde ao custo final por pessoa definido pelo prestador da atividade. O pagamento será realizado exclusivamente de forma presencial e direta ao Guia no dia da saída.",
          "Política de comparecimento e tolerância (No-Show): se o Turista decidir não comparecer, assumirá a obrigação de cancelar a reserva com no mínimo três (3) horas de antecedência. A reiteração de três (3) ausências injustificadas habilitará a NorteWalk a cancelar ou suspender a conta do Usuário de forma permanente. Os Guias poderão cancelar ou remarcar uma saída por questões de força maior ou por não atingir o número mínimo técnico exigido, devendo avisar pelos canais de contato fornecidos com no mínimo quatro (4) horas de antecedência.",
        ],
      },
      {
        id: "responsabilidad",
        heading: "3. Independência e isenção de responsabilidade",
        body: [
          "Autonomia e aptidão dos Guias: cada Guia exerce sua atividade profissional de maneira autônoma, independente e por conta própria. Os Guias não mantêm relação de emprego, subordinação, sociedade, representação jurídica nem aliança exclusiva com a NorteWalk. A Plataforma limita-se a aplicar filtros qualitativos de verificação documental sobre as credenciais locais dos prestadores em Tucumán no momento do cadastro, mas o controle operacional imediato da saída em campo recai exclusivamente sobre o Guia profissional.",
          "Exclusão de responsabilidade por sinistros ou contingências: na máxima medida permitida pelo ordenamento civil aplicável na República Argentina, a NorteWalk, seus fundadores, desenvolvedores e agentes ficam isentos de toda responsabilidade civil, penal, contratual ou extracontratual por qualquer tipo de dano direto, indireto, patrimonial ou extrapatrimonial, lesões corporais, acidentes de trânsito, perdas de bagagem, subtração de objetos de valor ou falecimento ocorridos em razão da realização, transporte, desenvolvimento físico ou cancelamento dos passeios turísticos contratados.",
          "Âmbito terrestre e via pública: o Usuário declara conhecer, compreender e aceitar que as atividades se desenvolvem principalmente em centros históricos urbanos, trilhas naturais ou espaços públicos expostos a variações climáticas, irregularidades do terreno e fatores de circulação geral fora do controle da NorteWalk. O Usuário assume, por sua própria conta e risco, a responsabilidade física por sua participação nas experiências.",
          "Indenidade e via de reclamação: caso surja algum conflito, má prática, inconformidade ou dano por ocasião da saída, o Usuário se obriga a manter a NorteWalk indene e a dirigir suas ações ou reclamações formais unicamente ao Guia prestador que esteve a cargo da saída, que atua como único contratante final do serviço.",
        ],
      },
      {
        id: "contenido",
        heading: "4. Conteúdo, avaliações e propriedade intelectual",
        body: [
          "Sistema de avaliação pela comunidade: após concluir a excursão, o Turista poderá emitir opiniões e avaliações numéricas sobre o serviço. Fica estritamente vedada a publicação de linguagem obscena, injuriosa, difamatória, discriminatória ou que constitua assédio. A NorteWalk conserva a faculdade absoluta de auditar e suprimir avaliações que violem estas diretrizes de convivência ética (ver a Política de Avaliações).",
          "Direitos sobre a Plataforma: o design geral, códigos de programação, algoritmos, bancos de dados, textos, logotipos corporativos e o domínio nortewalk.com.ar constituem propriedade intelectual protegida da NorteWalk. Sua reprodução ou exploração não autorizada dará lugar às ações civis e penais correspondentes.",
        ],
      },
      {
        id: "ley",
        heading: "5. Atualizações e lei aplicável",
        body: [
          "A NorteWalk reserva-se a faculdade unilateral de modificar ou reescrever os presentes Termos a qualquer momento para adaptá-los a inovações técnicas, normas turísticas ou mudanças comerciais no mercado. As modificações entrarão em vigor imediatamente após sua publicação no site.",
          "Qualquer divergência jurídica derivada da interpretação, validade ou cumprimento deste documento reger-se-á pelas leis da República Argentina e será submetida exclusivamente à competência territorial dos Tribunais Ordinários de San Miguel de Tucumán, renunciando as partes a qualquer outro foro ou jurisdição que possa lhes corresponder em razão de domicílio.",
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
    updated: UPDATED_ES,
    intro:
      "Bienvenido a NorteWalk. La privacidad y la seguridad de tus datos son fundamentales para nosotros. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información personal de los usuarios (los «Turistas») y de los guías de turismo locales (los «Guías Habilitados») que interactúan con nuestra plataforma web alojada en nortewalk.com.ar. Al utilizar nuestro sitio web, registrarte en nuestros formularios o reservar una experiencia, aceptás las prácticas descritas en este documento de conformidad con la Ley Nacional de Protección de Datos Personales N° 25.326 de la República Argentina.",
    sections: [
      {
        id: "responsable",
        heading: "1. Responsable del tratamiento de los datos",
        body: [
          "El responsable legal de la recopilación y tratamiento de tus datos personales es NorteWalk, con domicilio en la Provincia de Tucumán, Argentina.",
          "Para cualquier consulta, rectificación o eliminación de tus datos, podés comunicarte directamente a nuestro canal oficial de atención: hola@nortewalk.com.ar.",
        ],
      },
      {
        id: "datos",
        heading: "2. Datos que recopilamos y su finalidad",
        body: [
          "De acuerdo con el principio de minimización de datos, solo solicitamos la información estrictamente necesaria para conectar a las partes y asegurar la calidad del servicio.",
          "Datos de los Turistas / Usuarios. Qué recopilamos: nombre, apellido, dirección de correo electrónico, número de teléfono (WhatsApp) e idioma de preferencia. Finalidad: procesar y coordinar las reservas de los tours, enviar la confirmación del cupo, permitir que el Guía asignado se comunique para coordinar el punto de encuentro, y remitir novedades u ofertas del pre-lanzamiento (siempre que lo hayas autorizado).",
          "Datos de los Guías Locales. Qué recopilamos: nombre, apellido, foto de perfil, datos de contacto, documentación fiscal y credenciales de habilitación emitidas por el Ente Autárquico Tucumán Turismo (EATT). Finalidad: validar de forma interna y rigurosa la identidad y la habilitación legal del profesional para garantizar un entorno de «turismo seguro», gestionar la relación de intermediación comercial y publicar el perfil en el marketplace.",
        ],
      },
      {
        id: "financieros",
        heading: "3. Exclusión de datos financieros y bancarios",
        body: [
          "NorteWalk NO recopila, NO solicita y NO almacena datos de tarjetas de crédito, débito ni cuentas bancarias. El modelo actual de la plataforma no procesa pagos en línea.",
          "En el formato de «Free Walking Tours» (caminatas a la gorra) o experiencias de precio cerrado, la reserva en la web es 100% gratuita. Todo aporte voluntario, propina o pago acordado se realiza de manera directa y exclusiva entre el Turista y el Guía el día del recorrido.",
        ],
      },
      {
        id: "comparten",
        heading: "4. Cómo se comparten los datos",
        body: [
          "NorteWalk funciona como un intermediario tecnológico. Una vez confirmada la reserva, NorteWalk facilitará al Guía Habilitado los datos de contacto (nombre y teléfono) del Turista, únicamente para fines logísticos del tour. De igual manera, el Turista recibirá los datos del Guía asignado.",
          "Deslinde de responsabilidad: los Guías Habilitados actúan como profesionales independientes. Al recibir los datos de un Turista para un tour, se comprometen por contrato a usarlos exclusivamente para esa salida. NorteWalk no se hace responsable por tratamientos informales o usos indebidos de la información que ocurran fuera del ámbito estricto de control de la plataforma digital.",
        ],
      },
      {
        id: "cookies",
        heading: "5. Cookies y analítica",
        body: [
          "Utilizamos cookies y tecnologías similares para que el sitio funcione y para entender cómo se usa. Distinguimos entre cookies necesarias (imprescindibles para la navegación y la seguridad, siempre activas) y cookies de analítica (opcionales, que solo se activan con tu consentimiento).",
          "Para medir el uso del sitio empleamos Google Analytics y Microsoft Clarity. Microsoft Clarity puede registrar mapas de calor y reproducciones anónimas de sesión (movimientos del cursor, clics y desplazamiento) para mejorar la experiencia. Estas herramientas pueden recopilar datos como tu dirección IP, navegador, dispositivo y páginas visitadas, y utilizan cookies propias y de terceros.",
          "La primera vez que entrás te mostramos un aviso para aceptar o rechazar las cookies de analítica, y podés cambiar tu elección en cualquier momento desde el enlace «Cookies» del pie de página o desde la configuración de tu navegador. Si las rechazás, la analítica no se carga y el sitio sigue funcionando con normalidad.",
        ],
      },
      {
        id: "seguridad",
        heading: "6. Almacenamiento y seguridad",
        body: [
          "Todos los datos recolectados se almacenan en servidores seguros que cuentan con medidas de protección técnicas y organizativas estándar para evitar la pérdida, alteración, acceso no autorizado o filtración de la información.",
          "El acceso a los documentos de validación de los guías está estrictamente restringido al equipo de administración de NorteWalk.",
        ],
      },
      {
        id: "derechos",
        heading: "7. Tus derechos (acceso, rectificación y supresión)",
        body: [
          "De acuerdo con la Ley N° 25.326, podés ejercer en cualquier momento tus derechos de acceso (conocer qué datos tenemos tuyos), rectificación o actualización (corregir datos erróneos o desactualizados) y supresión (solicitar que eliminemos de forma definitiva tus datos de nuestra base de datos).",
          "Para ejercer cualquiera de estos derechos, basta con enviar un correo electrónico a hola@nortewalk.com.ar detallando tu solicitud. Responderemos y procesaremos tu baja o edición de forma completamente gratuita.",
        ],
      },
      {
        id: "cambios",
        heading: "8. Modificaciones a esta política",
        body: [
          "NorteWalk se reserva el derecho de modificar esta política para adaptarla a futuras novedades legislativas, jurisprudenciales o cambios en el modelo de negocio (como la incorporación de pasarelas de pago externas en el mediano plazo).",
          "Cualquier cambio sustancial será publicado en esta misma sección y, si corresponde, notificado a los usuarios registrados vía correo electrónico.",
        ],
      },
    ],
  },
  en: {
    updated: UPDATED_EN,
    notice: NOTICE_EN,
    intro:
      "Welcome to NorteWalk. The privacy and security of your data are essential to us. This Privacy Policy describes how we collect, use, store and protect the personal information of users (the “Travelers”) and local tour guides (the “Licensed Guides”) who interact with our website hosted at nortewalk.com.ar. By using our website, signing up through our forms or booking an experience, you accept the practices described in this document in accordance with Argentina’s National Personal Data Protection Act No. 25.326.",
    sections: [
      {
        id: "responsable",
        heading: "1. Data controller",
        body: [
          "The party legally responsible for collecting and processing your personal data is NorteWalk, domiciled in the Province of Tucumán, Argentina.",
          "For any inquiry, correction or deletion of your data, you can contact our official support channel directly: hola@nortewalk.com.ar.",
        ],
      },
      {
        id: "datos",
        heading: "2. Data we collect and its purpose",
        body: [
          "In line with the data minimization principle, we only request the information strictly necessary to connect the parties and ensure service quality.",
          "Traveler / User data. What we collect: first name, last name, email address, phone number (WhatsApp) and preferred language. Purpose: to process and coordinate tour bookings, send spot confirmations, allow the assigned Guide to get in touch to coordinate the meeting point, and send pre-launch news or offers (whenever you have authorized it).",
          "Local Guide data. What we collect: first name, last name, profile photo, contact details, tax documentation and accreditation credentials issued by the Ente Autárquico Tucumán Turismo (EATT). Purpose: to internally and rigorously validate the professional’s identity and legal accreditation to guarantee a “safe tourism” environment, manage the commercial intermediation relationship and publish the profile on the marketplace.",
        ],
      },
      {
        id: "financieros",
        heading: "3. Exclusion of financial and banking data",
        body: [
          "NorteWalk does NOT collect, does NOT request and does NOT store credit card, debit card or bank account data. The platform’s current model does not process online payments.",
          "For “Free Walking Tours” (tip-based walks) or fixed-price experiences, booking on the web is 100% free. Any voluntary contribution, tip or agreed payment is made directly and exclusively between the Traveler and the Guide on the day of the tour.",
        ],
      },
      {
        id: "comparten",
        heading: "4. How data is shared",
        body: [
          "NorteWalk works as a technological intermediary. Once a booking is confirmed, NorteWalk will share the Traveler’s contact details (name and phone) with the Licensed Guide, solely for the tour’s logistical purposes. Likewise, the Traveler will receive the assigned Guide’s details.",
          "Disclaimer: Licensed Guides act as independent professionals. When they receive a Traveler’s data for a tour, they contractually commit to using it exclusively for that outing. NorteWalk is not responsible for informal handling or misuse of the information occurring outside the strict scope of the digital platform’s control.",
        ],
      },
      {
        id: "cookies",
        heading: "5. Cookies and analytics",
        body: [
          "We use cookies and similar technologies to make the site work and to understand how it is used. We distinguish between necessary cookies (essential for navigation and security, always active) and analytics cookies (optional, enabled only with your consent).",
          "To measure site usage we use Google Analytics and Microsoft Clarity. Microsoft Clarity may record heatmaps and anonymous session replays (cursor movements, clicks and scrolling) to improve the experience. These tools may collect data such as your IP address, browser, device and pages visited, and they use first- and third-party cookies.",
          "The first time you visit we show a notice to accept or reject analytics cookies, and you can change your choice at any time from the “Cookies” link in the footer or from your browser settings. If you reject them, analytics is not loaded and the site keeps working normally.",
        ],
      },
      {
        id: "seguridad",
        heading: "6. Storage and security",
        body: [
          "All collected data is stored on secure servers with standard technical and organizational protection measures to prevent loss, alteration, unauthorized access or leakage of information.",
          "Access to the guides’ validation documents is strictly restricted to the NorteWalk administration team.",
        ],
      },
      {
        id: "derechos",
        heading: "7. Your rights (access, rectification and deletion)",
        body: [
          "Under Act No. 25.326, you may exercise at any time your rights of access (knowing what data we hold about you), rectification or update (correcting wrong or outdated data) and deletion (requesting that we permanently remove your data from our database).",
          "To exercise any of these rights, simply send an email to hola@nortewalk.com.ar detailing your request. We will respond and process your removal or edit completely free of charge.",
        ],
      },
      {
        id: "cambios",
        heading: "8. Changes to this policy",
        body: [
          "NorteWalk reserves the right to modify this policy to adapt it to future legislative or case-law developments, or changes to the business model (such as adding external payment gateways in the medium term).",
          "Any substantial change will be published in this same section and, where applicable, notified to registered users via email.",
        ],
      },
    ],
  },
  pt: {
    updated: UPDATED_PT,
    notice: NOTICE_PT,
    intro:
      "Bem-vindo à NorteWalk. A privacidade e a segurança dos seus dados são fundamentais para nós. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as informações pessoais dos usuários (os “Turistas”) e dos guias de turismo locais (os “Guias Credenciados”) que interagem com nossa plataforma web hospedada em nortewalk.com.ar. Ao usar nosso site, cadastrar-se em nossos formulários ou reservar uma experiência, você aceita as práticas descritas neste documento, em conformidade com a Lei Nacional de Proteção de Dados Pessoais N° 25.326 da República Argentina.",
    sections: [
      {
        id: "responsable",
        heading: "1. Responsável pelo tratamento dos dados",
        body: [
          "O responsável legal pela coleta e tratamento dos seus dados pessoais é a NorteWalk, com domicílio na Província de Tucumán, Argentina.",
          "Para qualquer consulta, retificação ou exclusão dos seus dados, você pode entrar em contato diretamente com nosso canal oficial de atendimento: hola@nortewalk.com.ar.",
        ],
      },
      {
        id: "datos",
        heading: "2. Dados que coletamos e sua finalidade",
        body: [
          "De acordo com o princípio de minimização de dados, solicitamos apenas as informações estritamente necessárias para conectar as partes e garantir a qualidade do serviço.",
          "Dados dos Turistas / Usuários. O que coletamos: nome, sobrenome, endereço de e-mail, número de telefone (WhatsApp) e idioma de preferência. Finalidade: processar e coordenar as reservas dos tours, enviar a confirmação da vaga, permitir que o Guia designado entre em contato para combinar o ponto de encontro e enviar novidades ou ofertas do pré-lançamento (sempre que você tiver autorizado).",
          "Dados dos Guias Locais. O que coletamos: nome, sobrenome, foto de perfil, dados de contato, documentação fiscal e credenciais de habilitação emitidas pelo Ente Autárquico Tucumán Turismo (EATT). Finalidade: validar de forma interna e rigorosa a identidade e a habilitação legal do profissional para garantir um ambiente de “turismo seguro”, gerir a relação de intermediação comercial e publicar o perfil no marketplace.",
        ],
      },
      {
        id: "financieros",
        heading: "3. Exclusão de dados financeiros e bancários",
        body: [
          "A NorteWalk NÃO coleta, NÃO solicita e NÃO armazena dados de cartões de crédito, débito ou contas bancárias. O modelo atual da plataforma não processa pagamentos online.",
          "No formato de “Free Walking Tours” (caminhadas a gorjeta) ou experiências de preço fechado, a reserva no site é 100% gratuita. Toda contribuição voluntária, gorjeta ou pagamento combinado é feito de forma direta e exclusiva entre o Turista e o Guia no dia do passeio.",
        ],
      },
      {
        id: "comparten",
        heading: "4. Como os dados são compartilhados",
        body: [
          "A NorteWalk funciona como um intermediário tecnológico. Uma vez confirmada a reserva, a NorteWalk fornecerá ao Guia Credenciado os dados de contato (nome e telefone) do Turista, unicamente para fins logísticos do tour. Da mesma forma, o Turista receberá os dados do Guia designado.",
          "Isenção de responsabilidade: os Guias Credenciados atuam como profissionais independentes. Ao receber os dados de um Turista para um tour, comprometem-se por contrato a usá-los exclusivamente para aquela saída. A NorteWalk não se responsabiliza por tratamentos informais ou usos indevidos da informação que ocorram fora do âmbito estrito de controle da plataforma digital.",
        ],
      },
      {
        id: "cookies",
        heading: "5. Cookies e analítica",
        body: [
          "Usamos cookies e tecnologias semelhantes para que o site funcione e para entender como ele é usado. Distinguimos entre cookies necessários (imprescindíveis para a navegação e a segurança, sempre ativos) e cookies de analítica (opcionais, ativados apenas com o seu consentimento).",
          "Para medir o uso do site utilizamos o Google Analytics e o Microsoft Clarity. O Microsoft Clarity pode registrar mapas de calor e reproduções anônimas de sessão (movimentos do cursor, cliques e rolagem) para melhorar a experiência. Essas ferramentas podem coletar dados como seu endereço IP, navegador, dispositivo e páginas visitadas, e utilizam cookies próprios e de terceiros.",
          "Na primeira vez que você acessa, mostramos um aviso para aceitar ou rejeitar os cookies de analítica, e você pode mudar sua escolha a qualquer momento pelo link “Cookies” no rodapé ou nas configurações do seu navegador. Se você os rejeitar, a analítica não é carregada e o site continua funcionando normalmente.",
        ],
      },
      {
        id: "seguridad",
        heading: "6. Armazenamento e segurança",
        body: [
          "Todos os dados coletados são armazenados em servidores seguros que contam com medidas de proteção técnicas e organizacionais padrão para evitar a perda, alteração, acesso não autorizado ou vazamento das informações.",
          "O acesso aos documentos de validação dos guias é estritamente restrito à equipe de administração da NorteWalk.",
        ],
      },
      {
        id: "derechos",
        heading: "7. Seus direitos (acesso, retificação e exclusão)",
        body: [
          "De acordo com a Lei N° 25.326, você pode exercer a qualquer momento seus direitos de acesso (saber quais dados temos sobre você), retificação ou atualização (corrigir dados errados ou desatualizados) e exclusão (solicitar que apaguemos definitivamente seus dados do nosso banco de dados).",
          "Para exercer qualquer um desses direitos, basta enviar um e-mail para hola@nortewalk.com.ar detalhando sua solicitação. Responderemos e processaremos sua remoção ou edição de forma totalmente gratuita.",
        ],
      },
      {
        id: "cambios",
        heading: "8. Alterações a esta política",
        body: [
          "A NorteWalk reserva-se o direito de modificar esta política para adaptá-la a futuras novidades legislativas, jurisprudenciais ou mudanças no modelo de negócio (como a incorporação de gateways de pagamento externos no médio prazo).",
          "Qualquer mudança substancial será publicada nesta mesma seção e, se for o caso, notificada aos usuários cadastrados por e-mail.",
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------
// Política de Opiniones y Reseñas
// ---------------------------------------------------------------------

const REVIEWS: Record<Locale, LegalDoc> = {
  es: {
    updated: UPDATED_ES,
    intro:
      "En NorteWalk creemos en la transparencia, la honestidad y el valor del turismo seguro. El sistema de opiniones y reseñas de nuestra plataforma ayuda a los viajeros a elegir las mejores experiencias en Tucumán y premia el profesionalismo de nuestros Guías Habilitados. Para garantizar que este sistema sea confiable y justo, todos los usuarios deben cumplir con la presente Política de Opiniones.",
    sections: [
      {
        id: "quien",
        heading: "1. ¿Quién puede dejar una opinión?",
        body: [
          "Para mantener la autenticidad del marketplace, solo podrán publicar opiniones aquellos Turistas que hayan realizado una reserva efectiva a través de nortewalk.com.ar y cuya asistencia al tour haya sido confirmada.",
          "No se permiten opiniones de usuarios que no reservaron a través del sitio web. Si una reserva fue cancelada o el Turista no asistió al punto de encuentro (No-Show), el sistema inhabilitará la opción de dejar una reseña sobre esa experiencia.",
        ],
      },
      {
        id: "moderacion",
        heading: "2. Control y moderación de contenido",
        body: [
          "NorteWalk no edita ni modifica el texto de las opiniones escritas por los usuarios. Sin embargo, nos reservamos el derecho de retirar o rechazar la publicación de una reseña si viola alguna de las siguientes reglas de contenido:",
          "Infracciones graves: no se tolerarán comentarios que incluyan insultos, lenguaje vulgar, discursos de odio, discriminación de cualquier índole (racial, religiosa, de género, orientación sexual o nacionalidad), amenazas o difamaciones directas.",
          "Contenido irrelevante o spam: la opinión debe tratar estrictamente sobre la experiencia del tour, el itinerario o el desempeño del Guía. No se permiten comentarios sobre política, publicidad de otras agencias, enlaces externos (links) o números de teléfono.",
          "Conflicto de intereses (fraude): los Guías Habilitados no pueden autocalificarse, pedir a familiares o amigos cercanos que publiquen reseñas falsas, ni dejar opiniones negativas en los perfiles de otros guías competidores.",
          "Extorsión o coacción: no se permitirán opiniones donde el turista intente coaccionar al guía (por ejemplo, amenazar con poner una mala puntuación si no se le da un trato preferencial o dinero).",
        ],
      },
      {
        id: "replica",
        heading: "3. Derecho a réplica del guía",
        body: [
          "Cuando un Turista publica una reseña, el Guía afectado tiene derecho a enviar una única Respuesta del Guía. Esta respuesta se mostrará públicamente debajo del comentario original.",
          "Las respuestas de los guías están sujetas a las mismas normas de respeto, profesionalismo y educación detalladas en el punto anterior. El espacio de réplica debe usarse para aclarar malentendidos o explicar situaciones logísticas de manera constructiva, resguardando siempre la reputación de la comunidad turística local.",
        ],
      },
      {
        id: "disputas",
        heading: "4. Procedimiento en caso de disputas",
        body: [
          "Si un Guía considera que una reseña en su perfil es falsa, fraudulenta o viola los términos de esta política, puede solicitar su revisión enviando un correo a hola@nortewalk.com.ar con el asunto «Impugnación de Reseña», detallando el código de reserva y los motivos del reclamo.",
          "El equipo de moderación de NorteWalk investigará el caso analizando los canales de comunicación internos. La opinión solo será retirada si se demuestra de forma fehaciente el incumplimiento de las normativas aquí descritas. Las decisiones de moderación tomadas por NorteWalk para proteger la integridad de la comunidad serán definitivas.",
        ],
      },
    ],
  },
  en: {
    updated: UPDATED_EN,
    notice: NOTICE_EN,
    intro:
      "At NorteWalk we believe in transparency, honesty and the value of safe tourism. Our platform’s review system helps travelers choose the best experiences in Tucumán and rewards the professionalism of our Licensed Guides. To keep this system reliable and fair, all users must comply with this Reviews Policy.",
    sections: [
      {
        id: "quien",
        heading: "1. Who can leave a review?",
        body: [
          "To preserve the marketplace’s authenticity, only Travelers who made an effective booking through nortewalk.com.ar and whose attendance was confirmed may post reviews.",
          "Reviews from users who did not book through the website are not allowed. If a booking was canceled or the Traveler did not show up at the meeting point (No-Show), the system will disable the option to review that experience.",
        ],
      },
      {
        id: "moderacion",
        heading: "2. Content control and moderation",
        body: [
          "NorteWalk does not edit or modify the text of reviews written by users. However, we reserve the right to remove or reject a review if it breaks any of the following content rules:",
          "Serious violations: comments containing insults, vulgar language, hate speech, discrimination of any kind (racial, religious, gender, sexual orientation or nationality), threats or direct defamation will not be tolerated.",
          "Irrelevant content or spam: the review must be strictly about the tour experience, the itinerary or the Guide’s performance. Comments about politics, advertising for other agencies, external links or phone numbers are not allowed.",
          "Conflict of interest (fraud): Licensed Guides may not rate themselves, ask close family or friends to post fake reviews, or leave negative reviews on competing guides’ profiles.",
          "Extortion or coercion: reviews where the traveler tries to coerce the guide (for example, threatening a bad rating unless given preferential treatment or money) are not allowed.",
        ],
      },
      {
        id: "replica",
        heading: "3. The guide’s right to reply",
        body: [
          "When a Traveler posts a review, the affected Guide has the right to send a single Guide Reply. This reply is shown publicly below the original comment.",
          "Guide replies are subject to the same standards of respect, professionalism and courtesy set out above. The reply space must be used to clarify misunderstandings or explain logistical situations constructively, always safeguarding the reputation of the local tourism community.",
        ],
      },
      {
        id: "disputas",
        heading: "4. Dispute procedure",
        body: [
          "If a Guide believes that a review on their profile is false, fraudulent or breaches these terms, they may request a review by emailing hola@nortewalk.com.ar with the subject “Review Dispute”, detailing the booking code and the reasons for the claim.",
          "The NorteWalk moderation team will investigate the case by analyzing the internal communication channels. A review will only be removed if a breach of the rules described here is reliably proven. Moderation decisions made by NorteWalk to protect the community’s integrity are final.",
        ],
      },
    ],
  },
  pt: {
    updated: UPDATED_PT,
    notice: NOTICE_PT,
    intro:
      "Na NorteWalk acreditamos na transparência, na honestidade e no valor do turismo seguro. O sistema de opiniões e avaliações da nossa plataforma ajuda os viajantes a escolher as melhores experiências em Tucumán e premia o profissionalismo dos nossos Guias Credenciados. Para garantir que esse sistema seja confiável e justo, todos os usuários devem cumprir a presente Política de Avaliações.",
    sections: [
      {
        id: "quien",
        heading: "1. Quem pode deixar uma avaliação?",
        body: [
          "Para manter a autenticidade do marketplace, somente poderão publicar avaliações os Turistas que tenham feito uma reserva efetiva através de nortewalk.com.ar e cujo comparecimento ao tour tenha sido confirmado.",
          "Não são permitidas avaliações de usuários que não reservaram pelo site. Se uma reserva foi cancelada ou o Turista não compareceu ao ponto de encontro (No-Show), o sistema desabilitará a opção de deixar uma avaliação sobre essa experiência.",
        ],
      },
      {
        id: "moderacion",
        heading: "2. Controle e moderação de conteúdo",
        body: [
          "A NorteWalk não edita nem modifica o texto das avaliações escritas pelos usuários. No entanto, reservamo-nos o direito de retirar ou rejeitar a publicação de uma avaliação se ela violar alguma das seguintes regras de conteúdo:",
          "Infrações graves: não serão tolerados comentários que incluam insultos, linguagem vulgar, discursos de ódio, discriminação de qualquer índole (racial, religiosa, de gênero, orientação sexual ou nacionalidade), ameaças ou difamações diretas.",
          "Conteúdo irrelevante ou spam: a avaliação deve tratar estritamente da experiência do tour, do itinerário ou do desempenho do Guia. Não são permitidos comentários sobre política, publicidade de outras agências, links externos ou números de telefone.",
          "Conflito de interesses (fraude): os Guias Credenciados não podem se autoavaliar, pedir a familiares ou amigos próximos que publiquem avaliações falsas, nem deixar avaliações negativas nos perfis de outros guias concorrentes.",
          "Extorsão ou coação: não serão permitidas avaliações em que o turista tente coagir o guia (por exemplo, ameaçar dar uma nota baixa caso não receba tratamento preferencial ou dinheiro).",
        ],
      },
      {
        id: "replica",
        heading: "3. Direito de resposta do guia",
        body: [
          "Quando um Turista publica uma avaliação, o Guia afetado tem o direito de enviar uma única Resposta do Guia. Essa resposta será exibida publicamente abaixo do comentário original.",
          "As respostas dos guias estão sujeitas às mesmas normas de respeito, profissionalismo e educação detalhadas no ponto anterior. O espaço de resposta deve ser usado para esclarecer mal-entendidos ou explicar situações logísticas de maneira construtiva, resguardando sempre a reputação da comunidade turística local.",
        ],
      },
      {
        id: "disputas",
        heading: "4. Procedimento em caso de disputas",
        body: [
          "Se um Guia considerar que uma avaliação em seu perfil é falsa, fraudulenta ou viola os termos desta política, pode solicitar sua revisão enviando um e-mail para hola@nortewalk.com.ar com o assunto “Contestação de Avaliação”, detalhando o código de reserva e os motivos da reclamação.",
          "A equipe de moderação da NorteWalk investigará o caso analisando os canais de comunicação internos. A avaliação só será retirada se for comprovado de forma cabal o descumprimento das normas aqui descritas. As decisões de moderação tomadas pela NorteWalk para proteger a integridade da comunidade serão definitivas.",
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------
// Política de Contenido
// ---------------------------------------------------------------------

const CONTENT: Record<Locale, LegalDoc> = {
  es: {
    updated: UPDATED_ES,
    intro:
      "En NorteWalk trabajamos para ofrecer una vidriera digital de alta calidad, segura y respetuosa que ponga en valor el patrimonio de la Provincia de Tucumán. Esta Política de Contenido regula los requisitos y las restricciones aplicables a todo el material (títulos, descripciones de itinerarios, imágenes, biografías y perfiles) que los Guías Habilitados publiquen en nuestra plataforma.",
    sections: [
      {
        id: "calidad",
        heading: "1. Requisitos de calidad y veracidad",
        body: [
          "Veracidad histórica y cultural: las descripciones de los recorridos por el Centro Histórico, circuitos de naturaleza o experiencias gastronómicas deben basarse en datos verídicos, veraces y fidedignos. No se permite información distorsionada que confunda al viajero.",
          "Redacción clara y profesional: los textos deben estar correctamente redactados, sin faltas de ortografía graves, y mantener un tono cordial, entusiasta y hospitalario.",
          "Actualización del itinerario: el Guía es responsable de que el circuito publicado coincida de forma exacta con el recorrido que se realizará en la realidad. Si un punto de parada deja de estar disponible, el texto debe modificarse de inmediato.",
        ],
      },
      {
        id: "prohibido",
        heading: "2. Contenido prohibido y restricciones",
        body: [
          "Datos de contacto y desintermediación: no se permite la inclusión de números de teléfono, enlaces a páginas web externas, perfiles de redes sociales personales (Instagram, Facebook, etc.), correos electrónicos o cualquier otra forma de contacto directo en los campos públicos de descripción del tour o del perfil. Todo contacto legítimo se realiza de forma automática una vez efectuada la reserva en la plataforma, o con consentimiento expreso de NorteWalk.",
          "Lenguaje inapropiado o discriminatorio: está prohibido cualquier término vulgar, insulto, alusión política partidaria, discurso de odio o discriminación por motivos de género, raza, religión, nacionalidad u orientación sexual.",
          "Promoción de actividades ilegales o comerciales ajenas: no se permite promocionar servicios que no cuenten con las habilitaciones correspondientes (por ejemplo, transporte informal, ingresos a propiedades privadas sin autorización) ni comercializar productos de terceros ajenos a la experiencia del tour.",
        ],
      },
      {
        id: "propiedad",
        heading: "3. Propiedad intelectual e imágenes",
        body: [
          "Derechos de autor: las imágenes subidas por el Guía deben ser de su propiedad, contar con la autorización explícita del autor o provenir de bancos de imágenes gratuitos libres de derechos. NorteWalk no se hace responsable por reclamos de terceros derivados de imágenes robadas de internet por parte del Guía.",
          "Calidad visual: se rechazarán fotos borrosas, pixeladas, con marcas de agua de otras agencias, logos de la competencia o que no guarden relación directa con el circuito turístico de Tucumán ofrecido.",
        ],
      },
      {
        id: "moderacion",
        heading: "4. Moderación, edición y retirada",
        body: [
          "NorteWalk actúa como curador del marketplace. Nos reservamos el derecho de editar la redacción, corregir la ortografía o adaptar los títulos de los tours publicados para mejorar su posicionamiento orgánico (SEO) y su atractivo comercial, sin alterar la esencia del circuito.",
          "NorteWalk retirará de forma inmediata y sin previo aviso cualquier tour o perfil de Guía que infrinja las prohibiciones detalladas en esta política. Las reiteradas infracciones darán lugar a la suspensión definitiva de la cuenta del Guía en la plataforma.",
        ],
      },
    ],
  },
  en: {
    updated: UPDATED_EN,
    notice: NOTICE_EN,
    intro:
      "At NorteWalk we work to offer a high-quality, safe and respectful digital showcase that highlights the heritage of the Province of Tucumán. This Content Policy governs the requirements and restrictions applicable to all material (titles, itinerary descriptions, images, biographies and profiles) that Licensed Guides publish on our platform.",
    sections: [
      {
        id: "calidad",
        heading: "1. Quality and accuracy requirements",
        body: [
          "Historical and cultural accuracy: descriptions of tours through the Historic Center, nature circuits or gastronomic experiences must be based on truthful, accurate and reliable facts. Distorted information that confuses the traveler is not allowed.",
          "Clear and professional writing: texts must be properly written, free of serious spelling mistakes, and keep a cordial, enthusiastic and welcoming tone.",
          "Up-to-date itinerary: the Guide is responsible for ensuring the published circuit exactly matches the tour that will actually take place. If a stop is no longer available, the text must be updated immediately.",
        ],
      },
      {
        id: "prohibido",
        heading: "2. Prohibited content and restrictions",
        body: [
          "Contact details and disintermediation: phone numbers, links to external websites, personal social media profiles (Instagram, Facebook, etc.), emails or any other form of direct contact may not be included in the public description fields of the tour or profile. All legitimate contact happens automatically once the booking is made on the platform, or with NorteWalk’s express consent.",
          "Inappropriate or discriminatory language: any vulgar term, insult, partisan political reference, hate speech, or discrimination based on gender, race, religion, nationality or sexual orientation is prohibited.",
          "Promotion of illegal or third-party commercial activities: it is not allowed to promote services that lack the corresponding permits (e.g., informal transport, access to private property without authorization) or to sell third-party products unrelated to the tour experience.",
        ],
      },
      {
        id: "propiedad",
        heading: "3. Intellectual property and images",
        body: [
          "Copyright: images uploaded by the Guide must be their own property, have the author’s explicit authorization or come from free, royalty-free image banks. NorteWalk is not responsible for third-party claims arising from images stolen from the internet by the Guide.",
          "Visual quality: blurry or pixelated photos, photos with other agencies’ watermarks, competitor logos, or photos unrelated to the offered Tucumán tour circuit will be rejected.",
        ],
      },
      {
        id: "moderacion",
        heading: "4. Moderation, editing and removal",
        body: [
          "NorteWalk acts as the marketplace’s curator. We reserve the right to edit the wording, correct spelling or adapt the titles of published tours to improve their organic ranking (SEO) and commercial appeal, without altering the essence of the circuit.",
          "NorteWalk will immediately remove, without prior notice, any tour or Guide profile that breaches the prohibitions in this policy. Repeated violations will lead to permanent suspension of the Guide’s account on the platform.",
        ],
      },
    ],
  },
  pt: {
    updated: UPDATED_PT,
    notice: NOTICE_PT,
    intro:
      "Na NorteWalk trabalhamos para oferecer uma vitrine digital de alta qualidade, segura e respeitosa que valorize o patrimônio da Província de Tucumán. Esta Política de Conteúdo regula os requisitos e as restrições aplicáveis a todo o material (títulos, descrições de itinerários, imagens, biografias e perfis) que os Guias Credenciados publiquem em nossa plataforma.",
    sections: [
      {
        id: "calidad",
        heading: "1. Requisitos de qualidade e veracidade",
        body: [
          "Veracidade histórica e cultural: as descrições dos passeios pelo Centro Histórico, circuitos de natureza ou experiências gastronômicas devem basear-se em dados verídicos, verazes e fidedignos. Não é permitida informação distorcida que confunda o viajante.",
          "Redação clara e profissional: os textos devem estar corretamente redigidos, sem erros graves de ortografia, e manter um tom cordial, entusiasta e hospitaleiro.",
          "Atualização do itinerário: o Guia é responsável por garantir que o circuito publicado coincida exatamente com o passeio que será realizado na realidade. Se um ponto de parada deixar de estar disponível, o texto deve ser modificado imediatamente.",
        ],
      },
      {
        id: "prohibido",
        heading: "2. Conteúdo proibido e restrições",
        body: [
          "Dados de contato e desintermediação: não é permitida a inclusão de números de telefone, links para páginas web externas, perfis de redes sociais pessoais (Instagram, Facebook, etc.), e-mails ou qualquer outra forma de contato direto nos campos públicos de descrição do tour ou do perfil. Todo contato legítimo é feito de forma automática uma vez efetuada a reserva na plataforma, ou com consentimento expresso da NorteWalk.",
          "Linguagem inadequada ou discriminatória: é proibido qualquer termo vulgar, insulto, alusão político-partidária, discurso de ódio ou discriminação por motivos de gênero, raça, religião, nacionalidade ou orientação sexual.",
          "Promoção de atividades ilegais ou comerciais alheias: não é permitido promover serviços que não contem com as habilitações correspondentes (por exemplo, transporte informal, acesso a propriedades privadas sem autorização) nem comercializar produtos de terceiros alheios à experiência do tour.",
        ],
      },
      {
        id: "propiedad",
        heading: "3. Propriedade intelectual e imagens",
        body: [
          "Direitos autorais: as imagens enviadas pelo Guia devem ser de sua propriedade, contar com a autorização explícita do autor ou provir de bancos de imagens gratuitos livres de direitos. A NorteWalk não se responsabiliza por reclamações de terceiros derivadas de imagens roubadas da internet pelo Guia.",
          "Qualidade visual: serão rejeitadas fotos borradas, pixeladas, com marcas d’água de outras agências, logos da concorrência ou que não guardem relação direta com o circuito turístico de Tucumán oferecido.",
        ],
      },
      {
        id: "moderacion",
        heading: "4. Moderação, edição e remoção",
        body: [
          "A NorteWalk atua como curadora do marketplace. Reservamo-nos o direito de editar a redação, corrigir a ortografia ou adaptar os títulos dos tours publicados para melhorar seu posicionamento orgânico (SEO) e seu apelo comercial, sem alterar a essência do circuito.",
          "A NorteWalk retirará de forma imediata e sem aviso prévio qualquer tour ou perfil de Guia que infrinja as proibições detalhadas nesta política. As reiteradas infrações darão lugar à suspensão definitiva da conta do Guia na plataforma.",
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------
// Política de Cancelación y Asistencia
// ---------------------------------------------------------------------

const CANCELLATION: Record<Locale, LegalDoc> = {
  es: {
    updated: UPDATED_ES,
    intro:
      "En NorteWalk buscamos asegurar experiencias confiables, seguras y de alta calidad en Tucumán. Para que el sistema funcione de manera justa tanto para los viajeros como para los Guías Habilitados (quienes preparan sus itinerarios y reservan su tiempo), disponemos de la siguiente Política de Cancelación y Asistencia de cumplimiento obligatorio.",
    sections: [
      {
        id: "turista",
        heading: "1. Reglas para el turista",
        body: [
          "Nuestras experiencias y Free Walking Tours son de reserva gratuita y plazas limitadas. Si reservás un cupo y no asistís, estás privando a otro viajero de conocer Tucumán.",
          "Cancelación anticipada: si por cualquier motivo no podés asistir al tour, tenés la obligación de cancelar tu reserva con un mínimo de 3 horas de antelación al inicio del recorrido. Podés hacerlo de forma simple a través del enlace de cancelación incluido en tu correo de confirmación o notificando al Guía por los canales provistos.",
          "Incumplimiento de asistencia (No-Show): si no te presentás en el punto de encuentro ni cancelás tu reserva con la anticipación mínima requerida, se registrará un No-Show en tu perfil de usuario.",
          "Penalización: la acumulación de tres (3) No-Shows injustificados resultará en la suspensión automática de tu cuenta en NorteWalk, impidiéndote realizar futuras reservas en la plataforma.",
        ],
      },
      {
        id: "guia",
        heading: "2. Reglas para el guía habilitado",
        body: [
          "La confiabilidad del Guía es el pilar de NorteWalk. Una cancelación injustificada del Guía daña la reputación de toda la comunidad local.",
          "Ventana de cancelación mínima: el Guía solo podrá cancelar un tour programado con un mínimo de 24 horas de antelación, debiendo el sistema notificar inmediatamente a todos los turistas reservados por correo electrónico o WhatsApp.",
          "Emergencias personales (fuerza mayor): si el Guía sufre un imprevisto grave de fuerza mayor (problemas de salud de urgencia, accidentes o situaciones familiares graves) dentro de las 24 horas previas al tour, deberá comunicarlo de inmediato a la administración de NorteWalk a través de hola@nortewalk.com.ar o el canal interno de soporte, adjuntando la justificación si correspondiera. El Guía deberá, en la medida de lo posible, contactar a los turistas reservados para avisar del inconveniente por cortesía profesional.",
          "Penalizaciones por cancelación tardía: las cancelaciones recurrentes o injustificadas por parte del Guía afectarán directamente su posicionamiento orgánico en el listado de búsquedas de la plataforma (bajarán en los resultados) o podrán derivar en la suspensión temporal o definitiva de su perfil en NorteWalk.",
        ],
      },
      {
        id: "clima",
        heading: "3. Cancelaciones por clima extremo",
        body: [
          "Tucumán cuenta con alertas meteorológicas o condiciones climáticas particulares (lluvias torrenciales de verano, calor extremo, etc.).",
          "Regla general: los tours se realizan normalmente bajo lluvia leve o clima nublado, quedando a criterio del Turista llevar paraguas o piloto.",
          "Cancelación oficial por clima: si rige una alerta meteorológica oficial emitida por el Servicio Meteorológico Nacional (SMN) que ponga en riesgo la seguridad física de las personas en la vía pública o senderos, tanto el Guía como NorteWalk podrán cancelar la actividad en cualquier momento sin penalización alguna. Se priorizará siempre la integridad del grupo.",
        ],
      },
      {
        id: "cupo",
        heading: "4. Política de cupo mínimo",
        body: [
          "Ciertos tours especializados o de libre pago pueden requerir un número mínimo de asistentes (por ejemplo, un mínimo de 3 personas) para llevarse a cabo.",
          "Si no se alcanza el cupo mínimo, el Guía tiene derecho a cancelar el tour avisando a los usuarios registrados con un mínimo de 4 horas de anticipación. De no dar aviso en ese plazo, el Guía tiene la obligación ética de presentarse y realizar el recorrido para los turistas que asistieron.",
        ],
      },
    ],
  },
  en: {
    updated: UPDATED_EN,
    notice: NOTICE_EN,
    intro:
      "At NorteWalk we aim to ensure reliable, safe and high-quality experiences in Tucumán. So the system works fairly for both travelers and Licensed Guides (who prepare their itineraries and set aside their time), we have the following mandatory Cancellation and Attendance Policy.",
    sections: [
      {
        id: "turista",
        heading: "1. Rules for the traveler",
        body: [
          "Our experiences and Free Walking Tours have free booking and limited spots. If you book a spot and don’t show up, you are depriving another traveler of getting to know Tucumán.",
          "Early cancellation: if for any reason you cannot attend the tour, you are required to cancel your booking at least 3 hours before the tour starts. You can do this easily through the cancellation link in your confirmation email or by notifying the Guide through the provided channels.",
          "Failure to attend (No-Show): if you do not show up at the meeting point nor cancel your booking with the minimum required notice, a No-Show will be recorded on your user profile.",
          "Penalty: accumulating three (3) unjustified No-Shows will result in the automatic suspension of your NorteWalk account, preventing you from making future bookings on the platform.",
        ],
      },
      {
        id: "guia",
        heading: "2. Rules for the licensed guide",
        body: [
          "The Guide’s reliability is the cornerstone of NorteWalk. An unjustified cancellation by the Guide harms the reputation of the entire local community.",
          "Minimum cancellation window: the Guide may only cancel a scheduled tour at least 24 hours in advance, and the system must immediately notify all booked travelers by email or WhatsApp.",
          "Personal emergencies (force majeure): if the Guide suffers a serious unforeseen force-majeure event (urgent health problems, accidents or serious family situations) within the 24 hours before the tour, they must immediately notify NorteWalk administration via hola@nortewalk.com.ar or the internal support channel, attaching justification where applicable. The Guide must, as far as possible, contact the booked travelers to advise of the issue as a professional courtesy.",
          "Penalties for late cancellation: recurring or unjustified cancellations by the Guide will directly affect their organic ranking in the platform’s search listings (they will drop in results) or may lead to the temporary or permanent suspension of their profile on NorteWalk.",
        ],
      },
      {
        id: "clima",
        heading: "3. Cancellations due to extreme weather",
        body: [
          "Tucumán has weather alerts or particular climate conditions (torrential summer rains, extreme heat, etc.).",
          "General rule: tours run normally under light rain or cloudy weather, and it is up to the Traveler to bring an umbrella or raincoat.",
          "Official weather cancellation: if an official weather alert issued by the National Weather Service (SMN) is in effect that endangers people’s physical safety on public roads or trails, both the Guide and NorteWalk may cancel the activity at any time without any penalty. The group’s safety always takes priority.",
        ],
      },
      {
        id: "cupo",
        heading: "4. Minimum group policy",
        body: [
          "Certain specialized or tip-based tours may require a minimum number of attendees (for example, a minimum of 3 people) to take place.",
          "If the minimum group size is not reached, the Guide has the right to cancel the tour by notifying registered users at least 4 hours in advance. If they fail to give notice within that period, the Guide has the ethical obligation to show up and run the tour for the travelers who attended.",
        ],
      },
    ],
  },
  pt: {
    updated: UPDATED_PT,
    notice: NOTICE_PT,
    intro:
      "Na NorteWalk buscamos assegurar experiências confiáveis, seguras e de alta qualidade em Tucumán. Para que o sistema funcione de maneira justa tanto para os viajantes quanto para os Guias Credenciados (que preparam seus itinerários e reservam seu tempo), dispomos da seguinte Política de Cancelamento e Comparecimento de cumprimento obrigatório.",
    sections: [
      {
        id: "turista",
        heading: "1. Regras para o turista",
        body: [
          "Nossas experiências e Free Walking Tours têm reserva gratuita e vagas limitadas. Se você reserva uma vaga e não comparece, está privando outro viajante de conhecer Tucumán.",
          "Cancelamento antecipado: se por qualquer motivo você não puder comparecer ao tour, tem a obrigação de cancelar sua reserva com no mínimo 3 horas de antecedência em relação ao início do passeio. Você pode fazê-lo de forma simples através do link de cancelamento incluído no seu e-mail de confirmação ou avisando o Guia pelos canais fornecidos.",
          "Não comparecimento (No-Show): se você não se apresentar no ponto de encontro nem cancelar sua reserva com a antecedência mínima exigida, será registrado um No-Show no seu perfil de usuário.",
          "Penalização: o acúmulo de três (3) No-Shows injustificados resultará na suspensão automática da sua conta na NorteWalk, impedindo você de fazer futuras reservas na plataforma.",
        ],
      },
      {
        id: "guia",
        heading: "2. Regras para o guia credenciado",
        body: [
          "A confiabilidade do Guia é o pilar da NorteWalk. Um cancelamento injustificado do Guia prejudica a reputação de toda a comunidade local.",
          "Janela mínima de cancelamento: o Guia só poderá cancelar um tour programado com no mínimo 24 horas de antecedência, devendo o sistema notificar imediatamente todos os turistas reservados por e-mail ou WhatsApp.",
          "Emergências pessoais (força maior): se o Guia sofrer um imprevisto grave de força maior (problemas de saúde de urgência, acidentes ou situações familiares graves) dentro das 24 horas anteriores ao tour, deverá comunicá-lo imediatamente à administração da NorteWalk através de hola@nortewalk.com.ar ou do canal interno de suporte, anexando a justificativa se for o caso. O Guia deverá, na medida do possível, contatar os turistas reservados para avisar do inconveniente por cortesia profissional.",
          "Penalidades por cancelamento tardio: os cancelamentos recorrentes ou injustificados por parte do Guia afetarão diretamente seu posicionamento orgânico na lista de buscas da plataforma (cairão nos resultados) ou poderão derivar na suspensão temporária ou definitiva de seu perfil na NorteWalk.",
        ],
      },
      {
        id: "clima",
        heading: "3. Cancelamentos por clima extremo",
        body: [
          "Tucumán conta com alertas meteorológicos ou condições climáticas particulares (chuvas torrenciais de verão, calor extremo, etc.).",
          "Regra geral: os tours são realizados normalmente sob chuva leve ou clima nublado, ficando a critério do Turista levar guarda-chuva ou capa de chuva.",
          "Cancelamento oficial por clima: se vigorar um alerta meteorológico oficial emitido pelo Serviço Meteorológico Nacional (SMN) que coloque em risco a segurança física das pessoas na via pública ou em trilhas, tanto o Guia quanto a NorteWalk poderão cancelar a atividade a qualquer momento sem nenhuma penalização. A integridade do grupo será sempre priorizada.",
        ],
      },
      {
        id: "cupo",
        heading: "4. Política de número mínimo",
        body: [
          "Certos tours especializados ou a gorjeta podem exigir um número mínimo de participantes (por exemplo, um mínimo de 3 pessoas) para acontecer.",
          "Se o número mínimo não for atingido, o Guia tem o direito de cancelar o tour avisando os usuários cadastrados com no mínimo 4 horas de antecedência. Caso não avise nesse prazo, o Guia tem a obrigação ética de comparecer e realizar o passeio para os turistas que compareceram.",
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

export function getReviews(locale: Locale): LegalDoc {
  return REVIEWS[locale] ?? REVIEWS.es;
}

export function getContentPolicy(locale: Locale): LegalDoc {
  return CONTENT[locale] ?? CONTENT.es;
}

export function getCancellation(locale: Locale): LegalDoc {
  return CANCELLATION[locale] ?? CANCELLATION.es;
}
