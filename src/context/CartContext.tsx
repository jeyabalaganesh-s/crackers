
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  content?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "shiva-fire-works-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
