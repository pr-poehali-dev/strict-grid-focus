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
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const {
    user,
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
  } = useAuth();

  const [city, setCity] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState("home");
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
          onFavourite={toggleFavourite}
          onAddToCart={addToCart}
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
            onFavourite={toggleFavourite}
            onAddToCart={addToCart}
            onShopClick={handleShopClick}
          />
        );
      case "categories":
        return <CategoriesPage />;
      case "shops":
        return <ShopsPage onShopClick={handleShopClick} />;
      case "favourites":
        return (
          <FavouritesPage
            favourites={favourites}
            onFavourite={toggleFavourite}
            onAddToCart={addToCart}
            onShopClick={handleShopClick}
          />
        );
      case "cart":
        return (
          <CartPage
            cart={cart}
            onUpdateQty={updateCartQty}
            onRemove={removeFromCart}
            onClear={clearCart}
          />
        );
      case "profile":
        return (
          <ProfilePage
            user={user}
            onLogin={login}
            onRegister={register}
            onLogout={logout}
            onNav={handleNav}
          />
        );
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
        user={user}
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
