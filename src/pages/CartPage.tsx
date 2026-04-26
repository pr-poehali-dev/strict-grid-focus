import { useState } from "react";
import { PRODUCTS } from "@/data/products";
import Icon from "@/components/ui/icon";

interface CartItem {
  id: number;
  qty: number;
}

interface CartPageProps {
  cart: CartItem[];
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}

export default function CartPage({ cart, onUpdateQty, onRemove }: CartPageProps) {
  const [ordered, setOrdered] = useState(false);

  const cartProducts = cart.map((item) => ({
    ...item,
    product: PRODUCTS.find((p) => p.id === item.id)!,
  })).filter((item) => item.product);

  const total = cartProducts.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  if (ordered) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-brand-black mb-2">Заказ оформлен!</h2>
        <p className="text-muted-foreground">Продавцы свяжутся с вами в ближайшее время</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-brand-black mb-2">Корзина</h1>
      <p className="text-muted-foreground mb-8">
        {cartProducts.length > 0 ? `${cartProducts.length} товара` : "Корзина пуста"}
      </p>

      {cartProducts.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items */}
          <div className="flex-1 space-y-3">
            {cartProducts.map((item) => (
              <div key={item.id} className="bg-white border border-border rounded-2xl p-4 flex gap-4 items-center animate-slide-up">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-brand-black line-clamp-2 mb-1">{item.product.name}</p>
                  <p className="text-xs text-teal">{item.product.seller}</p>
                  <p className="font-bold text-brand-black mt-2">{(item.product.price * item.qty).toLocaleString("ru-RU")} ₽</p>
                </div>
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2 border border-border rounded-xl">
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-l-xl transition-all"
                    >
                      <Icon name="Minus" size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-r-xl transition-all"
                    >
                      <Icon name="Plus" size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white border border-border rounded-2xl p-5 sticky top-24">
              <h3 className="font-bold text-brand-black mb-4">Итого</h3>
              <div className="space-y-2 mb-4">
                {cartProducts.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{item.product.name}</span>
                    <span className="font-medium shrink-0">{(item.product.price * item.qty).toLocaleString("ru-RU")} ₽</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 mb-5">
                <div className="flex justify-between font-bold text-lg">
                  <span>Итого</span>
                  <span>{total.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>
              <button
                onClick={() => setOrdered(true)}
                className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal/90 transition-all"
              >
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed border-border rounded-2xl">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-lg font-semibold text-brand-black mb-2">Корзина пуста</p>
          <p className="text-sm text-muted-foreground">Добавьте товары из каталога</p>
        </div>
      )}
    </main>
  );
}
