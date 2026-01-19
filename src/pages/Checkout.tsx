import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  MapPin, 
  Truck, 
  ShoppingBag,
  RefreshCw,
  User,
  Building
} from 'lucide-react';
import { useCart, CartItem } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  notes?: string;
}

interface SavedAddress {
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

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { client, token, isAuthenticated } = useAuth();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
    notes: ''
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryCost] = useState(deliveryMethod === 'delivery' ? 0 : 0);
  
  // Tax settings
  const [taxRate, setTaxRate] = useState(20); // Default 20% for France
  const [taxMode, setTaxMode] = useState<'ttc' | 'ht' | 'remove'>('ttc'); // ttc = prices include tax, ht = prices exclude tax, remove = remove TVA from TTC prices

  const taxRates = [
    { value: 20, label: 'TVA 20% (France)' },
    { value: 10, label: 'TVA 10% (Rénovation)' },
    { value: 5.5, label: 'TVA 5.5% (Environnement)' }
  ];

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
      fetchSavedAddresses();
    }
    if (client) {
      setShippingAddress(prev => ({
        ...prev,
        firstName: client.name?.split(' ')[0] || '',
        lastName: client.name?.split(' ').slice(1).join(' ') || '',
        phone: client.phone || '',
        email: client.email || ''
      }));
    }
  }, [isAuthenticated, token, client]);

  const fetchSavedAddresses = async () => {
    try {
      const response = await fetch(`${API_URL}/clients/me/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSavedAddresses(data.data.addresses || []);
        const defaultAddr = data.data.addresses?.find((a: SavedAddress) => a.is_default === 1);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    }
  };

  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-zinc-200' : 'border-zinc-700';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';
  const headerBgClass = isLight ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-white/10';
  const cardBgClass = isLight ? 'bg-white/80' : 'bg-zinc-900/80';

  const formatPrice = (price: number) => price.toFixed(2) + ' €';

  // Calculate prices based on tax mode
  // If taxMode is 'ttc' - prices INCLUDE tax, so we need to extract HT
  // If taxMode is 'ht' - prices are already EXCL tax, show as is
  // If taxMode is 'remove' - prices INCLUDE tax, subtract TVA (same as HT)
  
  const getPriceExclTax = (price: number): number => {
    if (taxMode === 'ht') return price;
    if (taxMode === 'ttc' || taxMode === 'remove') {
      return price / (1 + taxRate / 100);
    }
    return price;
  };

  const getTaxAmount = (price: number): number => {
    return price - getPriceExclTax(price);
  };

  // Calculate order totals
  const subtotalExclTax = items.reduce((sum, item) => sum + getPriceExclTax(item.price * item.quantity), 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = items.reduce((sum, item) => sum + getTaxAmount(item.price * item.quantity), 0);
  const totalWithTax = subtotal + deliveryCost;
  const totalExclTax = subtotalExclTax + getPriceExclTax(deliveryCost);

  // Display values based on mode
  const displaySubtotal = taxMode === 'ht' || taxMode === 'remove' ? subtotalExclTax : subtotal;
  const displayTax = taxMode === 'remove' ? 0 : (taxMode === 'ttc' ? taxAmount : subtotal * taxRate / 100);
  const displayDelivery = taxMode === 'ht' || taxMode === 'remove' ? getPriceExclTax(deliveryCost) : deliveryCost;
  const displayTotal = taxMode === 'ht' ? totalExclTax : (taxMode === 'remove' ? subtotalExclTax + getPriceExclTax(deliveryCost) : totalWithTax);

  const getItemName = (item: CartItem) => item.name;

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressSelect = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    const names = address.name.split(' ');
    setShippingAddress({
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      address: address.address,
      apartment: '',
      city: address.city,
      postalCode: address.postal_code,
      country: address.country,
      phone: address.phone || '',
      notes: ''
    });
    setUseSavedAddress(true);
  };

  const validateStep1 = () => {
    if (!shippingAddress.firstName || !shippingAddress.lastName || 
        !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.postalCode || !shippingAddress.phone) {
      setError(t('checkout.fillAllFields'));
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url
          })),
          totalPrice: totalPrice + deliveryCost,
          shippingAddress: {
            ...shippingAddress,
            fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            method: deliveryMethod
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setOrderNumber(data.data.order.id.toString());
        setSuccess(true);
        clearCart();
      } else {
        setError(data.error || t('checkout.orderFailed'));
      }
    } catch (err) {
      setError(t('checkout.orderFailed'));
    }

    setLoading(false);
  };

  const steps = [
    { id: 1, title: t('checkout.information'), icon: <User className="w-5 h-5" /> },
    { id: 2, title: t('checkout.delivery'), icon: <Truck className="w-5 h-5" /> },
    { id: 3, title: t('checkout.summary'), icon: <Check className="w-5 h-5" /> }
  ];

  if (items.length === 0 && !success) {
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
          <h1 className="font-bold text-xl">
            <span className="text-[#FF6B00]">YAN'S</span>
            <span className={textClass}>DECO</span>
          </h1>
          <div className="w-20" />
        </header>

        <main className="pt-20 pb-12 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className={`w-16 h-16 mx-auto mb-4 ${mutedClass} opacity-30`} />
            <p className={`text-lg ${mutedClass} mb-4`}>{t('cart.empty')}</p>
            <button
              onClick={() => navigate('/catalogue')}
              className="bg-[#FF6B00] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wide"
            >
              {t('catalogue.products')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen">
        <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
          <div className="w-20" />
          <h1 className="font-bold text-xl">
            <span className="text-[#FF6B00]">YAN'S</span>
            <span className={textClass}>DECO</span>
          </h1>
          <div className="w-20" />
        </header>

        <main className="pt-20 pb-12 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`max-w-lg mx-auto p-8 border ${borderClass} rounded-2xl ${cardBgClass} text-center`}
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-2 ${textClass}`}>
              {t('checkout.orderConfirmed')}
            </h2>
            <p className={`text-lg ${mutedClass} mb-4`}>
              {t('checkout.orderNumber')}: <span className="font-bold text-[#FF6B00]">#{orderNumber}</span>
            </p>
            <p className={`text-sm ${mutedClass} mb-8`}>
              {t('checkout.confirmationEmail')}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#FF6B00] text-black px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors"
            >
              {t('checkout.continueShopping')}
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

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
        <h1 className="font-bold text-xl">
          <span className="text-[#FF6B00]">YAN'S</span>
          <span className={textClass}>DECO</span>
        </h1>
        <div className="w-20" />
      </header>

      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`font-black italic text-3xl md:text-4xl uppercase tracking-tight mb-8 ${textClass}`}>
            {t('checkout.title')}
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={`p-6 border ${borderClass} rounded-xl ${cardBgClass} mb-6`}>
                <div className="flex items-center gap-2 mb-6">
                  {steps.map((s, idx) => (
                    <React.Fragment key={s.id}>
                      {idx > 0 && (
                        <div className={`flex-1 h-0.5 ${step >= s.id ? 'bg-[#FF6B00]' : borderClass}`} />
                      )}
                      <button
                        onClick={() => step > s.id && setStep(s.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          step === s.id
                            ? 'bg-[#FF6B00] text-black'
                            : step > s.id
                            ? 'text-[#FF6B00]'
                            : mutedClass
                        }`}
                        disabled={step < s.id}
                      >
                        {s.icon}
                        <span className="text-sm font-bold uppercase tracking-wide hidden sm:inline">
                          {s.title}
                        </span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {isAuthenticated && savedAddresses.length > 0 && (
                        <div className="mb-6">
                          <button
                            onClick={() => setUseSavedAddress(!useSavedAddress)}
                            className={`text-sm font-bold uppercase tracking-wide text-[#FF6B00] mb-3`}
                          >
                            {useSavedAddress ? '+ ' + t('checkout.enterManually') : t('checkout.useSavedAddress')}
                          </button>
                          
                          <AnimatePresence>
                            {useSavedAddress && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3 mb-6"
                              >
                                {savedAddresses.map((addr) => (
                                  <div
                                    key={addr.id}
                                    onClick={() => handleAddressSelect(addr)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                      selectedAddressId === addr.id
                                        ? 'border-[#FF6B00] bg-[#FF6B00]/10'
                                        : borderClass
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        selectedAddressId === addr.id ? 'border-[#FF6B00]' : borderClass
                                      }`}>
                                        {selectedAddressId === addr.id && (
                                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                                        )}
                                      </div>
                                      <div>
                                        <p className={`font-bold ${textClass}`}>{addr.name}</p>
                                        <p className={`text-sm ${mutedClass}`}>{addr.address}</p>
                                        <p className={`text-sm ${mutedClass}`}>{addr.postal_code} {addr.city}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      <div className={`grid md:grid-cols-2 gap-4 ${!useSavedAddress ? 'block' : 'hidden'}`}>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('checkout.firstName')}
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder={t('checkout.firstName')}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('checkout.lastName')}
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder={t('checkout.lastName')}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('checkout.address')}
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder={t('checkout.address')}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('checkout.apartment')}
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.apartment}
                            onChange={(e) => handleInputChange('apartment', e.target.value)}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder={t('checkout.apartmentOptional')}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('checkout.city')}
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder={t('checkout.city')}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('checkout.postalCode')}
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder={t('checkout.postalCode')}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('checkout.country')}
                          </label>
                          <select
                            value={shippingAddress.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                          >
                            <option value="France">France</option>
                            <option value="Belgium">Belgique</option>
                            <option value="Luxembourg">Luxembourg</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('auth.phone')}
                          </label>
                          <input
                            type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            placeholder="+33 6 12 34 56 78"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                            {t('checkout.notes')}
                          </label>
                          <textarea
                            value={shippingAddress.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                            rows={3}
                            placeholder={t('checkout.notesPlaceholder')}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setError('');
                          if (validateStep1()) setStep(2);
                        }}
                        className="w-full bg-[#FF6B00] text-black py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors flex items-center justify-center gap-2 mt-6"
                      >
                        {t('checkout.continueDelivery')}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className={`font-bold italic text-lg uppercase tracking-wide mb-4 ${textClass}`}>
                        {t('checkout.deliveryMethod')}
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div
                          onClick={() => setDeliveryMethod('delivery')}
                          className={`p-4 border rounded-xl cursor-pointer transition-all ${
                            deliveryMethod === 'delivery'
                              ? 'border-[#FF6B00] bg-[#FF6B00]/10'
                              : borderClass
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              deliveryMethod === 'delivery' ? 'border-[#FF6B00]' : borderClass
                            }`}>
                              {deliveryMethod === 'delivery' && (
                                <div className="w-3 h-3 rounded-full bg-[#FF6B00]" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Truck className={`w-5 h-5 ${textClass}`} />
                                <p className={`font-bold ${textClass}`}>{t('checkout.homeDelivery')}</p>
                              </div>
                              <p className={`text-sm ${mutedClass} mt-1`}>
                                {t('checkout.deliveryInfo')}
                              </p>
                            </div>
                            <span className={`font-bold ${textClass}`}>
                              {formatPrice(0)}
                            </span>
                          </div>
                        </div>

                        <div
                          onClick={() => setDeliveryMethod('pickup')}
                          className={`p-4 border rounded-xl cursor-pointer transition-all ${
                            deliveryMethod === 'pickup'
                              ? 'border-[#FF6B00] bg-[#FF6B00]/10'
                              : borderClass
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              deliveryMethod === 'pickup' ? 'border-[#FF6B00]' : borderClass
                            }`}>
                              {deliveryMethod === 'pickup' && (
                                <div className="w-3 h-3 rounded-full bg-[#FF6B00]" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Building className={`w-5 h-5 ${textClass}`} />
                                <p className={`font-bold ${textClass}`}>{t('checkout.storePickup')}</p>
                              </div>
                              <p className={`text-sm ${mutedClass} mt-1`}>
                                1 Rue Magnier Bédu, 95410 Groslay
                              </p>
                            </div>
                            <span className={`font-bold text-green-500`}>
                              {t('checkout.free')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-xl font-bold uppercase tracking-wide hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors flex items-center justify-center gap-2"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          {t('checkout.back')}
                        </button>
                        <button
                          onClick={() => setStep(3)}
                          className="flex-1 bg-[#FF6B00] text-black py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors flex items-center justify-center gap-2"
                        >
                          {t('checkout.toSummary')}
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className={`font-bold italic text-lg uppercase tracking-wide mb-4 ${textClass}`}>
                        {t('checkout.orderSummary')}
                      </h3>

                      <div className={`p-4 border ${borderClass} rounded-xl mb-4`}>
                        <div className="flex items-start gap-3 mb-3">
                          <MapPin className={`w-5 h-5 text-[#FF6B00] mt-0.5`} />
                          <div>
                            <p className={`font-bold ${textClass}`}>
                              {shippingAddress.firstName} {shippingAddress.lastName}
                            </p>
                            <p className={`text-sm ${mutedClass}`}>{shippingAddress.address}</p>
                            {shippingAddress.apartment && (
                              <p className={`text-sm ${mutedClass}`}>{shippingAddress.apartment}</p>
                            )}
                            <p className={`text-sm ${mutedClass}`}>
                              {shippingAddress.postalCode} {shippingAddress.city}
                            </p>
                            <p className={`text-sm ${mutedClass}`}>{shippingAddress.country}</p>
                            <p className={`text-sm ${mutedClass} mt-1`}>{shippingAddress.phone}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="text-xs font-bold uppercase tracking-wide text-[#FF6B00]"
                        >
                          {t('checkout.edit')}
                        </button>
                      </div>

                      <div className={`p-4 border ${borderClass} rounded-xl mb-4`}>
                        <div className="flex items-center gap-3">
                          {deliveryMethod === 'delivery' ? (
                            <Truck className={`w-5 h-5 text-[#FF6B00]`} />
                          ) : (
                            <Building className={`w-5 h-5 text-[#FF6B00]`} />
                          )}
                          <div>
                            <p className={`font-bold ${textClass}`}>
                              {deliveryMethod === 'delivery' ? t('checkout.homeDelivery') : t('checkout.storePickup')}
                            </p>
                            <p className={`text-sm ${mutedClass}`}>
                              {deliveryMethod === 'delivery' 
                                ? t('checkout.deliveryInfo')
                                : '1 Rue Magnier Bédu, 95410 Groslay'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setStep(2)}
                          className="text-xs font-bold uppercase tracking-wide text-[#FF6B00] mt-3"
                        >
                          {t('checkout.edit')}
                        </button>
                      </div>

                      {!isAuthenticated && (
                        <div className={`p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-xl mb-4`}>
                          <p className={`text-sm ${textClass}`}>
                            {t('checkout.loginPrompt')}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(2)}
                          className="flex-1 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-xl font-bold uppercase tracking-wide hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors flex items-center justify-center gap-2"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          {t('checkout.back')}
                        </button>
                        <button
                          onClick={handleSubmitOrder}
                          disabled={loading}
                          className="flex-1 bg-[#FF6B00] text-black py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-5 h-5" />
                              {t('checkout.confirmOrder')} - {formatPrice(displayTotal)}
                            </>
                          )}
                            </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className={`p-6 border ${borderClass} rounded-xl ${cardBgClass} sticky top-24`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold italic text-lg uppercase tracking-wide ${textClass}`}>
                    {t('checkout.yourOrder')}
                  </h3>
                </div>

                {/* Tax Settings */}
                <div className={`p-3 border ${borderClass} rounded-lg mb-4`}>
                  <div className="mb-3">
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      Taux de TVA
                    </label>
                    <select
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className={`w-full px-3 py-2 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                    >
                      {taxRates.map(rate => (
                        <option key={rate.value} value={rate.value}>{rate.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      Affichage des prix
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTaxMode('ttc')}
                        className={`px-2 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors ${
                          taxMode === 'ttc'
                            ? 'bg-[#FF6B00] text-black'
                            : `${borderClass} ${textClass} hover:border-[#FF6B00]`
                        }`}
                      >
                        TTC
                      </button>
                      <button
                        onClick={() => setTaxMode('ht')}
                        className={`px-2 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors ${
                          taxMode === 'ht'
                            ? 'bg-[#FF6B00] text-black'
                            : `${borderClass} ${textClass} hover:border-[#FF6B00]`
                        }`}
                      >
                        HT
                      </button>
                      <button
                        onClick={() => setTaxMode('remove')}
                        className={`px-2 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors ${
                          taxMode === 'remove'
                            ? 'bg-[#FF6B00] text-black'
                            : `${borderClass} ${textClass} hover:border-[#FF6B00]`
                        }`}
                      >
                        -TVA
                      </button>
                    </div>
                    <p className={`text-[10px] ${mutedClass} mt-2`}>
                      {taxMode === 'ttc' && 'Les prix incluent la TVA'}
                      {taxMode === 'ht' && 'Les prix sont Hors Taxe'}
                      {taxMode === 'remove' && 'Enlever la TVA du prix TTC'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={getItemName(item)}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className={`w-5 h-5 ${mutedClass} opacity-30`} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${textClass}`}>
                          {getItemName(item)}
                        </p>
                        <p className={`text-xs ${mutedClass}`}>
                          {t('cart.quantity')}: {item.quantity}
                        </p>
                      </div>
                      <span className={`font-bold text-sm ${textClass}`}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={`border-t ${borderClass} pt-4 space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${mutedClass}`}>{t('cart.subtotal')}</span>
                    <span className={`font-bold ${textClass}`}>{formatPrice(displaySubtotal)}</span>
                  </div>
                  {displayTax > 0 && (
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${mutedClass}`}>
                        TVA ({taxRate}%)
                        {taxMode === 'remove' && ' removed'}
                      </span>
                      <span className={`font-bold ${textClass}`}>
                        {taxMode === 'remove' ? '-' : ''}{formatPrice(displayTax)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${mutedClass}`}>{t('checkout.delivery')}</span>
                    <span className={`font-bold ${textClass}`}>
                      {deliveryCost > 0 ? formatPrice(displayDelivery) : t('checkout.free')}
                    </span>
                  </div>
                  <div className={`border-t ${borderClass} pt-2 mt-2`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold uppercase tracking-wide ${textClass}`}>
                        {taxMode === 'ht' ? 'Total HT' : taxMode === 'remove' ? 'Total TTC - TVA' : 'Total TTC'}
                      </span>
                      <span className={`text-xl font-black italic text-[#FF6B00]`}>
                        {formatPrice(displayTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
