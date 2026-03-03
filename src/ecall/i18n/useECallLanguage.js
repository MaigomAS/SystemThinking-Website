import { useEffect, useMemo, useState } from 'react';
import en from './en.json';
import es from './es.json';

const E_CALL_LANGUAGE_KEY = 'ecall-language';
const translations = { en, es };

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

export default function useECallLanguage() {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'es';
    return window.localStorage.getItem(E_CALL_LANGUAGE_KEY) ?? window.localStorage.getItem('language') ?? 'es';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(E_CALL_LANGUAGE_KEY, language);
  }, [language]);

  return useMemo(
    () => ({
      language,
      setLanguage,
      t: mergeWithFallback(translations.es, translations[language] ?? {}),
    }),
    [language],
  );
}
