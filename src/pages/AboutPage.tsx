import Icon from "@/components/ui/icon";

const STATS = [
  { value: "2 400+", label: "Продавцов", icon: "Store" },
  { value: "48 000+", label: "Товаров", icon: "Package" },
  { value: "36", label: "Городов", icon: "MapPin" },
  { value: "120 000+", label: "Покупателей", icon: "Users" },
];

const VALUES = [
  { icon: "🌿", title: "Местное производство", text: "Мы поддерживаем малый бизнес и локальных мастеров по всей России." },
  { icon: "✅", title: "Проверенные продавцы", text: "Каждый продавец проходит верификацию перед размещением товаров." },
  { icon: "🚀", title: "Быстрая доставка", text: "Ваш город — наш приоритет. Доставка в течение 1–3 дней." },
  { icon: "💬", title: "Поддержка 24/7", text: "Наша команда всегда готова помочь с любым вопросом." },
];

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="text-center py-12 mb-12">
        <span className="inline-block bg-teal-light text-teal text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          О проекте
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
          Маркет — место, где<br />местное становится ценным
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Мы создали платформу, где покупатели находят уникальные товары от мастеров и фермеров своего города, а продавцы — своих первых постоянных клиентов.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white border border-border rounded-2xl p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center mx-auto mb-3">
              <Icon name={stat.icon} size={18} className="text-teal" />
            </div>
            <div className="text-2xl font-bold text-brand-black">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <h2 className="text-xl font-bold text-brand-black mb-6">Наши принципы</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {VALUES.map((val) => (
          <div key={val.title} className="bg-white border border-border rounded-2xl p-6 flex gap-4">
            <div className="text-3xl shrink-0">{val.icon}</div>
            <div>
              <h3 className="font-bold text-brand-black mb-1">{val.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{val.text}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
