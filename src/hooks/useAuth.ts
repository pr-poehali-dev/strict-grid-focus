import { useState, useEffect, useCallback } from "react";
import {
  apiRegister,
  apiLogin,
  apiLogout,
  apiGetMe,
  apiFetchFavourites,
  apiFetchCart,
  apiToggleFavourite,
  apiUpdateCart,
  apiSyncCart,
  apiClearCart,
} from "@/lib/api";

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface CartItem {
  id: number;
  qty: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("market_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart locally
  useEffect(() => {
    localStorage.setItem("market_cart", JSON.stringify(cart));
  }, [cart]);

  // Init: check stored token
  useEffect(() => {
    const init = async () => {
      const me = await apiGetMe();
      if (me) {
        setUser(me);
        const [favs, serverCart] = await Promise.all([apiFetchFavourites(), apiFetchCart()]);
        setFavourites(favs);
        // Merge local cart with server cart on login
        const local = JSON.parse(localStorage.getItem("market_cart") || "[]") as CartItem[];
        if (local.length > 0 && serverCart.length === 0) {
          const merged = await apiSyncCart(local);
          setCart(merged);
        } else {
          setCart(serverCart);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    localStorage.setItem("market_token", data.token);
    setUser({ id: data.id, email: data.email, name: data.name });
    const [favs, serverCart] = await Promise.all([apiFetchFavourites(), apiFetchCart()]);
    setFavourites(favs);
    // Merge local cart
    const local = cart;
    if (local.length > 0) {
      const merged = await apiSyncCart(local);
      setCart(merged);
    } else {
      setCart(serverCart);
    }
    return data;
  }, [cart]);

  const register = useCallback(async (email: string, name: string, password: string) => {
    const data = await apiRegister(email, name, password);
    localStorage.setItem("market_token", data.token);
    setUser({ id: data.id, email: data.email, name: data.name });
    // Sync local cart to new account
    if (cart.length > 0) {
      const merged = await apiSyncCart(cart);
      setCart(merged);
    }
    return data;
  }, [cart]);

  const logout = useCallback(async () => {
    await apiLogout();
    localStorage.removeItem("market_token");
    localStorage.removeItem("market_cart");
    setUser(null);
    setFavourites([]);
    setCart([]);
  }, []);

  const toggleFavourite = useCallback(async (productId: number) => {
    setFavourites((prev) =>
      prev.includes(productId) ? prev.filter((f) => f !== productId) : [...prev, productId]
    );
    if (localStorage.getItem("market_token")) {
      await apiToggleFavourite(productId);
    }
  }, []);

  const addToCart = useCallback(async (productId: number) => {
    let newQty = 1;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === productId);
      if (existing) {
        newQty = existing.qty + 1;
        return prev.map((c) => c.id === productId ? { ...c, qty: newQty } : c);
      }
      return [...prev, { id: productId, qty: 1 }];
    });
    if (localStorage.getItem("market_token")) {
      await apiUpdateCart(productId, newQty);
    }
  }, []);

  const updateCartQty = useCallback(async (productId: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== productId));
    } else {
      setCart((prev) => prev.map((c) => c.id === productId ? { ...c, qty } : c));
    }
    if (localStorage.getItem("market_token")) {
      await apiUpdateCart(productId, qty);
    }
  }, []);

  const removeFromCart = useCallback(async (productId: number) => {
    setCart((prev) => prev.filter((c) => c.id !== productId));
    if (localStorage.getItem("market_token")) {
      await apiUpdateCart(productId, 0);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
    if (localStorage.getItem("market_token")) {
      await apiClearCart();
    }
  }, []);

  return {
    user,
    loading,
    favourites,
    cart,
    login,
    register,
    logout,
    toggleFavourite,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
  };
}
