import Icon from "@/components/ui/icon";

const SHOPS = [
  {
    name: "Мастерская «Глина и Огонь»",
    description: "Авторская керамика ручной работы. Посуда, декор, подарки.",
    rating: 4.9,
    products: 43,
    city: "Москва",
    emoji: "🏺",
    category: "Хэндмейд",
  },
  {
    name: "Ферма «Зелёный луг»",
    description: "Органические овощи и зелень от местного фермера без химии.",
    rating: 4.8,
    products: 27,
    city: "Москва",
    emoji: "🌿",
    category: "Продукты",
  },
  {
    name: "Кожевенная мастерская Романова",
    description: "Изделия из натуральной кожи: сумки, кошельки, ремни.",
    rating: 4.7,
    products: 31,
    city: "Санкт-Петербург",
    emoji: "👜",
    category: "Аксессуары",
  },
  {
    name: "Художник Алёна Орлова",
    description: "Акварельные портреты по фото и пейзажи на заказ.",
    rating: 4.9,
    products: 12,
    city: "Санкт-Петербург",
    emoji: "🎨",
    category: "Искусство",
  },
  {
    name: "Свечная лавка «Уют»",
    description: "Натуральные соевые свечи с авторскими ароматами.",
    rating: 4.8,
    products: 18,
    city: "Казань",
    emoji: "🕯️",
    category: "Декор",
  },
  {
    name: "Пасека Семёнова",
    description: "Мёд и продукты пчеловодства с собственной пасеки.",
    rating: 5.0,
    products: 9,
    city: "Краснодар",
    emoji: "🍯",
    category: "Продукты",
  },
];

interface ShopsPageProps {
  onShopClick: (seller: string) => void;
}

export default function ShopsPage({ onShopClick }: ShopsPageProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-brand-black mb-2">Магазины</h1>
      <p className="text-muted-foreground mb-8">Местные продавцы и мастера</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SHOPS.map((shop, i) => (
          <div
            key={shop.name}
            onClick={() => onShopClick(shop.name)}
            className="bg-white border border-border rounded-2xl p-5 hover:border-teal/30 hover:shadow-md transition-all duration-200 cursor-pointer animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center text-2xl shrink-0">
                {shop.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-brand-black text-sm leading-snug mb-1 line-clamp-2">{shop.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{shop.category}</span>
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={11} className="text-yellow fill-yellow" />
                    <span className="text-xs font-semibold text-brand-black">{shop.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{shop.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Icon name="MapPin" size={12} className="text-teal" />
                  {shop.city}
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Package" size={12} />
                  {shop.products} товаров
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-teal">
                Смотреть
                <Icon name="ArrowRight" size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}