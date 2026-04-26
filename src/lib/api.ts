const AUTH_URL = "https://functions.poehali.dev/13d4d147-43f9-4409-b279-b98e3b261763";
const DATA_URL = "https://functions.poehali.dev/df134097-c090-412d-9a41-c87959f98049";

function getToken(): string | null {
  return localStorage.getItem("market_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

// --- AUTH ---

export async function apiRegister(email: string, name: string, password: string) {
  const res = await fetch(`${AUTH_URL}/?action=register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
  return data as { token: string; id: number; email: string; name: string };
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${AUTH_URL}/?action=login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка входа");
  return data as { token: string; id: number; email: string; name: string };
}

export async function apiLogout() {
  const token = getToken();
  if (!token) return;
  await fetch(`${AUTH_URL}/?action=logout`, {
    method: "POST",
    headers: authHeaders(),
  });
}

export async function apiGetMe() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${AUTH_URL}/?action=me`, {
    headers: authHeaders(),
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ id: number; email: string; name: string }>;
}

// --- USER DATA ---

export async function apiFetchFavourites(): Promise<number[]> {
  const res = await fetch(`${DATA_URL}/?action=favourites`, { headers: authHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.favourites || [];
}

export async function apiToggleFavourite(product_id: number): Promise<void> {
  await fetch(`${DATA_URL}/?action=fav_toggle`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ product_id }),
  });
}

export async function apiFetchCart(): Promise<Array<{ id: number; qty: number }>> {
  const res = await fetch(`${DATA_URL}/?action=cart`, { headers: authHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.cart || [];
}

export async function apiUpdateCart(product_id: number, qty: number): Promise<void> {
  await fetch(`${DATA_URL}/?action=cart_update`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ product_id, qty }),
  });
}

export async function apiClearCart(): Promise<void> {
  await fetch(`${DATA_URL}/?action=cart_clear`, {
    method: "POST",
    headers: authHeaders(),
  });
}

export async function apiSyncCart(items: Array<{ id: number; qty: number }>): Promise<Array<{ id: number; qty: number }>> {
  const res = await fetch(`${DATA_URL}/?action=cart_sync`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ items }),
  });
  if (!res.ok) return items;
  const data = await res.json();
  return data.cart || items;
}
