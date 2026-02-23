import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import Section from './ui/Section.jsx';
import elisaPortrait from '../assets/leadership/voice-1.jpg';
import sofiaPortrait from '../assets/leadership/voice-2.jpg';
import andresPortrait from '../assets/leadership/voice-3.jpg';

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
    modalLabels: {
      context: 'Contexto',
      lever: 'Decisión / palanca',
      impact: 'Qué cambió',
      learning: 'Aprendizaje ejecutivo',
    },
    linkedInLabel: 'Ver perfil de LinkedIn',
  },
  en: {
    eyebrow: 'Experiences that transform',
    title: 'Voices applying systemic thinking in the real world',
    subtitle: 'Click a profile to see the mini-case (not a program endorsement).',
    disclaimer: '',
    cta: 'Learn more',
    modalDisclaimer: 'Independent perspective on systemic thinking. Not a program endorsement.',
    modalActions: {
      close: 'Close modal',
      previous: 'View previous voice',
      next: 'View next voice',
    },
    modalLabels: {
      context: 'Context',
      lever: 'Decision / leverage',
      impact: 'What changed',
      learning: 'Executive learning',
    },
    linkedInLabel: 'View LinkedIn profile',
  },
};

const VOICES = {
  es: [
    {
      id: 'voice-elisa-estrada',
      name: 'Elisa Estrada',
      linkedInUrl: 'https://www.linkedin.com/in/elisaestradat/?originalSubdomain=mx',
      summary:
        'Lideró la implementación del primer Ecosistema de Cuidados municipal en América Latina, aplicando un enfoque sistémico desde el gobierno local.',
      role: 'Titular de la Secretaría de las Mujeres',
      sector: 'Apodaca, México',
      initials: 'EE',
      details: [
        'Titular de la Secretaría de las Mujeres, Apodaca, México',
        'Gobierno local',
        'Ecosistema de cuidados',
        'Política pública',
      ],
      insightTitle: 'Decidir en sistemas vivos requiere corresponsabilidad real',
      testimonial:
        '“Los principales desafíos actuales —sociales, económicos y ambientales— son problemas complejos e interconectados que no pueden resolverse con decisiones aisladas ni desde una sola institución. Estas herramientas de pensamiento y estrategia sistémica, nos dimensionan y nos potencian, entendiendo que ningún actor posee la visión completa del sistema.\n\nEsto es clave hoy, porque cada decisión puede reproducir desigualdades o, por el contrario, generar transformaciones sostenibles que pongan la vida, el bienestar y la estabilidad social al centro.”',
      imageSrc: elisaPortrait,
    },
    {
      id: 'voice-2',
      name: 'L. Agustín Landa G-T',
      linkedInUrl: 'https://www.linkedin.com/in/agustinlanda/',
      summary:
        'Referente en pensamiento y estrategia sistémica, con aplicación directa en procesos de cambio social en el tercer sector.',
      role: 'Fundador de LANZA',
      sector: 'Líder de la sociedad civil',
      initials: 'AL',
      details: [
        'Líder de la sociedad civil',
        'Fundador de LANZA',
        'Pionero del pensamiento y la estrategia sistémica aplicados al cambio social en el tercer sector.',
        'Consultor en procuración de fondos, fundaciones comunitarias, principios ASG y creación y desarrollo de consejos de OSC',
        'Pionero del pensamiento y la estrategia sistémica aplicados a cambios sociales en el tercer sector',
      ],
      insightTitle: 'Anticipar el cambio conectando los puntos del sistema',
      testimonial:
        '“Los líderes de cualquier sector tienen una capacidad de prevenir o anticipar lo que va a suceder, para hacerlo es importante que conecten los diferentes puntos y entender que las soluciones no son unifactoriales es definitivo para el éxito del cumplimiento del propósito. Esto se ha hablado siempre en el mundo pero en realidad poco hacemos para vivirlo porque implica una visión de largo plazo mucho más allá de la vida misma personal.”',
      imageSrc: sofiaPortrait,
    },
    {
      id: 'voice-3',
      name: 'Ana Ricalde',
      linkedInUrl: 'https://www.linkedin.com/in/anapau-ricalde/',
      summary:
        'Líder en diseño y articulación de ecosistemas, especializada en estrategia y tejido de redes en el tercer sector.',
      role: 'Subdirectora',
      sector: 'Fundación Santander',
      initials: 'AR',
      details: [
        'Líder del tercer sector',
        'Subdirectora Fundación Santander',
        'Lideresa de ecosistema, estratega y articuladora de redes en el tercer sector.',
        'Liderazgo de ecosistema, estrategia y tejido de redes para transformar el tercer sector.',
      ],
      insightTitle: 'Liderar transiciones sistémicas desde alianzas multiactor',
      testimonial:
        '“Desde que conocí estas perspectivas mi paradigma cambió, y con él, mi propósito de vida, hoy enfocado a liderar transiciones sistémicas en alianzas multiactor desde el 3er sector”.',
      imageSrc: andresPortrait,
    },
  ],
  en: [
    {
      id: 'voice-elisa-estrada',
      name: 'Elisa Estrada',
      linkedInUrl: 'https://www.linkedin.com/in/elisaestradat/?originalSubdomain=mx',
      summary:
        'Led the implementation of Latin America’s first municipal Care Ecosystem, applying a systemic approach from local government.',
      role: 'Head of the Minister of Women Affairs, Apodaca, Mexico',
      sector: 'Local government',
      initials: 'EE',
      details: [
        'Head of the Minister of Women Affairs, Apodaca, Mexico',
        'Local government',
        'Care ecosystems',
        'Public policy',
      ],
      insightTitle: 'Decisions in living systems require shared responsibility',
      testimonial:
        '“Today’s key social, economic, and environmental challenges are complex and interconnected. They cannot be solved through isolated decisions or by a single institution. Systemic thinking and strategy tools help us see scale and possibility, recognizing that no one actor holds the whole-system view.\n\nThis matters now because every decision can either reproduce inequality or enable sustainable transformations that place life, wellbeing, and social stability at the center.”',
      imageSrc: elisaPortrait,
    },
    {
      id: 'voice-2',
      name: 'L. Agustín Landa G-T',
      linkedInUrl: 'https://www.linkedin.com/in/agustinlanda/',
      summary:
        'Reference in systemic thinking and strategy, directly applied to social change processes in the third sector.',
      role: 'Civil society leader',
      sector: 'LANZA Founder',
      initials: 'AL',
      details: [
        'Civil society leader',
        'LANZA Founder',
        'Pioneering systems thinker and strategist for social change in the third sector.',
        'Fundraising, community foundations, ESG principles, and CSO council development consultant',
        'Pioneer of systems thinking and systems strategy applied to social change in the third sector',
      ],
      insightTitle: 'Anticipating change by connecting systemic dots',
      testimonial:
        '“Leaders in any sector can prevent or anticipate what is coming when they connect the different points in the system. Understanding that solutions are not single-factor is decisive to fulfill a shared purpose successfully. We have always talked about this, but we rarely live it, because it requires a long-term vision far beyond personal timelines.”',
      imageSrc: sofiaPortrait,
    },
    {
      id: 'voice-3',
      name: 'Ana Ricalde',
      linkedInUrl: 'https://www.linkedin.com/in/anapau-ricalde/',
      summary:
        'Leader in ecosystem design and articulation, specialized in strategy and network weaving in the third sector.',
      role: 'Third sector leader',
      sector: 'Deputy Director, Fundación Santander',
      initials: 'AR',
      details: [
        'Third sector leader',
        'Deputy Director, Fundación Santander',
        'Ecosystem leader and network weaver driving strategy across the third sector.',
        'Ecosystem leader, strategist, and network weaver in the third sector',
      ],
      insightTitle: 'Leading systemic transitions through multi-stakeholder alliances',
      testimonial:
        '“Since discovering these perspectives, my paradigm changed, and with it, my life purpose—now focused on leading systemic transitions through multi-stakeholder alliances from the third sector.”',
      imageSrc: andresPortrait,
    },
  ],
};

