from aiogram import Bot, Dispatcher, types
from aiogram.types import ChatPermissions
from aiogram.utils import executor
import asyncio

API_TOKEN = 'ВАШ_ТОКЕН_БОТА'

bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

# Список спонсоров (только их никнеймы без @)
SPONSORS = ['sponsor1', 'sponsor2']

# Сообщение с просьбой подписаться
WARNING_MESSAGE = "Чтобы писать в чате, нужно подписаться на спонсоров: " + ", ".join(f"@{s}" for s in SPONSORS)

# Хранение ID сообщений предупреждения чтобы не спамить
warning_messages = {}

@dp.message_handler(content_types=types.ContentTypes.ANY, chat_type=[types.ChatType.GROUP, types.ChatType.SUPERGROUP])
async def check_user(message: types.Message):
    user = message.from_user
    chat_id = message.chat.id

    # Проверяем, является ли пользователь спонсором
    # Можно проверять по username (вроде бы проще)
    if user.username and user.username.lower() in SPONSORS:
        # Спонсор - может писать
        return

    # Если это сообщение от бота или от админа - тоже пропускаем
    member = await bot.get_chat_member(chat_id, user.id)
    if member.is_chat_admin():
        return

    # Удаляем сообщение пользователя, если он не спонсор
    try:
        await message.delete()
    except Exception as e:
        print(f"Не удалось удалить сообщение: {e}")

    # Проверяем, отправляли ли уже предупреждение в этом чате
    if chat_id in warning_messages:
        # Уже есть предупреждение, обновим время жизни
        return
    else:
        sent = await message.reply(WARNING_MESSAGE)
        warning_messages[chat_id] = sent.message_id

        # Через 30 секунд удаляем предупреждение и очищаем из словаря
        await asyncio.sleep(30)
        try:
            await bot.delete_message(chat_id, sent.message_id)
        except:
            pass
        warning_messages.pop(chat_id, None)


if __name__ == '__main__':
    print("Бот запущен")
    executor.start_polling(dp, skip_updates=True)
