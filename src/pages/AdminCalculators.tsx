import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Calculator,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const AdminCalculators: React.FC = () => {
  const { t } = useTranslation();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };

    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const hoverBorderClass = 'hover:border-[#FF6B00]';

  const calculators = [
    { id: '1', name: 'Calculateur de Peinture', description: 'Surface × rendement × couches', status: 'active' },
    { id: '2', name: 'Calculateur de Carrelage', description: 'Surface +10% perte de coupe', status: 'active' },
    { id: '3', name: 'Calculateur de Colle', description: 'Surface × épaisseur de joint', status: 'active' },
    { id: '4', name: 'Calculateur de Ragréage', description: 'Surface × épaisseur', status: 'inactive' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`font-black italic text-2xl md:text-3xl uppercase tracking-tight ${textClass}`}>
              {t('admin.calculators.title')}
            </h1>
            <p className={`text-xs ${mutedClass} mt-1`}>
              {t('admin.sections.calculators.description')}
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-black rounded-lg hover:bg-[#FF8533] transition-colors">
            <Plus className="w-3 h-3" />
            {t('admin.calculators.addNew')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {calculators.map((calc, index) => (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-5 bg-transparent border ${borderClass} ${hoverBorderClass} rounded-xl transition-all duration-500 group`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg bg-[#FF6B00]/10 ${isLight ? 'text-[#FF6B00]' : 'text-[#FF6B00]'}`}>
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold italic text-lg uppercase tracking-wide mb-1 ${textClass}`}>
                    {calc.name}
                  </h3>
                  <p className={`text-sm ${mutedClass} mb-3`}>{calc.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    calc.status === 'active'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {calc.status === 'active' ? t('admin.products.active') : t('admin.products.inactive')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold uppercase tracking-wide border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
                  <Eye className="w-3.5 h-3.5" />
                  {t('admin.products.view')}
                </button>
                <button className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold uppercase tracking-wide border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
                  <Edit className="w-3.5 h-3.5" />
                  {t('admin.products.edit')}
                </button>
                <button className="flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-bold uppercase tracking-wide border border-red-500/50 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCalculators;