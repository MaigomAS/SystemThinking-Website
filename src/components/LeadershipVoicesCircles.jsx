import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import Section from './ui/Section.jsx';

const COPY = {
  es: {
    eyebrow: 'Experiencias que transforman',
    title: 'Líderes que aplican pensamiento sistémico en el mundo real',
    subtitle: 'Haz clic en un perfil para ver el mini-caso (no es recomendación del programa).',
    disclaimer: '',
    cta: 'Saber más',
    modalDisclaimer: '',
    modalActions: {
      close: 'Cerrar modal',
      previous: 'Ver líder anterior',
      next: 'Ver siguiente líder',
    },
  },
  en: {
    eyebrow: 'Experiences that transform',
    title: 'Voices applying systemic thinking in the real world',
    subtitle: 'Click a profile to see the mini-case (not a program endorsement).',
    disclaimer: '*Independent perspectives. They do not constitute program endorsement.',
    cta: 'Learn more',
    modalDisclaimer: 'Independent perspective on systemic thinking. Not a program endorsement.',
    modalActions: {
      close: 'Close modal',
      previous: 'View previous voice',
      next: 'View next voice',
    },
  },
};

// When real images are available, import them here and set imageSrc per voice.
// Example: import voice1 from '../assets/leadership/voice-1.jpg';
const VOICES = [
  {
    id: 'voice-1',
    name: 'Marta Escobar',
    handle: '@marta.sistemas',
    role: 'Directora de Operaciones',
    sector: 'Agroindustria',
    initials: 'ME',
    tags: ['Cadenas de suministro', 'Gobernanza', 'Escala'],
    insightTitle: 'Coordinar el ritmo sin perder flexibilidad',
    context:
      'La organización había crecido rápido y los equipos locales estaban tomando decisiones contradictorias sobre inventario y logística.',
    lever: 'Rediseñamos los incentivos para que las metas regionales compartieran un objetivo sistémico común.',
    impact: 'El lead time se redujo y la visibilidad del flujo completo aumentó sin frenar la velocidad de ejecución.',
    learning: 'Cuando el sistema premia coordinación, la autonomía deja de ser ruido y se vuelve capacidad.',
    // TODO: When assets are available, import image files and set imageSrc here.
    imageSrc: null,
  },
  {
    id: 'voice-2',
    name: 'Sofía Lema',
    handle: '@sofia.lema',
    role: 'Head de Producto',
    sector: 'Fintech',
    initials: 'SL',
    tags: ['Decisiones', 'Riesgo', 'Experiencia'],
    insightTitle: 'Alinear decisiones críticas sin perder foco en el cliente',
    context:
      'El equipo tenía insights dispersos y las prioridades cambiaban cada sprint, afectando la confianza del usuario final.',
    lever: 'Clarificamos la arquitectura de información y quién debía decidir cada cambio crítico.',
    impact: 'Se redujeron re-trabajos y el roadmap ganó coherencia con la propuesta de valor.',
    learning: 'El timing correcto de la información evita que la estrategia se convierta en improvisación.',
    imageSrc: null,
  },
  {
    id: 'voice-3',
    name: 'Andrés Villaseñor',
    handle: '@andres.villa',
    role: 'Chief Sustainability Officer',
    sector: 'Energía renovable',
    initials: 'AV',
    tags: ['Stakeholders', 'Política pública', 'Transición'],
    insightTitle: 'Convertir relaciones en infraestructura de cambio',
    context:
      'La transición energética requería coordinar actores públicos y privados con tiempos y prioridades distintas.',
    lever: 'Creamos un mapa de relaciones críticas y diseñamos rituales de coordinación recurrentes.',
    impact: 'Los acuerdos estratégicos se aceleraron y el pipeline de proyectos ganó tracción.',
    learning: 'Las relaciones sostenidas son un activo estructural, no un “extra” relacional.',
    imageSrc: null,
  },
];

