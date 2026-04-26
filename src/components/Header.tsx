import Icon from "@/components/ui/icon";
import type { User } from "@/hooks/useAuth";

interface HeaderProps {
  city: string;
  onCityClick: () => void;
  currentPage: string;
  onNav: (page: string) => void;
  cartCount: number;
  favCount: number;
  user: User | null;
}

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "categories", label: "Категории" },
  { id: "shops", label: "Магазины" },
  { id: "about", label: "О нас" },
  { id: "contacts", label: "Контакты" },
];

export default function Header({ city, onCityClick, currentPage, onNav, cartCount, favCount, user }: HeaderProps) {
  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "";
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={() => onNav("home")}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
              <Icon name="ShoppingBag" size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl text-brand-black tracking-tight">
              Маркет
            </span>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-lg hidden sm:block">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Найти товар, магазин..."
                className="w-full pl-9 pr-4 py-2.5 bg-muted border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* City selector */}
            <button
              onClick={onCityClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-teal-light hover:text-teal transition-all text-sm font-medium text-muted-foreground group"
            >
              <Icon name="MapPin" size={15} className="text-teal" />
              <span className="hidden sm:inline max-w-[120px] truncate">{city}</span>
            </button>

            {/* Favourites */}
            <button
              onClick={() => onNav("favourites")}
              className="relative p-2.5 rounded-xl hover:bg-muted transition-all"
            >
              <Icon name="Heart" size={20} className={currentPage === "favourites" ? "text-teal" : "text-brand-black"} />
              {favCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-yellow text-brand-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => onNav("cart")}
              className="relative p-2.5 rounded-xl hover:bg-muted transition-all"
            >
              <Icon name="ShoppingCart" size={20} className={currentPage === "cart" ? "text-teal" : "text-brand-black"} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-teal text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => onNav("profile")}
              className={`p-1.5 rounded-xl hover:bg-muted transition-all flex items-center gap-1.5 ${currentPage === "profile" ? "text-teal" : "text-brand-black"}`}
            >
              {user ? (
                <div className="w-7 h-7 rounded-lg bg-teal text-white text-xs font-bold flex items-center justify-center">
                  {initials || "👤"}
                </div>
              ) : (
                <Icon name="User" size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Nav bar */}
        <nav className="flex gap-1 pb-1 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                currentPage === item.id
                  ? "bg-teal text-white"
                  : "text-muted-foreground hover:text-brand-black hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}