import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/components/site/data";

type CartItem = {
  product: Product;
  quantity: number;
};

type SortOption = "whats-new" | "price-low-high" | "price-high-low" | "rating-high";
type FilterOption = "all" | "ultratech" | "acc" | "rating4plus";

type ShopContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  filterOption: FilterOption;
  setFilterOption: (value: FilterOption) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("whats-new");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const value: ShopContextValue = {
    cartItems,
    cartCount,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    filterOption,
    setFilterOption,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
