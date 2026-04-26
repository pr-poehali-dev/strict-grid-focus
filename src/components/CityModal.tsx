import { useState } from "react";
import Icon from "@/components/ui/icon";

const CITIES = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург",
  "Казань", "Нижний Новгород", "Челябинск", "Самара",
  "Ростов-на-Дону", "Уфа", "Красноярск", "Пермь",
  "Воронеж", "Волгоград", "Краснодар", "Саратов",
];

interface CityModalProps {
  onSelect: (city: string) => void;
}

export default function CityModal({ onSelect }: CityModalProps) {
  const [search, setSearch] = useState("");

  const filtered = CITIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center">
              <Icon name="MapPin" size={20} className="text-teal" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-black">Выберите город</h2>
              <p className="text-sm text-muted-foreground">Покажем товары рядом с вами</p>
            </div>
          </div>

          <div className="relative mt-5">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск города..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
              autoFocus
            />
          </div>
        </div>

        <div className="px-4 pb-6 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-2 gap-1.5">
            {filtered.map((city) => (
              <button
                key={city}
                onClick={() => onSelect(city)}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium text-brand-black hover:bg-teal-light hover:text-teal transition-all duration-150"
              >
                {city}
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">Город не найден</p>
          )}
        </div>
      </div>
    </div>
  );
}
