import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '../data/i18n/en.json';
import es from '../data/i18n/es.json';

const translations = { en, es };
const LanguageContext = createContext(null);

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

const mergeWithFallback = (base, override) => {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  if (!isPlainObject(base)) return override ?? base;
  const result = { ...base };
  if (isPlainObject(override)) {
    Object.entries(override).forEach(([key, value]) => {
      result[key] = mergeWithFallback(base[key], value);
    });
  }
  return result;
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'es';
    return window.localStorage.getItem('language') ?? 'es';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
    window.localStorage.setItem('language', language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: mergeWithFallback(translations.es, translations[language] ?? {}),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
