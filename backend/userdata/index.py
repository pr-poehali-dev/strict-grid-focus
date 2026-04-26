"""
Хранение корзины и избранного пользователя.
GET  /?action=favourites         — получить список product_id
POST /?action=fav_toggle         — { product_id } — добавить/убрать
GET  /?action=cart               — получить [{ id, qty }]
POST /?action=cart_update        — { product_id, qty } (qty=0 — удалить)
POST /?action=cart_clear         — очистить корзину
POST /?action=cart_sync          — { items: [{id,qty}] } — полная синхронизация
"""
import json
import os
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}


def get_user_id(event: dict, conn) -> int | None:
    auth = event.get("headers", {}).get("X-Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth[7:]
    cur = conn.cursor()
    cur.execute("SELECT user_id FROM sessions WHERE token = %s", (token,))
    row = cur.fetchone()
    return row[0] if row else None


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    conn = get_conn()
    user_id = get_user_id(event, conn)

    if not user_id:
        conn.close()
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Unauthorized"})}

    cur = conn.cursor()

    # GET ?action=favourites
    if action == "favourites":
        cur.execute("SELECT product_id FROM user_favourites WHERE user_id = %s", (user_id,))
        ids = [r[0] for r in cur.fetchall()]
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"favourites": ids})}

    # POST ?action=fav_toggle
    if action == "fav_toggle":
        body = json.loads(event.get("body") or "{}")
        product_id = int(body.get("product_id", 0))
        cur.execute("SELECT 1 FROM user_favourites WHERE user_id = %s AND product_id = %s", (user_id, product_id))
        if cur.fetchone():
            cur.execute("DELETE FROM user_favourites WHERE user_id = %s AND product_id = %s", (user_id, product_id))
            result_action = "removed"
        else:
            cur.execute("INSERT INTO user_favourites (user_id, product_id) VALUES (%s, %s)", (user_id, product_id))
            result_action = "added"
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"action": result_action})}

    # GET ?action=cart
    if action == "cart":
        cur.execute("SELECT product_id, qty FROM user_cart WHERE user_id = %s", (user_id,))
        items = [{"id": r[0], "qty": r[1]} for r in cur.fetchall()]
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"cart": items})}

    # POST ?action=cart_update
    if action == "cart_update":
        body = json.loads(event.get("body") or "{}")
        product_id = int(body.get("product_id", 0))
        qty = int(body.get("qty", 0))
        if qty <= 0:
            cur.execute("DELETE FROM user_cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
        else:
            cur.execute(
                "INSERT INTO user_cart (user_id, product_id, qty) VALUES (%s, %s, %s) ON CONFLICT (user_id, product_id) DO UPDATE SET qty = %s",
                (user_id, product_id, qty, qty)
            )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # POST ?action=cart_clear
    if action == "cart_clear":
        cur.execute("DELETE FROM user_cart WHERE user_id = %s", (user_id,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # POST ?action=cart_sync — синхронизация всей корзины при входе
    if action == "cart_sync":
        body = json.loads(event.get("body") or "{}")
        items = body.get("items", [])
        for item in items:
            pid = int(item.get("id", 0))
            qty = int(item.get("qty", 1))
            if pid and qty > 0:
                cur.execute(
                    "INSERT INTO user_cart (user_id, product_id, qty) VALUES (%s, %s, %s) ON CONFLICT (user_id, product_id) DO UPDATE SET qty = EXCLUDED.qty + user_cart.qty",
                    (user_id, pid, qty)
                )
        conn.commit()
        cur.execute("SELECT product_id, qty FROM user_cart WHERE user_id = %s", (user_id,))
        merged = [{"id": r[0], "qty": r[1]} for r in cur.fetchall()]
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"cart": merged})}

    conn.close()
    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Unknown action"})}