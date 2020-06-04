# golos50-50-bot
 Бот, уведомляющий об изменении процента кураторских
## Установка и запуск
Необходим node.js и npm.

При желании вы можете установить pm2 для фоновой работы скрипта:
npm install pm2 -g

Далее заходите папку через консоль (ssh) и вводите
npm install

## Настройки
- Нода - golos5050.js, метод golos.config.set('websocket','wss://golos.lexa.host/ws');
- api ключ меняется в строке (замените x:y:z)
const bot = new TeleBot('x:y:z');