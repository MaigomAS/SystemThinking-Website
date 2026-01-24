import { useMemo, useRef, useState } from 'react';
import Button from './ui/Button.jsx';
import Card from './ui/Card.jsx';
import Container from './ui/Container.jsx';
import Section from './ui/Section.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const whatsappPhone = '4741368586';
const roomUrl = 'https://whereby.com/annia-no?embed=1';

function ECallPage() {
  const { t, language, setLanguage } = useLanguage();
  const frameRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCoverVisible, setIsCoverVisible] = useState(true);
  const [isCoverLeaving, setIsCoverLeaving] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const whatsappLink = useMemo(
    () => `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(t.ecall.whatsappMessage)}`,
    [t.ecall.whatsappMessage],
  );

  const handleEnterRoom = () => {
    setIsCoverLeaving(true);
    setTimeout(() => {
      setIsCoverVisible(false);
      setIsCoverLeaving(false);
    }, 320);
    frameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleFullscreen = async () => {
    if (!frameRef.current || !frameRef.current.requestFullscreen) return;
    try {
      await frameRef.current.requestFullscreen();
    } catch (error) {
      // no-op: fullscreen may be blocked by the browser
    }
  };

  return (
    <div className="page ecall-page">
      <header className="navbar navbar--ecall">
        <Container>
          <nav className="navbar__inner" aria-label={t.ecall.aria.nav}>
            <div className="brandmark">ANNiA</div>
            <div className="ecall-nav__links">
              <a href="/" className="ecall-nav__link">
                {t.ecall.actions.back}
              </a>
              <a href="#room" className="ecall-nav__link">
                {t.ecall.actions.enter}
              </a>
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
              <Button as="a" href="#room" variant="primary" size="sm" aria-label={t.ecall.aria.enter}>
                {t.ecall.actions.enter}
              </Button>
            </div>
          </nav>
        </Container>
      </header>

      <main className="ecall-main">
        <section className="ecall-hero">
          <Container>
            <div className="ecall-hero__grid">
              <div className="ecall-hero__content">
                <span className="ecall-hero__eyebrow">{t.ecall.eyebrow}</span>
                <h1>{t.ecall.title}</h1>
                <p>{t.ecall.description}</p>
                <div className="ecall-hero__actions">
                  <Button as="a" href="#room" variant="primary" aria-label={t.ecall.aria.enter}>
                    {t.ecall.actions.enter}
                  </Button>
                  <Button as="a" href="/" variant="secondary" aria-label={t.ecall.aria.back}>
                    {t.ecall.actions.back}
                  </Button>
                </div>
                <p className="ecall-hero__note">{t.ecall.note}</p>
              </div>
              <Card variant="glass" className="ecall-hero__card" as="article">
                <h2>{t.ecall.card.title}</h2>
                <p>{t.ecall.card.description}</p>
                <div className="ecall-hero__badges">
                  {t.ecall.card.badges.map((badge) => (
                    <span key={badge} className="ecall-hero__badge">
                      {badge}
                    </span>
                  ))}
                </div>
<p className="ecall-hero__powered">{t.ecall.card.subtle}</p>

              </Card>
            </div>
          </Container>
        </section>

        <Section id="room" eyebrow={t.ecall.room.eyebrow} title={t.ecall.room.title} description={t.ecall.room.subtitle} tone="mid">
          <div className="ecall-room">
            <Card variant="glass" className="ecall-room__card" as="article">
              <div className="ecall-room__header">
                <div>
                  <h3>{t.ecall.room.cardTitle}</h3>
                  <p>{t.ecall.room.cardCopy}</p>
                </div>
                <span className="ecall-room__status">{t.ecall.room.status}</span>
              </div>
<div
  className="ecall-room__frame"
  ref={frameRef}
  onMouseEnter={() => setShowControls(true)}
  onMouseLeave={() => setShowControls(false)}
>
  <div className={`ecall-room__controls ${showControls ? '' : 'is-hidden'}`.trim()}>
    <button type="button" className="ecall-room__control-button" onClick={handleFullscreen}>
      <span className="ecall-room__control-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M16 3h3a2 2 0 0 1 2 2v3" />
          <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      </span>
      <span className="ecall-room__control-label">
        {t.ecall.actions.fullscreen}
      </span>
    </button>
  </div>

  {!isLoaded ? (
    <div className="ecall-room__loader">
      <span className="ecall-room__spinner" aria-hidden="true" />
      <span>{t.ecall.room.loading}</span>
    </div>
  ) : null}

  {isCoverVisible ? (
    <div className={`ecall-room__cover ${isCoverLeaving ? 'is-leaving' : ''}`.trim()}>
      <div className="ecall-room__cover-card">
        <h3>{t.ecall.room.readyTitle}</h3>
        <p>{t.ecall.room.readyCopy}</p>
        <Button type="button" variant="primary" onClick={handleEnterRoom}>
          {t.ecall.actions.join}
        </Button>
      </div>
    </div>
  ) : null}

  <iframe
    title={t.ecall.room.iframeTitle}
    src={roomUrl}
    allow="camera; microphone; fullscreen; speaker; display-capture"
    loading="lazy"
    onLoad={() => setIsLoaded(true)}
  />
</div>

                />
              </div>
              <div className="ecall-room__footer">
                <span>{t.ecall.room.brandNote}</span>
<span className="ecall-room__powered">{t.ecall.room.subtle}</span>

              </div>
            </Card>
            <div className="ecall-room__sidebar">
              <Card variant="outline" className="ecall-room__list" as="article">
                <h3>{t.ecall.prep.title}</h3>
                <ul>
                  {t.ecall.prep.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
              <Card variant="outline" className="ecall-room__support" as="article">
                <h3>{t.ecall.support.title}</h3>
                <p>{t.ecall.support.copy}</p>
                <Button as="a" href={whatsappLink} variant="secondary" aria-label={t.ecall.aria.whatsapp}>
                  {t.ecall.support.button}
                </Button>
              </Card>
            </div>
          </div>
        </Section>

        <Section eyebrow={t.ecall.steps.eyebrow} title={t.ecall.steps.title} description={t.ecall.steps.subtitle} tone="dark">
          <div className="ecall-steps">
            {t.ecall.steps.items.map((step) => (
              <Card key={step.title} variant="glass" as="article">
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </Card>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}

export default ECallPage;
