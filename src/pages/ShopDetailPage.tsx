import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";
import Icon from "@/components/ui/icon";

interface ShopDetailPageProps {
  seller: string;
  favourites: number[];
  onFavourite: (id: number) => void;
  onAddToCart: (id: number) => void;
  onBack: () => void;
}

export default function ShopDetailPage({ seller, favourites, onFavourite, onAddToCart, onBack }: ShopDetailPageProps) {
  const shopProducts = PRODUCTS.filter((p) => p.seller === seller);
  const avgRating = shopProducts.length
    ? shopProducts.reduce((s, p) => s + p.rating, 0) / shopProducts.length
    : 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-black transition-colors mb-6"
      >
        <Icon name="ArrowLeft" size={16} />
        Назад
      </button>

      {/* Shop hero */}
      <div className="bg-white border border-border rounded-2xl p-6 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-teal-light flex items-center justify-center text-4xl shrink-0">
          🏪
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-brand-black mb-1">{seller}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="Star" size={14} className="text-yellow fill-yellow" />
              <span className="font-semibold text-brand-black">{avgRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Package" size={14} />
              {shopProducts.length} товаров
            </div>
          </div>
        </div>
        <button className="px-5 py-2.5 bg-teal text-white font-semibold rounded-xl hover:bg-teal/90 transition-all text-sm shrink-0">
          Написать
        </button>
      </div>

      {/* Products */}
      <h2 className="font-bold text-brand-black mb-5">Витрина магазина</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {shopProducts.map((product, i) => (
          <div
            key={product.id}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <ProductCard
              product={product}
              isFav={favourites.includes(product.id)}
              onFavourite={onFavourite}
              onAddToCart={onAddToCart}
              onShopClick={() => {}}
            />
          </div>
        ))}
      </div>

      {shopProducts.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-lg font-semibold text-brand-black">Товары ещё не добавлены</p>
        </div>
      )}
    </main>
  );
}
