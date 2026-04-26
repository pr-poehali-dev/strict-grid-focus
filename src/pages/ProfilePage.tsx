import Icon from "@/components/ui/icon";

const MENU_ITEMS = [
  { icon: "ShoppingBag", label: "Мои заказы", count: 3 },
  { icon: "Heart", label: "Избранное", count: null },
  { icon: "MapPin", label: "Адреса доставки", count: null },
  { icon: "Bell", label: "Уведомления", count: 2 },
  { icon: "Settings", label: "Настройки", count: null },
  { icon: "HelpCircle", label: "Помощь", count: null },
];

export default function ProfilePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Avatar */}
      <div className="flex flex-col items-center py-8 mb-6">
        <div className="w-20 h-20 rounded-full bg-teal-light flex items-center justify-center text-4xl mb-4 ring-4 ring-teal/20">
          👤
        </div>
        <h2 className="text-xl font-bold text-brand-black">Гость</h2>
        <p className="text-muted-foreground text-sm mt-1">Войдите, чтобы сохранить заказы</p>

        <div className="flex gap-3 mt-5">
          <button className="px-6 py-2.5 bg-teal text-white font-semibold rounded-xl hover:bg-teal/90 transition-all text-sm">
            Войти
          </button>
          <button className="px-6 py-2.5 border border-border text-brand-black font-semibold rounded-xl hover:bg-muted transition-all text-sm">
            Зарегистрироваться
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-muted transition-all text-left ${
              i < MENU_ITEMS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center shrink-0">
              <Icon name={item.icon} size={17} className="text-teal" />
            </div>
            <span className="flex-1 font-medium text-brand-black text-sm">{item.label}</span>
            <div className="flex items-center gap-2">
              {item.count && (
                <span className="bg-teal text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
