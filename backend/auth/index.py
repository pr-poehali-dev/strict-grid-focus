"""
Аутентификация: регистрация, вход, выход, профиль.
POST /?action=register — { email, name, password }
POST /?action=login    — { email, password }
POST /?action=logout   — (X-Authorization: Bearer <token>)
GET  /?action=me       — (X-Authorization: Bearer <token>)
"""
import json
import os
import hashlib
import secrets
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_token(event: dict) -> str | None:
    auth = event.get("headers", {}).get("X-Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    # GET ?action=me
    if action == "me":
        token = get_token(event)
        if not token:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Unauthorized"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = %s",
            (token,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Invalid token"})}
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"id": row[0], "email": row[1], "name": row[2]})}

    body = json.loads(event.get("body") or "{}")

    # POST ?action=register
    if action == "register":
        email = body.get("email", "").strip().lower()
        name = body.get("name", "").strip()
        password = body.get("password", "")
        if not email or not name or not password:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все поля"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Пароль минимум 6 символов"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Email уже зарегистрирован"})}
        cur.execute(
            "INSERT INTO users (email, name, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (email, name, hash_password(password))
        )
        user_id = cur.fetchone()[0]
        token = secrets.token_hex(32)
        cur.execute("INSERT INTO sessions (token, user_id) VALUES (%s, %s)", (token, user_id))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"token": token, "id": user_id, "email": email, "name": name})}

    # POST ?action=login
    if action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, name FROM users WHERE email = %s AND password_hash = %s", (email, hash_password(password)))
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}
        user_id, name = row
        token = secrets.token_hex(32)
        cur.execute("INSERT INTO sessions (token, user_id) VALUES (%s, %s)", (token, user_id))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"token": token, "id": user_id, "email": email, "name": name})}

    # POST ?action=logout
    if action == "logout":
        token = get_token(event)
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute("DELETE FROM sessions WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Unknown action"})}