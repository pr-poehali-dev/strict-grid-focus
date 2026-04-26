import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, name: string, password: string) => Promise<void>;
  initialMode?: "login" | "register";
}

export default function AuthModal({ onClose, onLogin, onRegister, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await onLogin(email, password);
      } else {
        await onRegister(email, name, password);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-scale-in">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-teal to-teal/70 px-8 pt-8 pb-10 relative overflow-hidden">
          <div className="text-[100px] opacity-10 absolute -right-4 -top-4 leading-none select-none">🛍️</div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <Icon name="X" size={15} className="text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-1 relative z-10">
            {mode === "login" ? "Добро пожаловать" : "Создать аккаунт"}
          </h2>
          <p className="text-white/70 text-sm relative z-10">
            {mode === "login" ? "Войдите, чтобы сохранить корзину и избранное" : "Зарегистрируйтесь — это бесплатно"}
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-muted mx-6 rounded-xl p-1 -mt-5 relative z-10 mb-6 shadow-sm">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "login" ? "bg-white shadow-sm text-brand-black" : "text-muted-foreground"}`}
          >
            Вход
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "register" ? "bg-white shadow-sm text-brand-black" : "text-muted-foreground"}`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-3">
          {mode === "register" && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Ваше имя</label>
              <input
                type="text"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="mail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Пароль</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder={mode === "register" ? "Минимум 6 символов" : "Ваш пароль"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-11 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-black transition-colors"
              >
                <Icon name={showPwd ? "EyeOff" : "Eye"} size={17} />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
              <Icon name="AlertCircle" size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white font-bold py-3.5 rounded-xl hover:bg-teal/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {mode === "login" ? "Входим..." : "Регистрируем..."}
              </>
            ) : (
              mode === "login" ? "Войти" : "Создать аккаунт"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
