import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart, CartItem } from '../../context/CartContext';

interface CartDrawerProps {
  theme: 'dark' | 'light';
}

const CartDrawer: React.FC<CartDrawerProps> = ({ theme }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLight = theme === 'light';
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, totalItems, totalPrice } = useCart();

  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-gray-400';
  const bgClass = isLight ? 'bg-white' : 'bg-zinc-900';
  const borderClass = isLight ? 'border-zinc-200' : 'border-zinc-700';

  const getItemName = (item: CartItem) => item.name;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-sm sm:max-w-md z-[70] ${bgClass} shadow-2xl flex flex-col`}
          >
            <div className={`p-3 sm:p-4 border-b ${borderClass} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <ShoppingCart className={`w-4 h-4 sm:w-5 sm:h-5 ${textClass}`} />
                <h2 className={`font-bold italic text-lg sm:text-xl uppercase tracking-wide ${textClass}`}>
                  {t('cart.title')}
                </h2>
                <span className={`text-xs sm:text-sm ${mutedClass}`}>({totalItems})</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
              >
                <X className={`w-4 h-4 sm:w-5 sm:h-5 ${textClass}`} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className={`w-12 h-12 sm:w-16 sm:h-16 ${mutedClass} opacity-30 mb-3 sm:mb-4`} />
                  <p className={`text-base sm:text-lg ${mutedClass}`}>{t('cart.empty')}</p>
                  <p className={`text-xs sm:text-sm ${mutedClass} mt-1.5 sm:mt-2`}>{t('cart.addItems')}</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${borderClass}`}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={getItemName(item)}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className={`w-6 h-6 sm:w-8 sm:h-8 ${mutedClass} opacity-30`} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold italic text-xs sm:text-sm uppercase tracking-wide truncate ${textClass}`}>
                            {getItemName(item)}
                          </h3>
                          <p className={`text-[10px] sm:text-xs ${mutedClass} mt-0.5 sm:mt-1`}>
                            Réf: {item.sku}
                          </p>
                          <p className={`text-base sm:text-lg font-bold text-[#FF6B00] mt-1 sm:mt-2`}>
                            {item.price.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-dashed border-gray-300 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${isLight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20'}`}
                          >
                            <Minus className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${textClass}`} />
                          </button>
                          <span className={`w-6 sm:w-8 text-center font-bold text-xs sm:text-sm ${textClass}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${isLight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20'}`}
                          >
                            <Plus className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${textClass}`} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className={`font-bold text-sm sm:text-base ${textClass}`}>
                            {(item.price * item.quantity).toFixed(2)} €
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isLight ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                          >
                            <Trash2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className={`p-3 sm:p-4 border-t ${borderClass}`}>
                <div className={`flex items-center justify-between mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-dashed border-gray-300 dark:border-gray-700`}>
                  <span className={`text-xs sm:text-sm uppercase tracking-wide ${mutedClass}`}>
                    {t('cart.total')}
                  </span>
                  <span className={`text-xl sm:text-2xl font-black italic text-[#FF6B00]`}>
                    {totalPrice.toFixed(2)} €
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full bg-[#FF6B00] text-black py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg sm:rounded-xl hover:bg-[#FF8533] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('cart.checkout')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
