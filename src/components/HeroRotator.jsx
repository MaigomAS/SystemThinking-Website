import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from './ui/Button.jsx';
import Card from './ui/Card.jsx';
import Chip from './ui/Chip.jsx';
import Container from './ui/Container.jsx';
import bergenHero from '../assets/bergen-hero.png';

const hero2Bg = import.meta.glob('../assets/bergen-hero-2.png', { eager: true, query: '?url', import: 'default' })[
  '../assets/bergen-hero-2.png'
];

const ROTATION_INTERVAL = 2500;

const heroBadges = ['Presencial · Full-time', '2-20 Noviembre 2026', 'Bergen, Noruega', 'Cupos limitados · Aplicación'];

const heroVariants = [
  { id: 'editorial', label: 'Hero A · Editorial minimal' },
  { id: 'orbs', label: 'Hero B · Gradientes y orbes' },
  { id: 'split', label: 'Hero C · Split con mock abstracto' },
];

const heroBackgrounds = {
  editorial: bergenHero,
  orbs: hero2Bg,
  split: null,
};

function HeroVariantContent({ variant }) {
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
          <Card variant="glass" className="hero-mock">
            <div className="hero-mock__header">
              <span>Simulación</span>
              <span>Panel estratégico</span>
            </div>
            <div className="hero-mock__grid">
              <div className="hero-mock__block hero-mock__block--primary" />
              <div className="hero-mock__block hero-mock__block--secondary" />
              <div className="hero-mock__block hero-mock__block--tertiary" />
            </div>
            <div className="hero-mock__lines">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
          </Card>
        </div>
      );
    case 'editorial':
    default:
      return (
        <div className="playground-hero__content playground-hero__content--editorial">
          <Chip className="hero__badge">Encuentro fundacional de liderazgo sistémico · Bergen, Noruega · Noviembre 2026</Chip>
          <h1>Systemic Strategy &amp; Leadership for Complex Issues</h1>
          <p className="playground-hero__lead">
            Encuentro ejecutivo internacional e inmersivo (3 semanas) para líderes del sector público, privado, industria y sociedad
            civil que toman decisiones estratégicas en contextos de alta complejidad.
          </p>
          <p className="hero__meta">Bergen, Noruega · Noviembre 2026 · Presencial · Full-time</p>
          <div className="hero__actions">
            <Button variant="primary" className="cta-glow">
              Solicitar información →
            </Button>
            <Button variant="ghost">Descargar overview (PDF)</Button>
          </div>
          <div className="hero__chips">
            {heroBadges.map((badge) => (
              <Chip key={badge} variant="outline">
                {badge}
              </Chip>
            ))}
          </div>
        </div>
      );
  }
}

function HeroRotator() {
  const heroRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveIndex(0);
      return undefined;
    }
    if (isPaused) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % heroVariants.length);
    }, ROTATION_INTERVAL);
    return () => window.clearInterval(interval);
  }, [isPaused, prefersReducedMotion]);

  const handleHeroMove = useCallback(
    (event) => {
      const hero = heroRef.current;
      if (!hero || prefersReducedMotion) return;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty('--parallax-x', `${x * 20}px`);
      hero.style.setProperty('--parallax-y', `${y * 14}px`);
    },
    [prefersReducedMotion],
  );

  const handleHeroLeave = useCallback(() => {
    const hero = heroRef.current;
    if (hero) {
      hero.style.setProperty('--parallax-x', '0px');
      hero.style.setProperty('--parallax-y', '0px');
    }
  }, []);

  const handleFocusCapture = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleBlurCapture = useCallback((event) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setIsPaused(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  const activeLabel = useMemo(() => heroVariants[activeIndex]?.label ?? 'Hero', [activeIndex]);

  return (
    <header
      className="hero hero-rotator hero--parallax"
      id="inicio"
      ref={heroRef}
      onMouseMove={handleHeroMove}
      onMouseLeave={handleHeroLeave}
      onMouseEnter={handleMouseEnter}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
    >
      <span className="sr-only" aria-live="polite">
        {prefersReducedMotion ? 'Hero fijo' : `Hero activo: ${activeLabel}`}
      </span>
      <div className="hero-rotator__track" onMouseLeave={handleMouseLeave}>
        {heroVariants.map((variant, index) => {
          const isActive = index === activeIndex;
          const backgroundImage = heroBackgrounds[variant.id];
          const overlayByVariant = {
            editorial:
              'linear-gradient(90deg, rgba(6, 10, 20, 0.82) 0%, rgba(6, 10, 20, 0.62) 40%, rgba(6, 10, 20, 0.28) 70%, rgba(6, 10, 20, 0.08) 100%)',
            orbs: 'linear-gradient(180deg, rgba(6, 10, 20, 0.35), rgba(6, 10, 20, 0.65))',
            split: 'linear-gradient(180deg, rgba(6, 10, 20, 0.35), rgba(6, 10, 20, 0.65))',
          };
          const heroBackgroundStyle = backgroundImage
            ? {
                '--hero-bg-image': `url(${backgroundImage})`,
                '--hero-bg-opacity': 0.18,
                '--hero-bg-scale': 1.15,
                '--hero-bg-overlay': overlayByVariant[variant.id] ?? overlayByVariant.editorial,
                '--hero-content-max-width': '520px',
              }
            : undefined;
          return (
            <div
              key={variant.id}
              className={`hero-rotator__panel hero-rotator__panel--${variant.id} ${isActive ? 'is-active' : ''}`}
              aria-hidden={!isActive}
              inert={!isActive}
            >
              <div
                className={`playground-hero playground-hero--${variant.id} hero--parallax`}
                style={heroBackgroundStyle}
              >
                <div className="hero-rotator__image" aria-hidden="true" />
                <Container className="hero-rotator__content">
                  <HeroVariantContent variant={variant.id} />
                </Container>
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}

export default HeroRotator;
