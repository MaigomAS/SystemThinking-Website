import { useEffect, useMemo, useRef, useState } from 'react';
import Button from './components/ui/Button.jsx';
import Card from './components/ui/Card.jsx';
import Chip from './components/ui/Chip.jsx';
import Container from './components/ui/Container.jsx';
import Section from './components/ui/Section.jsx';
import DesignPlayground from './components/DesignPlayground.jsx';
import HeroRotator from './components/HeroRotator.jsx';
import OrganizationModal from './components/OrganizationModal.jsx';
import { organizations } from './data/organizations.js';

const navLinks = ['Programa', 'Método', 'Liderazgo', 'FAQ', 'Contacto'];

const outcomes = [
  {
    title: 'Visión sistémica accionable',
    copy: 'Comprender situaciones complejas de naturaleza social, organizacional, tecnológica y territorial; identificar causas raíz y comunicar una visión estratégica clara para la acción.',
    tag: 'Claridad estratégica',
  },
  {
    title: 'Palancas con impacto',
    copy: 'Identificar puntos de apalancamiento sistémico y definir decisiones estratégicas con impacto estructural.',
    tag: 'Decisión informada',
  },
  {
    title: 'Gobernanza colaborativa',
    copy: 'Diseñar y participar en ecosistemas de colaboración multisectorial y nuevas formas de gobernanza.',
    tag: 'Ecosistemas vivos',
  },
  {
    title: 'Dirección de proyectos sistémicos',
    copy: 'Dirigir, solicitar y evaluar proyectos sistémicos con equipos especializados.',
    tag: 'Ejecución avanzada',
  },
  {
    title: 'Red global de liderazgo',
    copy: 'Integrarse a una red internacional de líderes con consciencia sistémica para colaboración de largo plazo.',
    tag: 'Comunidad de largo plazo',
  },
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
    copy: 'Aprendizaje y comprensión sistémica basada en casos reales, más allá de marcos conceptuales o motivacionales.',
  },
  {
    title: 'Estrategia en sistemas vivos',
    copy: 'Integración equilibrada de dinámica de sistemas, estrategia sistémica y gobernanza, con aprendizajes derivados de prueba y error en proyectos reales.',
  },
  {
    title: 'Decisión y acción en la práctica',
    copy: 'Trabajo aplicado, análisis estratégico, reflexión colectiva y espacios de integración personal sobre lo que implica liderar en contextos complejos reales.',
  },
];

const faqs = [
  {
    id: 'intro',
    question: '¿Es un programa introductorio?',
    summary: 'Diseñado para líderes con experiencia y retos complejos.',
    answer: {
      heading: 'Es un laboratorio avanzado, no una introducción.',
      paragraphs: [
        'Partimos de desafíos reales y decisiones estratégicas. El objetivo es profundizar en pensamiento sistémico aplicado y trasladarlo a decisiones concretas.',
        'El ritmo es intenso y está orientado a ejecutivos, directores y líderes de política pública que ya operan en entornos complejos.',
      ],
      bullets: ['Casos reales y simulaciones de gobernanza', 'Trabajo aplicado con mentores', 'Integración de rigor técnico + liderazgo consciente'],
    },
    followUps: ['¿Qué tipo de perfil es ideal?', '¿Se requiere experiencia previa?', '¿Cómo se mide el impacto?'],
  },
  {
    id: 'encuentro',
    question: '¿Qué incluye el encuentro?',
    summary: 'Inmersión presencial con sesiones estratégicas y trabajo colaborativo.',
    answer: {
      heading: 'Tres semanas para pensar, diseñar y decidir mejor.',
      paragraphs: [
        'Incluye sesiones de análisis sistémico, estudios de caso, coaching y espacios de integración personal para líderes.',
        'La experiencia combina teoría aplicada, herramientas avanzadas y construcción de redes de confianza.',
      ],
      bullets: ['Workshops intensivos + laboratorios de decisión', 'Mentoría estratégica y feedback personalizado', 'Experiencias en Bergen y espacios de conexión'],
    },
    followUps: ['¿Cómo se estructura cada semana?', '¿Qué tan presencial es?', '¿Qué resultados se esperan?'],
  },
  {
    id: 'aplicacion',
    question: '¿Cómo es el proceso de aplicación?',
    summary: 'Conversación de encaje, revisión de perfil y confirmación.',
    answer: {
      heading: 'Selectivo y personalizado para asegurar fit.',
      paragraphs: [
        'Iniciamos con una conversación breve para entender tu desafío, contexto y objetivos.',
        'Luego revisamos el perfil y confirmamos cupo con tiempo para preparar la experiencia.',
      ],
      bullets: ['Formulario corto y conversación estratégica', 'Respuesta en máximo 7 días', 'Acompañamiento previo a la inmersión'],
    },
    followUps: ['¿Qué documentos se necesitan?', '¿Hay cupos limitados?', '¿Puedo postular como equipo?'],
  },
  {
    id: 'costo',
    question: '¿Se publica el costo?',
    summary: 'Se comparte tras la conversación de encaje.',
    answer: {
      heading: 'El valor depende del perfil y tipo de participación.',
      paragraphs: [
        'Priorizamos conversaciones directas para entender el impacto esperado y definir condiciones.',
        'Puedes solicitar un overview con rangos y alternativas de apoyo institucional.',
      ],
      bullets: ['Costos compartidos de forma transparente', 'Opciones para equipos y organizaciones', 'Claridad antes de la confirmación final'],
    },
    followUps: ['¿Hay becas o apoyos?', '¿Incluye alojamiento?', '¿Cómo se paga?'],
  },
];

