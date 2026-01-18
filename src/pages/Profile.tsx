import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Lock, 
  ChevronRight,
  Edit3,
  Trash2,
  Plus,
  Check,
  X,
  Save,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Address {
  id: number;
  type: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: number;
}

interface Order {
  id: number;
  items: any[];
  total_price: number;
  status: string;
  created_at: string;
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { client, token, isLoading, isAuthenticated, logout, updateProfile } = useAuth();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [activeTab, setActiveTab] = useState<'info' | 'addresses' | 'orders'>('info');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'shipping',
    name: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
    is_default: false
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAddresses();
      fetchOrders();
      if (client) {
        setEditName(client.name);
        setEditPhone(client.phone || '');
      }
    }
  }, [isAuthenticated, token, client]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_URL}/clients/me/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data.addresses || []);
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/clients/me/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    const result = await updateProfile({ name: editName, phone: editPhone });
    
    if (result.success) {
      setSuccess(t('auth.profileUpdated'));
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to update profile');
    }
    
    setLoading(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/clients/me/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newAddress)
      });
      const data = await response.json();
      
      if (data.success) {
        setAddresses([...addresses, data.data.address]);
        setShowAddAddress(false);
        setNewAddress({
          type: 'shipping',
          name: '',
          address: '',
          city: '',
          postal_code: '',
          country: '',
          phone: '',
          is_default: false
        });
      } else {
        setError(data.error || 'Failed to add address');
      }
    } catch (err) {
      setError('Failed to add address');
    }
    
    setLoading(false);
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm(t('admin.products.deleteConfirm'))) return;
    
    try {
      const response = await fetch(`${API_URL}/clients/me/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setAddresses(addresses.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (passwordData.new !== passwordData.confirm) {
      setError(t('auth.passwordsNotMatch'));
      setLoading(false);
      return;
    }
    
    if (passwordData.new.length < 6) {
      setError(t('auth.passwordTooShort'));
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/clients/me/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess(t('auth.passwordUpdated'));
        setShowPasswordModal(false);
        setPasswordData({ current: '', new: '', confirm: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('Failed to update password');
    }
    
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-zinc-200' : 'border-zinc-700';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';
  const headerBgClass = isLight ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-white/10';
  const cardBgClass = isLight ? 'bg-white/80' : 'bg-zinc-900/80';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className={`text-lg ${mutedClass} mb-4`}>{t('auth.loginRequired')}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#FF6B00] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wide"
          >
            {t('auth.login')}
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: t('auth.profile'), icon: <User className="w-5 h-5" /> },
    { id: 'addresses', label: t('profile.addresses'), icon: <MapPin className="w-5 h-5" /> },
    { id: 'orders', label: t('auth.myOrders'), icon: <ShoppingBag className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
          }`}
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          {t('admin.backToSite')}
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center">
              <span className="text-black font-bold">
                {client?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className={`text-sm font-bold ${textClass}`}>
              {client?.name}
            </span>
          </div>
          <button
            onClick={logout}
            className={`text-xs font-bold uppercase tracking-wide ${mutedClass} hover:text-[#FF6B00]`}
          >
            {t('auth.logout')}
          </button>
        </div>
      </header>

      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className={`font-black italic text-3xl md:text-4xl uppercase tracking-tight ${textClass}`}>
              {t('auth.profile')}
            </h1>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 text-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {success}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className={`p-4 border ${borderClass} rounded-xl ${cardBgClass}`}>
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-[#FF6B00] text-black'
                          : `${textClass} hover:bg-[#FF6B00]/10`
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className={`w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-200 border ${borderClass} ${textClass} hover:border-[#FF6B00]`}
                >
                  <Lock className="w-5 h-5" />
                  {t('profile.changePassword')}
                </button>
              </div>
            </div>

            <div className="lg:col-span-3">
              {activeTab === 'info' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 border ${borderClass} rounded-xl ${cardBgClass}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`font-bold italic text-xl uppercase tracking-wide ${textClass}`}>
                      {t('auth.profile')}
                    </h2>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#FF6B00]"
                      >
                        <Edit3 className="w-4 h-4" />
                        {t('admin.edit')}
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setEditName(client?.name || '');
                            setEditPhone(client?.phone || '');
                          }}
                          className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-red-500"
                        >
                          <X className="w-4 h-4" />
                          {t('admin.cancel')}
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#FF6B00]"
                        >
                          {loading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {t('admin.save')}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        {t('auth.name')}
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        />
                      ) : (
                        <p className={`text-lg ${textClass}`}>{client?.name}</p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        {t('auth.email')}
                      </label>
                      <p className={`text-lg ${textClass}`}>{client?.email}</p>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        {t('auth.phone')}
                      </label>
                      {editMode ? (
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                          placeholder="+33 6 12 34 56 78"
                        />
                      ) : (
                        <p className={`text-lg ${textClass}`}>{client?.phone || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        {t('profile.memberSince')}
                      </label>
                      <p className={`text-lg ${textClass}`}>
                        {client?.created_at ? formatDate(client.created_at) : '-'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 border ${borderClass} rounded-xl ${cardBgClass}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`font-bold italic text-xl uppercase tracking-wide ${textClass}`}>
                      {t('profile.addresses')}
                    </h2>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#FF6B00]"
                    >
                      <Plus className="w-4 h-4" />
                      {t('profile.addAddress')}
                    </button>
                  </div>

                  {showAddAddress && (
                    <form onSubmit={handleAddAddress} className={`mb-6 p-4 border ${borderClass} rounded-xl`}>
                      <h3 className={`font-bold uppercase tracking-wide mb-4 ${textClass}`}>
                        {t('profile.addAddress')}
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('profile.type')}
                          </label>
                          <select
                            value={newAddress.type}
                            onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                          >
                            <option value="shipping">{t('profile.shipping')}</option>
                            <option value="billing">{t('profile.billing')}</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('profile.label')}
                          </label>
                          <input
                            type="text"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder={t('profile.home')}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('profile.address')}
                          </label>
                          <input
                            type="text"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder="123 Rue de la Paix"
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('profile.city')}
                          </label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder="Paris"
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('profile.postalCode')}
                          </label>
                          <input
                            type="text"
                            value={newAddress.postal_code}
                            onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder="75001"
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('profile.country')}
                          </label>
                          <input
                            type="text"
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder="France"
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('auth.phone')}
                          </label>
                          <input
                            type="tel"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder="+33 6 12 34 56 78"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer mb-4">
                        <input
                          type="checkbox"
                          checked={newAddress.is_default}
                          onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                          className="w-5 h-5 rounded border-2 border-[#FF6B00] text-[#FF6B00]"
                        />
                        <span className={`text-sm ${textClass}`}>{t('profile.defaultAddress')}</span>
                      </label>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-[#FF6B00] text-black py-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors"
                        >
                          {loading ? <RefreshCw className="w-5 h-5 mx-auto animate-spin" /> : t('admin.save')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(false)}
                          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold uppercase tracking-wide hover:border-red-500 hover:text-red-500 transition-colors"
                        >
                          {t('admin.cancel')}
                        </button>
                      </div>
                    </form>
                  )}

                  {addresses.length === 0 ? (
                    <div className={`text-center py-8 ${mutedClass}`}>
                      <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>{t('profile.noAddresses')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-4 border ${borderClass} rounded-xl ${cardBgClass}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded ${
                                  addr.type === 'shipping' ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'
                                }`}>
                                  {addr.type === 'shipping' ? t('profile.shipping') : t('profile.billing')}
                                </span>
                                {addr.is_default === 1 && (
                                  <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded bg-[#FF6B00]/20 text-[#FF6B00]`}>
                                    {t('profile.default')}
                                  </span>
                                )}
                              </div>
                              <p className={`font-bold ${textClass}`}>{addr.name}</p>
                              <p className={`text-sm ${mutedClass}`}>{addr.address}</p>
                              <p className={`text-sm ${mutedClass}`}>{addr.postal_code} {addr.city}</p>
                              <p className={`text-sm ${mutedClass}`}>{addr.country}</p>
                              {addr.phone && <p className={`text-sm ${mutedClass} mt-1`}>{addr.phone}</p>}
                            </div>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-red-100 text-red-500' : 'hover:bg-red-500/20 text-red-400'}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 border ${borderClass} rounded-xl ${cardBgClass}`}
                >
                  <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
                    {t('auth.myOrders')}
                  </h2>

                  {orders.length === 0 ? (
                    <div className={`text-center py-8 ${mutedClass}`}>
                      <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>{t('profile.noOrders')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className={`p-4 border ${borderClass} rounded-xl ${cardBgClass}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className={`font-bold uppercase tracking-wide ${textClass}`}>
                                #{order.id}
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
                                {order.status === 'completed' ? t('profile.completed') : order.status}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 pt-3 border-t border-dashed border-gray-300 dark:border-gray-700">
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
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative w-full max-w-md p-6 border ${borderClass} rounded-xl ${cardBgClass}`}
          >
            <h3 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
              {t('profile.changePassword')}
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                  {t('profile.currentPassword')}
                </label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                  {t('auth.password')}
                </label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                  {t('auth.confirmPassword')}
                </label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#FF6B00] text-black py-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors"
                >
                  {loading ? <RefreshCw className="w-5 h-5 mx-auto animate-spin" /> : t('admin.save')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold uppercase tracking-wide hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
