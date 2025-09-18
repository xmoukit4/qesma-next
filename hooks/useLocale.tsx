'use client';

import { createContext, useContext, useState } from 'react';

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  fetchTranslations: (locale: string) => Promise<void>;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  const fetchTranslations = async (locale: string) => {
    const res = await fetch(`/locales/${locale}.json`);
    const data = await res.json();
    setTranslations(data);
  };

  const t = (key: string) => {
    return translations[key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, fetchTranslations, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};