// Reemplaza el número con el formato internacional sin "+" (ej: 56912345678).
const whatsappPhone = '4741368586';
const whatsappMessage = 'Hola, me gustaría conversar sobre el programa y próximos pasos.';
const calendlyLink = 'https://calendly.com/annia-info/30min';
const interactiveTabs = {
  sintomas: {
    title: 'Cuando solo tratamos síntomas, el sistema se defiende',
    description:
      'Las soluciones parciales pueden aliviar hoy... y agravar mañana: costos ocultos, efectos colaterales, fatiga organizacional.',
    bullets: ['Parchea sin cambiar la estructura', 'Produce efectos no deseados', 'Refuerza el problema a mediano plazo'],
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
  { title: 'Incentivos', copy: 'Lo que el sistema premia (y castiga) manda.' },
  { title: 'Información', copy: 'Lo que se sabe, cuándo se sabe y quién lo sabe.' },
  { title: 'Relaciones', copy: 'La coordinación es infraestructura, no “buena voluntad”.' },
  { title: 'Reglas', copy: 'Normas formales e informales: el verdadero “código” del sistema.' },
];

const zoomBlock = {
  title: 'Zoom: Incentivos',
  bullets: ['Qué métricas gobiernan decisiones', 'Qué trade-offs se esconden', 'Qué comportamientos estamos reforzando'],
  note: 'Ejemplo: cuando solo se mide velocidad, se sacrifica calidad y confianza.',
};

function App() {
  const [activeTab, setActiveTab] = useState('sintomas');
  const [activeFaqId, setActiveFaqId] = useState(faqs[0].id);
  const tabContent = interactiveTabs[activeTab];
  const tabKeys = useMemo(() => Object.keys(interactiveTabs), []);
  const isPlayground = typeof window !== 'undefined' && window.location.pathname === '/playground';
  const returnFocusRef = useRef(null);
  const activeFaq = useMemo(() => faqs.find((faq) => faq.id === activeFaqId) ?? faqs[0], [activeFaqId]);

  const whatsappLink = useMemo(
    () => `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`,
    [whatsappPhone, whatsappMessage],
  );

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeOrg, setActiveOrg] = useState(null);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [quickRequestStatus, setQuickRequestStatus] = useState('idle');
  const [quickRequestMessage, setQuickRequestMessage] = useState('');

  const handleOpenOrg = (org, focusTarget) => {
    setActiveOrg(org);
    setIsOrgModalOpen(true);
    returnFocusRef.current = focusTarget;
  };

  const handleCloseOrg = () => {
    setIsOrgModalOpen(false);
  };

  const handleQuickRequestSubmit = async (event) => {
    event.preventDefault();
    setQuickRequestStatus('loading');
    setQuickRequestMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/quick-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload?.error || 'No se pudo enviar la solicitud.');
      }

      setQuickRequestStatus('success');
      setQuickRequestMessage('Solicitud enviada. Te llegará un correo de confirmación con los próximos pasos.');
      form.reset();
    } catch (error) {
      setQuickRequestStatus('error');
      setQuickRequestMessage(
        'No pudimos enviar tu solicitud. Inténtalo nuevamente o escribe directamente a info@annia.no.',
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  if (isPlayground) {
    return <DesignPlayground />;
  }

  return (
    <div className="page">
      <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <Container>
          <nav className="navbar__inner" aria-label="Navegación principal">
            <div className="brandmark">ANNiA</div>
            <div className="nav-links">
              {navLinks.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`}>
                  {link}
                </a>
              ))}
            </div>
            <div className="hero__actions">
              <Button variant="ghost" as="a" href="/playground" aria-label="Abrir playground de diseño">
                Playground
              </Button>
              <Button variant="secondary" aria-label="Solicitar información del programa">
                Solicitar información →
              </Button>
            </div>
          </nav>
        </Container>
      </header>

      <HeroRotator />

      <Section
        id="metodo"
        title="Trabajar en los sistemas, no solo en los síntomas"
        description="Una forma clara y aplicada de entender qué significa pensar sistémicamente — sin teoría innecesaria."
        className="reveal"
      />

      <Section id="experiencia" eyebrow="Síntomas vs Sistema" title="Interactivo" tone="mid" className="reveal">
        <div className="interactive">
          <Card variant="glass" as="article">
            <div className="interactive-tabs" aria-label="Selector de enfoque: síntomas o sistema">
              {tabKeys.map((key) => (
                <Button
                  key={key}
                  variant="ghost"
                  className={`interactive-tab ${activeTab === key ? 'interactive-tab--active' : ''}`}
                  onClick={() => setActiveTab(key)}
                  aria-label={key === 'sintomas' ? 'Ver enfoque de síntomas' : 'Ver enfoque de sistema'}
                >
                  {key === 'sintomas' ? 'Síntomas' : 'Sistema'}
                </Button>
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
          </Card>

          <div className="card-grid">
            {systemBlocks.map((block) => (
              <Card key={block.title} variant="glass" as="article">
                <h4>{block.title}</h4>
                <p>{block.copy}</p>
              </Card>
            ))}
            <Card variant="glass" as="article" className="section-grid" style={{ gridColumn: 'span 2' }}>
              <h4>{zoomBlock.title}</h4>
              <ul>
                {zoomBlock.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="interactive__note">{zoomBlock.note}</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section id="programa" title="Qué ocurre en este encuentro" tone="mid" className="reveal">
        <div className="card-grid">
          {highlightCards.map((card) => (
            <Card key={card.title} variant="glass" as="article">
              <h4>{card.title}</h4>
              <p>{card.copy}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="resultados" title="Resultados para los participantes" tone="light" className="reveal">
        <div className="result-flow">
          {outcomes.map((outcome, index) => (
            <article key={outcome.title} className="result-step">
              <div className="result-step__header">
                <span className="result-step__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="result-step__tag">{outcome.tag}</span>
              </div>
              <h4>{outcome.title}</h4>
              <p>{outcome.copy}</p>
              <div className="result-step__meter">
                <span style={{ '--result-progress': `${(index + 1) * 20}%` }} />
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="formato" title="Formato del encuentro" tone="light" className="reveal">
        <div className="format-strip">
          {formatCards.map((card) => (
            <div key={card.title} className="format-strip__row">
              <span className="format-strip__label">{card.title}</span>
              <span className="format-strip__value">{card.value}</span>
            </div>
          ))}
        </div>
        <p className="interactive__note">Cupos limitados · Aplicación requerida · Conversación de encaje disponible</p>
      </Section>

      <Section id="bergen" title="Por qué Bergen, Noruega" tone="light" className="reveal">
        <div className="split">
          <div className="section-grid">
            <p>
              La reflexión profunda y el aprendizaje sistémico requieren entornos que favorezcan el enfoque, el rigor y la perspectiva de largo plazo.
            </p>
            <p>
              Noruega ofrece un contexto singular donde naturaleza, tecnología y gobernanza conviven de manera avanzada. Bergen no es un escenario decorativo: es parte del método.
            </p>
            <div className="hero__chips">
              {['Inmersión', 'Enfoque', 'Rigor', 'Naturaleza + tecnología'].map((chip) => (
                <Chip key={chip} variant="solid">
                  {chip}
                </Chip>
              ))}
            </div>
          </div>
          <div className="gradient-card" />
        </div>
      </Section>

      <Section id="liderazgo" title="Liderazgo" tone="light" className="reveal">
        <div className="split split--reverse split--equipo">
          <div className="section-grid">
            <h3>A quién está dirigido</h3>
            <Card variant="elevated" className="section-grid equipo-card">
              <p>
                Directores, ejecutivos y tomadores de decisión del sector público, privado, industria y sociedad civil, con responsabilidad directa sobre políticas, estrategias organizacionales o iniciativas de alto impacto.
              </p>
              <p>
                Está diseñado para líderes con experiencia que buscan profundidad analítica, claridad estratégica y capacidad real de acción.
              </p>
            </Card>
          </div>
          <div className="section-grid">
            <h3>Quiénes convocan</h3>
            <div className="card-grid">
              {organizations.map((org) => (
                <Card
                  key={org.id}
                  variant="elevated"
                  as="button"
                  type="button"
                  className="convocan-card"
                  aria-haspopup="dialog"
                  onClick={(event) => handleOpenOrg(org, event.currentTarget)}
                >
                  <div className="convocan-card__header">
                    <h4>{org.name}</h4>
                    <span className="convocan-card__tagline">{org.tagline}</span>
                  </div>
                  <p>{org.description}</p>
                  <div className="convocan-card__meta">
                    <span>{org.url ? 'Sitio disponible' : 'Detalle interno'}</span>
                    <span>Ver más →</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="faq" title="Preguntas frecuentes" tone="light" className="reveal">
        <div className="faq-shell">
          <div className="faq-sidebar" role="tablist" aria-label="Lista de preguntas frecuentes">
            <div className="faq-sidebar__header">
              <span className="faq-sidebar__label">Biblioteca dinámica</span>
              <h3>Explora como si fuera un chat estratégico</h3>
              <p>Selecciona una pregunta y observa cómo el asistente sintetiza decisiones, contexto y próximos pasos.</p>
            </div>
            <div className="faq-sidebar__list">
              {faqs.map((faq) => (
                <button
                  key={faq.id}
                  className={`faq-sidebar__item ${activeFaqId === faq.id ? 'is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeFaqId === faq.id}
                  onClick={() => setActiveFaqId(faq.id)}
                >
                  <span className="faq-sidebar__title">{faq.question}</span>
                  <span className="faq-sidebar__meta">{faq.summary}</span>
                </button>
              ))}
            </div>
            <div className="faq-sidebar__footer">
              <span>Automatización estilo OpenAI</span>
              <p>Respuestas guiadas, contexto sintetizado y follow-ups sugeridos para acelerar decisiones.</p>
            </div>
          </div>

          <div className="faq-chat" role="tabpanel">
            <div className="faq-chat__header">
              <span className="faq-chat__badge">Asistente FAQ</span>
              <div>
                <h3>{activeFaq.question}</h3>
                <p>Tiempo estimado de respuesta: 12 segundos</p>
              </div>
            </div>

            <div className="faq-chat__thread">
              <div className="chat-bubble chat-bubble--user">
                <p>{activeFaq.question}</p>
              </div>
              <div className="chat-bubble chat-bubble--assistant">
                <h4>{activeFaq.answer.heading}</h4>
                {activeFaq.answer.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <ul>
                  {activeFaq.answer.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="faq-chat__actions" aria-label="Siguientes preguntas sugeridas">
              {activeFaq.followUps.map((followUp) => (
                <button key={followUp} type="button" className="faq-chat__chip">
                  {followUp}
                </button>
              ))}
            </div>

            <div className="faq-chat__input" aria-label="Entrada de chat simulada">
              <span>Escribe tu pregunta…</span>
              <Button type="button" variant="dark" disabled>
                Enviar
              </Button>
            </div>
            <a className="faq-chat__handoff" href="#contacto">
              ¿No encuentras lo que buscas? Habla con un humano →
            </a>
          </div>
        </div>
      </Section>

      <Section id="contacto" title="Conversemos" tone="light" className="reveal cta-section">
        <div className="split">
          <div className="section-grid">
            <p>Si estás evaluando tu participación o la de tu institución, podemos conversar directamente para explorar encaje y próximos pasos.</p>
            <div className="contact-actions">
              <Button
                as="a"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                variant="primary"
                aria-label="Contactar por WhatsApp"
              >
                WhatsApp
              </Button>
              <Button
                as="a"
                href={calendlyLink}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                aria-label="Agendar una conversación"
              >
                Agendar conversación
              </Button>
            </div>
            <p className="interactive__note">*Disponible arriba: asistente inteligente para responder preguntas frecuentes sobre el programa.*</p>
          </div>

          <Card
            variant="elevated"
            as="form"
            className="ui-form"
            aria-label="Formulario de solicitud rápida"
            method="POST"
            action="/api/quick-request"
            onSubmit={handleQuickRequestSubmit}
          >
            <h4>Solicitud rápida</h4>
            <input type="text" name="nombre" placeholder="Nombre" aria-label="Nombre" required />
            <input type="email" name="email" placeholder="Correo" aria-label="Correo" required />
            <input
              type="text"
              name="rol_organizacion"
              placeholder="Rol / Organización"
              aria-label="Rol u organización"
              required
            />
            <select name="interes" aria-label="Tipo de interés" required defaultValue="">
              <option value="" disabled>
                Tipo de interés
              </option>
              <option value="Participación individual">Participación individual</option>
              <option value="Inscripción de equipo">Inscripción de equipo</option>
              <option value="Alianza institucional">Alianza institucional</option>
              <option value="Prensa u otro">Prensa u otro</option>
            </select>
            <Button type="submit" variant="dark" aria-label="Enviar solicitud" disabled={quickRequestStatus === 'loading'}>
              Enviar
            </Button>
            <p className="interactive__note">
              Al enviar, recibirás un correo de confirmación y te contactamos con el overview y próximos pasos.
            </p>
            {quickRequestMessage ? (
              <p className="interactive__note" role="status" aria-live="polite">
                {quickRequestMessage}
              </p>
            ) : null}
          </Card>
        </div>
      </Section>

      <footer className="footer reveal">
        <Container className="footer__content">
          <div className="footer__meta">
            <p>ANNiA + Vida al Centro · Cohorte fundacional 2026</p>
            <p>
              Systemic Strategy &amp; Leadership for Complex Issues es una iniciativa educativa diseñada para fortalecer capacidades de liderazgo sistémico y estratégico frente a desafíos complejos.
            </p>
          </div>
          <div className="footer__icons" aria-label="Redes sociales">
            <span className="footer__sky" aria-hidden="true" />
            <a
              className="footer__icon-link"
              href="https://www.instagram.com/annia.no?igsh=MTYzcXkwY2hkczg4eA=="
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de ANNiA"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm5 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm5.5-.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z"
                  fill="currentColor"
                />
              </svg>
              <span className="sr-only">Instagram</span>
            </a>
            <a
              className="footer__icon-link"
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M21.7 8.1a3 3 0 0 0-2.1-2.1C17.8 5.5 12 5.5 12 5.5s-5.8 0-7.6.5A3 3 0 0 0 2.3 8.1 31.3 31.3 0 0 0 1.9 12c0 1.3.1 2.6.4 3.9a3 3 0 0 0 2.1 2.1c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a3 3 0 0 0 2.1-2.1c.3-1.3.4-2.6.4-3.9 0-1.3-.1-2.6-.4-3.9Zm-11 6V9.9l3.6 2.1-3.6 2.1Z"
                  fill="currentColor"
                />
              </svg>
              <span className="sr-only">YouTube</span>
            </a>
          </div>
        </Container>
      </footer>
      <OrganizationModal open={isOrgModalOpen} onClose={handleCloseOrg} org={activeOrg} returnFocusRef={returnFocusRef} />
    </div>
  );
}

export default App;
