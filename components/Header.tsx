import React, { useState } from 'react';
import { Menu, Calendar, Download, CalendarPlus } from './icons';
import { useLocalization } from '../App';

interface HeaderProps {
  onSetView: (view: 'day' | 'week') => void;
  onResetToDefault: () => void;
  onExportToCSV: () => void;
  onExportToICS: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSetView, onResetToDefault, onExportToCSV, onExportToICS }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { language, setLanguage, t } = useLocalization();

  return (
    <div className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            {t('appName')}
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 text-sm">
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-2 py-0.5 rounded-full transition-colors ${language === 'en' ? 'bg-white text-blue-600 shadow font-semibold' : 'text-gray-600'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('nl')} 
                className={`px-2 py-0.5 rounded-full transition-colors ${language === 'nl' ? 'bg-white text-blue-600 shadow font-semibold' : 'text-gray-600'}`}
              >
                NL
              </button>
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        {showMenu && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 animate-fade-in-down">
            <button
              onClick={() => { onSetView('week'); setShowMenu(false); }}
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('weekOverview')}
            </button>
            <button
              onClick={() => { onExportToICS(); setShowMenu(false); }}
              className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <CalendarPlus className="w-4 h-4" />
              {t('exportToICal')}
            </button>
            <button
              onClick={() => { onExportToCSV(); setShowMenu(false); }}
              className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              {t('exportToCSV')}
            </button>
            <button
              onClick={() => { onResetToDefault(); setShowMenu(false); }}
              className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('resetToDefault')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;