const TeleBot = require('telebot');
const bot = new TeleBot('x:y:z');
bot.start();
const udb = require("./usersdb");
const wdb = require("./witnessesdb");
const view = require("./viewer");

async function keybord(variant) {
let replyMarkup;
    if (variant === 'standart') {
    replyMarkup = bot.keyboard([
        ["Пауза", "?", "%", "Поддержка", "О"],
], {resize: true});
} else if (variant === 'stopt') {
    replyMarkup = bot.keyboard([
        ["Воспроизведение", "?", "%", "Поддержка", "О"],
], {resize: true});
} else if (variant === 'admin') {
    replyMarkup = bot.keyboard([
        ["Да"],
], {resize: true});
} else {
    var buttons = {};
}
var buttons = {
    parseMode: 'Html',
    replyMarkup};
    return buttons;
}

async function sendMSG(userId, text, type) {
    try {
let msg_options = await keybord(type);
        await bot.sendMessage(userId, text, msg_options);
    } catch(e) {
        console.log(JSON.stringify(e));
        if (e.error_code === 403) {
await udb.removeUser(userId);
}
    }
}

async function startCommand() {
bot.on(/start|старт/, async function (msg, props) {
    var userId = msg.from.id;
    var username = msg.from.username;

const uid = {uid: userId, username: username, active: true, state:0};
const user = await udb.getUser(userId);
if (!user) {
await udb.addUser(uid);
    }
                      
let text = `Привет, @${username}! Я сообщаю, когда меняется процент кураторских, с указанием текущего процента.
                        Кроме того, вы узнаете от меня, когда делегаты меняют проценты.
                        
                        для преостановки уведомлений нажмите на кнопку пауза.
                        list 25:75 - список делегатов, установивших минимальный и максимальный процент кураторских на 50% (Это пример: можно поставить другие значения),
                        /cp - текущий процент кураторских,
                        /help - Список команд,
                        /about - О боте.`;
                        await sendMSG(userId, text, 'standart');
});
}

async function listCommand() {
bot.on(/list (.+)/i, async function (msg, props) {
    var userId = msg.from.id;
    var curation_percents = props.match[1];

    var p = curation_percents.split(':');

    var witnesses_line = '';
    const curation_obj = {min_curation_percent: p[0]*100, max_curation_percent: p[1]*100};
const witnesses_array = await wdb.findWitnesses(curation_obj);
if (witnesses_array) {
var witnesses_count = witnesses_array.length;
        witnesses_array.forEach(async function (witness) {
witnesses_line += `<a href="https://golos.id/@${witness.witness}">@${witness.witness}</a>, `;
});
witnesses_line = witnesses_line.replace(/,\s*$/, "");

let text = `Список делегатов, установивших минимальный процент кураторских на ${p[0]}% и максимальный - на ${p[1]}%:
Всего: ${witnesses_count}
${witnesses_line}
Проголосовать за них вы можете <a href="https://golos.id/~witnesses">на golos.id</a>, либо на другой странице голосования за делегатов.
/help - список команд.`;
const user = await udb.getUser(userId);
    if(user['active'] && user['active'] === false) {
await sendMSG(userId, text, 'stopt');
} else {
        await sendMSG(userId, text, 'standart');
    }
}
});
}

async function cpCommand(curation_percent) {
bot.on(/cp|%/i, async function (msg, props) {
    var userId = msg.from.id;

    if (curation_percent.length !== 0) {
let text = `Текущий кураторский процент. Минимальный: ${curation_percent[0]['min_curation_percent']}%, максимальный: ${curation_percent[0]['max_curation_percent']}%
/help - список команд.`;
const user = await udb.getUser(userId);
    if(user['active']&& user['active'] === false) {
await sendMSG(userId, text, 'stopt');
} else {
        await sendMSG(userId, text, 'standart');
    }
    } else {
let text = `Текущий кураторский процент неизвестен. Попробуйте позже.
        /help - список команд.`;
        const user = await udb.getUser(userId);
        if(user['active'] && user['active'] === false) {
    await sendMSG(userId, text, 'stopt');
} else {
            await sendMSG(userId, text, 'standart');
        }
    }
});
}

async function helpCommand() {
bot.on(/help|\?/i, async function (msg, props) {
    var userId = msg.from.id;

let text = `Список команд:
        list min_curation_percent:max_curation_percent - список делегатов с указанными минимальным и максимальным процентом кураторских. (Кнопка "list 50:50" показывает список поддерживающих 50/50),
/cp - текущий процент кураторских (Сокращение от двух слов: Curation percent. Кнопка "%");
/support - Поддержка пользователей. Используя эту команду, вы можете отправить автору бота сообщение с предложениями/проблемами, касающимися бота.,
/help - Список команд (Кнопка "?"),
/about - О боте (Кнопка "О боте").`;
const user = await udb.getUser(userId);
    if(user['active'] && user['active'] === false) {
await sendMSG(userId, text, 'stopt');
} else {
        await sendMSG(userId, text, 'standart');
    }
});
}

