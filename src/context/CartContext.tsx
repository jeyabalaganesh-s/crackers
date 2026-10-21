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

type CartProduct = Omit<CartItem, "quantity">;

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: CartProduct, quantity?: number) => void;
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

      if (!savedCart) return [];

      const parsed: unknown = JSON.parse(savedCart);

      if (!Array.isArray(parsed)) return [];

      // Keep existing saved carts compatible with the updated code.
      return parsed
        .filter(
          (item): item is CartItem =>
            item !== null &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            typeof item.price === "number"
        )
        .map((item) => ({
          ...item,
          quantity:
            Number.isInteger(item.quantity) && item.quantity > 0
              ? item.quantity
              : 1,
        }));
    } catch {
      return [];
    }
  });

  // Persist cart changes between page refreshes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [items]);

  // Add the selected quantity to the cart.
  const addToCart = (product: CartProduct, quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity,
        },
      ];
    });
  };

  // Update an item's quantity from the cart page.
  const updateQuantity = (id: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Remove a product from the cart.
  const removeFromCart = (id: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  // Empty the entire cart.
  const clearCart = () => {
    setItems([]);
  };

  // Total units across all products.
  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total price, including each product's quantity.
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