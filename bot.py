# -*- coding: utf-8 -*-
"""
Телеграм-бот «Иду к врачу» — приветствие и переход в Mini App.
"""
import os
import logging
from dotenv import load_dotenv
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

load_dotenv()

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("BOT_TOKEN")
MINIAPP_URL = os.getenv("MINIAPP_URL", "").rstrip("/")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")

GREETING = (
    "Привет! Я цифровой помощник «Иду к врачу». "
    "Я помогу ребёнку с РАС подготовиться к посещению врача и сделать его менее тревожным.\n\n"
    "Что доступно прямо сейчас:\n"
    "• Подготовка ребенка к посещению стоматолога\n"
    "• Подготовка к сдаче крови\n"
    "• Запись в клинику\n\n"
    "Подготовка включает в себя адаптационные материалы: мультфильмы, социстории, игры-тренажеры и рекомендации для родителей.\n\n"
    'Нажимая кнопку "Начать", вы подтверждаете согласие на обработку персональных данных.'
)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Команда /start — приветствие и кнопка «Начать» (открывает Mini App)."""
    keyboard = []
    if MINIAPP_URL:
        keyboard.append([
            InlineKeyboardButton(
                "Начать",
                web_app=WebAppInfo(url=MINIAPP_URL),
            )
        ])
    reply_markup = InlineKeyboardMarkup(keyboard) if keyboard else None
    await update.message.reply_text(
        GREETING,
        reply_markup=reply_markup,
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Сообщения от пользователя: приветствие или пересылка админу («Написать нам»)."""
    text = (update.message.text or "").strip()
    user = update.effective_user
    user_info = f"От: {user.id} @{user.username or '—'} {user.first_name or ''} {user.last_name or ''}"

    # Пересылаем админу, если настроен ADMIN_CHAT_ID
    if ADMIN_CHAT_ID and text and text.lower() not in ("/start", "start", "начать"):
        try:
            await context.bot.send_message(
                chat_id=ADMIN_CHAT_ID,
                text=f"«Написать нам»\n{user_info}\n\n{text}",
            )
            await update.message.reply_text("Сообщение отправлено. Мы ответим вам в ближайшее время.")
        except Exception as e:
            logger.exception("Ошибка пересылки админу: %s", e)
            await update.message.reply_text("Не удалось отправить сообщение. Попробуйте позже.")
        return

    # Иначе показываем приветствие и кнопку «Начать»
    keyboard = []
    if MINIAPP_URL:
        keyboard.append([
            InlineKeyboardButton(
                "Начать",
                web_app=WebAppInfo(url=MINIAPP_URL),
            )
        ])
    reply_markup = InlineKeyboardMarkup(keyboard) if keyboard else None
    await update.message.reply_text(
        GREETING,
        reply_markup=reply_markup,
    )


def main() -> None:
    if not BOT_TOKEN:
        logger.error("Укажите BOT_TOKEN в .env")
        return
    if not MINIAPP_URL:
        logger.warning("MINIAPP_URL не задан — кнопка «Начать» не будет открывать Mini App")

    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    logger.info("Бот запущен")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
