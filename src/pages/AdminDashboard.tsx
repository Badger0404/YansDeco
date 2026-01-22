import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Tag,
  Award,
  Globe,
  Calculator,
  Settings,
  Plus,
  ChevronRight,
  Upload,
  Download,
  RefreshCw,
  Edit3,
  Users,
  MessageSquare
} from 'lucide-react';

interface AdminSection {
  id: string;
  key: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  label: string;
}

const AdminDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  const isRootAdmin = location.pathname === '/admin';

  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const hoverBorderClass = 'hover:border-[#FF6B00]';

  const sections: AdminSection[] = useMemo(() => [
    {
      id: 'products',
      key: 'admin.sections.products',
      icon: <Package className="w-12 h-12" />,
      path: '/admin/products',
      color: 'from-orange-500/10 to-orange-600/5',
      label: t('admin.sections.products.title')
    },
    {
      id: 'categories',
      key: 'admin.sections.categories',
      icon: <Tag className="w-12 h-12" />,
      path: '/admin/categories',
      color: 'from-blue-500/10 to-blue-600/5',
      label: t('admin.sections.categories.title')
    },
    {
      id: 'brands',
      key: 'admin.sections.brands',
      icon: <Award className="w-12 h-12" />,
      path: '/admin/brands',
      color: 'from-yellow-500/10 to-yellow-600/5',
      label: t('admin.sections.brands.title')
    },
    {
      id: 'services',
      key: 'admin.sections.services',
      icon: <Globe className="w-12 h-12" />,
      path: '/admin/services',
      color: 'from-teal-500/10 to-teal-600/5',
      label: t('admin.sections.services.title')
    },
    {
      id: 'clients',
      key: 'admin.sections.clients',
      icon: <Users className="w-12 h-12" />,
      path: '/admin/clients',
      color: 'from-pink-500/10 to-pink-600/5',
      label: 'CLIENTS'
    },
    {
      id: 'translations',
      key: 'admin.sections.translations',
      icon: <Globe className="w-12 h-12" />,
      path: '/admin/translations',
      color: 'from-green-500/10 to-green-600/5',
      label: t('admin.sections.translations.title')
    },
    {
      id: 'calculators',
      key: 'admin.sections.calculators',
      icon: <Calculator className="w-12 h-12" />,
      path: '/admin/calculators',
      color: 'from-purple-500/10 to-purple-600/5',
      label: t('admin.sections.calculators.title')
    },
    {
      id: 'settings',
      key: 'admin.sections.settings',
      icon: <Settings className="w-12 h-12" />,
      path: '/admin/settings',
      color: 'from-gray-500/10 to-gray-600/5',
      label: t('admin.sections.settings.title')
    },
    {
      id: 'content',
      key: 'admin.sections.content',
      icon: <Edit3 className="w-12 h-12" />,
      path: '/admin/content',
      color: 'from-red-500/10 to-red-600/5',
      label: t('admin.sections.content.title')
    },
    {
      id: 'slogans',
      key: 'admin.sections.slogans',
      icon: <MessageSquare className="w-12 h-12" />,
      path: '/admin/slogans',
      color: 'from-indigo-500/10 to-indigo-600/5',
      label: t('admin.sections.slogans.title')
    }
  ], [t, i18n.language]);

  const renderDashboardContent = () => (
    <>
      <div className="text-center mb-12">
        <h1 className="font-black italic text-4xl md:text-5xl uppercase tracking-tight mb-3 text-[#FF6B00]">
          {t('admin.title')}
        </h1>
        <p className={`text-sm ${isLight ? 'text-zinc-600' : 'text-zinc-300'} max-w-2xl mx-auto`}>
          {t('admin.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link to={section.path}>
              <div
                className={`relative h-56 rounded-xl border border-transparent ${borderClass} bg-transparent group cursor-pointer transition-all duration-500 overflow-hidden ${hoveredSection === section.id ? 'drop-shadow-[0_0_15px_rgba(255,107,0,0.3)]' : ''
                  }`}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col items-center justify-center h-full p-5">
                  <div className={`mb-3 transition-all duration-500 ${hoveredSection === section.id ? 'scale-110' : 'scale-100'
                    } ${hoveredSection === section.id ? 'text-[#FF6B00]' : 'text-[#FF6B00]'}`}>
                    {section.icon}
                  </div>

                  <h3 className={`font-black italic text-2xl uppercase tracking-tight mb-2 transition-all duration-300 ${hoveredSection === section.id ? 'text-white' : (isLight ? 'text-black' : 'text-white')
                    }`}>
                    {section.label}
                  </h3>

                  <div className={`absolute bottom-3 left-3 right-3 transition-all duration-500 ${hoveredSection === section.id
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3'
                    }`}>
                    <p className={`text-xs text-center bg-black/40 backdrop-blur-sm rounded-lg py-1.5 px-3 ${hoveredSection === section.id ? 'text-zinc-200' : mutedClass
                      }`}>
                      {t(`${section.key}.description`)}
                    </p>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-0 rounded-xl border border-[#FF6B00]/50" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF6B00]/10 to-transparent opacity-50" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-14">
        <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-5 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
          {t('admin.quickActions.title')}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Plus className="w-4 h-4" />, label: t('admin.quickActions.newProduct'), path: '/admin/add-product' },
            { icon: <Upload className="w-4 h-4" />, label: t('admin.quickActions.importCsv') },
            { icon: <Download className="w-4 h-4" />, label: t('admin.quickActions.exportData') },
            { icon: <RefreshCw className="w-4 h-4" />, label: t('admin.quickActions.syncCloud') },
          ].map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              onClick={action.path ? () => navigate(action.path!) : undefined}
              className={`flex items-center justify-center gap-2 py-3 px-4 bg-transparent border ${borderClass} rounded-lg text-xs font-bold uppercase tracking-wide ${isLight ? 'text-zinc-700' : 'text-zinc-400'} hover:text-[#FF6B00] hover:border-[#FF6B00] transition-all duration-300`}
            >
              {action.icon}
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-5 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
          {t('admin.recentActivity.title')}
        </h2>

        <div className="space-y-2">
          {[
            { time: '2 min', action: t('admin.recentActivity.items.productModified'), status: 'success' },
            { time: '15 min', action: t('admin.recentActivity.items.categoryAdded'), status: 'success' },
            { time: '1 h', action: t('admin.recentActivity.items.syncComplete'), status: 'info' },
            { time: '3 h', action: t('admin.recentActivity.items.translationUpdated'), status: 'warning' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className={`flex items-center gap-3 p-3 bg-transparent border border-transparent ${borderClass} rounded-lg ${hoverBorderClass} transition-all duration-300`}
            >
              <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' :
                activity.status === 'warning' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]' :
                  'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]'
                }`} />
              <span className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'} w-14`}>{activity.time}</span>
              <span className={`text-sm ${isLight ? 'text-zinc-900' : 'text-white'} flex-1`}>{activity.action}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {isRootAdmin ? renderDashboardContent() : <Outlet />}
    </div>
  );
};

export default AdminDashboard;
