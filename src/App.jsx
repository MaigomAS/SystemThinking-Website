import { useEffect, useMemo, useRef, useState } from 'react';
import Button from './components/ui/Button.jsx';
import Card from './components/ui/Card.jsx';
import Chip from './components/ui/Chip.jsx';
import Container from './components/ui/Container.jsx';
import Section from './components/ui/Section.jsx';
import DesignPlayground from './components/DesignPlayground.jsx';
import ECallPage from './components/ECallPage.jsx';
import HeroRotator from './components/HeroRotator.jsx';
import OrganizationModal from './components/OrganizationModal.jsx';
import sectionOrder from './data/sections.json';
import { getOrganizations } from './data/organizations.js';
import { useLanguage } from './i18n/LanguageContext.jsx';

const whatsappPhone = '4741368586';
const calendlyLink = 'https://calendly.com/annia-info/30min';

function App() {
  const { t, language, setLanguage } = useLanguage();
  const navLinks = t.nav.links;
  const outcomes = t.outcomes.items;
  const formatCards = t.format.cards;
  const highlightCards = t.program.cards;
  const faqs = t.faq.items;
  const interactiveTabs = t.interactive.tabs;
  const systemBlocks = t.interactive.systemBlocks;
  const zoomBlock = t.interactive.zoomBlock;
  const detailBlocks = t.interactive.detailBlocks;
  const organizations = useMemo(() => getOrganizations(t.organizations), [t]);

  const [activeTab, setActiveTab] = useState('sintomas');
  const [activeFaqId, setActiveFaqId] = useState(faqs[0]?.id ?? '');
  const tabKeys = useMemo(() => Object.keys(interactiveTabs), [interactiveTabs]);
  const isPlayground = typeof window !== 'undefined' && window.location.pathname === '/playground';
  const isECall = typeof window !== 'undefined' && window.location.pathname === '/e-call';
  const returnFocusRef = useRef(null);
  const activeFaq = useMemo(() => faqs.find((faq) => faq.id === activeFaqId) ?? faqs[0], [activeFaqId, faqs]);

  const whatsappLink = useMemo(
    () => `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(t.contact.whatsappMessage)}`,
    [t.contact.whatsappMessage],
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
        tone="mid"
        className="reveal"
      >
        <div className="interactive">
          <Card variant="glass" as="article">
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
          <div className="interactive-details">
            {detailBlocks.map((block) => (
              <Card key={block.title} variant="glass" as="article" className="interactive-detail">
                <div className="interactive-detail__image" role="img" aria-label={block.imageAlt}>
                  <span>{block.imageHint}</span>
                </div>
                <div className="interactive-detail__content">
                  <p className="interactive-detail__eyebrow">{block.title}</p>
                  <h4>{block.lead}</h4>
                  <p className="interactive-detail__label">{block.whyTitle}</p>
                  <ul>
                    {block.whyBullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="interactive-detail__label">{block.impactTitle}</p>
                  <p className="interactive__note">{block.impactCopy}</p>
                </div>
              </Card>
            ))}
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
      <Section key={section.id} id={section.id} title={t.outcomes.title} tone="light" className="reveal">
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
        <div className="split">
          <div className="section-grid">
            {t.bergen.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="hero__chips">
              {t.bergen.chips.map((chip) => (
                <Chip key={chip} variant="solid">
                  {chip}
                </Chip>
              ))}
            </div>
          </div>
          <div className="gradient-card" />
        </div>
      </Section>
    ),
    leadership: (section) => (
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
                    <span>{org.url ? t.leadership.convocan.meta.site : t.leadership.convocan.meta.internal}</span>
                    <span>{t.leadership.convocan.meta.cta}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>
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

          <Card
            variant="elevated"
            as="form"
            className="ui-form"
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
        </div>
      </Section>
    ),
  };

  return (
    <div className="page">
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
