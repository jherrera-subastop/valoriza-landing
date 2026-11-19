"use client";

/**
 * Landing «Valoriza» (nueva, 16/11/2026 · v2). Vive dentro del shell del Index (HomeIndexRebase): mismo Header,
 * Sidebar, SidebarMobile, lienzo de 1024 y CSS module; solo cambia el contenido de la columna principal.
 * Reutiliza del Index: el botón de vidrio (GLASS_CSS), Button de Concorde, íconos Vidrio
 * y tokens del hero (.hp). Copy y pantallas reales: campaña «Valoriza y Vende» (correos).
 * Regla de color: los naranjas salen SOLO de la escala del DS (--vmc-color-orange-*): orange-600 (#ED8936) sobre fondo claro,
 * orange-400 (#FBC47D) sobre fondo oscuro. Nada de duraznos ni naranjas inventados.
 * Regla Stage 1: la valorización es un valor REFERENCIAL con fecha, nunca un precio fijo de venta.
 * Sin backend: los CTA llevan al prototipo de valorización/publicación ya integrado (datos simulados).
 *
 * v3 (17/11, comentario de Julio): estructura de landing-subascars. Hero bajo + franja de vidrio, ¿Cómo funciona?,
 * beneficio, lo que debes saber, «Vende tu vehículo» del Index, preguntas frecuentes y Centro de Ayuda.
 */
import WhatsappOriginalBanner from "./WhatsappOriginalBanner";
import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";

import { Button, Header, Sidebar, SidebarMenuButton, SidebarMobile } from "@/src/product/index/adapter";
import shell from "@/src/product/index/view/HomeIndexRebase.module.css";
import { GLASS_CSS } from "@/src/product/index/view/glass";
import { Vidrio, type Sec } from "@/src/product/index/view/Vidrio";
import { VMC_EXAMPLE } from "./vmc-example-2026-11-19";

import { LIGHT, Projection, Season, type RData } from "@/src/product/mi-garaje/models/Resultado";

const VALUAR = "/producto/mi-garaje/m/vmc-valuar";
const IMG = "/correos/campana-valoriza";

// Ejemplo ilustrativo aprobado por Julio para concordar con el video.
// Estimación referencial, no una oferta comercial.
const SAMPLE_MARKET = VMC_EXAMPLE.market;
const SAMPLE_FORWARD = VMC_EXAMPLE.curve.map(({ month, value }) => ({ v: value, label: [0, 1, 3, 6, 12].includes(month) ? (month === 0 ? "Hoy" : `${month}M`) : null, full: month === 0 ? "Hoy" : `${month}M`, date: new Date(2026, 10, 19 + Math.round(month * 30)) }));
const SAMPLE_PROJECTION = SAMPLE_FORWARD.map((p) => ({ v: p.v, full: p.full, f: 0 }));
const SAMPLE_MILESTONES = [1, 3, 6, 12].map((month) => ({ month, value: SAMPLE_FORWARD.find((p: { label: string | null; v: number }) => p.label === `${month}M`)?.v ?? SAMPLE_MARKET }));
const SAMPLE_GRAPH = {
  market: SAMPLE_MARKET,
  proj: SAMPLE_PROJECTION,
  pf: SAMPLE_FORWARD,
  now: 11,
  season: VMC_EXAMPLE.season.map((f, index) => ({m:index+1,name:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][index],f})),
} as RData;
const usd = (value: number) => `US$ ${Math.round(value).toLocaleString("en-US")}`;

// Conocimiento AVT: ver ./AVT.md (contrato relevado del código de avt-ai y del lab de VMC-Laptop).
// Estructura: la de landing-subascars (Julio y Fernando, 17/11). Comercial + informativa: hero y franja de vidrio,
// cómo funciona, qué esperar del servicio, lo que debes saber, banner de venta, FAQ y Centro de Ayuda.
const STEPS: { icon: Sec; label: string }[] = [
  {
    "icon": "auto",
    "label": "Ingresa los datos de tu carro"
  },
  {
    "icon": "docs",
    "label": "Agrega detalles de su estado"
  },
  {
    "icon": "valorizaciones",
    "label": "Conoce su valor y proyección"
  },
  {
    "icon": "publicar",
    "label": "Guarda o decide publicar"
  }
];

const PERKS: { icon: Sec; title: string; text: string }[] = [
  {
    "icon": "verificado",
    "title": "Gratis",
    "text": "Sin compromiso de venta"
  },
  {
    "icon": "fecha",
    "title": "Valor actual",
    "text": "Una referencia para decidir"
  },
  {
    "icon": "docs",
    "title": "Hasta 12 meses",
    "text": "De proyección estimada"
  }
];

// Qué esperar del servicio: lo que trae el resultado de AVT (público en el contrato, ver AVT.md).
const EXPECT: { icon: Sec; title: string; text: string }[] = [
  {
    "icon": "valorizaciones",
    "title": "Valor estimado hoy",
    "text": "Conoce una referencia del valor de tu carro a la fecha de la consulta."
  },
  {
    "icon": "crecimiento",
    "title": "Su valor en el tiempo",
    "text": "Explora cómo podría cambiar su valor en 1, 3, 6 y 12 meses."
  },
  {
    "icon": "auto",
    "title": "Decide con más información",
    "text": "Usa el valor actual y su proyección como referencia para evaluar cuándo vender."
  },
  {
    "icon": "fecha",
    "title": "Tu valorización en Mi Garaje",
    "text": "Guarda el resultado para consultarlo después y decidir si quieres publicar tu carro."
  }
];

const USES = [
  {
    "img": "vender.jpg",
    "title": "¿Estás pensando en vender?",
    "text": "Ten una referencia de valor antes de definir cuánto pedir."
  },
  {
    "img": "comprar.jpg",
    "title": "¿Estás buscando un carro?",
    "text": "Consulta su valor estimado antes de hacer una propuesta."
  }
];

// «Lo que debes saber» (equivale a la tarjeta de Subascars). Fórmula de AVT en lenguaje llano, sin cifras internas.
const KNOW = [
  "El cálculo parte del precio de referencia del modelo o la versión cuando era nuevo.",
  "Considera la antigüedad, el kilometraje y los ajustes estacionales del modelo.",
  "Los datos de estado, historial y equipamiento ayudan a ajustar el resultado.",
  "Recibes un valor referencial con fecha para orientar tu decisión. El precio final de venta puede variar."
];

