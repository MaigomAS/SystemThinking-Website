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

const navLinks = ['Programa', 'Método', 'Experiencia', 'Equipo', 'FAQ', 'Contacto'];

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

const faqs = ['¿Es un programa introductorio?', '¿Qué incluye el encuentro?', '¿Cómo es el proceso de aplicación?', '¿Se publica el costo?'];

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
  const tabContent = interactiveTabs[activeTab];
  const tabKeys = useMemo(() => Object.keys(interactiveTabs), []);
  const isPlayground = typeof window !== 'undefined' && window.location.pathname === '/playground';
  const returnFocusRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeOrg, setActiveOrg] = useState(null);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);

  const handleOpenOrg = (org, focusTarget) => {
    setActiveOrg(org);
    setIsOrgModalOpen(true);
    returnFocusRef.current = focusTarget;
  };

  const handleCloseOrg = () => {
    setIsOrgModalOpen(false);
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
        <div className="result-grid">
          {outcomes.map((outcome) => (
            <Card key={outcome} variant="elevated" as="article">
              <p>{outcome}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="formato" title="Formato del encuentro" tone="light" className="reveal">
        <div className="card-grid">
          {formatCards.map((card) => (
            <Card key={card.title} variant="elevated" as="article">
              <span>{card.title}</span>
              <strong>{card.value}</strong>
            </Card>
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

      <Section id="equipo" title="A quién está dirigido" tone="light" className="reveal">
        <div className="split split--reverse">
          <Card variant="elevated" className="section-grid">
            <p>
              Directores, ejecutivos y tomadores de decisión del sector público, privado, industria y sociedad civil, con responsabilidad directa sobre políticas, estrategias organizacionales o iniciativas de alto impacto.
            </p>
            <p>
              Está diseñado para líderes con experiencia que buscan profundidad analítica, claridad estratégica y capacidad real de acción.
            </p>
          </Card>
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
                    <span>Ver preview →</span>
                  </div>
                </Card>
              ))}
            </div>
            <p className="interactive__note">Nota: en el overview PDF se incluyen perfiles ampliados, agenda detallada y logística.</p>
          </div>
        </div>
      </Section>

      <Section id="faq" title="Preguntas frecuentes" tone="light" className="reveal">
        <div className="faq-list">
          {faqs.map((question) => (
            <button key={question} className="faq-item" type="button" aria-label={`Ver respuesta: ${question}`}>
              <span>{question}</span>
              <span aria-hidden="true">+</span>
            </button>
          ))}
        </div>
      </Section>

      <Section id="contacto" title="Conversemos" tone="light" className="reveal cta-section">
        <div className="split">
          <div className="section-grid">
            <p>Si estás evaluando tu participación o la de tu institución, podemos conversar directamente para explorar encaje y próximos pasos.</p>
            <div className="contact-actions">
              <Button variant="primary" aria-label="Contactar por WhatsApp">
                WhatsApp
              </Button>
              <Button variant="outline" aria-label="Agendar una conversación">
                Agendar conversación
              </Button>
            </div>
            <p className="interactive__note">*Próximamente: asistente inteligente para responder preguntas frecuentes sobre el programa.*</p>
          </div>

          <Card variant="elevated" as="form" className="ui-form" aria-label="Formulario de solicitud rápida">
            <h4>Solicitud rápida</h4>
            <input type="text" placeholder="Nombre" aria-label="Nombre" />
            <input type="email" placeholder="Correo" aria-label="Correo" />
            <input type="text" placeholder="Rol / Organización" aria-label="Rol u organización" />
            <Button type="button" variant="dark" aria-label="Enviar solicitud">
              Enviar
            </Button>
            <p className="interactive__note">Al enviar, te contactamos con el overview y próximos pasos.</p>
          </Card>
        </div>
      </Section>

      <footer className="footer reveal">
        <Container className="footer__content">
          <div>
            <p>ANNiA + Vida al Centro · Cohorte fundacional 2026</p>
            <p>
              Systemic Strategy &amp; Leadership for Complex Issues es una iniciativa educativa diseñada para fortalecer capacidades de liderazgo sistémico y estratégico frente a desafíos complejos.
            </p>
          </div>
          <div className="footer__icons">
            <span>Instagram</span>
            <span>YouTube</span>
          </div>
        </Container>
      </footer>
      <OrganizationModal open={isOrgModalOpen} onClose={handleCloseOrg} org={activeOrg} returnFocusRef={returnFocusRef} />
    </div>
  );
}

export default App;
