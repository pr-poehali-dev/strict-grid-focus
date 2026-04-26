import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";

interface FavouritesPageProps {
  favourites: number[];
  onFavourite: (id: number) => void;
  onAddToCart: (id: number) => void;
  onShopClick: (seller: string) => void;
}

export default function FavouritesPage({ favourites, onFavourite, onAddToCart, onShopClick }: FavouritesPageProps) {
  const favProducts = PRODUCTS.filter((p) => favourites.includes(p.id));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-brand-black mb-2">Избранное</h1>
      <p className="text-muted-foreground mb-8">
        {favProducts.length > 0
          ? `${favProducts.length} товара сохранено`
          : "Здесь будут ваши сохранённые товары"}
      </p>

      {favProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {favProducts.map((product, i) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <ProductCard
                product={product}
                isFav={true}
                onFavourite={onFavourite}
                onAddToCart={onAddToCart}
                onShopClick={onShopClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed border-border rounded-2xl">
          <div className="text-6xl mb-4">🤍</div>
          <p className="text-lg font-semibold text-brand-black mb-2">Ничего не сохранено</p>
          <p className="text-sm text-muted-foreground">Нажмите ♡ на карточке товара, чтобы сохранить</p>
        </div>
      )}
    </main>
  );
}