const FAQ: [string, string][] = [
  [
    "¿Qué puedo conocer con AVT?",
    "AVT te muestra una estimación del valor actual de tu carro y cómo podría evolucionar en 1, 3, 6 y 12 meses. Esa información te ayuda a evaluar si vender ahora o más adelante."
  ],
  [
    "¿Cuánto cuesta valorizar mi carro?",
    "La valorización es gratis y puedes consultarla sin compromiso de venta."
  ],
  [
    "¿Qué datos necesito?",
    "Ingresa la marca, el año, el modelo y el kilometraje de tu carro. Cuando corresponda, selecciona la versión. Después puedes agregar detalles de su estado, historial y equipamiento."
  ],
  [
    "¿Tengo que completar todos los detalles?",
    "Los detalles adicionales son opcionales. Puedes continuar con los datos principales o completar más información para ajustar la estimación a las características de tu carro."
  ],
  [
    "¿Puedo saber cuánto podría valer mi carro en seis meses?",
    "Sí. La proyección incluye una estimación a seis meses, además de referencias a 1, 3 y 12 meses. Son valores estimados que pueden cambiar según las condiciones del carro y del mercado."
  ],
  [
    "¿AVT me ayuda a decidir cuándo vender?",
    "Puedes comparar el valor actual con su proyección para evaluar cuándo te conviene vender. Tómalo como una referencia y considera también el estado de tu carro y tus necesidades."
  ],
  [
    "¿El valor estimado es el precio que recibiré al vender?",
    "Es una referencia para orientar tu decisión, no una oferta de compra ni un precio garantizado. El precio final puede variar según el estado del carro, su documentación y las condiciones del mercado."
  ],
  [
    "¿Tengo que publicar mi carro después de valorizarlo?",
    "Tú decides. Puedes consultar su valor, guardar la valorización o continuar con la publicación cuando quieras vender."
  ],
  [
    "¿Qué hago si mi modelo no aparece?",
    "Selecciona “Mi modelo no aparece”, ingresa sus datos e indica su precio de lista cuando era nuevo."
  ],
  [
    "¿Dónde puedo volver a consultar mi valorización?",
    "Guarda el resultado en Mi Garaje para revisarlo después y decidir si quieres continuar con la publicación."
  ]
];

// Contenido: un solo componente para escritorio y móvil (el shell lo monta en ambos lienzos).
function ValorizaBody({ id }: { id: "d" | "m" }): JSX.Element {
  const router = useRouter();
  const valuar = () => router.push(VALUAR);
  const publicar = () => router.push("/producto/mi-garaje/m/vmc-publica");
  const hero = useRef<HTMLElement>(null);
  const close = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);
  // CTA fijo del móvil: visible entre el hero y el banner final (un observer, sin scroll handler).
  useEffect(() => {
    const el = hero.current, end = close.current;
    if (!el || !end) return;
    const seen = new Map<Element, IntersectionObserverEntry>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => seen.set(e.target, e));
      const h = seen.get(el), c = seen.get(end);
      setPastHero(!!h && !h.isIntersecting && h.boundingClientRect.top < 0 && !(c?.isIntersecting));
    });
    io.observe(el); io.observe(end);
    return () => io.disconnect();
  }, []);
  // El shell monta el contenido dos veces (escritorio y móvil); se desplaza al bloque visible, sin ids duplicados.
  const toSteps = () => {
    const el = [...document.querySelectorAll<HTMLElement>("[data-vz='pasos']")].find((n) => n.offsetParent !== null);
    el?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="vz">
      {/* ── Hero ── */}
      <section className="vz-hero" ref={hero} aria-label="Valoriza tu carro">
        <div className="vz-hero__photo">
          <picture>
            <source media="(max-width: 1023px)" srcSet="/producto/index/banners/vmc/valoriza-hero-mobile.jpg" />
            <img src="/producto/index/banners/vmc/valoriza-hero-desktop.jpg" alt="Hombre consulta la valorización de su carro seminuevo desde su celular" fetchPriority="high" />
          </picture>
        </div>
        <div className="vz-hero__copy">
          <h1>¿Sabes cuánto vale <em>tu carro hoy?</em></h1>
          <p>Consulta gratis su valor estimado y cómo podría cambiar.<br />¡Tú decides cuándo vender!</p>
          <div className="vz-hero__actions">
            <Button variant="primary" onClick={valuar}>¡Valoriza ahora!</Button>
          </div>
        </div>
      </section>
      <div className="vz-proof">
        <p className="vz-proof__brand"><strong>Valorizador AVT</strong><span>Tu carro. Su valor. Tu decisión.</span></p>
        <ul aria-label="Condiciones de la valorización">
          {PERKS.map((p) => (
            <li key={p.title}><Vidrio s={p.icon} size={32} /><div><strong>{p.title}</strong><span>{p.text}</span></div></li>
          ))}
        </ul>
      </div>

      {/* ── ¿Cómo funciona? (fila de pasos como en Subascars) ── */}
      <section className="vz-card vz-steps" data-vz="pasos" aria-label="Cómo funciona">
        <p className="vz-label">¿Cómo funciona?</p>
        <ol>
          {STEPS.map((s, i) => (
            <li key={s.label}><Vidrio s={s.icon} size={36} /><span><small>Paso {i + 1}</small>{s.label}</span></li>
          ))}
        </ol>
      </section>

      {/* ── Beneficio (como «Un solo pago, hasta que lo vendas») ── */}
      <section className="vz-card vz-center" aria-label="Por qué valorizar">
        <div className="vz-center__block">
          <p className="vz-pill"><span>¿Qué es AVT?</span></p>
          <h2 className="vz-title" style={{ fontSize: "clamp(18px, 5vw, 33px)", maxWidth: "100%" }}>Conocer su valor es el inicio<br /><span>Elegir el momento hace la diferencia</span></h2>
          <p className="vz-lead" style={{ maxWidth: "100%" }}>Conoce su valor estimado hoy y descubre cómo podría cambiar en los próximos meses. La<br />información que necesitas para ver una buena oportunidad y decidir tu próximo movimiento.</p>
          <dl className="vz-stats">
            <div><dt>Hoy</dt><dd>Valor estimado de tu carro</dd></div>
            <div><dt>Hasta 12 meses</dt><dd>Proyección de su valor</dd></div>
          </dl>
          <div className="vz-know">
            <article className="vz-know__card">
              <header><small>¿Cómo funciona</small>nuestro valorizador AVT?</header>
              <div>
                <p className="vz-label">Lo que debes saber</p>
                <ul>{KNOW.map((k) => <li key={k}>{k}</li>)}</ul>
              </div>
            </article>
            <div className="vz-know__video"><video controls playsInline preload="metadata" aria-label="Video explicativo de Valoriza" width={720} height={1280}><source src="/producto/valoriza/valoriza-explicacion.mp4" type="video/mp4" />Tu navegador no admite la reproducción de este video.</video></div>
          </div>
          <Button variant="primary" onClick={valuar}>¡Valoriza con AVT aquí!</Button>
        </div>

        {/* ── Qué esperar del servicio ── */}
        <div className="vz-center__block">
          <p className="vz-pill"><span>¿Por qué me conviene valorizar con AVT?</span></p>
          <h2 className="vz-title">Esta es la ventaja que obtendrás <span>al valorizar con AVT</span></h2>
          <div className="vz-demo" aria-label="Ejemplo de resultados de una valorización AVT">
            <article className="vz-demo__value">
              <img className="vz-demo__car" src="/producto/valoriza/toyota-rav4-card-v3.png" alt="Toyota RAV4 2020 seminueva de ejemplo" width={1024} height={1536} loading="lazy" />
              <span className="vz-demo__tag">Ejemplo</span>
              <div className="vz-demo__content">
                <p>{VMC_EXAMPLE.vehicle}</p>
                <small>Valor de mercado hoy</small>
                <strong>{usd(SAMPLE_MARKET)}</strong>
                <p>Rango estimado: {usd(VMC_EXAMPLE.range[0])} – {usd(VMC_EXAMPLE.range[1])}.</p>
              </div>
            </article>
            <article className="vz-demo__chart">
              <header><h3>Proyección de valor</h3><p>Proyección referencial a 12 meses: {usd(SAMPLE_MILESTONES[3].value)} · {((SAMPLE_MILESTONES[3].value / SAMPLE_MARKET - 1) * 100).toFixed(1)}%</p></header>
              <Projection milestoneMonths={VMC_EXAMPLE.curve.map((p) => p.month)} d={SAMPLE_GRAPH} t={LIGHT} gid={`vz-projection-${id}`} ds fluid />
              <dl>{SAMPLE_MILESTONES.map(({ month, value }) => <div key={month}><dt>{month === 12 ? "12 meses" : `${month} ${month === 1 ? "mes" : "meses"}`}</dt><dd>{usd(value)}</dd></div>)}</dl>
            </article>
          </div>
          <div className="vz-more" aria-label="Señales y comparables de ejemplo">
            <article className="vz-more__card">
              <header><h3>Señal de venta</h3><p>{VMC_EXAMPLE.signal.sublabel}</p></header>
              <div className="vz-signal" role="img" aria-label={`Señal de venta: ${VMC_EXAMPLE.signal.label}, ${VMC_EXAMPLE.signal.level} de 5`}>
                <span aria-hidden>{[1,2,3,4,5].map(n => <i key={n} data-on={n <= VMC_EXAMPLE.signal.level || undefined} />)}</span>
                <b>{VMC_EXAMPLE.signal.label}</b>
              </div>
              <p className="vz-more__hint">Próximo pico: <b>{VMC_EXAMPLE.timing.nextPeakMonth} (+{VMC_EXAMPLE.timing.peakPercent}%)</b></p>
            </article>
            <article className="vz-more__card vz-more__wide">
              <header><h3>Momento óptimo de venta</h3><p>Demanda en noviembre: -5.08%. Mejores meses: Enero, Febrero y Septiembre.</p></header>
              <div className="vz-season"><p>Próximo pico · +13.1%</p><Season d={SAMPLE_GRAPH} t={LIGHT} ds fluid /></div>
            </article>
            <article className="vz-next" aria-label="Publica tu carro">
              <img src="/producto-assets/mi-garaje/banners/personaje/01-auto-h.jpg" alt="" loading="lazy" />
              <div className="vz-next__copy"><h3>¡Tu eliges el <em>próximo paso!</em></h3><p>Guarda tu valorización o continúa con la publicación de tu carro cuando decidas vender.</p><Button variant="primary" className="vz-next__cta" onClick={publicar}>¡Publica tu carro!</Button></div>
            </article>
          </div>
          <ul className="vz-expect">
            {EXPECT.map((e) => <li key={e.title}><Vidrio s={e.icon} size={40} /><h3>{e.title}</h3><p>{e.text}</p></li>)}
          </ul>
        </div>


      </section>

      {/* ── Banner comercial (lugar del banner de WhatsApp de Subascars) + franja de vidrio con los dos usos,
             mismo patrón que hero + franja. Un solo CTA principal; las opciones son enlaces secundarios. ── */}
      <WhatsappOriginalBanner />

      {/* ── Preguntas frecuentes ── */}
      <section className="vz-card vz-faq" aria-label="Preguntas frecuentes">
        <h2 className="vz-title">Preguntas frecuentes</h2>
        {/* name compartido: acordeón exclusivo nativo; un grupo por copia escritorio/móvil. */}
        <div className="vz-faq__list">
          {FAQ.map(([q, a], i) => (
            <details key={q} name={`vz-faq-${id}`}>
              <summary><span>{i + 1}. {q}</span><i aria-hidden /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        {/* Datos estructurados FAQPage: ayudan a buscadores y respuestas de IA a citar el contenido. */}
        {id === "d" ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }) }} /> : null}
      </section>

      {/* ── Centro de Ayuda (banner final, como en Subascars) ── */}
      <section className="vz-help" ref={close} aria-label="Centro de Ayuda">
        <div><h2><span className="vz-help__mobile">Centro<br />de Ayuda</span><span className="vz-help__desktop">Centro de Ayuda</span></h2><p>Respuestas rápidas a todas tus dudas</p></div>
        <a className="hib-glass" href="https://www.vmcsubastas.com/centro-de-ayuda">Ir al Centro de Ayuda</a>
      </section>

      {/* CTA fijo inferior (solo móvil). */}
      <div className="vz-dock" data-on={pastHero || undefined} aria-hidden={!pastHero}>
        <Button variant="primary" onClick={valuar} tabIndex={pastHero ? 0 : -1}>Conocer el valor de mi carro</Button>
      </div>
      <style>{GLASS_CSS + VZ_CSS}</style>
    </div>
  );
}

