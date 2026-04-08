'use client'
import { useState, useEffect } from 'react'

const translations: Record<string, Record<string, string>> = {
  EN: {
    services: 'Services',
    propertyTypes: 'Property Types',
    neighborhoods: 'Neighborhoods',
    languages: 'Languages',
    tagline: 'Miami Residence Realty is a premier full-service Miami real estate brokerage.',
    callUs: 'Call Us',
    search: 'Search',
    condos: 'Condos',
    homes: 'Homes',
    newDev: 'New Developments',
    estimate: 'Estimate',
    sell: 'Sell',
  },
  ES: {
    services: 'Servicios',
    propertyTypes: 'Tipos de Propiedad',
    neighborhoods: 'Vecindarios',
    languages: 'Idiomas',
    tagline: 'Miami Residence Realty es una agencia inmobiliaria de servicio completo en Miami.',
    callUs: 'Llame',
    search: 'Buscar',
    condos: 'Condominios',
    homes: 'Casas',
    newDev: 'Nuevos Desarrollos',
    estimate: 'Estimar',
    sell: 'Vender',
  },
  RU: {
    services: 'Услуги',
    propertyTypes: 'Типы недвижимости',
    neighborhoods: 'Районы',
    languages: 'Языки',
    tagline: 'Miami Residence Realty — ведущее агентство недвижимости полного цикла в Майами.',
    callUs: 'Позвонить',
    search: 'Поиск',
    condos: 'Кондо',
    homes: 'Дома',
    newDev: 'Новостройки',
    estimate: 'Оценка',
    sell: 'Продать',
  },
}

export function useLanguage() {
  const [lang, setLang] = useState('EN')

  useEffect(() => {
    const stored = localStorage.getItem('miami-lang')
    if (stored && translations[stored]) setLang(stored)
  }, [])

  const changeLang = (newLang: string) => {
    setLang(newLang)
    localStorage.setItem('miami-lang', newLang)
  }

  const t = (key: string) => translations[lang]?.[key] || translations.EN[key] || key

  return { lang, changeLang, t }
}

export default function LanguageSelector() {
  const { lang, changeLang } = useLanguage()

  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider mb-2">🌐 Languages</h4>
      <div className="flex gap-3 text-xs">
        {['EN', 'ES', 'RU'].map(l => (
          <label key={l} className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-white">
            <input
              type="radio"
              name="lang"
              checked={lang === l}
              onChange={() => changeLang(l)}
              className="accent-white w-3 h-3"
            />
            {l}
          </label>
        ))}
      </div>
    </div>
  )
}
