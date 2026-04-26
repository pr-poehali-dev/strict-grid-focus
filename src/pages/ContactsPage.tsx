import Icon from "@/components/ui/icon";

const CONTACTS = [
  { icon: "Mail", label: "Email", value: "hello@market.ru" },
  { icon: "Phone", label: "Телефон", value: "+7 (800) 555-01-23" },
  { icon: "MapPin", label: "Адрес", value: "Москва, ул. Примерная, д. 1" },
  { icon: "Clock", label: "Режим работы", value: "Пн–Пт, 9:00–19:00" },
];

export default function ContactsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-brand-black mb-2">Контакты</h1>
      <p className="text-muted-foreground mb-10">Свяжитесь с нами любым удобным способом</p>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Contact info */}
        <div className="space-y-3">
          {CONTACTS.map((c) => (
            <div key={c.label} className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-teal-light flex items-center justify-center shrink-0">
                <Icon name={c.icon} size={20} className="text-teal" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="font-semibold text-brand-black text-sm">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-bold text-brand-black mb-4">Написать нам</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Ваше имя"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
            <textarea
              placeholder="Ваше сообщение..."
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all resize-none"
            />
            <button className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal/90 transition-all text-sm">
              Отправить
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