const VZ_CSS = `
.vz { --ink: #191C1C; --muted: #6B6878; --v900: #1C0B4F; --v800: #2E0F70; --v700: #3B1782; --v500: #8460E5; --lav: #F5F0FF; --line: #ECE6FB; --peach: var(--vmc-color-orange-400, #FBC47D); --orange: var(--vmc-color-orange-600, #ED8936);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%; padding: 16px 16px 64px; box-sizing: border-box; display: grid; gap: 16px; background: #fff; font-family: var(--vmc-font-display); color: var(--ink); }
.vz *, .vz *::before, .vz *::after { box-sizing: border-box; }
.vz ::selection { background: #E8DDFF; color: #22005C; }
.vz h1, .vz h2, .vz h3 { text-wrap: balance; }
.vz em { font-style: normal; }

/* Hero: anatomía .hp del Index, bajo (como el banner de Subascars, un poco más alto por la franja). */
.vz-hero { position: relative; isolation: isolate; height: 320px; overflow: hidden; border-radius: 20px; color: #fff; background: var(--v800);
  box-shadow: 0 24px 48px -28px rgba(34,0,92,0.55); }
.vz-hero__photo { position: absolute; top: 0; right: 0; bottom: 0; width: 62%;
  background: linear-gradient(90deg, #3C147C 0%, #7A297F 55%, #E97643 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 34%); mask-image: linear-gradient(90deg, transparent 0%, #000 34%); }
.vz-hero__photo picture { display: block; width: 100%; height: 100%; }
.vz-hero__photo img { width: 100%; height: 100%; object-fit: cover; object-position: 30% 40%; display: block; }
.vz-hero::after { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: radial-gradient(60% 80% at 0% 100%, rgba(237,137,54,0.28), transparent 60%); }
.vz-hero__copy { position: absolute; top: 0; bottom: 36px; left: 36px; width: 57%; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 14px; }
.vz-hero h1 { margin: 0; max-width: 19ch; font-size: clamp(34px, 4.2vw, 44px); line-height: 1.04; font-weight: 800; letter-spacing: -0.035em; }
.vz-hero h1 em { color: var(--vmc-color-orange-600, #ED8936); }
.vz-hero p { margin: 0; max-width: 100%; font-size: 14px; line-height: 21px; font-weight: 500; color: #E8DDFF; }
.vz-hero__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.vz-hero__actions .pvbtn { height: 44px; padding-inline: 28px; font-size: 14px; white-space: nowrap; }
.vz-hero__actions .hib-glass { height: 44px; padding-inline: 22px; }

/* Franja de vidrio montada sobre el borde del hero (como «Formato de publicación» en Subascars). */
.vz-proof { position: relative; z-index: 2; display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 8px; margin: -52px 28px 0; padding: 12px 8px 12px 20px;
  border-radius: 16px; border: 1px solid rgba(255,255,255,0.9); background: rgba(255,255,255,0.82);
  -webkit-backdrop-filter: blur(16px) saturate(150%); backdrop-filter: blur(16px) saturate(150%); box-shadow: 0 16px 32px -18px rgba(59,23,130,0.4); }
.vz-proof__brand { margin: 0; padding-right: 20px; border-right: 1px solid #E4DCF8; }
.vz-proof__brand strong { display: block; font-size: 17px; line-height: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--v700); }
.vz-proof__brand span { display: block; font-size: 12px; line-height: 16px; font-weight: 600; color: var(--orange); }
.vz-proof ul { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 0; padding: 0; list-style: none; }
.vz-proof li { display: flex; align-items: center; gap: 12px; padding: 0 16px; min-width: 0; }
.vz-proof li + li { border-left: 1px solid #E4DCF8; }
.vz-proof strong { display: block; font-size: 15px; line-height: 20px; font-weight: 800; color: var(--v700); }
.vz-proof span { display: block; font-size: 12px; line-height: 16px; color: var(--muted); }

/* Tarjetas blancas del cuerpo (mismo lenguaje de Subascars: bloques blancos sobre el lienzo). */
.vz-card { border-radius: 20px; background: #fff; border: 1px solid var(--line); box-shadow: 0 12px 28px -24px rgba(59,23,130,0.35); padding: 24px; }
.vz-label { margin: 0; font-size: 12px; line-height: 16px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--v700); }

/* ¿Cómo funciona? El patrón de Subascars usa una etiqueta editorial y tarjetas blancas,
   no superficies lavanda: cada paso se lee como una acción independiente. */
.vz-steps { display: grid; gap: 18px; scroll-margin-top: 80px; padding: 26px 24px 22px; }
.vz-steps > .vz-label { justify-self: start; position: relative; padding: 8px 12px; color: var(--v700); font-weight: 600; letter-spacing: normal; }
.vz-steps > .vz-label::before, .vz-steps > .vz-label::after { content: ""; position: absolute; width: 10px; height: 10px; background: center / contain no-repeat; }
.vz-steps > .vz-label::before { left: 0; top: 0; background-image: url('/producto/valoriza/icons/corner-bracket-top-left.svg'); }
.vz-steps > .vz-label::after { right: 0; bottom: 0; background-image: url('/producto/valoriza/icons/corner-bracket-bottom-right.svg'); }
.vz-steps ol { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin: 0; padding: 0; list-style: none; counter-reset: none; }
.vz-steps li { position: relative; display: grid; justify-items: center; align-content: start; min-height: 112px; gap: 10px; padding: 16px 12px; border-radius: 14px; background: #fff; border: 1px solid #DED4F2; box-shadow: 0 10px 18px -16px rgba(53, 19, 117, 0.6); text-align: center; overflow: hidden; }
.vz-steps li::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(90deg, var(--vmc-color-vault-700, #3B1782), var(--vmc-color-vault-500, #8460E5)); opacity: 0.9; }
.vz-steps li span { display: grid; gap: 2px; font-size: 14px; line-height: 18px; font-weight: 800; color: var(--v700); }
.vz-steps li small { font-size: 11px; line-height: 14px; font-weight: 700; color: var(--muted); }

/* Bloques editoriales: la landing de referencia combina la píldora de contorno con
   títulos de acento violeta–turquesa para distinguir promesa, beneficios y sustento. */
.vz-center { display: grid; gap: 0; padding: 0; overflow: hidden; }
.vz-center__block { display: grid; justify-items: center; gap: 14px; padding: 42px 32px; text-align: center; }
.vz-center > .vz-center__block:not(:last-child) { padding-bottom: 24px; }
.vz-center__block + .vz-center__block { border-top: 0; background: transparent; padding-top: 24px; }
.vz-pill { margin: 0; padding: 5px 16px; border-radius: 999px; font-size: 12px; line-height: 18px; font-weight: 700; background: linear-gradient(#fff, #fff) padding-box, linear-gradient(100deg, #F2A25C 0%, #DE858C 42%, #8C70E3 100%) border-box; border: 1px solid transparent; }
.vz-pill span { display: block; background: linear-gradient(100deg, #DB8B52 0%, #C77E9A 48%, #8065D2 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.vz-title { margin: 0; max-width: 22ch; font-size: 36px; line-height: 1.1; font-weight: 800; letter-spacing: -0.035em; background: linear-gradient(100deg, #7B52DF 0%, #7557DC 38%, #5F91DB 68%, #45B7CE 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.vz-title span { color: inherit; }
.vz-lead { margin: 0; max-width: 58ch; font-size: 15px; line-height: 23px; color: #422682; }
.vz-lead b { color: #2C126D; }
/* Cifras con la misma cadencia del módulo «S/ 25 · 0%» de Subascars:
   valores y leyendas violetas, separados por un acento naranja. */
.vz-stats { position: relative; display: grid; grid-template-columns: repeat(2, minmax(112px, 1fr)); gap: 56px; align-items: center; margin: 10px 0 0; }
.vz-stats::after { content: ""; position: absolute; top: 8px; left: 50%; width: 38px; height: 38px; margin-left: -19px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #FBC47D 0 10%, transparent 11%), radial-gradient(circle at 68% 64%, rgba(255,255,255,.5) 0 7%, transparent 8%), #ED8936; box-shadow: 0 7px 14px -7px rgba(178,82,14,.75), inset 0 1px rgba(255,255,255,.55); }
.vz-stats div { display: grid; gap: 4px; min-width: 112px; }
.vz-stats dt { font-size: 30px; line-height: 48px; font-weight: 800; letter-spacing: -0.03em; color: #8057E4; }
.vz-stats dd { margin: 0; line-height: 24px; font-size: 13px; font-weight: 800; color: #8057E4; }

/* Lo que debes saber: tarjeta con checklist + pantalla real (en lugar del video de Subascars). */
.vz-know { display: grid; grid-template-columns: minmax(0, 1fr) 216px; gap: 24px; align-items: stretch; width: 100%; max-width: 640px; margin: 16px 0 8px; text-align: left; }
.vz-know__card { display: flex; flex-direction: column; overflow: hidden; border-radius: 16px; background: #fff; box-shadow: 0 0 16px 4px rgba(0,0,0,0.1); }
.vz-know__card header { box-sizing: border-box; min-height: 76px; padding: 16px; color: #fff; font-size: 20px; line-height: 28px; font-weight: 800; letter-spacing: normal; background: linear-gradient(174deg, #8460E5 0%, #3B1782 100%); }
.vz-know__card header small { display: block; font-size: 12px; line-height: 16px; font-weight: 400; color: #fff; letter-spacing: 0; }
.vz-know__card > div { flex: 1; display: grid; grid-template-rows: auto 1fr; gap: 12px; padding: 16px; }
.vz-know__card .vz-label { color: #99A1AF; font-size: 10px; line-height: 15px; font-weight: 700; letter-spacing: .025em; }
.vz-know__card ul { display: grid; align-content: space-between; gap: 12px; margin: 0; padding: 0; list-style: none; }
.vz-know__card li { display: grid; align-items: center; grid-template-columns: 24px minmax(0, 1fr); gap: 6px; padding: 8px 16px; border: 1px solid transparent; border-radius: 999px; font-size: 12px; line-height: 16px; font-weight: 600; color: #3B1782; }
.vz-know__card li::before { content: ""; width: 24px; height: 24px; border-radius: 50%; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='white'/%3E%3Cpath d='m7.5 12 3 3 6-7' fill='none' stroke='%23ED8936' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 16px no-repeat, linear-gradient(135deg, #ED8936 0%, #ED8936 40%, #8460E5 100%); }
.vz-know__video { box-sizing: border-box; width: 100%; aspect-ratio: 9 / 16; justify-self: center; display: grid; place-items: center; overflow: hidden; border-radius: 18px; border: 1px solid #CDBDF5; background: linear-gradient(180deg, #F4F0FF, #EAE2FA); color: var(--v700); text-align: center; }
.vz-know__video video { display: block; width: 100%; height: 100%; aspect-ratio: 9 / 16; object-fit: contain; background: #160A2B; }

/* Resultados AVT: se conserva la nueva estructura gráfica y se aplica el
   contraste violeta/naranja, cards, sombras y gradientes de esta landing. */
.vz-demo { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 16px; width: 100%; margin: 8px 0 0; text-align: left; }
.vz-demo__value { position: relative; isolation: isolate; min-height: 420px; overflow: hidden; border-radius: 18px; color: #fff; background: linear-gradient(160deg, #3B1782, #22005C); box-shadow: 0 16px 32px -20px rgba(34,0,92,.6); }
.vz-demo__value::after { content: ""; position: absolute; z-index: -1; inset: 0; background: linear-gradient(180deg, rgba(34,0,92,0) 4%, rgba(34,0,92,.02) 30%, rgba(34,0,92,.70) 61%, #22005C 100%); pointer-events: none; }
.vz-demo__content { position: absolute; z-index: 1; right: 0; bottom: 0; left: 0; display: grid; gap: 6px; padding: 22px 24px 24px; }
.vz-demo__value p { margin: 0; font-size: 13px; line-height: 19px; }
.vz-demo__content > p:first-child { color: rgba(255,255,255,.9); }
.vz-demo__content > p:last-child { color: #DCCFFF; }
.vz-demo__value small { margin-top: 8px; font-size: 13px; font-weight: 700; }
.vz-demo__value strong { font-size: 40px; line-height: 44px; font-weight: 800; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.vz-demo__car { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; filter: saturate(1.04) contrast(1.02); }
.vz-demo__tag { position: absolute; z-index: 1; top: 14px; right: 14px; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #22005C; background: var(--peach); }
.vz-demo__chart { display: grid; gap: 12px; min-width: 0; padding: 20px; border: 1px solid #DED4F2; border-radius: 18px; background: #fff; box-shadow: 0 12px 22px -20px rgba(53,19,117,.65); }
.vz-demo__chart h3, .vz-more h3 { margin: 0; font-size: 16px; line-height: 22px; font-weight: 800; color: var(--v700); }
.vz-demo__chart header p, .vz-more header p { margin: 2px 0 0; font-size: 13px; line-height: 19px; color: var(--muted); }
.vz-demo__chart .rv-tick { font-size: 16px; }
.vz-demo__chart dl { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 0; }
.vz-demo__chart dl div { padding: 8px 10px; border-radius: 12px; background: var(--lav); }
.vz-demo__chart dt { font-size: 11px; font-weight: 600; color: var(--muted); }
.vz-demo__chart dd { margin: 2px 0 0; font-size: 14px; font-weight: 800; color: var(--v700); font-variant-numeric: tabular-nums; }
.vz-more { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; width: 100%; text-align: left; }
.vz-more__card { display: grid; gap: 12px; padding: 20px; border: 1px solid #DED4F2; border-radius: 18px; background: #fff; box-shadow: 0 12px 22px -20px rgba(53,19,117,.65); }
.vz-more__wide { grid-column: 1 / -1; order: -1; }
.vz-season { position: relative; padding-top: 24px; }
.vz-season > p { position: absolute; z-index: 1; top: 0; left: 2px; margin: 0; padding: 3px 10px; border-radius: 999px; background: var(--v700); color: #fff; font-size: 11px; font-weight: 700; }
.vz-signal { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; color: var(--v700); }
.vz-signal > span { display: flex; gap: 5px; }
.vz-signal i { width: 10px; height: 10px; border-radius: 99px; background: #E3DCF5; }
.vz-signal i[data-on] { background: linear-gradient(135deg, var(--orange), var(--v500)); box-shadow: 0 2px 6px rgba(132,96,229,.3); }
.vz-signal b { font-size: 14px; }
.vz-more__hint { margin: 0; padding: 8px 12px; border: 1px dashed #8460E5; border-radius: 12px; background: rgba(132,96,229,.08); font-size: 13px; color: var(--muted); }
.vz-more__hint b { color: var(--v700); }
.vz-next { position: relative; isolation: isolate; overflow: hidden; display: grid; align-items: center; min-width: 0; min-height: 190px; padding: 20px; border-radius: 18px; background: linear-gradient(115deg,#3F167E 0%,#5B2DA7 52%,#7E55C9 100%); color: #fff; box-shadow: 0 14px 28px -20px rgba(35,6,100,.8); }
.vz-next > img { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 38% center; transform: scaleX(-1); }
.vz-next::before { content: ""; position: absolute; z-index: -1; inset: 0; background: linear-gradient(90deg,rgba(47,13,111,.98) 0%,rgba(61,20,132,.94) 38%,rgba(67,23,142,.45) 64%,rgba(67,23,142,.04) 92%); }
.vz-next__copy { position: relative; display: grid; justify-items: start; gap: 10px; width: 64%; }
.vz-more .vz-next h3 { margin: 0; color: #fff; font-size: 22px; line-height: 24px; letter-spacing: -.035em; text-wrap: balance; }
.vz-next h3 em { font-style: normal; color: var(--orange); }
.vz-next p { margin: 0; color: rgba(255,255,255,.9); font-size: 12px; line-height: 15px; text-wrap: pretty; }
.vz-next__cta.pvbtn { min-height: 38px; padding: 0 20px; font-size: 13px; }
.vz-comparables { position: relative; height: 36px; margin-top: 12px; border-radius: 999px; background: linear-gradient(90deg, rgba(237,137,54,.22), rgba(132,96,229,.2)); }
.vz-comparables i { position: absolute; top: 50%; left: 54%; width: 14px; height: 14px; border: 3px solid #fff; border-radius: 50%; background: var(--v500); box-shadow: 0 0 0 3px rgba(132,96,229,.24); transform: translate(-50%, -50%); }
.vz-comparables b { position: absolute; top: -26px; left: 54%; font-size: 12px; line-height: 18px; color: var(--v700); transform: translateX(-50%); white-space: nowrap; }
.vz-comparables__ends { display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: var(--muted); }
.vz-demo__note { width: 100%; margin: 0; font-size: 12px; line-height: 18px; color: var(--muted); text-align: left; }

/* Qué esperar: cuatro tarjetas con ícono. */
.vz-expect { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; width: 100%; margin: 8px 0 0; padding: 0; list-style: none; text-align: left; }
.vz-expect li { position: relative; display: grid; align-content: start; gap: 8px; padding: 20px 16px 18px; border-radius: 16px; background: #fff; border: 1px solid #DED4F2; box-shadow: 0 12px 22px -20px rgba(53,19,117,0.65); overflow: hidden; }
.vz-expect li::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(90deg, var(--vmc-color-vault-700, #3B1782), var(--vmc-color-vault-500, #8460E5)); }
.vz-expect h3 { margin: 4px 0 0; font-size: 15px; line-height: 20px; font-weight: 800; color: var(--v700); }
.vz-expect p { margin: 0; font-size: 13px; line-height: 19px; color: var(--muted); }

/* Banner de venta + franja de vidrio con los dos usos (vender / comprar). */
.vz-use { display: grid; }
.vz-sell { position: relative; overflow: hidden; isolation: isolate; display: grid; align-content: center; justify-items: start; gap: 10px; min-height: 240px; padding: 32px 36px 72px; border-radius: 20px; color: #fff;
  background: radial-gradient(90% 120% at -10% 120%, rgba(239,133,46,0.85) 0%, rgba(239,133,46,0.3) 30%, transparent 58%), linear-gradient(120deg, #32136F 0%, #4E22A9 60%, #7B4BE3 100%); }
.vz-sell__kicker { margin: 0; font-size: 12px; line-height: 16px; font-weight: 700; color: var(--peach); }
.vz-sell h2 { margin: 0; max-width: 18ch; font-size: 30px; line-height: 1.08; font-weight: 800; letter-spacing: -0.03em; }
.vz-sell h2 span { display: block; color: var(--peach); }
.vz-sell > p:not(.vz-sell__kicker) { margin: 0 0 6px; max-width: 40ch; font-size: 14px; line-height: 21px; color: rgba(255,255,255,0.86); }
.vz-sell__person { position: absolute; z-index: -1; right: 40px; bottom: 0; height: 100%; width: auto; pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent 100%); mask-image: linear-gradient(180deg, #000 70%, transparent 100%); }
.vz-use__opts { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: -48px 28px 0; padding: 8px; list-style: none;
  border-radius: 16px; border: 1px solid rgba(255,255,255,0.9); background: rgba(255,255,255,0.86);
  -webkit-backdrop-filter: blur(16px) saturate(150%); backdrop-filter: blur(16px) saturate(150%); box-shadow: 0 16px 32px -18px rgba(59,23,130,0.4); }
.vz-use__opts li + li { border-left: 1px solid #E4DCF8; }
.vz-use__opts a { display: grid; grid-template-columns: 72px minmax(0, 1fr) 20px; align-items: center; gap: 14px; padding: 8px 12px 8px 8px; border-radius: 12px;
  color: var(--muted); font-size: 13px; line-height: 18px; text-decoration: none; transition: background-color 200ms var(--ease); }
.vz-use__opts a:hover { background: var(--lav); }
.vz-use__opts a:focus-visible { outline: 2px solid var(--v500); outline-offset: 2px; }
.vz-use__opts img { width: 72px; height: 56px; border-radius: 10px; object-fit: cover; display: block; }
.vz-use__opts strong { display: block; font-size: 15px; line-height: 20px; font-weight: 800; color: var(--v700); }
.vz-use__opts svg { color: var(--orange); transition: transform 200ms var(--ease); }
.vz-use__opts a:hover svg { transform: translateX(3px); }

/* Preguntas frecuentes: título centrado y tarjetas numeradas (como Subascars), <details> nativo. */
.vz-faq { display: grid; gap: 20px; padding: 32px 24px; }
.vz-faq .vz-title { justify-self: center; text-align: center; line-height: 1.3; padding-bottom: .08em; }
.vz-faq__list { display: grid; gap: 8px; }
.vz-faq details { border-radius: 14px; background: #fff; border: 1px solid var(--line); box-shadow: 0 6px 16px -14px rgba(59,23,130,0.4); transition: background-color 240ms var(--ease), border-color 240ms var(--ease); }
.vz-faq details:hover { border-color: #CDBDF5; }
.vz-faq details[open] { background: var(--lav); border-color: #CDBDF5; }
.vz-faq summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 56px; padding: 0 14px 0 20px;
  cursor: pointer; list-style: none; font-size: 15px; line-height: 21px; font-weight: 700; color: var(--v700); border-radius: 14px; }
.vz-faq summary::-webkit-details-marker { display: none; }
.vz-faq summary:focus-visible { outline: 2px solid var(--v500); outline-offset: 2px; }
.vz-faq summary i { position: relative; flex: none; width: 26px; height: 26px; border-radius: 50%; background: #fff; border: 1px solid var(--line); transition: background-color 240ms var(--ease); }
.vz-faq summary i::before, .vz-faq summary i::after { content: ""; position: absolute; top: 50%; left: 50%; width: 10px; height: 2px; margin: -1px 0 0 -5px; border-radius: 2px; background: var(--v500); transition: transform 280ms var(--ease), background-color 240ms; }
.vz-faq summary i::after { transform: rotate(90deg); }
.vz-faq details[open] summary i { background: var(--v700); border-color: var(--v700); }
.vz-faq details[open] summary i::before, .vz-faq details[open] summary i::after { background: #fff; }
.vz-faq details[open] summary i::after { transform: rotate(0deg); }
.vz-faq details p { margin: 0; padding: 0 20px 18px; max-width: 70ch; font-size: 14px; line-height: 22px; color: var(--muted); }
@supports (interpolate-size: allow-keywords) {
  @media (prefers-reduced-motion: no-preference) {
    .vz-faq { interpolate-size: allow-keywords; }
    .vz-faq details::details-content { block-size: 0; overflow: clip; opacity: 0;
      transition: block-size 320ms var(--ease), opacity 240ms ease, content-visibility 320ms allow-discrete; }
    .vz-faq details[open]::details-content { block-size: auto; opacity: 1; }
  }
}

/* Centro de Ayuda: banner final con el degradado de la marca. */
.vz-help { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 24px 28px; border-radius: 20px; color: #fff;
  background: linear-gradient(90deg, #B4602A 0%, #5B2AB8 45%, #2E0F70 100%); }
.vz-help h2 { margin: 0; font-size: 20px; line-height: 26px; font-weight: 800; }
.vz-help p { margin: 2px 0 0; font-size: 13px; line-height: 18px; color: #E8DDFF; }
.vz-help .hib-glass { height: 40px; padding-inline: 20px; white-space: nowrap; }

.vz-dock { display: none; }

@media (max-width: 1023px) {
  .vz { padding: 14px 14px 104px; gap: 12px; }
  .vz-hero { height: auto; display: flex; flex-direction: column; border-radius: 18px; }
  .vz-hero__photo { position: relative; width: 100%; height: 200px; -webkit-mask-image: linear-gradient(180deg, #000 60%, transparent 100%); mask-image: linear-gradient(180deg, #000 60%, transparent 100%); }
  .vz-hero__photo picture { transform: none; }
  .vz-hero__photo img { object-position: 62% 35%; }
  .vz-hero__copy { position: relative; left: 0; bottom: 0; width: 100%; padding: 0 20px 64px; margin-top: -28px; gap: 12px; }
  .vz-hero h1 { max-width: 20ch; font-size: 32px; }
  .vz-hero__actions { width: 100%; }
  .vz-hero__actions > * { flex: 1 1 100%; }
  .vz-hero__actions .pvbtn { white-space: nowrap; padding-inline: 16px; }
  .vz-proof { grid-template-columns: minmax(0, 1fr); margin: -52px 12px 0; padding: 14px 4px 6px; }
  .vz-proof__brand { padding: 0 12px 10px; border-right: 0; border-bottom: 1px solid #E4DCF8; }
  .vz-proof ul { grid-template-columns: minmax(0, 1fr); }
  .vz-proof li { padding: 10px 12px; }
  .vz-proof li + li { border-left: 0; border-top: 1px solid #E4DCF8; }
  .vz-card { padding: 20px 16px; }
  .vz-center { padding: 0; }
  .vz-steps ol { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .vz-steps { padding: 20px 16px; }
  .vz-steps li { min-height: 108px; gap: 8px; padding: 12px; }
  .vz-center__block { padding: 32px 16px; }
  .vz-title { font-size: 26px; }
  .vz-stats { gap: 32px; }
  .vz-stats dt { font-size: 26px; line-height: 39px; }
  .vz-know { grid-template-columns: minmax(0, 1fr); }
  .vz-know__video { width: min(100%, 216px); }
  .vz-center .pvbtn { width: 100%; }
  .vz-demo { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .vz-demo__value { min-height: 380px; }
  .vz-demo__content { padding: 20px 18px; }
  .vz-demo__value strong { font-size: 34px; }
  .vz-demo__chart { padding: 16px 12px; }
  .vz-demo__chart .rv-tick, .vz-season .rv-tick { font-size: 22px; }
  .vz-demo__chart .rv-val, .vz-season .rv-val { font-size: 24px; }
.vz-demo__chart dl { gap: 4px; }
  .vz-demo__chart dl div { padding: 7px 5px; }
  .vz-demo__chart dd { font-size: 12px; }
  .vz-more { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .vz-more__wide { grid-column: auto; order: 0; }
  .vz-more__card { padding: 16px 12px; }
  .vz-next { min-height: 164px; padding: 18px; }
  .vz-next::before { background: linear-gradient(90deg,rgba(47,13,111,.98) 0%,rgba(61,20,132,.91) 54%,rgba(67,23,142,.20) 100%); }
  .vz-next__copy { width: 68%; gap: 10px; }
  .vz-more .vz-next h3 { font-size: 20px; line-height: 22px; }
  .vz-expect { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .vz-expect li { padding: 14px 12px; }
  .vz-sell { padding: 24px 20px 260px; }
  .vz-sell h2 { font-size: 24px; }
  .vz-sell .pvbtn { width: 100%; }
  .vz-sell__person { right: 50%; transform: translateX(50%); bottom: 48px; height: 220px; }
  .vz-use__opts { grid-template-columns: minmax(0, 1fr); margin: -48px 12px 0; padding: 4px; }
  .vz-use__opts li + li { border-left: 0; border-top: 1px solid #E4DCF8; }
  .vz-sell__person { right: -10px; height: 230px; }
  .vz-faq { padding: 24px 12px; }
  .vz-faq summary { padding: 0 12px 0 16px; }
  .vz-faq details p { padding: 0 16px 16px; }
  .vz-help { flex-direction: column; align-items: flex-start; padding: 20px; }
  .vz-help .hib-glass { width: 100%; justify-content: center; }
  .vz-dock { display: block; position: fixed; left: 12px; right: 12px; bottom: max(12px, env(safe-area-inset-bottom)); z-index: 40; padding: 8px; border-radius: 999px;
    background: rgba(255,255,255,0.86); border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 18px 36px -16px rgba(34,0,92,0.45);
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    transform: translateY(calc(100% + 24px)); opacity: 0; transition: transform 420ms var(--ease), opacity 240ms ease; }
  .vz-dock[data-on] { transform: none; opacity: 1; }
  .vz-dock .pvbtn { width: 100%; white-space: nowrap; }
}
@media (prefers-reduced-motion: reduce) {
  .vz-dock { transition: none; }
}
/* Banner compacto: dimensiones de la landing SubasCars; contenido secundario fuera para no recortarlo. */
.vz-use { width: 100%; max-width: none; margin-inline: auto; gap: 0; }
.vz-use > .vz-sell__kicker { color: var(--v700); }
.vz-sell { display: block; width: 100%; min-width: 0; min-height: 0; height: 120px; padding: 0; border-radius: 16px; background: linear-gradient(141deg,#340091 33%,#8460E5 92%,#ED8936 100%); }
.vz-sell h2 { position: absolute; left: 20px; top: 14px; width: 70%; max-width: none; font-size: 20px; line-height: 24px; letter-spacing: -.025em; }
.vz-sell h2 span { display: inline; color: var(--orange); }
.vz-sell > .pvbtn { position: absolute; left: 20px; top: 60px; height: 40px; padding-inline: 24px; font-size: 14px; }
.vz-sell__person { right: 0; bottom: 0; height: 100%; width: 68%; max-width: 640px; object-fit: cover; object-position: right top; transform: none; -webkit-mask-image: linear-gradient(90deg,transparent,#000 14%); mask-image: linear-gradient(90deg,transparent,#000 14%); }
.vz-sell__person img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: right top; }
.vz-sell > .pvbtn { text-decoration: none; border: none; color: #fff; background: linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,.08) 45%,rgba(255,255,255,0)); backdrop-filter: blur(5px); box-shadow: 0 8px 24px rgba(0,0,0,.1), inset 0 1px 6px rgba(255,255,255,.45); }
.vz-sell > .pvbtn::before { content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1.5px; background: linear-gradient(162deg,#F4AC59,#8460E5); -webkit-mask: linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
.vz-use__opts { margin: 0; }
@media (max-width: 767px) {
  .vz-use { max-width: none; }
  .vz-sell { height: auto; aspect-ratio: 388 / 120; min-height: 110px; }
  .vz-sell h2 { left: 3%; top: 7%; width: 49%; font-size: clamp(14px,4.6vw,18px); line-height: 1.15; }
  .vz-sell h2 span { display: block; }
  .vz-sell > .pvbtn { left: auto; right: 3%; top: auto; bottom: 7%; height: 34px; padding-inline: 20px; font-size: 12px; width: auto; }
  .vz-sell__person { right: 0; bottom: 0; height: 100%; width: 70%; object-position: right top; transform: none; }
  .vz-use__opts { margin: 0; }
}
/* Original VMC banner markup, isolated utility equivalents. */
.vz-original-wa { width: 100%; }
.vz-original-wa section { position: relative; margin-inline: auto; max-width: 100%; overflow: hidden; border-radius: 16px; }
.vz-original-wa section:first-child { display: none; }
@media (min-width:768px) {
 .vz-original-wa section:last-child { width: 100% !important; }
 .vz-original-wa section:last-child > img { left: auto !important; right: 23px; }
 .vz-original-wa section:last-child > div:nth-child(2) { left: auto !important; right: -94px; }
 .vz-original-wa section:last-child > div:nth-child(4) { left: auto !important; right: 42px; }
}
.vz-original-wa .absolute { position: absolute; }
.vz-original-wa .pointer-events-none { pointer-events: none; }
.vz-original-wa .rounded-full { border-radius: 9999px; }
.vz-original-wa [class*="blur-[35px]"] { filter: blur(35px); }
.vz-original-wa [class*="blur-[40px]"] { filter: blur(40px); }
.vz-original-wa [class*="blur-[60px]"] { filter: blur(60px); }
.vz-original-wa [class*="blur-[24px]"] { filter: blur(24px); }
.vz-original-wa h2 { margin: 0; font-family: inherit; font-weight: 800; color: #fff; line-height: 28px; }
.vz-original-wa img { object-fit: cover; max-width: none; }
.vz-original-wa a { text-decoration: none; }
@media (max-width:767px) {
 .vz-original-wa section:first-child { display: block; width: 100%; min-height: 120px; }
 .vz-original-wa section:last-child { display: none; }
 .vz-original-wa section:first-child a { width: 100%; padding-inline: 8px; }
}
/* Centro de Ayuda: estilos exactos del bloque original landing-subascars. */
.vz-help { position: relative; width: 100%; height: 120px; padding: 0 24px; gap: 16px; flex-direction: row; align-items: center; overflow: hidden; border-radius: 16px; background: linear-gradient(90deg,#b27128 0%,#99524d 15%,#7d3b85 30%,#5a35c2 50%,#3b1782 72%,#22005c 100%); box-shadow: 0 0 16px 4px rgba(0,0,0,.1); }
.vz-help > div { position: relative; z-index: 1; display: flex; flex: 1; min-width: 0; flex-direction: column; justify-content: center; padding-right: 4px; }
.vz-help h2 { font-size: clamp(14px,4.8vw,20px); font-weight: 800; line-height: 28px; background: linear-gradient(172deg,#e8deff 0%,#fff 40%,#cfbaff 75%,#ae8eff 100%); background-clip: text; -webkit-background-clip: text; color: transparent; }
.vz-help p { margin: 2px 0 0; font-size: 12px; font-weight: 600; line-height: 16px; color: #fff; }
.vz-help .hib-glass { position: relative; z-index: 1; display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; width: min(191px,46vw); height: 40px; padding: 0 16px; border-radius: 9999px; border: 1.5px solid #fff; color: #fff; text-decoration: none; font-size: 14px; font-weight: 600; white-space: nowrap; backdrop-filter: blur(5px); background: linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.08) 45%,rgba(255,255,255,.03)); box-shadow: none; }
.vz-help .hib-glass::before,.vz-help .hib-glass::after { display: none; }
.vz-help .hib-glass:hover { opacity: .9; }
.vz-help__mobile { display: none; }
@media (max-width:767px) {
 .vz-help { padding: 0 12px; gap: 8px; }
 .vz-help h2 { line-height: 1.15; }
 .vz-help p { margin-top: 4px; max-width: min(128px,38vw); font-size: clamp(10px,3vw,12px); line-height: 1.375; }
 .vz-help .hib-glass { height: 36px; padding-inline: 8px; font-size: clamp(10px,3vw,14px); }
 .vz-help__desktop { display: none; } .vz-help__mobile { display: inline; }
}
/* Mobile: espacio real para titular, rostros y CTA, sin recortes por porcentajes. */
@media (max-width:767px) {
 .vz-original-wa section:first-child { max-width: none !important; aspect-ratio: auto !important; height: 180px; min-height: 180px; }
 .vz-original-wa section:first-child h2 { left: 16px !important; top: 16px !important; width: 51% !important; font-size: 18px !important; line-height: 1.2 !important; }
 .vz-original-wa section:first-child > img { left: auto !important; right: 0; top: -40px !important; width: 45% !important; height: 250px !important; object-fit: contain; }
 .vz-original-wa section:first-child > div:last-child { left: 16px !important; right: 16px !important; top: auto !important; bottom: 14px; width: auto !important; }
 .vz-original-wa section:first-child a { height: 40px; font-size: 12px !important; padding-inline: 10px; }
}
@media (max-width:767px) {
 .vz-next .vz-next__cta.pvbtn { width: auto; min-width: 0; height: 40px; min-height: 40px; padding: 0 16px; font-size: 12px; line-height: 16px; justify-self: start; }
}
@media (max-width:767px) {
 .vz-next > img { object-position: 15% center; }
 .vz-next::before { background: linear-gradient(90deg,rgba(47,13,111,.98) 0%,rgba(61,20,132,.88) 42%,rgba(67,23,142,.25) 65%,rgba(67,23,142,0) 85%); }
}
`;

