import { useState } from "react";
import Icon from "@/components/ui/icon";
import AuthModal from "@/components/AuthModal";
import type { User } from "@/hooks/useAuth";

interface ProfilePageProps {
  user: User | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, name: string, password: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onNav: (page: string) => void;
}

const MENU_ITEMS = [
  { icon: "ShoppingBag", label: "Мои заказы", page: null },
  { icon: "Heart", label: "Избранное", page: "favourites" },
  { icon: "ShoppingCart", label: "Корзина", page: "cart" },
  { icon: "MapPin", label: "Адреса доставки", page: null },
  { icon: "Bell", label: "Уведомления", page: null },
  { icon: "Settings", label: "Настройки", page: null },
];

export default function ProfilePage({ user, onLogin, onRegister, onLogout, onNav }: ProfilePageProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openLogin = () => { setAuthMode("login"); setShowAuth(true); };
  const openRegister = () => { setAuthMode("register"); setShowAuth(true); };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={onLogin}
          onRegister={onRegister}
          initialMode={authMode}
        />
      )}

      {/* Profile card */}
      <div className="bg-white border border-border rounded-3xl overflow-hidden mb-5">
        <div className="bg-gradient-to-br from-teal to-teal/70 px-6 pt-8 pb-14 relative">
          <div className="text-[120px] opacity-10 absolute -right-6 -bottom-6 leading-none select-none">👤</div>
        </div>
        <div className="-mt-10 px-6 pb-6 relative">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 ring-4 ring-white shadow-md ${user ? "bg-teal" : "bg-muted"}`}>
            {user ? initials || "👤" : "👤"}
          </div>
          {user ? (
            <>
              <h2 className="text-xl font-bold text-brand-black">{user.name}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <button
                onClick={onLogout}
                className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-black transition-colors"
              >
                <Icon name="LogOut" size={15} />
                Выйти из аккаунта
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-brand-black">Гость</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Войдите, чтобы сохранить корзину и избранное</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={openLogin}
                  className="px-6 py-2.5 bg-teal text-white font-semibold rounded-xl hover:bg-teal/90 transition-all text-sm"
                >
                  Войти
                </button>
                <button
                  onClick={openRegister}
                  className="px-6 py-2.5 border border-border text-brand-black font-semibold rounded-xl hover:bg-muted transition-all text-sm"
                >
                  Зарегистрироваться
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.label}
            onClick={() => item.page && onNav(item.page)}
            className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-muted transition-all text-left ${
              i < MENU_ITEMS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center shrink-0">
              <Icon name={item.icon} size={17} className="text-teal" />
            </div>
            <span className="flex-1 font-medium text-brand-black text-sm">{item.label}</span>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {!user && (
        <p className="text-center text-xs text-muted-foreground mt-6">
          Ваша корзина сохраняется в браузере даже без входа
        </p>
      )}
    </main>
  );
}
