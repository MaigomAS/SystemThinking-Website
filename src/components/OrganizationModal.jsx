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

  useEffect(() => {
    setImageError(false);
  }, [org?.previewImage]);

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
          {hasPreview ? (
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

export default OrganizationModal;
