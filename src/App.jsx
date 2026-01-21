import { useMemo, useState } from 'react';

const navLinks = ['Programa', 'Método', 'Experiencia', 'Equipo', 'FAQ', 'Contacto'];

const heroBadges = [
  'Presencial · Full-time',
  '2-20 Noviembre 2026',
  'Bergen, Noruega',
  'Cupos limitados · Aplicación',
];

const outcomes = [
  'Comprender situaciones complejas de naturaleza social, organizacional, tecnológica y territorial; identificar causas raíz y comunicar una visión estratégica clara para la acción.',
  'Identificar puntos de apalancamiento sistémico y definir decisiones estratégicas con impacto estructural.',
  'Diseñar y participar en ecosistemas de colaboración multisectorial y nuevas formas de gobernanza.',
  'Dirigir, solicitar y evaluar proyectos sistémicos con equipos especializados.',
  'Integrarse a una red internacional de líderes con consciencia sistémica para colaboración de largo plazo.',
];

const formatCards = [
  { title: 'Duración', value: '3 semanas intensivas' },
  { title: 'Dedicación', value: 'Tiempo completo · presencial' },
  { title: 'Fechas', value: '2-20 Nov 2026' },
  { title: 'Lugar', value: 'Bergen, Noruega' },
];

const highlightCards = [
  {
    title: 'Comprensión sistémica aplicada',
    copy:
      'Aprendizaje y comprensión sistémica basada en casos reales, más allá de marcos conceptuales o motivacionales.',
  },
  {
    title: 'Estrategia en sistemas vivos',
    copy:
      'Integración equilibrada de dinámica de sistemas, estrategia sistémica y gobernanza, con aprendizajes derivados de prueba y error en proyectos reales.',
  },
  {
    title: 'Decisión y acción en la práctica',
    copy:
      'Trabajo aplicado, análisis estratégico, reflexión colectiva y espacios de integración personal sobre lo que implica liderar en contextos complejos reales.',
  },
];

const convocanCards = [
  {
    title: 'ANNiA',
    copy:
      'Hub colaborativo con base en Noruega para proyectos y encuentros de alto impacto, enfocado en pensamiento sistémico, estrategia y condiciones para el bienestar colectivo.',
  },
  {
    title: 'Vida al Centro',
    copy:
      'Iniciativa latinoamericana con más de 15 años de experiencia en liderazgo, transformación sistémica y aprendizaje aplicado en contextos sociales, organizacionales y territoriales.',
  },
  {
    title: 'Dirección académica',
    copy:
      'Encuentro co-diseñado y facilitado por Vanesa Armendáriz, con trayectoria en iniciativas internacionales de liderazgo sistémico y sostenibilidad.',
  },
];

const faqs = [
  '¿Es un programa introductorio?',
  '¿Qué incluye el encuentro?',
  '¿Cómo es el proceso de aplicación?',
  '¿Se publica el costo?',
];

const interactiveTabs = {
  sintomas: {
    title: 'Cuando solo tratamos síntomas, el sistema se defiende',
    description:
      'Las soluciones parciales pueden aliviar hoy... y agravar mañana: costos ocultos, efectos colaterales, fatiga organizacional.',
    bullets: [
      'Parchea sin cambiar la estructura',
      'Produce efectos no deseados',
      'Refuerza el problema a mediano plazo',
    ],
    note: 'El reto no es “hacer más”, es decidir mejor dónde intervenir.',
  },
  sistema: {
    title: 'Trabajar en el sistema: de respuestas a palancas',
    description:
      'El potencial aparece cuando diseñamos colaboración: reglas, incentivos, información y relaciones capaces de transformar cómo decidimos y coordinamos.',
    bullets: ['Leer patrones y causalidad', 'Identificar palancas reales', 'Diseñar gobernanza colaborativa'],
    note: 'Ciencia + consciencia: rigor, ética y ejecución adaptativa.',
  },
};

