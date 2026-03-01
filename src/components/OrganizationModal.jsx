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
  const descriptionParagraphs = (Array.isArray(org.description) ? org.description : [org.description]).filter(Boolean);
  const whyParagraphs = (Array.isArray(org.why) ? org.why : [org.why]).filter(Boolean);
  const founderMessage = org.founderMessage;
  const videoOptions = Array.isArray(org.videos) ? org.videos : [];
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
          <div className="org-modal__content-scroll">
            <span className="org-modal__eyebrow">{t.organizationModal.eyebrow}</span>
            <h3 id={`org-modal-title-${org.id}`}>{org.name}</h3>
            <p className="org-modal__tagline">{org.tagline}</p>
            <div className="org-modal__description-group">
              {descriptionParagraphs.map((paragraph) => (
                <p className="org-modal__description" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="org-modal__distinction">
              <span>{(t.organizationModal.distinctionLabel ?? 'Qué distingue a {{name}}').replace('{{name}}', org.name)}</span>
              <ul className="org-modal__bullets">
                {org.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div className="org-modal__why">
              <span>{t.organizationModal.whyLabel}</span>
              {whyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {founderMessage ? (
              <div className="org-modal__founder">
                <span>{founderMessage.title ?? t.organizationModal.founderMessageLabel}</span>
                {founderMessage.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <div className="org-modal__signature">
                  <a
                    href={founderMessage.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={(t.organizationModal.founderLinkedin ?? 'LinkedIn de {{name}}').replace(
                      '{{name}}',
                      founderMessage.founderName,
                    )}
                  >
                    <span>{founderMessage.founderName}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M6.94 8.5V19H3.51V8.5h3.43zm.22-3.24C7.16 6.29 6.38 7 5.23 7h-.02C4.08 7 3.3 6.29 3.3 5.26 3.3 4.2 4.1 3.5 5.25 3.5c1.14 0 1.9.7 1.91 1.76zM20.7 12.98V19h-3.42v-5.63c0-1.42-.5-2.39-1.77-2.39-.97 0-1.54.65-1.8 1.28-.1.23-.12.56-.12.88V19H10.2s.04-9.64 0-10.5h3.4v1.49c.45-.7 1.26-1.7 3.06-1.7 2.24 0 3.93 1.46 3.93 4.6z" />
                    </svg>
                  </a>
                  <p>{founderMessage.founderRole}</p>
                </div>
              </div>
            ) : null}
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
