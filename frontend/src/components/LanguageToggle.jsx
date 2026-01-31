import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const { isDark } = useTheme()

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
      isDark 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-300'
    }`}>
      <label className={`font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        Language:
      </label>
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className={`px-2 py-1 rounded border-0 bg-transparent font-medium text-sm cursor-pointer focus:outline-none ${
          isDark
            ? 'text-white'
            : 'text-gray-900'
        }`}
      >
        <option value="en" className="bg-white text-gray-900">English</option>
        <option value="kn" className="bg-white text-gray-900">ಕನ್ನಡ</option>
      </select>
    </div>
  )
}

