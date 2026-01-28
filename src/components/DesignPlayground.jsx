import { useCallback, useMemo, useRef, useState } from 'react';
import { getOrganizations } from '../data/organizations.js';
import OrganizationModal from './OrganizationModal.jsx';
import Button from './ui/Button.jsx';
import Card from './ui/Card.jsx';
import Chip from './ui/Chip.jsx';
import Container from './ui/Container.jsx';
import Section from './ui/Section.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const colorTokens = [
  { name: 'Background', value: 'var(--color-bg)' },
  { name: 'Surface', value: 'var(--color-surface)' },
  { name: 'Surface 2', value: 'var(--color-surface-2)' },
  { name: 'Brand 1', value: 'var(--color-brand-1)' },
  { name: 'Brand 2', value: 'var(--color-brand-2)' },
  { name: 'Brand 3', value: 'var(--color-brand-3)' },
  { name: 'Brand 4', value: 'var(--color-brand-4)' },
  { name: 'Text Primary', value: 'var(--color-text-primary)' },
];

const radiusTokens = [
  { name: 'XS', value: 'var(--radius-xs)' },
  { name: 'SM', value: 'var(--radius-sm)' },
  { name: 'MD', value: 'var(--radius-md)' },
  { name: 'LG', value: 'var(--radius-lg)' },
  { name: 'XL', value: 'var(--radius-xl)' },
  { name: 'Pill', value: 'var(--radius-pill)' },
];

const shadowTokens = [
  { name: 'XS', value: 'var(--shadow-xs)' },
  { name: 'SM', value: 'var(--shadow-sm)' },
  { name: 'MD', value: 'var(--shadow-md)' },
  { name: 'LG', value: 'var(--shadow-lg)' },
];

