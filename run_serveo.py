# -*- coding: utf-8 -*-
"""
Запуск бота и мини-приложения через SSH‑туннель Serveo.

Что делает скрипт:
- поднимает Flask (Mini App) на localhost:PORT (по умолчанию 5000);
- открывает туннель: ssh -R 80:localhost:PORT serveo.net;
- парсит выданный Serveo HTTPS‑адрес и передаёт его боту как MINIAPP_URL;
- запускает Telegram‑бота, у которого кнопка «Начать» открывает Mini App.

Требования:
- установлен ssh‑клиент (OpenSSH Client в Windows);
- доступ к serveo.net не заблокирован.
"""

import os
import re
import sys
import time
import threading
import subprocess

from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", 5000))


def run_flask() -> None:
    """Запуск Flask в отдельном потоке."""
    import app

    app.app.run(host="0.0.0.0", port=PORT, debug=False, use_reloader=False)


def start_serveo_tunnel() -> tuple[str | None, subprocess.Popen | None]:
    """
    Запускает ssh‑туннель на serveo.net и возвращает (url, процесс).

    Команда:
      ssh -o StrictHostKeyChecking=no -R 80:localhost:PORT serveo.net
    Serveo в ответ печатает строку вида:
      Forwarding HTTP traffic from https://xxxx.serveo.net
    """
    try:
        cmd = [
            "ssh",
            "-o",
            "StrictHostKeyChecking=no",
            "-R",
            f"80:localhost:{PORT}",
            "serveo.net",
        ]
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
    except FileNotFoundError:
        print("Команда 'ssh' не найдена. Установите OpenSSH Client или добавьте ssh в PATH.")
        return None, None
    except Exception as e:  # noqa: BLE001
        print(f"Не удалось запустить ssh/serveo: {e}")
        return None, None

    url_pattern = re.compile(r"https://[^\s]+", re.IGNORECASE)
    public_url: str | None = None

    # Ждём до ~20 секунд появления URL в выводе serveo
    start_time = time.time()
    while time.time() - start_time < 20:
        if proc.stdout is None:
            break
        line = proc.stdout.readline()
        if not line:
            time.sleep(0.3)
            continue
        line = line.strip()
        print(f"[serveo] {line}")
        match = url_pattern.search(line)
        if match:
            public_url = match.group(0).rstrip("/")
            break

    if not public_url:
        print("Не удалось получить URL от serveo. Проверьте доступ к serveo.net.")
        return None, proc

    print(f"Serveo URL: {public_url}")
    return public_url, proc


def main() -> None:
    print(f"Запуск Flask на порту {PORT}...")
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()
    time.sleep(2)

    print("Открытие SSH‑туннеля через serveo.net...")
    public_url, ssh_proc = start_serveo_tunnel()

    if not public_url:
        print("Туннель не поднят, бот всё равно будет запущен без Mini App URL.")
    else:
        os.environ["MINIAPP_URL"] = public_url
        print(f"MINIAPP_URL установлен: {public_url}")

    # Импорт после установки MINIAPP_URL
    import bot

    print("Запуск бота...")
    try:
        bot.main()
    finally:
        if ssh_proc and ssh_proc.poll() is None:
            print("Останавливаю SSH‑туннель serveo...")
            try:
                ssh_proc.terminate()
            except Exception:  # noqa: BLE001
                pass


if __name__ == "__main__":
    main()

