import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from './components/ui/Button.jsx';
import Card from './components/ui/Card.jsx';
import Chip from './components/ui/Chip.jsx';
import Container from './components/ui/Container.jsx';
import Section from './components/ui/Section.jsx';
import DesignPlayground from './components/DesignPlayground.jsx';
import ECallPage from './components/ECallPage.jsx';
import HeroRotator from './components/HeroRotator.jsx';
import LeadershipVoicesCircles from './components/LeadershipVoicesCircles.jsx';
import OrganizationModal from './components/OrganizationModal.jsx';
import sectionOrder from './data/sections.json';
import { getOrganizations } from './data/organizations.js';
import { useLanguage } from './i18n/LanguageContext.jsx';
import bergenStatementImage from './assets/bergen-hero.png';
import experienceSaunaImage from './assets/experience-sauna.png';
import experienceHardangerImage from './assets/experience-hardanger.png';
import experienceVossImage from './assets/experience-voss.png';

const whatsappPhone = '4741368586';
const calendlyLink = 'https://calendly.com/annia-info/30min';
const bergenVideoId = 'dQw4w9WgXcQ';

const EXPERIENCES = {
  es: [
    {
      title: 'Sauna & fiordo',
      badge: 'Experiencia social',
      lead: 'Reset físico y mental',
      description: 'Contraste térmico nórdico para claridad, presencia y energía sostenida.',
      image: experienceSaunaImage,
    },
    {
      title: 'Almuerzo en huerto (Hardanger)',
      badge: 'Tour opcional',
      lead: 'Conversaciones sin prisa',
      description: 'Recorrido lento para conversar con perspectiva y pausa consciente.',
      sourceUrl:
        'https://www.getyourguide.es/bergen-l1132/bergen-tour-por-el-fiordo-hardanger-con-almuerzo-y-cascadas-t1126812/?ranking_uuid=3c415476-d1e5-49b2-b8d3-67615888f16a',
      image: experienceHardangerImage,
    },
    {
      title: 'Voss + cascadas',
      badge: 'Tour opcional',
      lead: 'Escala y perspectiva',
      description: 'Panoramas abiertos para reencuadrar desafíos y prioridades estratégicas.',
      sourceUrl:
        'https://www.getyourguide.es/bergen-l1132/bergen-hardangerfjord-telecabina-de-voss-y-3-grandes-cascadas-t348716/?ranking_uuid=3c415476-d1e5-49b2-b8d3-67615888f16a',
      image: experienceVossImage,
    },
  ],
  en: [
    {
      title: 'Sauna & fjord',
      badge: 'Social experience',
      lead: 'Physical and mental reset',
      description: 'Nordic thermal contrast for clarity, presence, and sustained energy.',
      image: experienceSaunaImage,
    },
    {
      title: 'Orchard lunch (Hardanger)',
      badge: 'Optional tour',
      lead: 'Unhurried conversations',
      description: 'A slower pace that invites perspective, focus, and quiet dialogue.',
      sourceUrl:
        'https://www.getyourguide.es/bergen-l1132/bergen-tour-por-el-fiordo-hardanger-con-almuerzo-y-cascadas-t1126812/?ranking_uuid=3c415476-d1e5-49b2-b8d3-67615888f16a',
      image: experienceHardangerImage,
    },
    {
      title: 'Voss + waterfalls',
      badge: 'Optional tour',
      lead: 'Scale and perspective',
      description: 'Open panoramas to reframe strategic priorities and decisions.',
      sourceUrl:
        'https://www.getyourguide.es/bergen-l1132/bergen-hardangerfjord-telecabina-de-voss-y-3-grandes-cascadas-t348716/?ranking_uuid=3c415476-d1e5-49b2-b8d3-67615888f16a',
      image: experienceVossImage,
    },
  ],
};