function LeadershipVoicesCircles() {
  const { language } = useLanguage();
  const content = COPY[language] ?? COPY.es;
  const [activeIndex, setActiveIndex] = useState(null);
  const lastTriggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const bodyOverflowRef = useRef('');

  const activeVoice = useMemo(() => {
    if (activeIndex === null) return null;
    return VOICES[activeIndex];
  }, [activeIndex]);

  const handleOpen = (index, event) => {
    setActiveIndex(index);
    lastTriggerRef.current = event.currentTarget;
  };

  const handleClose = () => {
    setActiveIndex(null);
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + VOICES.length) % VOICES.length;
    });
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % VOICES.length;
    });
  };

  useEffect(() => {
    if (activeIndex === null) {
      if (lastTriggerRef.current) {
        lastTriggerRef.current.focus();
      }
      return;
    }

    bodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = bodyOverflowRef.current;
    };
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    closeButtonRef.current?.focus();
  }, [activeIndex]);

  const modal =
    activeVoice && typeof document !== 'undefined'
      ? createPortal(
          <div className="voices-modal__overlay" onClick={handleClose} role="presentation">
            <div
              className="voices-modal__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`voice-title-${activeVoice.id}`}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="voices-modal__close"
                aria-label={content.modalActions.close}
                onClick={handleClose}
                ref={closeButtonRef}
              >
                ×
              </button>
              <button
                type="button"
                className="voices-modal__nav voices-modal__nav--prev"
                aria-label={content.modalActions.previous}
                onClick={handlePrevious}
              >
                ←
              </button>
              <button
                type="button"
                className="voices-modal__nav voices-modal__nav--next"
                aria-label={content.modalActions.next}
                onClick={handleNext}
              >
                →
              </button>
              <div className="voices-modal__content">
                <aside className="voices-modal__aside">
                  <div className="voices-modal__badge">
                    {activeVoice.imageSrc ? (
                      <img src={activeVoice.imageSrc} alt={activeVoice.name} />
                    ) : (
                      <span>{activeVoice.initials}</span>
                    )}
                  </div>
                  <div className="voices-modal__identity">
                    <p className="voices-modal__name" id={`voice-title-${activeVoice.id}`}>
                      {activeVoice.name}
                    </p>
                    <span className="voices-modal__handle">{activeVoice.handle}</span>
                    <p className="voices-modal__role">{activeVoice.role}</p>
                    <p className="voices-modal__sector">{activeVoice.sector}</p>
                  </div>
                  <div className="voices-modal__tags">
                    {activeVoice.tags.map((tag) => (
                      <span key={tag} className="voices-modal__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </aside>
                <div className="voices-modal__body">
                  <h3 className="voices-modal__headline">{activeVoice.insightTitle}</h3>
                  <div className="voices-modal__block">
                    <h4>Contexto</h4>
                    <p>{activeVoice.context}</p>
                  </div>
                  <div className="voices-modal__block">
                    <h4>Decisión / palanca</h4>
                    <p>{activeVoice.lever}</p>
                  </div>
                  <div className="voices-modal__block">
                    <h4>Qué cambió</h4>
                    <p>{activeVoice.impact}</p>
                  </div>
                  <div className="voices-modal__block">
                    <h4>Aprendizaje ejecutivo</h4>
                    <p>{activeVoice.learning}</p>
                  </div>
                  {content.modalDisclaimer ? (
                    <p className="voices-modal__disclaimer">{content.modalDisclaimer}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <Section tone="light" className="voices" aria-label={content.title}>
        <div className="voices__header">
          <span className="voices__eyebrow">{content.eyebrow}</span>
          <h3 className="voices__title">{content.title}</h3>
          <p className="voices__subtitle">{content.subtitle}</p>
        </div>
        <div className="voices__grid">
          {VOICES.map((voice, index) => (
            <button
              key={voice.id}
              type="button"
              className="voices__card"
              onClick={(event) => handleOpen(index, event)}
              aria-label={`${voice.name}, ${content.cta}`}
            >
              <div className="voices__circle" aria-hidden="true">
                {voice.imageSrc ? (
                  <img src={voice.imageSrc} alt="" />
                ) : (
                  <span className="voices__initials">{voice.initials}</span>
                )}
                <span className="voices__cta">{content.cta}</span>
              </div>
              <div className="voices__meta">
                <span className="voices__name">{voice.name}</span>
                <span className="voices__handle">{voice.handle}</span>
                <span className="voices__role">
                  {voice.role} · {voice.sector}
                </span>
              </div>
            </button>
          ))}
        </div>
        {content.disclaimer ? (
          <p className="voices__disclaimer">{content.disclaimer}</p>
        ) : null}
      </Section>
      {modal}
    </>
  );
}

export default LeadershipVoicesCircles;
