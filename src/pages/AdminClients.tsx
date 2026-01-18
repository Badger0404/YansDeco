import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Search, 
  RefreshCw,
  Package,
  Tag,
  Award,
  Globe,
  Calculator,
  Settings,
  LogOut,
  User,
  Users,
  Calendar,
  ShoppingBag,
  Mail,
  Phone,
  Clock
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  last_login: string | null;
  order_count: number;
  total_spent: number | null;
}

const AdminClients: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/clients');
      const data = await response.json();
      
      if (data.success) {
        setClients(data.data.clients);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';
  const headerBgClass = isLight ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-white/10';

  const adminNavItems = [
    { id: 'products', label: t('admin.sections.products.title'), icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <Award className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'clients', label: 'CLIENTS', icon: <Users className="w-4 h-4" />, path: '/admin/clients' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <Globe className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', label: t('admin.sections.calculators.title'), icon: <Calculator className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', label: t('admin.sections.settings.title'), icon: <Settings className="w-4 h-4" />, path: '/admin/settings' },
  ];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToSite')}
          </button>
          <div className={`h-4 w-px ${isLight ? 'bg-gray-300' : 'bg-white/10'}`} />
          
          <nav className="hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? isLight ? 'bg-[#FF6B00] text-black' : 'bg-[#FF6B00] text-black'
                    : isLight ? 'text-gray-600 hover:bg-gray-100 hover:text-[#FF6B00]' : 'text-zinc-400 hover:bg-white/5 hover:text-[#FF6B00]'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-black" />
            </div>
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className={`font-black italic text-3xl md:text-4xl uppercase tracking-tight ${textClass}`}>
              CLIENTS
            </h1>
            <p className={`text-sm ${mutedClass} mt-1`}>
              Gestion de la base de données clients
            </p>
          </div>

          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedClass}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un client..."
                  className={`w-full pl-10 pr-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                />
              </div>
              <button
                onClick={fetchClients}
                className={`px-4 py-3 border ${borderClass} rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${textClass} hover:border-[#FF6B00] flex items-center gap-2`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className={`text-center py-12 border ${borderClass} rounded-xl ${mutedClass}`}>
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Aucun client trouvé</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/admin/clients/${client.id}`)}
                  className={`p-6 border ${borderClass} rounded-xl cursor-pointer transition-all duration-200 hover:border-[#FF6B00] hover:bg-[#FF6B00]/5`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}>
                        <User className={`w-6 h-6 ${mutedClass}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold italic text-lg uppercase tracking-wide ${textClass}`}>
                          {client.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className={`flex items-center gap-1 text-sm ${mutedClass}`}>
                            <Mail className="w-4 h-4" />
                            {client.email}
                          </span>
                          {client.phone && (
                            <span className={`flex items-center gap-1 text-sm ${mutedClass}`}>
                              <Phone className="w-4 h-4" />
                              {client.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${textClass}`}>
                          {client.order_count}
                        </p>
                        <p className={`text-xs ${mutedClass}`}>
                          <ShoppingBag className="w-3 h-3 inline mr-1" />
                          Commandes
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className={`text-2xl font-bold text-[#FF6B00]`}>
                          {client.total_spent ? client.total_spent.toFixed(2) : '0.00'} €
                        </p>
                        <p className={`text-xs ${mutedClass}`}>
                          Total dépensé
                        </p>
                      </div>
                      
                      <ChevronRight className={`w-5 h-5 ${mutedClass}`} />
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-4 mt-4 pt-4 border-t border-dashed ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                    <span className={`flex items-center gap-1 text-xs ${mutedClass}`}>
                      <Calendar className="w-3 h-3" />
                      Inscrit: {formatDate(client.created_at)}
                    </span>
                    {client.last_login && (
                      <span className={`flex items-center gap-1 text-xs ${mutedClass}`}>
                        <Clock className="w-3 h-3" />
                        Dernière connexion: {formatDate(client.last_login)}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminClients;
