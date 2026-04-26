import { useState, useCallback } from "react";
import CityModal from "@/components/CityModal";
import Header from "@/components/Header";
import HomePage from "./HomePage";
import CategoriesPage from "./CategoriesPage";
import ShopsPage from "./ShopsPage";
import FavouritesPage from "./FavouritesPage";
import CartPage from "./CartPage";
import ProfilePage from "./ProfilePage";
import AboutPage from "./AboutPage";
import ContactsPage from "./ContactsPage";
import ShopDetailPage from "./ShopDetailPage";

interface CartItem {
  id: number;
  qty: number;
}

export default function Index() {
  const [city, setCity] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [favourites, setFavourites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const handleCitySelect = useCallback((selectedCity: string) => {
    setCity(selectedCity);
    setShowCityPicker(false);
  }, []);

  const handleNav = useCallback((page: string) => {
    setCurrentPage(page);
    setSelectedShop(null);
  }, []);

  const handleFavourite = useCallback((id: number) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const handleAddToCart = useCallback((id: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) return prev.map((c) => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id, qty: 1 }];
    });
  }, []);

  const handleUpdateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== id));
    } else {
      setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty } : c));
    }
  }, []);

  const handleRemoveFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleShopClick = useCallback((seller: string) => {
    setSelectedShop(seller);
    setCurrentPage("shop-detail");
  }, []);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  if (!city) {
    return <CityModal onSelect={handleCitySelect} />;
  }

  const renderPage = () => {
    if (currentPage === "shop-detail" && selectedShop) {
      return (
        <ShopDetailPage
          seller={selectedShop}
          favourites={favourites}
          onFavourite={handleFavourite}
          onAddToCart={handleAddToCart}
          onBack={() => handleNav("shops")}
        />
      );
    }

    switch (currentPage) {
      case "home":
        return (
          <HomePage
            city={city}
            favourites={favourites}
            onFavourite={handleFavourite}
            onAddToCart={handleAddToCart}
            onShopClick={handleShopClick}
          />
        );
      case "categories":
        return <CategoriesPage />;
      case "shops":
        return <ShopsPage />;
      case "favourites":
        return (
          <FavouritesPage
            favourites={favourites}
            onFavourite={handleFavourite}
            onAddToCart={handleAddToCart}
            onShopClick={handleShopClick}
          />
        );
      case "cart":
        return (
          <CartPage
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemoveFromCart}
          />
        );
      case "profile":
        return <ProfilePage />;
      case "about":
        return <AboutPage />;
      case "contacts":
        return <ContactsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 font-golos">
      {city && showCityPicker && (
        <CityModal onSelect={handleCitySelect} />
      )}

      <Header
        city={city}
        onCityClick={() => setShowCityPicker(true)}
        currentPage={currentPage}
        onNav={handleNav}
        cartCount={cartCount}
        favCount={favourites.length}
      />

      {renderPage()}

      <footer className="border-t border-border mt-16 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© 2024 Маркет — локальный маркетплейс</span>
          <div className="flex gap-4">
            <button onClick={() => handleNav("about")} className="hover:text-brand-black transition-colors">О нас</button>
            <button onClick={() => handleNav("contacts")} className="hover:text-brand-black transition-colors">Контакты</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
