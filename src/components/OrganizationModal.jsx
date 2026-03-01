import { useEffect, useRef, useState } from 'react';
import Button from './ui/Button.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function OrganizationModal({ open, onClose, org, returnFocusRef }) {
  const { t } = useLanguage();
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  useEffect(() => {
    setImageError(false);
    setSelectedVideoIndex(0);
  }, [org?.id]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll(focusableSelector)).filter(
        (element) => !element.hasAttribute('disabled') && element.getAttribute('tabindex') !== '-1',
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const isShift = event.shiftKey;

      if (isShift && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!isShift && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      returnFocusRef?.current?.focus?.();
    };
  }, [open, onClose, returnFocusRef]);

  if (!open || !org) return null;

  const hasPreview = Boolean(org.previewImage) && !imageError;
  const videoOptions = Array.isArray(org.videos) ? org.videos : [];
  const isAnnia = org.id === 'annia';
  const hasVideos = videoOptions.length > 0;
  const selectedVideo = videoOptions[selectedVideoIndex] ?? videoOptions[0];
  const videoId = selectedVideo?.url ? getYouTubeId(selectedVideo.url) : null;
  const videoSrc = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="org-modal__overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="org-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`org-modal-title-${org.id}`}
        ref={panelRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="org-modal__close"
          onClick={onClose}
          aria-label={t.organizationModal.close}
          ref={closeButtonRef}
        >
          ×
        </button>
        <div className="org-modal__preview">
          {hasVideos && videoSrc ? (
            <div className="org-modal__video">
              <label className="org-modal__video-label" htmlFor={`org-modal-video-${org.id}`}>
                {t.organizationModal.videoLabel}
              </label>
              <select
                id={`org-modal-video-${org.id}`}
                className="org-modal__video-select"
                value={selectedVideoIndex}
                onChange={(event) => setSelectedVideoIndex(Number(event.target.value))}
              >
                {videoOptions.map((video, index) => (
                  <option key={video.url ?? `${org.id}-${index}`} value={index}>
                    {video.label ?? `${t.organizationModal.videoLabel} ${index + 1}`}
                  </option>
                ))}
              </select>
              <div className="org-modal__video-frame">
                <iframe
                  src={videoSrc}
                  title={`${org.name} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : isAnnia ? (
            <AnniaFounderVisual org={org} />
          ) : hasPreview ? (
            <img
              src={org.previewImage}
              alt={t.organizationModal.previewAlt.replace('{{name}}', org.name)}
              loading="lazy"
              decoding="async"
              width="1200"
              height="800"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="org-modal__preview-fallback" aria-hidden="true">
              <div className="org-modal__preview-glow" />
              <div className="org-modal__preview-mock">
                <span className="org-modal__preview-label">{t.organizationModal.previewLabel}</span>
                <div className="org-modal__preview-bars">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="org-modal__content">
          <span className="org-modal__eyebrow">{t.organizationModal.eyebrow}</span>
          <h3 id={`org-modal-title-${org.id}`}>{org.name}</h3>
          <p className="org-modal__tagline">{org.tagline}</p>
          <p className="org-modal__description">{org.description}</p>
          {org.descriptionSecondary ? <p className="org-modal__description">{org.descriptionSecondary}</p> : null}
          {org.distinctionTitle ? <h4 className="org-modal__section-title">{org.distinctionTitle}</h4> : null}
          <ul className="org-modal__bullets">
            {org.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className="org-modal__why">
            <span>{t.organizationModal.whyLabel}</span>
            <p>{org.why}</p>
          </div>
          <div className="org-modal__actions">
            {org.url ? (
              <Button as="a" href={org.url} target="_blank" rel="noreferrer" variant="primary">
                {t.organizationModal.visitSite}
              </Button>
            ) : null}
            <Button variant="ghost" onClick={onClose}>
              {t.organizationModal.closeButton}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


function AnniaFounderVisual({ org }) {
  return (
    <div className="org-modal__annia-visual">
      <div className="org-modal__annia-logo-shell" aria-hidden="true">
        {org.previewImage ? (
          <img src={org.previewImage} alt="" loading="lazy" decoding="async" width="600" height="600" />
        ) : (
          <span className="org-modal__annia-logo-fallback">ANNIA</span>
        )}
      </div>

      <div className="org-modal__founder-card">
        {org.founderWelcomeTitle ? <p className="org-modal__founder-eyebrow">{org.founderWelcomeTitle}</p> : null}
        {org.founderMessage ? <p className="org-modal__founder-message">{org.founderMessage}</p> : null}
        <p className="org-modal__founder-name">{org.founderName ?? 'Francisco Mainou'}</p>
        {org.founderRole ? <p className="org-modal__founder-role">{org.founderRole}</p> : null}
        {org.founderLinkedIn ? (
          <a href={org.founderLinkedIn} target="_blank" rel="noreferrer" className="org-modal__founder-link">
            {org.founderLinkedInLabel ?? 'LinkedIn'}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default OrganizationModal;

function getYouTubeId(url) {

  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.replace('/', '');
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
  } catch (error) {
    return null;
  }
  return null;
}