function App() {
  const { t, language, setLanguage } = useLanguage();
  const navLinks = t.nav.links;
  const outcomes = t.outcomes.items;
  const formatCards = t.format.cards;
  const highlightCards = t.program.cards;
  const faqs = t.faq.items;
  const interactiveTabs = t.interactive.tabs;
  const systemBlocks = t.interactive.systemBlocks;
  const leverItems = t.interactive.levers;
  const organizations = useMemo(() => getOrganizations(t.organizations), [t]);
  const leadershipOrganizations = useMemo(
    () => organizations.filter((org) => org.id !== 'direccion'),
    [organizations],
  );

  const [activeTab, setActiveTab] = useState('entender');
  const [activeFaqId, setActiveFaqId] = useState(faqs[0]?.id ?? '');
  const [activeLeverIndex, setActiveLeverIndex] = useState(null);
  const [isBergenVideoOpen, setIsBergenVideoOpen] = useState(false);
  const [isInvestmentFormOpen, setIsInvestmentFormOpen] = useState(false);
  const isLeverOpen = activeLeverIndex !== null;
  const tabKeys = useMemo(() => Object.keys(interactiveTabs), [interactiveTabs]);
  const isPlayground = typeof window !== 'undefined' && window.location.pathname === '/playground';
  const isECall = typeof window !== 'undefined' && window.location.pathname === '/e-call';
  const returnFocusRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const leverTitleRef = useRef(null);
  const investmentModalTitleRef = useRef(null);
  const investmentTriggerRef = useRef(null);
  const activeFaq = useMemo(() => faqs.find((faq) => faq.id === activeFaqId) ?? faqs[0], [activeFaqId, faqs]);
  const experienceItems = useMemo(() => EXPERIENCES[language] ?? EXPERIENCES.es, [language]);
  const experienceTrackRef = useRef(null);
  const outcomesFlowRef = useRef(null);

  const whatsappLink = useMemo(
    () => `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(t.contact.whatsappMessage)}`,
    [t.contact.whatsappMessage],
  );

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeOrg, setActiveOrg] = useState(null);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [quickRequestStatus, setQuickRequestStatus] = useState('idle');
  const [quickRequestMessage, setQuickRequestMessage] = useState('');

  const handleOpenLever = (index, event) => {
    setActiveLeverIndex(index);
    lastTriggerRef.current = event.currentTarget;
  };

  const handleCloseLever = () => {
    setActiveLeverIndex(null);
  };

  const handleNextLever = () => {
    setActiveLeverIndex((prev) => {
      if (prev === null || !leverItems.length) return prev;
      return (prev + 1) % leverItems.length;
    });
  };

  const handlePreviousLever = () => {
    setActiveLeverIndex((prev) => {
      if (prev === null || !leverItems.length) return prev;
      return (prev - 1 + leverItems.length) % leverItems.length;
    });
  };


  useEffect(() => {
    if (!interactiveTabs[activeTab]) {
      setActiveTab(Object.keys(interactiveTabs)[0]);
    }
  }, [activeTab, interactiveTabs]);

  const scrollOutcomes = (direction) => {
    const container = outcomesFlowRef.current;
    if (!container) return;
    const card = container.querySelector('.result-step');
    const styles = window.getComputedStyle(container);
    const gapValue = parseFloat(styles.columnGap || styles.gap || '0');
    const cardWidth = card?.getBoundingClientRect().width ?? 0;
    const scrollAmount = cardWidth + gapValue || container.clientWidth;
    container.scrollBy({ left: direction * scrollAmount, behavior: getScrollBehavior() });
  };

  const getScrollBehavior = () => {
    if (typeof window === 'undefined') return 'auto';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  };

  const handleOpenBergenVideo = () => {
    setIsBergenVideoOpen(true);
  };

  const handleCloseBergenVideo = () => {
    setIsBergenVideoOpen(false);
  };

  const handleOpenInvestmentForm = (event) => {
    setIsInvestmentFormOpen(true);
    investmentTriggerRef.current = event.currentTarget;
  };

  const handleCloseInvestmentForm = () => {
    setIsInvestmentFormOpen(false);
  };

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
        throw new Error(errorPayload?.error || 'Request failed.');
      }

      setQuickRequestStatus('success');
      setQuickRequestMessage(t.contact.form.messages.success);
      form.reset();
    } catch (error) {
      setQuickRequestStatus('error');
      setQuickRequestMessage(t.contact.form.messages.error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isBergenVideoOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsBergenVideoOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isBergenVideoOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (!isBergenVideoOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isBergenVideoOpen]);

  useEffect(() => {
    if (!isInvestmentFormOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseInvestmentForm();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isInvestmentFormOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (!isInvestmentFormOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isInvestmentFormOpen]);

  useEffect(() => {
    if (isInvestmentFormOpen) return;
    investmentTriggerRef.current?.focus?.();
  }, [isInvestmentFormOpen]);

  useEffect(() => {
    if (!isInvestmentFormOpen) return;
    investmentModalTitleRef.current?.focus?.();
  }, [isInvestmentFormOpen]);

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

  useEffect(() => {
    if (!faqs.length) return;
    if (faqs.some((faq) => faq.id === activeFaqId)) return;
    setActiveFaqId(faqs[0].id);
  }, [activeFaqId, faqs]);

  const QuickRequestForm = ({ className = '' }) => (
    <Card
      variant="elevated"
      as="form"
      className={`ui-form ${className}`.trim()}
      aria-label={t.contact.aria.form}
      method="POST"
      action="/api/quick-request"
      onSubmit={handleQuickRequestSubmit}
    >
      <h4>{t.contact.form.title}</h4>

      <input type="text" name="nombre" placeholder={t.contact.form.fields.name} aria-label={t.contact.form.fields.name} required />
      <input
        type="email"
        name="email"
        placeholder={t.contact.form.fields.email}
        aria-label={t.contact.form.fields.email}
        required
      />
      <input
        type="text"
        name="rol_organizacion"
        placeholder={t.contact.form.fields.role}
        aria-label={t.contact.form.fields.role}
        required
      />

      <select name="interes" aria-label={t.contact.form.fields.interest} required defaultValue="">
        <option value="" disabled>
          {t.contact.form.fields.interest}
        </option>
        {t.contact.form.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <Button
        type="submit"
        variant="dark"
        aria-label={t.contact.aria.submit}
        disabled={quickRequestStatus === 'loading'}
      >
        {t.contact.form.submit}
      </Button>

      <p className="interactive__note">{t.contact.form.note}</p>

      {quickRequestMessage ? (
        <p className="interactive__note" role="status" aria-live="polite">
          {quickRequestMessage}
        </p>
      ) : null}
    </Card>
  );

  useEffect(() => {
    if (!isLeverOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseLever();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextLever();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePreviousLever();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('lever-overlay-open');
    window.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => {
      leverTitleRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('lever-overlay-open');
      window.removeEventListener('keydown', handleKeyDown);
      lastTriggerRef.current?.focus();
    };
  }, [isLeverOpen]);

  if (isPlayground) {
    return <DesignPlayground />;
  }

  if (isECall) {
    return <ECallPage />;
  }

  const sectionRenderers = {
    method: (section) => (
      <Section
        key={section.id}
        id={section.id}
        title={t.method.title}
        description={t.method.description}
        className="reveal"
      />
    ),
    interactive: (section) => (
      <Section
        key={section.id}
        id={section.id}
        eyebrow={t.interactive.eyebrow}
        title={t.interactive.title}
        tone="light"
        className="reveal interactive-section"
      >
        <div className="interactive">
          <Card variant="elevated" as="article" className="interactive-panel">
            <div className="interactive-tabs" aria-label={t.interactive.ariaTabs}>
              {tabKeys.map((key) => (
                <Button
                  key={key}
                  variant="ghost"
                  className={`interactive-tab ${activeTab === key ? 'interactive-tab--active' : ''}`}
                  onClick={() => setActiveTab(key)}
                  aria-label={interactiveTabs[key].label}
                >
                  {interactiveTabs[key].label}
                </Button>
              ))}
            </div>
            <h3>{interactiveTabs[activeTab].title}</h3>
            <p>{interactiveTabs[activeTab].description}</p>
            <ul>
              {interactiveTabs[activeTab].bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className="interactive__note">{interactiveTabs[activeTab].note}</p>
          </Card>

          <div className="method-map">
            <p className="interactive__hint">{t.interactive.hint}</p>
            <div className="method-map__canvas" role="img" aria-label={t.interactive.diagramAria}>
              {systemBlocks.map((block, index) => (
                <button
                  key={block.title}
                  type="button"
                  className={`method-circle method-circle--${index + 1}`}
                  onClick={(event) => handleOpenLever(index, event)}
                >
                  <h4>{block.title}</h4>
                  <p>{block.copy}</p>
                </button>
              ))}
              <span className="method-map__intersection method-map__intersection--map">{t.interactive.intersections.map}</span>
              <span className="method-map__intersection method-map__intersection--intentions">
                {t.interactive.intersections.intentions}
              </span>
              <span className="method-map__intersection method-map__intersection--organization">
                {t.interactive.intersections.organization}
              </span>
            </div>
            <div className="method-map__legend" aria-hidden="true">
              <span>✦</span>
              <small>{t.interactive.centerLabel}</small>
            </div>
          </div>
        </div>
      </Section>
    ),
    program: (section) => (
      <Section key={section.id} id={section.id} title={t.program.title} tone="mid" className="reveal">
        <div className="card-grid">
          {highlightCards.map((card) => (
            <Card key={card.title} variant="glass" as="article">
              <h4>{card.title}</h4>
              <p>{card.copy}</p>
            </Card>
          ))}
        </div>
      </Section>
    ),
    outcomes: (section) => (
      <Section key={section.id} id={section.id} title={t.outcomes.title} tone="light" className="reveal outcomes-section">
        <div className="result-flow__controls">
          <button
            type="button"
            className="result-flow__button"
            onClick={() => scrollOutcomes(-1)}
            aria-label={t.outcomes.controls.previous}
          >
            <span aria-hidden="true">←</span>
            <span className="sr-only">{t.outcomes.controls.previous}</span>
          </button>
          <button
            type="button"
            className="result-flow__button"
            onClick={() => scrollOutcomes(1)}
            aria-label={t.outcomes.controls.next}
          >
            <span aria-hidden="true">→</span>
            <span className="sr-only">{t.outcomes.controls.next}</span>
          </button>
        </div>
        <div className="result-flow" ref={outcomesFlowRef}>
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
    ),
    investment: (section) => (
      <Section
        key={section.id}
        id={section.id}
        eyebrow={t.investment.eyebrow}
        title={t.investment.title}
        description={t.investment.description}
        tone="light"
        className="reveal"
      >
        <div className="investment">
          <div className="investment__grid">
            {t.investment.tiers.map((tier) => (
              <Card
                key={tier.title}
                variant="outline"
                className={`investment-card ${tier.recommended ? 'investment-card--recommended' : ''}`}
              >
                <div className="investment-card__header">
                  <h3>{tier.title}</h3>
                  {tier.recommended ? <span className="investment-card__tag">{t.investment.recommendedLabel}</span> : null}
                </div>
                <p className="investment-card__price">{tier.price}</p>
                <ul>
                  {tier.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <div className="investment__cta">
            <Button type="button" variant="primary" onClick={handleOpenInvestmentForm}>
              {t.investment.cta}
            </Button>
            <p className="investment__microcopy">{t.investment.microcopy}</p>
          </div>
        </div>
      </Section>
    ),
    format: (section) => (
      <Section key={section.id} id={section.id} title={t.format.title} tone="light" className="reveal">
        <div className="format-strip">
          {formatCards.map((card) => (
            <div key={card.title} className="format-strip__row">
              <span className="format-strip__label">{card.title}</span>
              <span className="format-strip__value">{card.value}</span>
            </div>
          ))}
        </div>
        <p className="interactive__note">{t.format.note}</p>
      </Section>
    ),
    bergen: (section) => (
      <Section key={section.id} id={section.id} title={t.bergen.title} tone="light" className="reveal">
        <div className="bergen-statement">
          <div className="bergen-statement__content">
            <span className="bergen-statement__badge">{t.bergen.badge}</span>
            <p className="bergen-statement__copy">{t.bergen.copy}</p>
            <div className="bergen-statement__actions">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label={t.bergen.actions.videoAria}
                onClick={handleOpenBergenVideo}
              >
                {t.bergen.actions.video}
              </Button>
            </div>
          </div>
          <div className="bergen-statement__media">
            <img src={bergenStatementImage} alt={t.bergen.imageAlt} className="bergen-statement__image" />
          </div>
        </div>

        <div className="bergen-experiences">
          <div className="bergen-experiences__divider" aria-hidden="true" />
          <div className="bergen-experiences__header">
            <span className="bergen-experiences__eyebrow">{t.bergen.experiences.eyebrow}</span>
            <h3>{t.bergen.experiences.title}</h3>
            <p>{t.bergen.experiences.description}</p>
          </div>
          <div className="bergen-experiences__carousel">
            <button
              type="button"
              className="bergen-experiences__nav bergen-experiences__nav--prev"
              aria-label={t.bergen.experiences.aria.prev}
              onClick={() => {
                if (!experienceTrackRef.current) return;
                experienceTrackRef.current.scrollBy({
                  left: -experienceTrackRef.current.clientWidth * 0.8,
                  behavior: getScrollBehavior(),
                });
              }}
            >
              ←
            </button>
            <div className="bergen-experiences__track" ref={experienceTrackRef}>
              {experienceItems.map((experience) => (
                <article key={experience.title} className="bergen-experience-card">
                  <div className="bergen-experience-card__media">
                    {experience.image ? (
                      <img src={experience.image} alt="" loading="lazy" />
                    ) : (
                      <span className="bergen-experience-card__placeholder" aria-hidden="true" />
                    )}
                  </div>
                  <div className="bergen-experience-card__body">
                    <span className="bergen-experience-card__badge">{experience.badge}</span>
                    <h4>{experience.title}</h4>
                    <p className="bergen-experience-card__lead">{experience.lead}</p>
                    <p className="bergen-experience-card__description">{experience.description}</p>
                    {experience.sourceUrl ? (
                      <a
                        className="bergen-experience-card__link"
                        href={experience.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.bergen.experiences.detailLink}
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="bergen-experiences__nav bergen-experiences__nav--next"
              aria-label={t.bergen.experiences.aria.next}
              onClick={() => {
                if (!experienceTrackRef.current) return;
                experienceTrackRef.current.scrollBy({
                  left: experienceTrackRef.current.clientWidth * 0.8,
                  behavior: getScrollBehavior(),
                });
              }}
            >
              →
            </button>
          </div>
        </div>
      </Section>
    ),
    leadership: (section) => (
      <>
        <Section key={section.id} id={section.id} title={t.leadership.title} tone="light" className="reveal">
          <div className="split split--reverse split--equipo">
            <div className="section-grid">
              <h3>{t.leadership.audience.title}</h3>
              <Card variant="elevated" className="section-grid equipo-card">
                {t.leadership.audience.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Card>
            </div>
            <div className="section-grid">
              <h3>{t.leadership.convocan.title}</h3>
              <div className="card-grid">
                {leadershipOrganizations.map((org) => (
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
                      <span>{org.url ? t.leadership.convocan.meta.site : t.leadership.convocan.meta.internal}</span>
                      <span>{t.leadership.convocan.meta.cta}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Section>
        <LeadershipVoicesCircles />
      </>
    ),
    faq: (section) => (
      <Section key={section.id} id={section.id} title={t.faq.title} tone="light" className="reveal">
        <div className="faq-shell">
          <div className="faq-sidebar" role="tablist" aria-label={t.faq.title}>
            <div className="faq-sidebar__header">
              <span className="faq-sidebar__label">{t.faq.sidebar.label}</span>
              <h3>{t.faq.sidebar.title}</h3>
              <p>{t.faq.sidebar.description}</p>
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
              <span>{t.faq.sidebar.footerLabel}</span>
              <p>{t.faq.sidebar.footerDescription}</p>
            </div>
          </div>

          <div className="faq-chat" role="tabpanel">
            <div className="faq-chat__header">
              <span className="faq-chat__badge">{t.faq.chat.badge}</span>
              <div>
                <h3>{activeFaq?.question}</h3>
                <p>{t.faq.chat.responseTime}</p>
              </div>
            </div>

            <div className="faq-chat__thread">
              <div className="chat-bubble chat-bubble--user">
                <p>{activeFaq?.question}</p>
              </div>
              <div className="chat-bubble chat-bubble--assistant">
                <h4>{activeFaq?.answer.heading}</h4>
                {activeFaq?.answer.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <ul>
                  {activeFaq?.answer.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="faq-chat__actions" aria-label={t.faq.chat.actionsLabel}>
              {activeFaq?.followUps.map((followUp) => (
                <button key={followUp} type="button" className="faq-chat__chip">
                  {followUp}
                </button>
              ))}
            </div>

            <div className="faq-chat__input" aria-label={t.faq.chat.inputPlaceholder}>
              <span>{t.faq.chat.inputPlaceholder}</span>
              <Button type="button" variant="dark" disabled>
                {t.faq.chat.sendButton}
              </Button>
            </div>
            <a className="faq-chat__handoff" href="#contacto">
              {t.faq.chat.handoff}
            </a>
          </div>
        </div>
      </Section>
    ),
    contact: (section) => (
      <Section key={section.id} id={section.id} title={t.contact.title} tone="light" className="reveal cta-section">
        <div className="split">
          <div className="section-grid">
            <p>{t.contact.description}</p>
            <div className="contact-actions">
              <Button
                as="a"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                variant="primary"
                aria-label={t.contact.aria.whatsapp}
              >
                {t.contact.buttons.whatsapp}
              </Button>
              <Button
                as="a"
                href={calendlyLink}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                aria-label={t.contact.aria.calendly}
              >
                {t.contact.buttons.calendly}
              </Button>
            </div>
            <p className="interactive__note">{t.contact.note}</p>
          </div>

          <QuickRequestForm />
        </div>
      </Section>
    ),
  };

  const leverOverlay = isLeverOpen ? (
    <div
      className="lever-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lever-overlay-title"
      onClick={handleCloseLever}
    >
      <div className="lever-overlay__panel" onClick={(event) => event.stopPropagation()}>
        <header className="lever-overlay__header">
          <button type="button" className="lever-overlay__close" onClick={handleCloseLever} aria-label="Cerrar">
            ×
          </button>
        </header>
        <div className="lever-overlay__media">
          {leverItems[activeLeverIndex].image ? (
            <img src={leverItems[activeLeverIndex].image} alt="" className="lever-overlay__image" />
          ) : (
            <div className="lever-overlay__placeholder" aria-hidden="true" />
          )}
          <div className="lever-overlay__caption">Palanca: {leverItems[activeLeverIndex].title}</div>
        </div>
        <div className="lever-overlay__body">
          <p className="lever-overlay__lead">{leverItems[activeLeverIndex].lead}</p>
          <h3 id="lever-overlay-title" tabIndex="-1" ref={leverTitleRef}>
            {leverItems[activeLeverIndex].title}
          </h3>
          <div className="lever-overlay__section">
            <h4>{leverItems[activeLeverIndex].whyTitle}</h4>
            <ul>
              {leverItems[activeLeverIndex].why.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="lever-overlay__section">
            <h4>{leverItems[activeLeverIndex].impactTitle}</h4>
            <p>{leverItems[activeLeverIndex].impact}</p>
          </div>
          <div className="lever-overlay__chips" aria-label="Palancas">
            {leverItems.map((item, index) => (
              <button
                key={item.key}
                type="button"
                className={`lever-overlay__chip ${index === activeLeverIndex ? 'is-active' : ''}`}
                onClick={() => setActiveLeverIndex(index)}
              >
                {item.title}
              </button>
            ))}
            <span className="lever-overlay__count" aria-hidden="true">
              {`${activeLeverIndex + 1}/${leverItems.length}`}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="lever-overlay__nav lever-overlay__nav--prev"
        onClick={(event) => {
          event.stopPropagation();
          handlePreviousLever();
        }}
        aria-label="Anterior"
      >
        ←
      </button>
      <button
        type="button"
        className="lever-overlay__nav lever-overlay__nav--next"
        onClick={(event) => {
          event.stopPropagation();
          handleNextLever();
        }}
        aria-label="Siguiente"
      >
        →
      </button>
    </div>
  ) : null;

  const overlayPortal =
    leverOverlay && typeof document !== 'undefined' ? createPortal(leverOverlay, document.body) : null;

  const investmentFormOverlay = isInvestmentFormOpen ? (
    <div
      className="investment-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="investment-modal-title"
      onClick={handleCloseInvestmentForm}
    >
      <div className="investment-modal__panel" onClick={(event) => event.stopPropagation()}>
        <div className="investment-modal__intro">
          <div className="investment-modal__header">
            <span className="investment-modal__eyebrow">{t.investment.eyebrow}</span>
            <button
              type="button"
              className="investment-modal__close"
              aria-label="Cerrar"
              onClick={handleCloseInvestmentForm}
            >
              ×
            </button>
          </div>
          <h3 id="investment-modal-title" tabIndex="-1" ref={investmentModalTitleRef}>
            {t.contact.form.title}
          </h3>
          <p>{t.investment.description}</p>
          <div className="investment-modal__accent" aria-hidden="true" />
        </div>
        <QuickRequestForm className="investment-modal__form" />
      </div>
    </div>
  ) : null;

  const investmentFormPortal =
    investmentFormOverlay && typeof document !== 'undefined' ? createPortal(investmentFormOverlay, document.body) : null;

  const bergenVideoOverlay = isBergenVideoOpen ? (
    <div
      className="bergen-video-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t.bergen.videoModal.ariaLabel}
      onClick={handleCloseBergenVideo}
    >
      <div className="bergen-video-overlay__panel" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="bergen-video-overlay__close"
          aria-label={t.bergen.videoModal.closeAria}
          onClick={handleCloseBergenVideo}
        >
          ×
        </button>
        <div className="bergen-video-overlay__frame">
          <iframe
            title={t.bergen.videoModal.title}
            src={`https://www.youtube.com/embed/${bergenVideoId}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  ) : null;

  const bergenVideoPortal =
    bergenVideoOverlay && typeof document !== 'undefined' ? createPortal(bergenVideoOverlay, document.body) : null;

  return (
    <div className="page" aria-hidden={isLeverOpen || isInvestmentFormOpen || isBergenVideoOpen}>
      <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <Container>
          <nav className="navbar__inner" aria-label={t.nav.aria.nav}>
            <div className="brandmark">ANNiA</div>
            <div className="nav-links">
              {navLinks.map((link) => (
                <a key={link.id} href={`#${link.id}`}>
                  {link.label}
                </a>
              ))}
            </div>
            <div className="hero__actions navbar__actions">
              <div className="language-switch" role="group" aria-label={t.language.label}>
                <button
                  type="button"
                  className={`language-switch__button ${language === 'es' ? 'is-active' : ''}`}
                  onClick={() => setLanguage('es')}
                  aria-label={t.language.aria.switchToEs}
                >
                  {t.language.options.es.short}
                </button>
                <button
                  type="button"
                  className={`language-switch__button ${language === 'en' ? 'is-active' : ''}`}
                  onClick={() => setLanguage('en')}
                  aria-label={t.language.aria.switchToEn}
                >
                  {t.language.options.en.short}
                </button>
              </div>
              <Button as="a" href="#contacto" variant="primary" size="sm" aria-label={t.nav.aria.cta}>
                {t.nav.actions.cta}
              </Button>
            </div>
          </nav>
        </Container>
      </header>

      <HeroRotator />

      {sectionOrder.map((section) => sectionRenderers[section.type]?.(section))}

      {overlayPortal}
      {investmentFormPortal}
      {bergenVideoPortal}

      <footer className="footer reveal">
        <Container className="footer__content">
          <div className="footer__meta">
            {t.footer.meta.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="footer__icons" aria-label={t.footer.aria.social}>
            <span className="footer__sky" aria-hidden="true" />
            <a
              className="footer__icon-link"
              href="https://www.instagram.com/annia.no?igsh=MTYzcXkwY2hkczg4eA=="
              target="_blank"
              rel="noreferrer"
              aria-label={t.footer.aria.instagram}
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
              aria-label={t.footer.aria.youtube}
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
