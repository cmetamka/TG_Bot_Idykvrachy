# -*- coding: utf-8 -*-
"""
Запуск бота и мини-приложения с HTTPS-туннелем (ngrok), чтобы кнопка «Начать» работала в Telegram.
"""
import json
import os
import re
import shutil
import sys
import time
import threading
import subprocess
import urllib.request

from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", 5000))

_ngrok_process = None  # чтобы процесс не закрывался


def run_flask():
    """Запуск Flask в фоновом потоке."""
    import app

    app.app.run(host="0.0.0.0", port=PORT, debug=False, use_reloader=False)


def _find_ngrok_windows():
    """Типичные пути ngrok на Windows (в т.ч. Microsoft Store)."""
    candidates = [
        os.getenv("NGROK_PATH"),
        shutil.which("ngrok"),
        os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WindowsApps\ngrok.exe"),
        os.path.expandvars(r"%ProgramFiles%\ngrok\ngrok.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\ngrok\ngrok.exe"),
    ]
    for p in candidates:
        if p and os.path.isfile(p):
            return p
    # Через cmd, чтобы подхватить PATH из профиля пользователя
    try:
        out = subprocess.run(
            ["cmd", "/c", "where", "ngrok"],
            capture_output=True,
            text=True,
            timeout=5,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
        )
        if out.returncode == 0 and out.stdout:
            first = out.stdout.strip().splitlines()[0].strip()
            if first.lower().endswith("ngrok.exe") and os.path.isfile(first):
                return first
    except Exception:
        pass
    return None


def get_ngrok_system_url():
    """Получить HTTPS-URL через установленный в системе ngrok (команда ngrok http PORT)."""
    global _ngrok_process
    _ngrok_process = None
    try:
        ngrok_exe = os.getenv("NGROK_PATH")
        if not ngrok_exe and sys.platform == "win32":
            ngrok_exe = _find_ngrok_windows()
        if not ngrok_exe:
            ngrok_exe = shutil.which("ngrok")
        if not ngrok_exe:
            return None
        ngrok_exe = os.path.normpath(ngrok_exe.strip().strip('"'))
        if not os.path.isfile(ngrok_exe):
            print(f"ngrok не найден по пути: {ngrok_exe}", file=sys.stderr)
            return None
        token = os.getenv("NGROK_AUTH_TOKEN")
        if not token:
            print("Укажите NGROK_AUTH_TOKEN в .env для авторизации ngrok.", file=sys.stderr)
            return None
        cmd = [ngrok_exe, "http", str(PORT)]
        env = os.environ.copy()
        token_val = token.strip()
        env["NGROK_AUTHTOKEN"] = token_val   # так ngrok ожидает переменную (дашборд ngrok)
        env["NGROK_AUTH_TOKEN"] = token_val
        kwargs = dict(
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            env=env,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
        )
        _ngrok_process = subprocess.Popen(cmd, **kwargs)
        time.sleep(1)  # даём ngrok время подняться
        for _ in range(24):
            time.sleep(0.5)
            try:
                with urllib.request.urlopen("http://127.0.0.1:4040/api/tunnels", timeout=3) as r:
                    data = json.loads(r.read().decode())
                    tunnels = data.get("tunnels") or []
                    for t in tunnels:
                        url = (t.get("public_url") or "").strip()
                        if url.startswith("https://"):
                            return url.rstrip("/")
            except (OSError, ValueError, KeyError):
                continue
        if _ngrok_process.poll() is not None and _ngrok_process.stderr:
            err = _ngrok_process.stderr.read().decode(errors="replace").strip()
            if err:
                print(f"ngrok: {err}", file=sys.stderr)
    except FileNotFoundError as e:
        print(f"ngrok не найден: {e}", file=sys.stderr)
        if _ngrok_process:
            _ngrok_process.terminate()
        return None
    except Exception as e:
        print(f"Ошибка ngrok (системный): {e}", file=sys.stderr)
        if _ngrok_process:
            _ngrok_process.terminate()
        return None
    finally:
        if _ngrok_process and _ngrok_process.poll() is None:
            pass  # оставляем процесс работать
        elif _ngrok_process:
            _ngrok_process.terminate()
    return None


def get_ngrok_url():
    """Получить HTTPS-URL через pyngrok (нужен NGROK_AUTH_TOKEN в .env)."""
    token = os.getenv("NGROK_AUTH_TOKEN")
    if not token:
        return None
    try:
        from pyngrok import ngrok

        ngrok.set_auth_token(token)
        public_url = ngrok.connect(PORT, bind_tls=True).public_url
        return public_url.rstrip("/")
    except Exception as e:
        print(f"Ошибка ngrok: {e}", file=sys.stderr)
        return None


def get_cloudflared_url():
    """Получить HTTPS-URL через cloudflared (если установлен)."""
    try:
        proc = subprocess.Popen(
            ["cloudflared", "tunnel", "--url", f"http://127.0.0.1:{PORT}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
        )
        for _ in range(30):
            line = proc.stdout.readline()
            if not line:
                time.sleep(0.3)
                continue
            match = re.search(r"https://[^\s]+\.trycloudflare\.com", line)
            if match:
                url = match.group(0).rstrip("/")
                # процесс оставляем работать в фоне
                return url
        proc.terminate()
    except FileNotFoundError:
        pass
    except Exception as e:
        print(f"Ошибка cloudflared: {e}", file=sys.stderr)
    return None


def main():
    use_tunnel = os.getenv("TUNNEL", "1").strip().lower() not in ("0", "no", "false")
    if "--no-tunnel" in sys.argv:
        use_tunnel = False

    print("Запуск мини-приложения (Flask)...")
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()
    time.sleep(2)

    mini_url = os.getenv("MINIAPP_URL", "").rstrip("/")
    if use_tunnel and (not mini_url or mini_url.startswith("http://")):
        print("Получение HTTPS-адреса для Mini App...")
        mini_url = get_ngrok_system_url()
        if not mini_url and sys.platform != "win32":
            mini_url = get_ngrok_url()
        if not mini_url:
            mini_url = get_cloudflared_url()
        if mini_url:
            os.environ["MINIAPP_URL"] = mini_url
            print(f"Mini App доступен по адресу: {mini_url}")
        else:
            if sys.platform == "win32":
                print(
                    "Не удалось запустить ngrok. Укажите в .env полный путь к ngrok.exe:\n"
                    "  NGROK_PATH=C:\\путь\\к\\ngrok.exe\n"
                    "Узнать путь: в терминале выполните  where ngrok"
                )
            else:
                print(
                    "Не удалось получить HTTPS. Укажите NGROK_AUTH_TOKEN в .env или установите cloudflared."
                )
    elif not use_tunnel:
        os.environ["MINIAPP_URL"] = ""
        print("Режим без туннеля: Mini App только в браузере — http://localhost:" + str(PORT))

    # Бот читает MINIAPP_URL при импорте — env уже установлен
    import bot

    print("Запуск бота...")
    bot.main()


if __name__ == "__main__":
    main()
