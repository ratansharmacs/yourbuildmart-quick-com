import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/components/site/data";
import { useAuth } from "@/context/auth-context";
import { api, resolveApiImage } from "@/lib/api";

export type ShopCartItem = {
  itemId?: number;
  product: Product;
  quantity: number;
};

type SortOption = "whats-new" | "price-low-high" | "price-high-low" | "rating-high";
type FilterOption = "all" | "ultratech" | "acc" | "rating4plus";

type ShopContextValue = {
  cartItems: ShopCartItem[];
  cartCount: number;
  cartLoading: boolean;
  mergeGuestCart: () => Promise<void>;
  wishlist: Product[];
  wishlistCount: number;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (product: Product) => boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  filterOption: FilterOption;
  setFilterOption: (value: FilterOption) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [guestItems, setGuestItems] = useState<ShopCartItem[]>([]);
  const [guestCartLoaded, setGuestCartLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("whats-new");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const mergingGuestCart = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("ybm_guest_cart");
    if (stored) {
      try {
        setGuestItems(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem("ybm_guest_cart");
      }
    }
    setGuestCartLoaded(true);
    try { setWishlist(JSON.parse(window.localStorage.getItem("ybm_wishlist") || "[]")); } catch { setWishlist([]); }
  }, []);

  useEffect(() => { window.localStorage.setItem("ybm_wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  useEffect(() => {
    window.localStorage.setItem("ybm_guest_cart", JSON.stringify(guestItems));
  }, [guestItems]);

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const cart = await api.cart();
      const items = await Promise.all(
        cart.items.map(async (item) => {
          if (item.imagePath) return item;
          try {
            const detail = await api.product(item.productId);
            const imagePath = detail.imagePath?.path || detail.variants.find((variant) => variant.id === item.variantId)?.images[0]?.path || "";
            return { ...item, imagePath };
          } catch {
            return item;
          }
        }),
      );
      return { ...cart, items };
    },
    enabled: isAuthenticated,
  });

  const serverItems: ShopCartItem[] = (cartQuery.data?.items || []).map((item) => ({
    itemId: item.id,
    quantity: item.quantity,
    product: {
      id: item.slug || String(item.productId),
      slug: item.slug || String(item.productId),
      apiId: item.productId,
      variantId: item.variantId,
      name: item.productName,
      brand: item.brandName,
      category: "",
      price: item.unitPrice,
      oldPrice: item.unitPrice,
      rating: 0,
      reviews: 0,
      sale: item.stockLabel,
      image: resolveApiImage(item.imagePath),
      maxQuantity: item.maxQuantity,
      inStock: true,
    },
  }));
  const cartItems = isAuthenticated ? serverItems : guestItems;

  const refreshCart = () => queryClient.invalidateQueries({ queryKey: ["cart"] });

  const mergeGuestCart = async () => {
    if (!guestItems.length) return;
    if (mergingGuestCart.current) return mergingGuestCart.current;
    mergingGuestCart.current = (async () => {
      for (const item of guestItems) {
        if (!item.product.variantId) continue;
        await api.addCartItem(item.product.variantId, item.quantity);
      }
      setGuestItems([]);
      await refreshCart();
    })();
    try {
      await mergingGuestCart.current;
    } finally {
      mergingGuestCart.current = null;
    }
  };

  useEffect(() => {
    if (!guestCartLoaded || !isAuthenticated || !guestItems.length) return;
    void mergeGuestCart().catch(() => {
      // Keep the local cart intact so the customer can retry safely.
    });
  }, [guestCartLoaded, isAuthenticated]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (isAuthenticated) {
      if (!product.variantId) throw new Error("Please select an available product variant");
      const existing = cartQuery.data?.items.find((item) => item.variantId === product.variantId);
      if (existing) {
        await api.updateCartItem(existing.id, Math.min(existing.quantity + quantity, product.maxQuantity || existing.quantity + quantity));
      } else {
        await api.addCartItem(product.variantId, quantity);
      }
      await refreshCart();
      return;
    }
    setGuestItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.product.variantId === product.variantId);
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: Math.min(item.quantity + quantity, product.maxQuantity || Infinity) } : item,
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    const item = cartItems.find((entry) => entry.product.id === productId);
    if (!item) return;
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    if (isAuthenticated && item.itemId) {
      await api.updateCartItem(item.itemId, Math.min(quantity, item.product.maxQuantity || quantity));
      await refreshCart();
      return;
    }
    setGuestItems((prev) =>
      prev.map((entry) => entry.product.id === productId ? { ...entry, quantity } : entry),
    );
  };

  const removeFromCart = async (productId: string) => {
    const item = cartItems.find((entry) => entry.product.id === productId);
    if (isAuthenticated && item?.itemId) {
      await api.removeCartItem(item.itemId);
      await refreshCart();
      return;
    }
    setGuestItems((prev) => prev.filter((entry) => entry.product.id !== productId));
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      await api.clearCart();
      await refreshCart();
    } else {
      setGuestItems([]);
    }
  };

  const cartCount = useMemo(
    () => cartItems.length,
    [cartItems],
  );
  const productKey = (product: Product) => `${product.apiId || product.id}:${product.variantId || "product"}`;
  const isWishlisted = (product: Product) => wishlist.some((item) => productKey(item) === productKey(product));
  const toggleWishlist = (product: Product) => setWishlist((items) => isWishlisted(product) ? items.filter((item) => productKey(item) !== productKey(product)) : [...items, product]);
  const wishlistCount = wishlist.length;

  return (
    <ShopContext.Provider value={{
      cartItems,
      cartCount,
      cartLoading: cartQuery.isLoading,
      mergeGuestCart,
      wishlist,
      wishlistCount,
      toggleWishlist,
      isWishlisted,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      searchTerm,
      setSearchTerm,
      sortOption,
      setSortOption,
      filterOption,
      setFilterOption,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
}
