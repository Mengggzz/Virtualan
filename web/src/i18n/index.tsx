import React, { createContext, useContext, useState, useEffect } from 'react';
import { id } from './id';
import { en } from './en';

type Language = 'id' | 'en';
type Translations = typeof id;

interface I18nContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('virtualan.lang');
    return (saved === 'en' || saved === 'id') ? saved : 'id';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('virtualan.lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'id' ? 'en' : 'id');
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value: I18nContextType = {
    lang,
    t: lang === 'id' ? id : en,
    setLang,
    toggleLang,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useT = (): I18nContextType => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used within an I18nProvider');
  return ctx;
};
