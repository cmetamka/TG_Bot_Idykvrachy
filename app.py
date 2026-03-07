# -*- coding: utf-8 -*-
"""
Flask-сервер для мини-приложения «Иду к врачу».
Запуск: python app.py
Для Telegram Mini App нужен HTTPS (например ngrok).
"""
import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="static", static_url_path="")


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
