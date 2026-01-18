import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  sku: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  sessionId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const initCart = async () => {
      let storedSession = localStorage.getItem('cart_session');
      
      if (!storedSession) {
        storedSession = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('cart_session', storedSession);
      }
      
      setSessionId(storedSession);
      
      try {
        const response = await fetch(`${API_URL}/cart`, {
          headers: { 'X-Session-ID': storedSession }
        });
        const data = await response.json();
        if (data.success && data.data.items) {
          setItems(data.data.items);
        }
      } catch (error) {
        console.error('Failed to load cart from API:', error);
      }
    };
    
    initCart();
  }, []);

  const saveCartToApi = async (cartItems: CartItem[]) => {
    if (!sessionId) return;
    
    try {
      await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-ID': sessionId },
        body: JSON.stringify({ items: cartItems })
      });
    } catch (error) {
      console.error('Failed to save cart to API:', error);
    }
  };

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id);
      let updatedItems;
      if (existingItem) {
        updatedItems = prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...prev, newItem];
      }
      saveCartToApi(updatedItems);
      return updatedItems;
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: number) => {
    setItems(prev => {
      const updatedItems = prev.filter(item => item.id !== id);
      saveCartToApi(updatedItems);
      return updatedItems;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => {
      const updatedItems = prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCartToApi(updatedItems);
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    if (sessionId) {
      fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: { 'X-Session-ID': sessionId }
      }).catch(console.error);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        sessionId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
