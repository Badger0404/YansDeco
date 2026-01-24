import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Layers,
  FolderTree,
  Tag
} from 'lucide-react';
import AdminSettingsCategoriesCustomization from './AdminSettingsCategoriesCustomization';
import AdminSettingsSubcategoriesCustomization from './AdminSettingsSubcategoriesCustomization';
import AdminSettingsBrandsCustomization from './AdminSettingsBrandsCustomization';

const AdminSettingsCustomization: React.FC = () => {
  const navigate = useNavigate();
  const [isLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showSubcategoriesModal, setShowSubcategoriesModal] = useState(false);
  const [showBrandsModal, setShowBrandsModal] = useState(false);

  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';

  const customizationOptions = [
    {
      id: 'categories',
      title: 'Кастомизация плиток каталогов',
      description: 'Настройка внешнего вида плиток категорий',
      icon: <Layers className="w-12 h-12" />,
      gradient: 'from-blue-500/10 to-blue-600/5',
      color: 'text-blue-500'
    },
    {
      id: 'subcategories',
      title: 'Кастомизация плиток подкаталогов',
      description: 'Настройка внешнего вида плиток подкатегорий',
      icon: <FolderTree className="w-12 h-12" />,
      gradient: 'from-green-500/10 to-green-600/5',
      color: 'text-green-500'
    },
    {
      id: 'brands',
      title: 'Кастомизация плиток брендов',
      description: 'Настройка внешнего вида плиток брендов',
      icon: <Tag className="w-12 h-12" />,
      gradient: 'from-orange-500/10 to-orange-600/5',
      color: 'text-orange-500'
    }
  ];

  const handleBackClick = () => {
    navigate('/admin/settings');
  };

  const handleOptionClick = (optionId: string) => {
    if (optionId === 'categories') {
      setShowCategoriesModal(true);
    } else if (optionId === 'subcategories') {
      setShowSubcategoriesModal(true);
    } else if (optionId === 'brands') {
      setShowBrandsModal(true);
    } else {
      // Пока просто логируем остальные опции
      console.log(`Clicked on ${optionId} customization`);
    }
  };

  return (
    <div className='min-h-screen'>
      <div className='pt-16'>
        <main className='pt-20 pb-12'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='mb-8 flex items-center gap-4'>
              <button
                onClick={handleBackClick}
                className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800'} ${mutedClass}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`font-black italic text-2xl md:text-3xl uppercase tracking-tight ${isLight ? 'text-black' : 'text-zinc-100'}`}>
                  Кастомизация плиток
                </h1>
                <p className={`text-xs ${mutedClass} mt-1`}>
                  Настройка внешнего вида плиток каталогов, подкаталогов и брендов
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {customizationOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div
                    className={`relative h-56 rounded-xl border border-transparent ${borderClass} bg-transparent group cursor-pointer transition-all duration-500 overflow-hidden hover:drop-shadow-[0_0_15px_rgba(255,107,0,0.3)]`}
                    onClick={() => handleOptionClick(option.id)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="absolute inset-0 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-5">
                      <div className="absolute top-3 left-3 w-8 h-8 bg-[#FF6B00] text-black rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>

                      <div className={`mb-3 transition-all duration-500 group-hover:scale-110 ${option.color}`}>
                        {option.icon}
                      </div>

                      <h3 className={`font-black italic text-xl uppercase tracking-tight mb-2 transition-all duration-300 text-center group-hover:text-white ${isLight ? 'text-black' : 'text-white'}`}>
                        {option.title}
                      </h3>

                      <div className="absolute bottom-3 left-3 right-3 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-3">
                        <p className="text-xs text-center bg-black/40 backdrop-blur-sm rounded-lg py-1.5 px-3 text-zinc-200">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute inset-0 rounded-xl border border-[#FF6B00]/50" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF6B00]/10 to-transparent opacity-50" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <AdminSettingsCategoriesCustomization
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />
      <AdminSettingsSubcategoriesCustomization
        isOpen={showSubcategoriesModal}
        onClose={() => setShowSubcategoriesModal(false)}
      />
      <AdminSettingsBrandsCustomization
        isOpen={showBrandsModal}
        onClose={() => setShowBrandsModal(false)}
      />
    </div>
  );
};

export default AdminSettingsCustomization;
