import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  RefreshCw,
  LogOut,
  User,
  Calendar,
  ShoppingBag,
  Mail,
  Phone,
  Clock
} from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  total_price: number;
  status: string;
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  last_login: string | null;
  order_count: number;
  total_spent: number | null;
}

interface ClientDetailData {
  client: Client;
  orders: Order[];
  addresses: any[];
}

const AdminClientDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ClientDetailData | null>(null);
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
    if (id) {
      fetchClientData(id);
    }
  }, [id]);

  const fetchClientData = async (clientId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/clients/${clientId}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch client:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const headerBgClass = isLight ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-white/10';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className={mutedClass}>Client non trouvé</p>
      </div>
    );
  }

  const { client, orders } = data;

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/clients')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            Retour aux clients
          </button>
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

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin/clients')}
              className={`mb-4 flex items-center gap-2 text-sm uppercase tracking-wide transition-colors ${mutedClass} hover:text-[#FF6B00]`}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Retour à la liste
            </button>
            <h1 className={`font-black italic text-3xl md:text-4xl uppercase tracking-tight ${textClass}`}>
              {client.name}
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 border ${borderClass} rounded-xl`}
              >
                <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-4 ${textClass}`}>
                  Informations
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}>
                      <User className={`w-5 h-5 ${mutedClass}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold uppercase tracking-wide ${textClass}`}>
                        {client.name}
                      </p>
                      <p className={`text-xs ${mutedClass}`}>Client</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}>
                      <Mail className={`w-5 h-5 ${mutedClass}`} />
                    </div>
                    <div>
                      <p className={`text-sm ${textClass}`}>{client.email}</p>
                      <p className={`text-xs ${mutedClass}`}>Email</p>
                    </div>
                  </div>

                  {client.phone && (
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}>
                        <Phone className={`w-5 h-5 ${mutedClass}`} />
                      </div>
                      <div>
                        <p className={`text-sm ${textClass}`}>{client.phone}</p>
                        <p className={`text-xs ${mutedClass}`}>Téléphone</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`mt-6 pt-6 border-t ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className={`text-2xl font-bold ${textClass}`}>{client.order_count}</p>
                      <p className={`text-xs ${mutedClass}`}>Commandes</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold text-[#FF6B00]`}>
                        {client.total_spent ? client.total_spent.toFixed(2) : '0.00'} €
                      </p>
                      <p className={`text-xs ${mutedClass}`}>Total dépensé</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 border ${borderClass} rounded-xl`}
              >
                <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-4 ${textClass}`}>
                  Activité
                </h2>
                
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                    <Calendar className="w-4 h-4" />
                    <span>Inscrit le {formatDate(client.created_at)}</span>
                  </div>
                  {client.last_login && (
                    <div className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                      <Clock className="w-4 h-4" />
                      <span>Dernière connexion: {formatDate(client.last_login)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`p-6 border ${borderClass} rounded-xl`}
              >
                <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
                  Historique des commandes ({orders.length})
                </h2>

                {orders.length === 0 ? (
                  <div className={`text-center py-8 ${mutedClass}`}>
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Aucune commande</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className={`p-4 border ${borderClass} rounded-xl ${isLight ? 'bg-gray-50' : 'bg-white/5'}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className={`font-bold uppercase tracking-wide ${textClass}`}>
                              Commande #{order.id}
                            </p>
                            <p className={`text-xs ${mutedClass}`}>
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-bold text-[#FF6B00]`}>
                              {order.total_price.toFixed(2)} €
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'completed' 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {order.status === 'completed' ? 'Terminée' : order.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isLight ? 'bg-gray-200' : 'bg-white/10'} ${mutedClass}`}>
                                  {item.quantity}
                                </span>
                                <span className={textClass}>{item.name}</span>
                              </div>
                              <span className={`${mutedClass}`}>
                                {(item.price * item.quantity).toFixed(2)} €
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className={`mt-3 pt-3 border-t ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                            <p className={`text-xs ${mutedClass}`}>
                              <span className="font-bold">Note:</span> {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminClientDetail;