async function aboutCommand() {
bot.on(/about|^О/i, async function (msg, props) {
var userId = msg.from.id;

let text = `Что такое @golos_info50_bot?
Это Telegram бот, который уведомляет об изменении процента кураторских с указанием него.
Кроме того, бот сообщает, если кто-то из топ 100 делегатов изменил минимальный и максимальный процент кураторских, позволяет получить список делегатов с любым указанным вами мин. и макс. процентом, а также текущий процент при помощи специальных команд.
Автором бота является незрячий программист @skripnikdenis. На Голосе логин https://golos.id/@denis-skripnik.\
Помимо бота создал сервис https://dpos.space, где можно найти форму постинга, просмотрщик профилей, возможность бекапа постов, калькулятор различных параметров блокчейна и так далее.
Делегат.`;
const user = await udb.getUser(userId);
    if(user['active'] && user['active'] === false) {
await sendMSG(userId, text, 'stopt');
} else {
        await sendMSG(userId, text, 'standart');
    }
});
}

        async function playCommand() {
            bot.on(/^Воспроизведение/i, async function (msg, props) {
                var fromId = msg.from.id;
                var username = msg.from.username;
                const user = await udb.getUser(fromId);
                if(user) {
            var user_active = '';
                if (user.active && user.active === false) {
                    user_active = user.active;
                    user_active = true;
                } else if (!user.active) {
                    user_active = true;
               }
            
               const user_data = {uid: fromId, username: username, active: user_active, state:0};
               const res = await udb.updateUser(fromId, user_data);
               if (res) {
let text = `Бот теперь будет уведомлять вас об изменении процентов кураторских.
/help - справка`;
                await sendMSG(fromId, text, 'standart');
            }

                    }
                });
            }

            async function pauseCommand() {
                bot.on(/^Пауза|stop|удалиться из бота/i, async function (msg, props) {
                    var fromId = msg.from.id;
                    var username = msg.from.username;
                    const user = await udb.getUser(fromId);
                    if(user) {
                var user_active = '';
                    if (user.active && user.active !== false) {
                        user_active = user.active;
                        user_active = false;
                    } else if (!user.active) {
                        user_active = false;
                   }
                
                   const user_data = {uid: fromId, username: username, active: user_active, state:0};
                   const res = await udb.updateUser(fromId, user_data);
                   if (res) {
    let text = `Бот теперь не будет уведомлять вас об изменении процентов кураторских.
    /help - справка,
                    /about - О боте.`;
                    await sendMSG(fromId, text, 'stopt');
                }
    
                        }
                    });
                }

        async function adminCommand() {
            bot.on(/admin ((.|\n)+)/, async function (msg, props) {
            var fromId = msg.from.id;
            var resp = props.match[1];
            if (fromId === 364096327) {
            const user_info = await udb.findAllUsers();
            if (user_info) {
            user_info.forEach(async function (user) {
            let text = resp + `
                        Если вы получили сообщение, просьба нажать на /yes или ввести
            Да
            Также вы можете нажать на одноимённую кнопку.
                        Надо убедиться, что вы получили это сообщение.`;
            await sendMSG(user['uid'], text, 'admin');
            });
            }
                            }
                        });
                    }
            
        async function yesCommand() {
       bot.on(/yes|Да/i, async function (msg, props) {
var fromId = msg.from.id;
        var fromLogin = msg.from.username;
        var toId = 364096327;

let textTo = `Пользователь Telegram @${fromLogin} подтвердил получение вашего сообщения.`;
await sendMSG(toId, textTo, 'standart');
try {
const user = await udb.getUser(fromId);
let textFrom = `Благодарю за подтверждение. Оно отправлено успешно.`;
        if(user['active'] && user['active'] === false) {
            await sendMSG(fromId, textFrom, 'stopt');
        } else {
        await sendMSG(fromId, textFrom, 'standart');
        }
    } catch(e) {
console.log(e);
    }
    });
    }

    async function supportCommand() {
        bot.on(/support|^Поддержка/i, async function (msg, props) {
            var fromId = msg.from.id;
            var username = msg.from.username;

const user = await udb.getUser(fromId);
                if(user) {
                   const user_data = {uid: fromId, username: username, active: user.active, state:1};

                       const res = await udb.updateUser(fromId, user_data);
                if (res) {
let text = 'Введите пожалуйста сообщение создателю бота.';
const user = await udb.getUser(fromId);
    if(user['active'] && user['active'] === false) {
await sendMSG(fromId, text, 'stopt');
} else {
        await sendMSG(fromId, text, 'standart');
    }
                }
        }
    });
    }

    async function nullSupportCommand() {
                        bot.on('message', async (msg) => {
                var fromId = msg.from.id;
                var username = msg.from.username;
var toId = 364096327;
                
                const user = await udb.getUser(fromId);
switch(user.state) {
case 1:
const user_data = {uid: fromId, username: username, active: user.active, state:0};
const update_user = await udb.updateUser(fromId, user_data);
if (update_user) {
const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
const date = await view.date_str(msg.date*1000 - timezoneOffset, true, false, true);
let textTo = `Пользователь @${username} оставил сообщение по поводу бота:

${msg.text}`;
await sendMSG(toId, textTo, 'standart');
let textFrom = `Благодарю. Сообщение успешно отправлено.`;
const user = await udb.getUser(fromId);
    if(user['active'] && user['active'] === false) {
await sendMSG(fromId, textFrom, 'stopt');
} else {
        await sendMSG(fromId, textFrom, 'standart');
    }
               }
    break;
}
        });
    }

    module.exports.sendMSG = sendMSG;
    module.exports.startCommand = startCommand;
    module.exports.listCommand = listCommand;
    module.exports.cpCommand = cpCommand;
    module.exports.helpCommand = helpCommand;
    module.exports.aboutCommand = aboutCommand;
    module.exports.adminCommand = adminCommand;
    module.exports.playCommand = playCommand;
    module.exports.pauseCommand = pauseCommand;
    module.exports.yesCommand = yesCommand;
    module.exports.supportCommand = supportCommand;
    module.exports.nullSupportCommand = nullSupportCommand;