const systemBlocks = [
  {
    title: 'Incentivos',
    copy: 'Lo que el sistema premia (y castiga) manda.',
  },
  {
    title: 'Información',
    copy: 'Lo que se sabe, cuándo se sabe y quién lo sabe.',
  },
  {
    title: 'Relaciones',
    copy: 'La coordinación es infraestructura, no “buena voluntad”.',
  },
  {
    title: 'Reglas',
    copy: 'Normas formales e informales: el verdadero “código” del sistema.',
  },
];

const zoomBlock = {
  title: 'Zoom: Incentivos',
  bullets: [
    'Qué métricas gobiernan decisiones',
    'Qué trade-offs se esconden',
    'Qué comportamientos estamos reforzando',
  ],
  note: 'Ejemplo: cuando solo se mide velocidad, se sacrifica calidad y confianza.',
};

function SectionShell({ id, eyebrow, title, description, children, tone = 'dark' }) {
  return (
    <section id={id} className={`section section--${tone}`}>
      <div className="container">
        {(eyebrow || title || description) && (
          <header className="section__header">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('sintomas');
  const tabContent = interactiveTabs[activeTab];
  const tabKeys = useMemo(() => Object.keys(interactiveTabs), []);

  return (
    <div className="page">
      <header className="hero" id="inicio">
        <div className="container">
          <nav className="nav">
            <div className="logo">ANNiA</div>
            <div className="nav__links">
              {navLinks.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`}>
                  {link}
                </a>
              ))}
            </div>
            <button className="nav__cta">Solicitar información →</button>
          </nav>

          <div className="hero__content">
            <div className="hero__badge">Encuentro fundacional de liderazgo sistémico · Bergen, Noruega · Noviembre 2026</div>
            <h1>Systemic Strategy &amp; Leadership for Complex Issues</h1>
            <p>
              Encuentro ejecutivo internacional e inmersivo (3 semanas) para líderes del sector público, privado,
              industria y sociedad civil que toman decisiones estratégicas en contextos de alta complejidad.
            </p>
            <p className="hero__meta">Bergen, Noruega · Noviembre 2026 · Presencial · Full-time</p>
            <div className="hero__actions">
              <button className="btn btn--primary">Solicitar información →</button>
              <button className="btn btn--ghost">Descargar overview (PDF)</button>
            </div>
            <div className="hero__chips">
              {heroBadges.map((badge) => (
                <span key={badge} className="chip">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <SectionShell
        id="metodo"
        title="Trabajar en los sistemas, no solo en los síntomas"
        description="Una forma clara y aplicada de entender qué significa pensar sistémicamente — sin teoría innecesaria."
      />

      <SectionShell id="experiencia" eyebrow="Síntomas vs Sistema" title="Interactivo" tone="mid">
        <div className="interactive">
          <div className="interactive__card">
            <div className="interactive__tabs">
              {tabKeys.map((key) => (
                <button
                  key={key}
                  className={`tab ${activeTab === key ? 'tab--active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {key === 'sintomas' ? 'Síntomas' : 'Sistema'}
                </button>
              ))}
            </div>
            <h3>{tabContent.title}</h3>
            <p>{tabContent.description}</p>
            <ul>
              {tabContent.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className="interactive__note">{tabContent.note}</p>
          </div>
          <div className="interactive__grid">
            {systemBlocks.map((block) => (
              <article key={block.title} className="glass-card">
                <h4>{block.title}</h4>
                <p>{block.copy}</p>
              </article>
            ))}
            <article className="glass-card glass-card--accent">
              <h4>{zoomBlock.title}</h4>
              <ul>
                {zoomBlock.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="interactive__note">{zoomBlock.note}</p>
            </article>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="programa" title="Qué ocurre en este encuentro" tone="mid">
        <div className="card-row">
          {highlightCards.map((card) => (
            <article key={card.title} className="glass-card">
              <h4>{card.title}</h4>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="resultados" title="Resultados para los participantes" tone="light">
        <div className="result-grid">
          {outcomes.map((outcome) => (
            <article key={outcome} className="card card--light">
              <p>{outcome}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="formato" title="Formato del encuentro" tone="light">
        <div className="format-grid">
          {formatCards.map((card) => (
            <article key={card.title} className="card card--light">
              <span>{card.title}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>
        <p className="section__note">Cupos limitados · Aplicación requerida · Conversación de encaje disponible</p>
      </SectionShell>

      <SectionShell id="bergen" title="Por qué Bergen, Noruega" tone="light">
        <div className="split">
          <div>
            <p>
              La reflexión profunda y el aprendizaje sistémico requieren entornos que favorezcan el enfoque, el rigor y la
              perspectiva de largo plazo.
            </p>
            <p>
              Noruega ofrece un contexto singular donde naturaleza, tecnología y gobernanza conviven de manera avanzada.
              Bergen no es un escenario decorativo: es parte del método.
            </p>
            <div className="chip-row">
              {['Inmersión', 'Enfoque', 'Rigor', 'Naturaleza + tecnología'].map((chip) => (
                <span key={chip} className="chip chip--light">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="gradient-card" />
        </div>
      </SectionShell>

      <SectionShell id="equipo" title="A quién está dirigido" tone="light">
        <div className="split split--reverse">
          <div className="card card--light">
            <p>
              Directores, ejecutivos y tomadores de decisión del sector público, privado, industria y sociedad civil, con
              responsabilidad directa sobre políticas, estrategias organizacionales o iniciativas de alto impacto.
            </p>
            <p>
              Está diseñado para líderes con experiencia que buscan profundidad analítica, claridad estratégica y
              capacidad real de acción.
            </p>
          </div>
          <div>
            <h3>Quiénes convocan</h3>
            <div className="card-row">
              {convocanCards.map((card) => (
                <article key={card.title} className="card card--light">
                  <h4>{card.title}</h4>
                  <p>{card.copy}</p>
                </article>
              ))}
            </div>
            <p className="section__note">
              Nota: en el overview PDF se incluyen perfiles ampliados, agenda detallada y logística.
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="faq" title="Preguntas frecuentes" tone="light">
        <div className="faq">
          {faqs.map((question) => (
            <button key={question} className="faq__item">
              <span>{question}</span>
              <span className="faq__icon">+</span>
            </button>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="contacto" title="Conversemos" tone="light">
        <div className="split">
          <div>
            <p>
              Si estás evaluando tu participación o la de tu institución, podemos conversar directamente para explorar
              encaje y próximos pasos.
            </p>
            <div className="contact-actions">
              <button className="btn btn--primary">WhatsApp</button>
              <button className="btn btn--ghost btn--light">Agendar conversación</button>
            </div>
            <p className="section__note">
              *Próximamente: asistente inteligente para responder preguntas frecuentes sobre el programa.*
            </p>
          </div>
          <form className="card card--light form">
            <h4>Solicitud rápida</h4>
            <input type="text" placeholder="Nombre" />
            <input type="email" placeholder="Correo" />
            <input type="text" placeholder="Rol / Organización" />
            <button type="button" className="btn btn--dark">
              Enviar
            </button>
            <p className="form__note">Al enviar, te contactamos con el overview y próximos pasos.</p>
          </form>
        </div>
      </SectionShell>

      <footer className="footer">
        <div className="container footer__content">
          <div>
            <p>ANNiA + Vida al Centro · Cohorte fundacional 2026</p>
            <p>
              Systemic Strategy &amp; Leadership for Complex Issues es una iniciativa educativa diseñada para fortalecer
              capacidades de liderazgo sistémico y estratégico frente a desafíos complejos.
            </p>
          </div>
          <div className="footer__icons">
            <span>Instagram</span>
            <span>YouTube</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
