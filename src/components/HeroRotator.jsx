import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from './ui/Button.jsx';
import Chip from './ui/Chip.jsx';
import Container from './ui/Container.jsx';
import bergenHero from '../assets/bergen-hero.png';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import HeroLoop from './HeroLoop.jsx';

const hero2Bg = import.meta.glob('../assets/bergen-hero-2.png', { eager: true, query: '?url', import: 'default' })[
  '../assets/bergen-hero-2.png'
];

const heroBackgrounds = {
  editorial: bergenHero,
  orbs: hero2Bg,
  split: null,
};

function HeroRotator() {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const heroVariants = useMemo(
    () => [
      { id: 'editorial', label: t.heroRotator.aria.editorial },
      { id: 'orbs', label: t.heroRotator.aria.orbs },
      { id: 'split', label: t.heroRotator.aria.split },
    ],
    [t],
  );

  const totalHeroes = heroVariants.length;

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

  const handleHeroMove = useCallback((event) => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion) return;
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    hero.style.setProperty('--parallax-x', `${x * 20}px`);
    hero.style.setProperty('--parallax-y', `${y * 14}px`);
  }, [prefersReducedMotion]);

  const handleHeroLeave = useCallback(() => {
    const hero = heroRef.current;
    if (hero) {
      hero.style.setProperty('--parallax-x', '0px');
      hero.style.setProperty('--parallax-y', '0px');
    }
  }, []);

  const handlePrevious = useCallback(() => {
    setActiveIndex((previousIndex) => (previousIndex - 1 + totalHeroes) % totalHeroes);
  }, [totalHeroes]);

  const handleNext = useCallback(() => {
    setActiveIndex((previousIndex) => (previousIndex + 1) % totalHeroes);
  }, [totalHeroes]);

  const handleTouchStart = useCallback((event) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((event) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX > 0) {
      handlePrevious();
    } else {
      handleNext();
    }
  }, [handleNext, handlePrevious]);

  const heroContent = useMemo(
    () => ({
      editorial: {
        ...t.heroRotator.variants.editorial,
        badges: t.heroRotator.badges,
      },
      orbs: t.heroRotator.variants.orbs,
      split: t.heroRotator.variants.split,
    }),
    [t],
  );

  const renderHeroContent = (variant) => {
    const content = heroContent[variant];
    switch (variant) {
      case 'orbs':
        return (
          <div className="playground-hero__grid">
            <div className="playground-hero__content">
              <Chip className="hero__badge">{content.badge}</Chip>
              <h1>{content.title}</h1>
              <p>{content.description}</p>
              <div className="hero__actions">
                <Button as="a" href="#contacto" variant="primary" className="cta-glow">
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
            <div className="playground-hero__content">
              <Chip className="hero__badge">{content.badge}</Chip>
              <h1>{content.title}</h1>
              <p>{content.description}</p>
              <p className="hero__meta">{content.meta}</p>
              <div className="hero__actions">
                <Button as="a" href="#contacto" variant="primary" className="cta-glow">
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
            <p className="hero__subtitle">{content.subtitle}</p>
            <p className="playground-hero__lead">{content.lead}</p>
            <p className="hero__meta">{content.meta}</p>
            <div className="hero__actions">
              <Button as="a" href="#contacto" variant="primary" className="cta-glow">
                {content.actions.primary}
              </Button>
              <Button variant="ghost">{content.actions.secondary}</Button>
            </div>
            <div className="hero__chips">
              {content.badges.map((badge) => (
                <Chip key={badge} variant="outline">
                  {badge}
                </Chip>
              ))}
            </div>
          </div>
        );
    }
  };

  const renderControls = () => (
    <div className="hero-rotator__controls" role="group" aria-label={t.heroRotator.aria.controls}>
      <button type="button" className="hero-rotator__arrow" onClick={handlePrevious} aria-label={t.heroRotator.aria.previous}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <div className="hero-rotator__dots" role="tablist" aria-label={t.heroRotator.aria.dots}>
        {heroVariants.map((variant, index) => (
          <button
            key={variant.id}
            type="button"
            className={`hero-rotator__dot ${index === activeIndex ? 'is-active' : ''}`}
            aria-label={variant.label}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
      <button type="button" className="hero-rotator__arrow" onClick={handleNext} aria-label={t.heroRotator.aria.next}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );

  return (
    <header
      className="hero hero-rotator hero--parallax"
      id="inicio"
      ref={heroRef}
      onMouseMove={handleHeroMove}
      onMouseLeave={handleHeroLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <span className="sr-only" aria-live="polite">
        {t.heroRotator.aria.status.replace('{{label}}', heroVariants[activeIndex].label)}
      </span>
      <div className="hero-rotator__track">
        {heroVariants.map((variant, index) => {
          const isActive = index === activeIndex;
          const backgroundImage = heroBackgrounds[variant.id];
          const isSplit = variant.id === 'split';
          const overlayByVariant = {
            editorial:
              'linear-gradient(90deg, rgba(6, 10, 20, 0.72) 0%, rgba(6, 10, 20, 0.56) 40%, rgba(6, 10, 20, 0.18) 72%, rgba(6, 10, 20, 0.04) 100%)',
            orbs: 'linear-gradient(180deg, rgba(6, 10, 20, 0.35), rgba(6, 10, 20, 0.65))',
            split: 'linear-gradient(180deg, rgba(6, 10, 20, 0.35), rgba(6, 10, 20, 0.65))',
          };
          const heroBackgroundStyle = backgroundImage
            ? {
                '--hero-bg-image': `url(${backgroundImage})`,
                '--hero-bg-position': variant.id === 'editorial' ? 'center 30%' : 'center',
                '--hero-bg-overlay': overlayByVariant[variant.id] ?? overlayByVariant.editorial,
                '--hero-content-max-width': '520px',
              }
            : undefined;

          const panelContent = renderHeroContent(variant.id);

          return (
            <div
              key={variant.id}
              className={`hero-rotator__panel hero-rotator__panel--${variant.id} ${isActive ? 'is-active' : ''}`}
              aria-hidden={!isActive}
              inert={!isActive}
            >
              <div className={`playground-hero playground-hero--${variant.id} hero--parallax`} style={heroBackgroundStyle}>
                <div className="hero-rotator__image" aria-hidden="true" />
                {isSplit ? <HeroLoop signals={heroContent.split.signals} reducedMotion={prefersReducedMotion} /> : null}
                <Container className="hero-rotator__content">
                  <div className="hero-rotator__content-inner">{panelContent}</div>
                </Container>
                {isActive ? renderControls() : null}
              </div>
            </div>
          );
        })}
      </div>
      <p className="hero-rotator__hint" aria-hidden="true">
        {t.heroRotator.aria.swipeHint}
      </p>
    </header>
  );
}

export default HeroRotator;
