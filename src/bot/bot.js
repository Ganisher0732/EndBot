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
  const first_name = msg.chat.first_name;
  const text = msg.text;
  
  if (text == "/start") {
    return onStart(msg);
  }

  if (text == "/profile") {
    return onProfile(msg);
  }

  return onError(msg);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const first_name = msg.chat.first_name;
  const text = msg.text;

   bot.sendMessage(chatId, `Assalomu alaykum hurmatli ${first_name} quyidagilarni ko'rip chiqqan holda tanlang👇 `, {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Kurslarga yozilish📚",
          },
          ],
          [

            
              {text: "Biz bilan bog'lanish☎️"},
              {text: "Ro'yhatdan o'tish📝"}
            
          ],
        
      ],
      resize_keyboard: true,
    },
   }); 
    if (text == "Kurslarga yozilish📚") {
      bot.sendMessage(chatId, `
        🎓 Bizning o‘quv markazimizda quyidagi kurslar mavjud:

1️⃣ Ingliz tili  
2️⃣ Rus tili  
3️⃣ Matematika  
4️⃣ Dasturlash (Python, Web)  
5️⃣ Grafik dizayn  

👇 Quyidagi kurslardan birini tanlang va batafsil ma’lumot oling:
        
        `,{
          reply_markup: {
            inline_keyboard: [
              [{text: "Inliz tili", callback_data: "course_english"}],
              [{text: "Rus tili", callback_data: "course_russian"}],
              [{text: "Nemis tili", callback_data: "course_german"}],
              [{text: "Frontend", callback_data: "course_frontend"}],
              [{text: "Beckend", callback_data: "course_brckend"}],

            ]
          }
        } )
      }
   
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const first_name = msg.chat.first_name;
  const text = msg.text;       
  
  if (text == "Biz bilan bog'lanish☎️") {
    bot.sendMessage(chatId, `
      Biz bilan bog'lanish uchun:
      📞 Telefon: +998 99 255 50 50;
      📞 Telefon: +998 99 250 50 55;
      `);

  }
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const first_name = msg.chat.first_name;
  const text = msg.text;

  if (text == "Ro'yhatdan o'tish📝") {
    bot.sendMessage(chatId, `
      Quyidagi ro'yhatga F.I.SH, ni yozib qoldiring:
      1. F.I.SH:
      2. Yoshi:
      3. Kasbi:
      4. Qaysi kursga yozilmoqchisiz:
      5. Telefon raqamingiz:
      `)
  }
});

console.log("Bot ishga tushdi...");