function HeroPreview({ variant, content, badges }) {
  const heroRef = useRef(null);

  const handleMove = useCallback((event) => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    hero.style.setProperty('--parallax-x', `${x * 18}px`);
    hero.style.setProperty('--parallax-y', `${y * 12}px`);
  }, []);

  const handleLeave = useCallback(() => {
    const hero = heroRef.current;
    if (hero) {
      hero.style.setProperty('--parallax-x', '0px');
      hero.style.setProperty('--parallax-y', '0px');
    }
  }, []);

  const contentMarkup = (() => {
    switch (variant) {
      case 'orbs':
        return (
          <div className="playground-hero__grid">
            <div className="playground-hero__content">
              <Chip className="hero__badge">{content.badge}</Chip>
              <h1>{content.title}</h1>
              <p>{content.description}</p>
              <div className="hero__actions">
                <Button variant="primary" className="cta-glow">
                  {content.actions.primary}
                </Button>
                <Button variant="ghost">{content.actions.secondary}</Button>
              </div>
              <div className="hero__chips">
                {content.chips.map((badge) => (
                  <Chip key={badge} variant="outline">
                    {badge}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="playground-hero__visual" aria-hidden="true">
              <div className="hero-orb hero-orb--one" />
              <div className="hero-orb hero-orb--two" />
              <div className="hero-orb hero-orb--three" />
              <div className="hero-orb hero-orb--four" />
            </div>
          </div>
        );
      case 'split':
        return (
          <div className="playground-hero__split">
            <div className="hero-loop" aria-hidden="true">
              <svg className="hero-loop__svg" viewBox="0 0 600 360" role="presentation">
                <defs>
                  <linearGradient id="loopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7ae7ff" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#7c6aff" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#f58bff" stopOpacity="0.55" />
                  </linearGradient>
                </defs>
                <path
                  className="hero-loop__path hero-loop__path--primary"
                  d="M60 210 C 120 80, 250 40, 320 120 C 380 190, 460 260, 560 200"
                />
                <path
                  className="hero-loop__path hero-loop__path--secondary"
                  d="M40 140 C 140 210, 210 320, 330 250 C 430 190, 480 80, 580 120"
                />
                <circle className="hero-loop__node hero-loop__node--tech" cx="120" cy="110" r="9" />
                <circle className="hero-loop__node hero-loop__node--human" cx="300" cy="200" r="12" />
                <circle className="hero-loop__node hero-loop__node--system" cx="470" cy="140" r="10" />
                <circle className="hero-loop__node hero-loop__node--tech" cx="520" cy="250" r="8" />
                <circle className="hero-loop__node hero-loop__node--human" cx="210" cy="260" r="7" />
              </svg>
              <div className="hero-loop__pulse hero-loop__pulse--one" />
              <div className="hero-loop__pulse hero-loop__pulse--two" />
              <div className="hero-loop__signals">
                <span className="hero-loop__signal hero-loop__signal--primary">{content.signals.primary}</span>
                <span className="hero-loop__signal hero-loop__signal--secondary">{content.signals.secondary}</span>
              </div>
            </div>
            <div className="playground-hero__content">
              <Chip className="hero__badge">{content.badge}</Chip>
              <h1>{content.title}</h1>
              <p>{content.description}</p>
              <p className="hero__meta">{content.meta}</p>
              <div className="hero__actions">
                <Button variant="primary" className="cta-glow">
                  {content.actions.primary}
                </Button>
                <Button variant="secondary">{content.actions.secondary}</Button>
              </div>
            </div>
          </div>
        );
      case 'editorial':
      default:
        return (
          <div className="playground-hero__content playground-hero__content--editorial">
            <Chip className="hero__badge">{content.badge}</Chip>
            <h1>
              {String(content.title)
                .split('\n')
                .map((line, index) => (
                  <span key={`${line}-${index}`} className="hero__title-line">
                    {line}
                  </span>
                ))}
            </h1>
            {content.subtitle ? <p className="hero__subtitle">{content.subtitle}</p> : null}
            <p className="playground-hero__lead">{content.lead}</p>
            <div className="hero__actions">
              <Button variant="primary" className="cta-glow">
                {content.actions.primary}
              </Button>
              <Button variant="ghost">{content.actions.secondary}</Button>
            </div>
            <p className="hero__meta">{content.meta}</p>
            <div className="hero__chips">
              {badges.map((badge) => (
                <Chip key={badge} variant="outline">
                  {badge}
                </Chip>
              ))}
            </div>
          </div>
        );
    }
  })();

  return (
    <div
      className={`playground-hero playground-hero--${variant} hero--parallax`}
      ref={heroRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <Container>{contentMarkup}</Container>
    </div>
  );
}

function DesignPlayground() {
  const { t } = useLanguage();
  const heroVariants = useMemo(
    () =>
      Object.keys(t.playground.hero.variants).map((id) => ({
        id,
        label: t.playground.hero.variants[id].badge ?? id,
      })),
    [t],
  );
  const [activeHero, setActiveHero] = useState('editorial');
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [activeOrg, setActiveOrg] = useState(null);
  const returnFocusRef = useRef(null);
  const organizations = useMemo(() => getOrganizations(t.organizations), [t]);

  const handleOpenOrg = useCallback((org, trigger) => {
    returnFocusRef.current = trigger;
    setActiveOrg(org);
    setIsOrgModalOpen(true);
  }, []);

  const handleCloseOrg = useCallback(() => {
    setIsOrgModalOpen(false);
  }, []);

  const heroContent = t.playground.hero.variants;
  const heroBadges = t.heroRotator.badges;

  return (
    <div className="playground">
      <Container>
        <header className="ui-section__header">
          <span className="ui-section__eyebrow">{t.playground.header.eyebrow}</span>
          <h2>{t.playground.header.title}</h2>
          <p>
            {t.playground.header.description.split('src/styles/tokens.css')[0]}
            <code>src/styles/tokens.css</code>.
          </p>
        </header>
      </Container>

      <Section tone="dark" title={t.playground.hero.title}>
        <div className="hero-variant-selector" role="tablist" aria-label={t.playground.hero.aria}>
          {heroVariants.map((variant) => (
            <Button
              key={variant.id}
              variant={activeHero === variant.id ? 'secondary' : 'ghost'}
              className={activeHero === variant.id ? 'hero-variant-button is-active' : 'hero-variant-button'}
              onClick={() => setActiveHero(variant.id)}
              aria-pressed={activeHero === variant.id}
            >
              {variant.label}
            </Button>
          ))}
        </div>
        <HeroPreview variant={activeHero} content={heroContent[activeHero]} badges={heroBadges} />
      </Section>

      <Section tone="mid" title={t.playground.palette.title}>
        <div className="token-grid">
          {colorTokens.map((token) => (
            <div key={token.name} className="token-card">
              <div className="token-swatch" style={{ background: token.value }} />
              <strong>{token.name}</strong>
              <span>{token.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark" title={t.playground.typography.title}>
        <div className="typography-stack">
          <div>
            <span>{t.playground.typography.samples.display}</span>
            <h1 style={{ fontSize: 'var(--font-size-4xl)', lineHeight: 'var(--line-height-tight)' }}>
              {t.playground.typography.samples.displayText}
            </h1>
          </div>
          <div>
            <span>{t.playground.typography.samples.heading}</span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', lineHeight: 'var(--line-height-tight)' }}>
              {t.playground.typography.samples.headingText}
            </h2>
          </div>
          <div>
            <span>{t.playground.typography.samples.body}</span>
            <p style={{ maxWidth: '520px', color: 'var(--color-text-secondary)' }}>
              {t.playground.typography.samples.bodyText}
            </p>
          </div>
        </div>
      </Section>

      <Section tone="mid" title={t.playground.orgs.title}>
        <div className="org-card-grid">
          {organizations.map((org) => (
            <Card
              key={org.id}
              variant="glass"
              as="button"
              type="button"
              className="org-card"
              onClick={(event) => handleOpenOrg(org, event.currentTarget)}
            >
              <div className="org-card__header">
                <h4>{org.name}</h4>
                <span className="org-card__tagline">{org.tagline}</span>
              </div>
              <p>{org.description}</p>
              <div className="org-card__meta">
                <span>{org.url ? t.playground.orgs.meta.site : t.playground.orgs.meta.internal}</span>
                <span>{t.playground.orgs.meta.cta}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="mid" title={t.playground.components.title}>
        <div className="section-grid">
          <div className="card-grid">
            <Button variant="primary">{t.playground.components.buttons.primary}</Button>
            <Button variant="secondary">{t.playground.components.buttons.secondary}</Button>
            <Button variant="ghost">{t.playground.components.buttons.ghost}</Button>
            <Button variant="outline">{t.playground.components.buttons.outline}</Button>
            <Button variant="dark">{t.playground.components.buttons.dark}</Button>
            <Button variant="primary" disabled>
              {t.playground.components.buttons.disabled}
            </Button>
          </div>
          <div className="card-grid">
            <Chip>{t.playground.components.chips.soft}</Chip>
            <Chip variant="solid">{t.playground.components.chips.solid}</Chip>
            <Chip variant="outline">{t.playground.components.chips.outline}</Chip>
          </div>
          <div className="card-grid">
            <Card variant="glass" as="article">
              <h4>{t.playground.components.cards.glass.title}</h4>
              <p>{t.playground.components.cards.glass.copy}</p>
            </Card>
            <Card variant="outline" as="article">
              <h4>{t.playground.components.cards.outline.title}</h4>
              <p>{t.playground.components.cards.outline.copy}</p>
            </Card>
            <Card variant="elevated" as="article">
              <h4>{t.playground.components.cards.elevated.title}</h4>
              <p>{t.playground.components.cards.elevated.copy}</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section tone="light" title={t.playground.radii.title}>
        <div className="split">
          <Card variant="elevated" className="section-grid">
            <h4>{t.playground.radii.radiiTitle}</h4>
            <div className="card-grid">
              {radiusTokens.map((token) => (
                <div key={token.name} className="token-card" style={{ borderRadius: token.value }}>
                  <strong>{token.name}</strong>
                  <span>{token.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card variant="elevated" className="section-grid">
            <h4>{t.playground.radii.shadowsTitle}</h4>
            <div className="card-grid">
              {shadowTokens.map((token) => (
                <div key={token.name} className="token-card" style={{ boxShadow: token.value }}>
                  <strong>{token.name}</strong>
                  <span>{token.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <OrganizationModal open={isOrgModalOpen} onClose={handleCloseOrg} org={activeOrg} returnFocusRef={returnFocusRef} />
    </div>
  );
}

export default DesignPlayground;
