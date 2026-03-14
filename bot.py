# -*- coding: utf-8 -*-
"""
Телеграм-бот «Иду к врачу» — приветствие, Mini App и обратная связь «Написать нам».
Связаться с нами — только по кнопке «Написать нам». У админа под каждым сообщением кнопка «Ответить».
"""
import json
import os
import logging
from typing import Optional

from dotenv import load_dotenv
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CallbackQueryHandler, CommandHandler, ContextTypes, MessageHandler, filters

load_dotenv()

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("BOT_TOKEN")
MINIAPP_URL = os.getenv("MINIAPP_URL", "").rstrip("/")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
FEEDBACK_STORE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "feedback_replies.json")


def _load_feedback_store():
    """Загрузить соответствие (чат админа, id сообщения бота) -> user_id."""
    if not os.path.isfile(FEEDBACK_STORE):
        return {}
    try:
        with open(FEEDBACK_STORE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.warning("Не удалось загрузить feedback_replies.json: %s", e)
        return {}


def _save_feedback_store(data):
    try:
        with open(FEEDBACK_STORE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.warning("Не удалось сохранить feedback_replies.json: %s", e)


def _register_forward(admin_chat_id: int, message_id: int, user_id: int):
    data = _load_feedback_store()
    key = str(admin_chat_id)
    if key not in data:
        data[key] = {}
    data[key][str(message_id)] = user_id
    _save_feedback_store(data)


def _get_user_for_reply(admin_chat_id: int, message_id: int) -> Optional[int]:
    data = _load_feedback_store()
    return data.get(str(admin_chat_id), {}).get(str(message_id))


def _clear_reply_mapping(admin_chat_id: int, message_id: int):
    data = _load_feedback_store()
    key = str(admin_chat_id)
    if key in data and str(message_id) in data[key]:
        del data[key][str(message_id)]
        if not data[key]:
            del data[key]
        _save_feedback_store(data)

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


def _main_keyboard():
    """Кнопки: Начать (Mini App) и Написать нам."""
    buttons = []
    if MINIAPP_URL:
        buttons.append(InlineKeyboardButton("Начать", web_app=WebAppInfo(url=MINIAPP_URL)))
    buttons.append(InlineKeyboardButton("Написать нам", callback_data="want_feedback"))
    return InlineKeyboardMarkup([buttons]) if buttons else None


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Команда /start — приветствие, кнопки «Начать» и «Написать нам»."""
    reply_markup = _main_keyboard()
    await update.message.reply_text(GREETING, reply_markup=reply_markup)


async def callback_button(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработка нажатий: «Написать нам» (пользователь) и «Ответить» (админ)."""
    query = update.callback_query
    await query.answer()
    data = (query.data or "").strip()

    # Пользователь нажал «Написать нам»
    if data == "want_feedback":
        context.user_data["awaiting_feedback"] = True
        await query.message.reply_text(
            "Напишите ваше сообщение ниже. Мы ответим вам в этом чате."
        )
        return

    # Админ нажал «Ответить» под сообщением
    if data.startswith("reply_") and ADMIN_CHAT_ID and str(query.from_user.id) == str(ADMIN_CHAT_ID):
        try:
            msg_id = int(data.replace("reply_", ""))
        except ValueError:
            return
        admin_chat_id = query.message.chat.id
        user_id = _get_user_for_reply(int(ADMIN_CHAT_ID), msg_id)
        if not user_id:
            await query.message.reply_text("Не удалось определить получателя. Сообщение уже могло быть обработано.")
            return
        if context.bot_data.get("admin_pending_reply") is None:
            context.bot_data["admin_pending_reply"] = {}
        context.bot_data["admin_pending_reply"][str(admin_chat_id)] = {"user_id": user_id, "message_id": msg_id}
        await query.message.reply_text(
            "Напишите ваш ответ пользователю. Следующее сообщение будет отправлено ему."
        )


async def handle_admin_reply(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Ответ админа на пересланное сообщение (Reply) — пересылаем пользователю (для совместимости)."""
    if not update.message or not update.message.reply_to_message or not update.message.text:
        return
    reply_to = update.message.reply_to_message
    if reply_to.from_user.id != context.bot.id:
        return
    admin_chat_id = update.effective_chat.id
    msg_id = reply_to.message_id
    user_id = _get_user_for_reply(admin_chat_id, msg_id)
    if not user_id:
        return
    text = (update.message.text or "").strip()
    if not text:
        return
    try:
        await context.bot.send_message(chat_id=user_id, text=f"Ответ от поддержки:\n\n{text}")
        _clear_reply_mapping(admin_chat_id, msg_id)
        await update.message.reply_text("Ответ отправлен пользователю.")
    except Exception as e:
        logger.exception("Ошибка отправки ответа пользователю: %s", e)
        await update.message.reply_text("Не удалось отправить ответ пользователю.")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Сообщения: ответ админа по кнопке «Ответить», пересылка админу только после «Написать нам», иначе — приветствие."""
    chat_id = update.effective_chat.id
    text = (update.message.text or "").strip()

    # Ответ админа после нажатия «Ответить»: следующее сообщение админа уходит пользователю
    if ADMIN_CHAT_ID and str(chat_id) == str(ADMIN_CHAT_ID):
        pending = (context.bot_data.get("admin_pending_reply") or {}).get(str(chat_id))
        if pending and text:
            user_id = pending.get("user_id")
            msg_id = pending.get("message_id")
            try:
                await context.bot.send_message(chat_id=user_id, text=f"Ответ от поддержки:\n\n{text}")
                _clear_reply_mapping(int(ADMIN_CHAT_ID), msg_id)
                await update.message.reply_text("Ответ отправлен пользователю.")
            except Exception as e:
                logger.exception("Ошибка отправки ответа пользователю: %s", e)
                await update.message.reply_text("Не удалось отправить ответ пользователю.")
            del context.bot_data["admin_pending_reply"][str(chat_id)]
            return
        if update.message.reply_to_message:
            await handle_admin_reply(update, context)
            return

    # Пользователь: пересылаем админу только если он нажал «Написать нам»
    if context.user_data.get("awaiting_feedback") and text and ADMIN_CHAT_ID:
        context.user_data["awaiting_feedback"] = False
        user = update.effective_user
        user_info = f"От: {user.id} @{user.username or '—'} {user.first_name or ''} {user.last_name or ''}"
        try:
            sent = await context.bot.send_message(
                chat_id=ADMIN_CHAT_ID,
                text=f"«Написать нам»\n{user_info}\n\n{text}",
            )
            _register_forward(int(ADMIN_CHAT_ID), sent.message_id, user.id)
            await context.bot.edit_message_reply_markup(
                chat_id=ADMIN_CHAT_ID,
                message_id=sent.message_id,
                reply_markup=InlineKeyboardMarkup([
                    [InlineKeyboardButton("Ответить", callback_data=f"reply_{sent.message_id}")]
                ]),
            )
            await update.message.reply_text("Сообщение отправлено. Мы ответим вам в этом чате.")
        except Exception as e:
            logger.exception("Ошибка пересылки админу: %s", e)
            await update.message.reply_text("Не удалось отправить сообщение. Попробуйте позже.")
        return

    # Любое другое сообщение — показываем приветствие и кнопки (без пересылки админу)
    context.user_data["awaiting_feedback"] = False
    reply_markup = _main_keyboard()
    await update.message.reply_text(GREETING, reply_markup=reply_markup)


def main() -> None:
    if not BOT_TOKEN:
        logger.error("Укажите BOT_TOKEN в .env")
        return
    if not MINIAPP_URL:
        logger.warning("MINIAPP_URL не задан — кнопка «Начать» не будет открывать Mini App")

    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(callback_button))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    logger.info("Бот запущен")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