function LeadershipVoicesCircles() {
  const { language } = useLanguage();
  const content = COPY[language] ?? COPY.es;
  const voices = VOICES[language] ?? VOICES.es;
  const [activeIndex, setActiveIndex] = useState(null);
  const lastTriggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const bodyOverflowRef = useRef('');

  const activeVoice = useMemo(() => {
    if (activeIndex === null) return null;
    return voices[activeIndex];
  }, [activeIndex, voices]);

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
      return (prev - 1 + voices.length) % voices.length;
    });
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % voices.length;
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
                    {activeVoice.summary ? (
                      <p className="voices-modal__summary">{activeVoice.summary}</p>
                    ) : null}
                    <p className="voices-modal__role">{activeVoice.role}</p>
                    <p className="voices-modal__sector">{activeVoice.sector}</p>
                  </div>
                  {activeVoice.linkedInUrl ? (
                    <a
                      className="voices-modal__linkedin-cta"
                      href={activeVoice.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${content.linkedInLabel}: ${activeVoice.name}`}
                    >
                      <span aria-hidden="true">in</span>
                      {content.linkedInLabel}
                    </a>
                  ) : null}
                </aside>
                <div className="voices-modal__body">
                  <h3 className="voices-modal__headline">{activeVoice.insightTitle}</h3>
                  <blockquote className="voices-modal__quote">
                    <p>{activeVoice.testimonial}</p>
                  </blockquote>
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
          {voices.map((voice, index) => (
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
                <span className="voices__name-row">
                  <span className="voices__name">{voice.name}</span>
                  {voice.linkedInUrl ? (
                    <a
                      className="voices__linkedin"
                      href={voice.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${content.linkedInLabel}: ${voice.name}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                        role="img"
                      >
                        <path
                          d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.08 1 2.5 1 4.98 2.12 4.98 3.5zM0.5 8.5h4V23h-4zM8.5 8.5h3.8v1.98h.05c.53-1 1.82-2.06 3.74-2.06 4 0 4.74 2.63 4.74 6.06V23h-4v-6.54c0-1.56-.03-3.56-2.17-3.56-2.17 0-2.5 1.7-2.5 3.45V23h-4z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                  ) : null}
                </span>
                {voice.summary ? <span className="voices__summary">{voice.summary}</span> : null}
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
