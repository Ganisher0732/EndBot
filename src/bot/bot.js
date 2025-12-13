import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import onStart from "./handlers/onStart.js";
import onProfile from "./handlers/onProfile.js";
import onError from "./handlers/onError.js";
config();

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const CHANNEL_ID = "@academy_100x_uz";

const checkIfUserSubscrideb = async (chatId) => {
  try {
    const chatMember = await bot.getChatMember(CHANNEL_ID, chatId);
    console.log(chatMember.status);

    if (chatMember.status == "left" || chatMember.status == "kicked") {
      return false;
    } else {
      return true;
    }
    
  }catch {
    console.log("error: chatMember checking" );
  };

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const firstname = msg.chat.first_name;
    const text = msg.text;

    const user_subscribed = await checkIfUserSubscrideb(chatId);

    console.log(user_subscribed);

    if (user_subscribed == false) {
      return bot.sendMessage(
        chatId,
        `Hurmatli ${firstname}, botdan foydalanish uchun avval kanalga obuna bo'ling👇🏻`,
        {
          reply_markup:{
            inline_keyboard: [
              [
                {
                  text: `100x Academy Xiva`,
                  url: "https://academy_100x_uz0"
                },
              ],
              [
                {
                  text: "O'bunani Tekshirish",
                  callback_data: "confirm_subscribtion"
                },
              ],
            ],
          },
        }
      );
    }

    if (text = "/start") {
      return onStart(msg);
    }

    if (text == "/profile") {
      return onProfile(msg);
    }

    return onError(msg);
    
  });

  bot.on("callback_query", async (query) => {
  const msg = query.message;
  const data = query.data;
  const queryId = query.id;

  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;

  if (data == "confirm_subscribtion") {
    console.log("TUGMA BOSILDIII");
    const user_subscribed = await checkIfUserSubscribed(chatId);

    if (user_subscribed == false) {
      return bot.answerCallbackQuery(queryId, {
        text: "Siz hali obuna bo'lmadingiz... ❌",
      });
    } else {
      bot.deleteMessage(chatId, msg.message_id);
      return onStart(msg);
    }
  }
});


} 
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;
  const text = msg.text;
  
  if (text == "/start") {
    return onStart(msg);
  }

  if (text == "/profile") {
    return onProfile(msg);
  }

  return onError(msg);
});

console.log("Bot ishga tushdi...");

