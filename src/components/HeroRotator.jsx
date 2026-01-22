import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from './ui/Button.jsx';
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
  { id: 'split', label: 'Hero C · Split con simulación dinámica' },
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
              'linear-gradient(90deg, rgba(6, 10, 20, 0.92) 0%, rgba(6, 10, 20, 0.86) 44%, rgba(6, 10, 20, 0.35) 72%, rgba(6, 10, 20, 0.12) 100%)',
            orbs: 'linear-gradient(180deg, rgba(6, 10, 20, 0.35), rgba(6, 10, 20, 0.65))',
            split: 'linear-gradient(180deg, rgba(6, 10, 20, 0.35), rgba(6, 10, 20, 0.65))',
          };
          const clarityMaskByVariant = {
            editorial:
              'radial-gradient(120% 140% at 8% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 38%, rgba(0, 0, 0, 0.7) 62%, rgba(0, 0, 0, 1) 82%)',
          };
          const heroBackgroundStyle = backgroundImage
            ? {
                '--hero-bg-image': `url(${backgroundImage})`,
                '--hero-bg-opacity': 0.18,
                '--hero-bg-scale': 1.15,
                '--hero-bg-clarity': variant.id === 'editorial' ? 0.82 : 0.65,
                '--hero-bg-clarity-blur': variant.id === 'editorial' ? '0.2px' : '0.3px',
                '--hero-bg-overlay': overlayByVariant[variant.id] ?? overlayByVariant.editorial,
                '--hero-bg-clarity-mask': clarityMaskByVariant[variant.id],
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
