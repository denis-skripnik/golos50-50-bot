var golos = require('golos-js');
golos.config.set('websocket','wss://golos.lexa.host/ws');
const udb = require("./usersdb");
const wdb = require("./witnessesdb");
const botjs = require("./bot");

let curation_percent = {};
let cp_results = [];

async function getPercents() {
let old_curation_percent = curation_percent;
const getChainProperties = await golos.api.getChainPropertiesAsync();
        if (getChainProperties) {
            curation_percent = {min_curation_percent: getChainProperties.min_curation_percent/100, max_curation_percent: getChainProperties.max_curation_percent/100};
                    if(JSON.stringify(old_curation_percent) !== JSON.stringify(curation_percent) && JSON.stringify(old_curation_percent) !== undefined) {
                        cp_results.length = 0;
                        cp_results.push(curation_percent);
                        const users = await udb.findAllUsers();
        for (let i in users) {
            if(users[i]['active'] && users[i]['active'] === true || users[i]['active'] === "") {
                    let text = `Сейчас процент кураторских: минимум - ${getChainProperties.min_curation_percent/100}%, максимум - ${getChainProperties.max_curation_percent/100}%
list ${getChainProperties.min_curation_percent/100}:${getChainProperties.max_curation_percent/100} - список делегатов, указавших в параметрах текущие проценты кураторских (Минимальный и максимальный),
/help - список команд.`;
    await botjs.sendMSG(users[i]['uid'], text, 'standart');
            }
    }
}
}
    }
    
    async function witnessesList() {
    const getWitnessesByVote = await golos.api.getWitnessesByVoteAsync('', 100);
            if (getWitnessesByVote) {
                getWitnessesByVote.forEach(async function (item) {
                        let witness_owner = item.owner;
        let witness_min_curation_percent = item.props.min_curation_percent;
        let witness_max_curation_percent = item.props.max_curation_percent;
    
        const delegat = await wdb.findWitness(witness_owner);
        if (delegat) {
        if (delegat.min_curation_percent != item.props.min_curation_percent && delegat.max_curation_percent != item.props.max_curation_percent) {
        const updateWitnessObj = {witness: item.owner, min_curation_percent: item.props.min_curation_percent, max_curation_percent: item.props.max_curation_percent};
                await wdb.updateWitness(item.owner, updateWitnessObj);
        
                const users = await udb.findAllUsers();
        if (users) {
    for (let user in users) {
    let text = `Делегат ${item.owner} изменил и минимальный процент кураторских с ${delegat.min_curation_percent/100}% на ${item.props.min_curation_percent/100}%, и максимальный процент кураторских с ${delegat.max_curation_percent/100}% на ${item.props.max_curation_percent/100}%.
    Проголосовать за него вы можете здесь: https://golos.io/~witnesses, либо на другой странице голосования за делегатов.
    list ${item.props.min_curation_percent/100}:${item.props.max_curation_percent/100} - список делегатов, указавших в параметрах кураторские, как у изменившего их сейчас,
    /cp - текущий процент кураторских,
    /help - список команд.`;
    await botjs.sendMSG(users[user]['uid'], text, 'standart');
                        }
                    }
                    } else if (delegat.min_curation_percent != item.props.min_curation_percent) {
                        const updateWitnessObj = {witness: item.owner, min_curation_percent: item.props.min_curation_percent, max_curation_percent: delegat.max_curation_percent};
                        await wdb.updateWitness(item.owner, updateWitnessObj);
               
                        const users = await udb.findAllUsers();
                        if (users) {
    for (let user in users) {
    let text = `Делегат ${item.owner} изменил минимальный процент кураторских с ${delegat.min_curation_percent/100}% на ${item.props.min_curation_percent/100}%. Его максимальный процент: ${item.props.max_curation_percent/100}%
    Проголосовать за него вы можете здесь: https://golos.io/~witnesses, либо на другой странице голосования за делегатов.
    list ${item.props.min_curation_percent/100}:${item.props.max_curation_percent/100} - список делегатов, указавших в параметрах кураторские, как у изменившего их сейчас,
    /cp - текущий процент кураторских,
    /help - список команд.`;
    await botjs.sendMSG(users[user]['uid'], text, 'standart');
                }
            }
            } else if (delegat.max_curation_percent != item.props.max_curation_percent) {
                    const updateWitnessObj = {witness: item.owner, min_curation_percent: delegat.min_curation_percent, max_curation_percent: item.props.max_curation_percent};
                    await wdb.updateWitness(item.owner, updateWitnessObj);
                    
                    const users = await udb.findAllUsers();
                    if (users) {
    for (let user in users) {
    let text = `Делегат ${item.owner} изменил максимальный процент кураторских с ${delegat.max_curation_percent/100}% на ${item.props.max_curation_percent/100}%. Его минимальный процент: ${item.props.min_curation_percent/100}%
    Проголосовать за него вы можете здесь: https://golos.io/~witnesses, либо на другой странице голосования за делегатов.
    list ${item.props.min_curation_percent/100}:${item.props.max_curation_percent/100} - список делегатов, указавших в параметрах кураторские, как у изменившего их сейчас,
    /cp - текущий процент кураторских,
    /help - список команд.`;
    await botjs.sendMSG(users[user]['uid'], text, 'standart');
                            }
                        }
                    }
                }
              }); // end forEach
            } // end if.
        }

async function timer() {
await getPercents();
await witnessesList();
}

        setInterval(timer, 3000);

        async function noReturn() {
await botjs.startCommand();
await botjs.listCommand();
await botjs.cpCommand(cp_results);
await botjs.helpCommand();
await botjs.aboutCommand();
await botjs.adminCommand();
await botjs.playCommand();
await botjs.pauseCommand();
await botjs.yesCommand();
await botjs.supportCommand();
await botjs.nullSupportCommand();
}

noReturn();