function BrandLogo({ className }: { className: string }) {
  return <img className={className} src="/producto/index/assets/brand/logo-voyager.svg" alt="VMC Subastas" />;
}

// Shell = HomeIndexRebase (mismas clases y piezas), sin los controles QA ni el feed del Index.
export default function ValorizaLanding(): JSX.Element {
  const [sidebarHeight, setSidebarHeight] = useState(900);
  const [collapsed, setCollapsed] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const resize = () => setSidebarHeight(Math.max(720, window.innerHeight));
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <>
      <div className={shell.desktopShell} data-collapsed={collapsed || undefined}>
        <Header width="100%" />
        <aside className={shell.sidebarRail} aria-label="Navegación de VMC">
          <Sidebar height={sidebarHeight} contentHeight={sidebarHeight} headerHeight={64} logo={<BrandLogo className={shell.brandLogo} />}
            collapsed={collapsed} onCollapsedChange={setCollapsed} />
        </aside>
        <main className={shell.mainColumn}><ValorizaBody id="d" /></main>
      </div>
      <div className={shell.mobileShell}>
        <SidebarMobile open={menuOpen} onOpenChange={setMenuOpen}>
          <Header width="100%" logo={
            <div className={shell.mobileBrand}>
              <SidebarMenuButton onClick={() => setMenuOpen(true)} expanded={menuOpen} />
              <BrandLogo className={shell.mobileLogo} />
            </div>
          } />
          <ValorizaBody id="m" />
        </SidebarMobile>
      </div>
    </>
  );
}
