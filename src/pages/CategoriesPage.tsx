import Icon from "@/components/ui/icon";

const CATEGORIES_DATA = [
  { name: "Хэндмейд", icon: "Scissors", count: 128, color: "bg-rose-50 text-rose-500 border-rose-100" },
  { name: "Аксессуары", icon: "Watch", count: 94, color: "bg-amber-50 text-amber-500 border-amber-100" },
  { name: "Продукты", icon: "Carrot", count: 73, color: "bg-green-50 text-green-500 border-green-100" },
  { name: "Декор", icon: "Lamp", count: 56, color: "bg-violet-50 text-violet-500 border-violet-100" },
  { name: "Искусство", icon: "Palette", count: 42, color: "bg-blue-50 text-blue-500 border-blue-100" },
  { name: "Одежда", icon: "Shirt", count: 87, color: "bg-pink-50 text-pink-500 border-pink-100" },
  { name: "Детское", icon: "Baby", count: 61, color: "bg-yellow-light text-yellow border-yellow-light" },
  { name: "Сад и огород", icon: "Flower", count: 35, color: "bg-teal-light text-teal border-teal-light" },
];

export default function CategoriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-brand-black mb-2">Категории</h1>
      <p className="text-muted-foreground mb-8">Выберите категорию и найдите нужный товар</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES_DATA.map((cat, i) => (
          <button
            key={cat.name}
            className="bg-white border border-border rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-teal/30 hover:shadow-md transition-all duration-200 group animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${cat.color}`}>
              <Icon name={cat.icon} size={26} fallback="Tag" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-brand-black text-sm">{cat.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{cat.count} товаров</p>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}