import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import Icon from "@/components/ui/icon";

interface HomePageProps {
  city: string;
  favourites: number[];
  onFavourite: (id: number) => void;
  onAddToCart: (id: number) => void;
  onShopClick: (seller: string) => void;
}

export default function HomePage({ city, favourites, onFavourite, onAddToCart, onShopClick }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [filterByCity, setFilterByCity] = useState(false);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const catMatch = activeCategory === "Все" || p.category === activeCategory;
      const cityMatch = !filterByCity || p.city === city;
      return catMatch && cityMatch;
    });
  }, [activeCategory, filterByCity, city]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero strip */}
      <div className="bg-gradient-to-r from-teal to-teal/80 rounded-2xl p-6 sm:p-8 mb-8 flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">Добро пожаловать</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Товары в {city}
          </h1>
          <p className="text-white/80 text-sm max-w-xs">
            Местные продавцы, уникальные вещи, доставка по городу
          </p>
        </div>
        <div className="text-[80px] opacity-20 select-none absolute right-6 bottom-0 leading-none">🛍️</div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex gap-1.5 flex-wrap flex-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                activeCategory === cat
                  ? "bg-brand-black text-white"
                  : "bg-muted text-muted-foreground hover:text-brand-black hover:bg-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFilterByCity(!filterByCity)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
            filterByCity
              ? "bg-yellow border-yellow text-brand-black"
              : "border-border text-muted-foreground hover:border-brand-black hover:text-brand-black"
          }`}
        >
          <Icon name="MapPin" size={14} />
          Только {city}
        </button>
      </div>

      {/* Products count */}
      <p className="text-sm text-muted-foreground mb-4">
        Найдено <span className="font-semibold text-brand-black">{filtered.length}</span> товаров
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <ProductCard
                product={product}
                isFav={favourites.includes(product.id)}
                onFavourite={onFavourite}
                onAddToCart={onAddToCart}
                onShopClick={onShopClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg font-semibold text-brand-black mb-2">Товары не найдены</p>
          <p className="text-sm text-muted-foreground">Попробуйте изменить фильтры</p>
        </div>
      )}
    </main>
  );
}
