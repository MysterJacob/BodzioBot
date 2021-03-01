// const logger = require('./logger');
const fs = require('fs');
module.exports.getRanking = (places, guild, bot) =>{
    const readen = fs.readdirSync('./user_data/');
    const reputation = [];
    const members = guild.members.cache;
    readen.forEach(file=>{
        const userID = file.split('.')[0];
        if(members.some(m=>m.id == userID)) {
            const userReputation = this.getUserReputation(userID, bot);
            const value = { id:userID, reputation:userReputation };
            if(userID != 'template') { reputation.push(value); }
        }
    });
    const buffer = reputation.slice();
    const sorted = [];

    for(let i = 0;i < reputation.length;i++) {
        let last = { id: '', reputation: 0 };
        for(let j = 0;j < buffer.length;j++) {
            const current = buffer[j];
            if(last.id == '') {
                last = current;
            }
            if(current.reputation >= last.reputation) {
                last = current;
            }
        }
        sorted.push(last);
        buffer.splice(buffer.indexOf(last), 1);
        if(sorted.length > places + 1) {
            break;
        }
    }
    return sorted;
};
module.exports.addReputation = (userID, value, bot)=>{
    const userData = bot.modules.get('users-data');
    const userRep = userData.getUserConfigKey(userID, 'reputation') || 0;
    userData.setUserConfigKey(userID, 'reputation', userRep + value);
};
module.exports.removeReputation = (userID, value, bot)=>{
    const userData = bot.modules.get('users-data');
    const userRep = userData.getUserConfigKey(userID, 'reputation') || 0;
    userData.setUserConfigKey(userID, 'reputation', userRep - value);
};

module.exports.getUserReputation = (userID, bot)=>{
    const userData = bot.modules.get('users-data');
    const userRep = userData.getUserConfigKey(userID, 'reputation') || 0;
    return userRep;
};
module.exports.giveReputation = (userID, giverID, bot)=>{
    const userData = bot.modules.get('users-data');
    let userRep = userData.getUserConfigKey(userID, 'reputation') || 0;
    const giverRep = userData.getUserConfigKey(giverID, 'reputation') || 0;
    const diffrence = (userRep - giverRep) + 0.1;
    userRep += diffrence * 0.1;
    userRep = Math.round(userRep * 100) / 100;
    userData.setUserConfigKey(userID, 'reputation', userRep);
    userData.setUserConfigKey(giverID, 'reputation', giverRep);
    return userRep;
};
module.exports.reduceReputation = (userID, giverID, bot)=>{
    const userData = bot.modules.get('users-data');
    let userRep = userData.getUserConfigKey(userID, 'reputation') || 0;
    const giverRep = userData.getUserConfigKey(giverID, 'reputation') || 0;
    const diffrence = (userRep - giverRep) + 0.1;
    userRep -= diffrence * 0.1;
    userRep = Math.round(userRep * 100) / 100;
    userData.setUserConfigKey(userID, 'reputation', userRep);
    userData.setUserConfigKey(giverID, 'reputation', giverRep);
    return userRep;
};
module.exports.config = {
    name:'user-reputation',
};