import { useCallback, useRef, useState } from 'react';
import { organizations } from '../data/organizations.js';
import OrganizationModal from './OrganizationModal.jsx';
import Button from './ui/Button.jsx';
import Card from './ui/Card.jsx';
import Chip from './ui/Chip.jsx';
import Container from './ui/Container.jsx';
import Section from './ui/Section.jsx';

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

const heroVariants = [
  { id: 'editorial', label: 'Hero A · Editorial minimal' },
  { id: 'orbs', label: 'Hero B · Gradientes y orbes' },
  { id: 'split', label: 'Hero C · Split con mock abstracto' },
];

function HeroPreview({ variant }) {
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

  const content = (() => {
    switch (variant) {
      case 'orbs':
        return (
          <div className="playground-hero__grid">
            <div className="playground-hero__content">
              <Chip className="hero__badge">Encuentro fundacional · Cohorte 2026</Chip>
              <h1>Una experiencia inmersiva para liderar en sistemas vivos.</h1>
              <p>
                Diseñamos un espacio de alta exigencia intelectual y emocional para equipos que necesitan ver el sistema completo,
                tomar mejores decisiones y activar cambios reales.
              </p>
              <div className="hero__actions">
                <Button variant="primary" className="cta-glow">
                  Aplicar ahora →
                </Button>
                <Button variant="ghost">Agenda una llamada</Button>
              </div>
              <div className="hero__chips">
                {['Presencial', 'Full-time', 'Bergen, Noruega'].map((badge) => (
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
                    <stop offset="0%" stopColor="rgba(122, 231, 255, 0.8)" />
                    <stop offset="50%" stopColor="rgba(124, 106, 255, 0.7)" />
                    <stop offset="100%" stopColor="rgba(245, 139, 255, 0.55)" />
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
                <span className="hero-loop__signal hero-loop__signal--primary">Simulación</span>
                <span className="hero-loop__signal hero-loop__signal--secondary">Panel estratégico</span>
              </div>
            </div>
            <div className="playground-hero__content">
              <Chip className="hero__badge">Laboratorio de estrategia sistémica</Chip>
              <h1>Estrategia, gobernanza y ejecución en un mismo espacio.</h1>
              <p>
                Un formato híbrido entre think tank y taller intensivo, con casos reales, trabajo aplicado y una red global de líderes
                sistémicos.
              </p>
              <p className="hero__meta">3 semanas intensivas · Nov 2026 · Cupos limitados</p>
              <div className="hero__actions">
                <Button variant="primary" className="cta-glow">
                  Solicitar información →
                </Button>
                <Button variant="secondary">Ver programa completo</Button>
              </div>
            </div>
          </div>
        );
      case 'editorial':
      default:
        return (
          <div className="playground-hero__content playground-hero__content--editorial">
            <Chip className="hero__badge">Encuentro ejecutivo · 2026</Chip>
            <h1>Systemic Strategy &amp; Leadership for Complex Issues.</h1>
            <p className="playground-hero__lead">
              Un programa editorialmente curado para líderes que quieren intervenir en sistemas complejos con precisión, profundidad y
              sensibilidad humana.
            </p>
            <div className="hero__actions">
              <Button variant="primary" className="cta-glow">
                Aplicar al programa →
              </Button>
              <Button variant="ghost">Descargar overview</Button>
            </div>
            <p className="hero__meta">Bergen, Noruega · Noviembre 2026 · Presencial</p>
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
      <Container>{content}</Container>
    </div>
  );
}

function DesignPlayground() {
  const [activeHero, setActiveHero] = useState('editorial');
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [activeOrg, setActiveOrg] = useState(null);
  const returnFocusRef = useRef(null);

  const handleOpenOrg = useCallback((org, trigger) => {
    returnFocusRef.current = trigger;
    setActiveOrg(org);
    setIsOrgModalOpen(true);
  }, []);

  const handleCloseOrg = useCallback(() => {
    setIsOrgModalOpen(false);
  }, []);

  return (
    <div className="playground">
      <Container>
        <header className="ui-section__header">
          <span className="ui-section__eyebrow">Design System</span>
          <h2>Playground · Tokens y Componentes</h2>
          <p>
            Una vista rápida para validar paleta, tipografía y componentes base. Edita tokens en{' '}
            <code>src/styles/tokens.css</code>.
          </p>
        </header>
      </Container>

      <Section tone="dark" title="Hero · Variantes creativas">
        <div className="hero-variant-selector" role="tablist" aria-label="Selector de variantes de hero">
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
        <HeroPreview variant={activeHero} />
      </Section>

      <Section tone="mid" title="Paleta & Tokens">
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

      <Section tone="dark" title="Tipografía">
        <div className="typography-stack">
          <div>
            <span>Display / H1</span>
            <h1 style={{ fontSize: 'var(--font-size-4xl)', lineHeight: 'var(--line-height-tight)' }}>
              Systemic Strategy & Leadership
            </h1>
          </div>
          <div>
            <span>Heading / H2</span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', lineHeight: 'var(--line-height-tight)' }}>
              Ecosistemas colaborativos con impacto real
            </h2>
          </div>
          <div>
            <span>Body</span>
            <p style={{ maxWidth: '520px', color: 'var(--color-text-secondary)' }}>
              Diseñamos experiencias premium para líderes que necesitan claridad estratégica, rigor y ejecución en
              entornos complejos.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="mid" title="Quiénes convocan (demo)">
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
                <span>{org.url ? 'Sitio disponible' : 'Detalle interno'}</span>
                <span>Ver más →</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="mid" title="Componentes base">
        <div className="section-grid">
          <div className="card-grid">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="dark">Dark</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="card-grid">
            <Chip>Soft Chip</Chip>
            <Chip variant="solid">Solid Chip</Chip>
            <Chip variant="outline">Outline Chip</Chip>
          </div>
          <div className="card-grid">
            <Card variant="glass" as="article">
              <h4>Glass Card</h4>
              <p>Para superficies flotantes con blur sutil y bordes premium.</p>
            </Card>
            <Card variant="outline" as="article">
              <h4>Outline Card</h4>
              <p>Útil para layouts oscuros con jerarquía suave.</p>
            </Card>
            <Card variant="elevated" as="article">
              <h4>Elevated Card</h4>
              <p>Superficie clara con sombra suave y padding generoso.</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section tone="light" title="Radii & Sombras">
        <div className="split">
          <Card variant="elevated" className="section-grid">
            <h4>Radii</h4>
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
            <h4>Sombras</h4>
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
