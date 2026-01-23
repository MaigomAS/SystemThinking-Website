import { useCallback, useRef } from 'react';
import Button from './ui/Button.jsx';
import Chip from './ui/Chip.jsx';
import Container from './ui/Container.jsx';
import bergenHero from '../assets/bergen-hero.png';
import { useLanguage } from '../i18n/LanguageContext.jsx';

function HeroRotator() {
  const { t } = useLanguage();
  const heroRef = useRef(null);

  const handleHeroMove = useCallback((event) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    hero.style.setProperty('--parallax-x', `${x * 20}px`);
    hero.style.setProperty('--parallax-y', `${y * 14}px`);
  }, []);

  const handleHeroLeave = useCallback(() => {
    const hero = heroRef.current;
    if (hero) {
      hero.style.setProperty('--parallax-x', '0px');
      hero.style.setProperty('--parallax-y', '0px');
    }
  }, []);

  const heroBackgroundStyle = {
    '--hero-bg-image': `url(${bergenHero})`,
    '--hero-bg-opacity': 0.18,
    '--hero-bg-scale': 1.15,
    '--hero-bg-clarity': 0.82,
    '--hero-bg-clarity-blur': '0.2px',
    '--hero-bg-overlay':
      'linear-gradient(90deg, rgba(6, 10, 20, 0.92) 0%, rgba(6, 10, 20, 0.86) 44%, rgba(6, 10, 20, 0.35) 72%, rgba(6, 10, 20, 0.12) 100%)',
    '--hero-bg-clarity-mask':
      'radial-gradient(120% 140% at 8% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 38%, rgba(0, 0, 0, 0.7) 62%, rgba(0, 0, 0, 1) 82%)',
    '--hero-content-max-width': '520px',
  };

  return (
    <header
      className="hero hero-rotator hero--parallax"
      id="inicio"
      ref={heroRef}
      onMouseMove={handleHeroMove}
      onMouseLeave={handleHeroLeave}
    >
      <div className="hero-rotator__track">
        <div className="hero-rotator__panel hero-rotator__panel--editorial is-active">
          <div className="playground-hero playground-hero--editorial hero--parallax" style={heroBackgroundStyle}>
            <div className="hero-rotator__image" aria-hidden="true" />
            <Container className="hero-rotator__content">
              <div className="playground-hero__content playground-hero__content--editorial">
                <Chip className="hero__badge">{t.heroRotator.badge}</Chip>
                <h1>{t.heroRotator.title}</h1>
                <p className="playground-hero__lead">{t.heroRotator.lead}</p>
                <p className="hero__meta">{t.heroRotator.meta}</p>
                <div className="hero__actions">
                  <Button variant="primary" className="cta-glow">
                    {t.heroRotator.actions.primary}
                  </Button>
                  <Button variant="ghost">{t.heroRotator.actions.secondary}</Button>
                </div>
                <div className="hero__chips">
                  {t.heroRotator.badges.map((badge) => (
                    <Chip key={badge} variant="outline">
                      {badge}
                    </Chip>
                  ))}
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeroRotator;
