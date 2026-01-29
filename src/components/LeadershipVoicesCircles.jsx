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

const resolveVoiceValue = (value, language) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[language] ?? value.es ?? Object.values(value)[0];
  }
  return value;
};

const resolveVoiceTags = (value, language) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    return value[language] ?? value.es ?? Object.values(value)[0] ?? [];
  }
  return [];
};

// When real images are available, import them here and set imageSrc per voice.
// Example: import voice1 from '../assets/leadership/voice-1.jpg';
const VOICES = [
  {
    id: 'voice-1',
    name: 'Elisa Estrada',
    handle: '@elisa.estrada',
    role: {
      es: 'Líder gubernamental',
      en: 'Government leader',
    },
    sector: {
      es: 'Política pública y derechos de las mujeres',
      en: 'Public policy & women’s rights',
    },
    initials: 'EE',
    tags: {
      es: ['Gobernanza', 'Cuidados', 'Política pública'],
      en: ['Governance', 'Care systems', 'Public policy'],
    },
    insightTitle: {
      es: 'Poner la vida al centro de la estrategia sistémica',
      en: 'Centering life in systemic strategy',
    },
    context: {
      es: 'Como titular de la Secretaría de la Mujer en Apodaca, impulsó el primer ecosistema municipal de cuidados en Latinoamérica para coordinar actores públicos y sociales.',
      en: 'As Head of the Ministry of Women Affairs in Apodaca, she launched Latin America’s first municipal care ecosystem, aligning public and social actors.',
    },
    lever: {
      es: 'Aplicar pensamiento sistémico para comprender causas estructurales, anticipar efectos no deseados y coordinar decisiones interinstitucionales.',
      en: 'Use systemic thinking to reveal structural causes, anticipate unintended effects, and align cross-sector decision-making.',
    },
    impact: {
      es: 'Las decisiones dejan de ser aisladas y se orientan a transformaciones sostenibles que reducen desigualdades y fortalecen el bienestar.',
      en: 'Decisions shift from isolated fixes to sustainable transformations that reduce inequities and strengthen wellbeing.',
    },
    learning: {
      es: 'Poner la vida al centro implica corresponsabilidad: cuidar personas, territorio y tejido social como base del desarrollo.',
      en: 'Centering life requires co-responsibility: caring for people, territory, and social ties as the foundation for development.',
    },
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

  const localizedVoices = useMemo(
    () =>
      VOICES.map((voice) => ({
        ...voice,
        name: resolveVoiceValue(voice.name, language),
        handle: resolveVoiceValue(voice.handle, language),
        role: resolveVoiceValue(voice.role, language),
        sector: resolveVoiceValue(voice.sector, language),
        tags: resolveVoiceTags(voice.tags, language),
        insightTitle: resolveVoiceValue(voice.insightTitle, language),
        context: resolveVoiceValue(voice.context, language),
        lever: resolveVoiceValue(voice.lever, language),
        impact: resolveVoiceValue(voice.impact, language),
        learning: resolveVoiceValue(voice.learning, language),
      })),
    [language],
  );

  const activeVoice = useMemo(() => {
    if (activeIndex === null) return null;
    return localizedVoices[activeIndex];
  }, [activeIndex, localizedVoices]);

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
          {localizedVoices.map((voice, index) => (
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
