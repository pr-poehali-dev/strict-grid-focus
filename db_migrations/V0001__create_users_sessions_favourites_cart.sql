
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_favourites (
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL,
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS user_cart (
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, product_id)
);
