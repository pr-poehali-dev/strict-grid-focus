import { useState } from "react";
import Icon from "@/components/ui/icon";

export interface Product {
  id: number;
  name: string;
  price: number;
  seller: string;
  rating: number;
  image: string;
  category: string;
  city: string;
}

interface ProductCardProps {
  product: Product;
  onFavourite: (id: number) => void;
  isFav: boolean;
  onAddToCart: (id: number) => void;
  onShopClick: (seller: string) => void;
}

export default function ProductCard({
  product,
  onFavourite,
  isFav,
  onAddToCart,
  onShopClick,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border hover:border-teal/30 hover:shadow-lg transition-all duration-200 group flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Rating badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
          <Icon name="Star" size={12} className="text-yellow fill-yellow" />
          <span className="text-xs font-bold text-brand-black">{product.rating.toFixed(1)}</span>
        </div>

        {/* Favourite */}
        <button
          onClick={() => onFavourite(product.id)}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm hover:bg-white transition-all"
        >
          <Icon
            name="Heart"
            size={15}
            className={isFav ? "text-rose-500 fill-rose-500" : "text-muted-foreground"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1 gap-2">
        <p className="text-sm font-semibold text-brand-black leading-snug line-clamp-2">{product.name}</p>

        <button
          onClick={() => onShopClick(product.seller)}
          className="text-xs text-teal font-medium hover:underline text-left w-fit"
        >
          {product.seller}
        </button>

        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-base font-bold text-brand-black">
            {product.price.toLocaleString("ru-RU")} ₽
          </span>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              added
                ? "bg-teal-light text-teal"
                : "bg-brand-black text-white hover:bg-teal"
            }`}
          >
            <Icon name={added ? "Check" : "Plus"} size={13} />
            {added ? "Добавлено" : "В корзину"}
          </button>
        </div>
      </div>
    </div>
  );
}
