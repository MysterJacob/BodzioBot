const { User } = require("discord.js");
const logger = require("./logger");

module.exports.addReputation = (UserID,value,bot)=>{
    const userData = bot.modules.get('users-data');
    let userRep = userData.getUserConfigKey(UserID,'reputation') || 0;
    userData.setUserConfigKey(UserID,'reputation',userRep + value);
}
module.exports.removeReputation = (UserID,value,bot)=>{
    const userData = bot.modules.get('users-data');
    let userRep = userData.getUserConfigKey(UserID,'reputation') || 0;
    userData.setUserConfigKey(UserID,'reputation',userRep - value);
}
module.exports.giveReputation = (UserID,GiverID,bot)=>{
    const userData = bot.modules.get('users-data');
    let userRep = userData.getUserConfigKey(UserID,'reputation') || 0;
    let giverRep = userData.getUserConfigKey(GiverID,'reputation') || 0;
    const diffrence = (userRep -  giverRep) + 0.1;
    userRep += diffrence * 0.1;
    userRep = Math.round(userRep*100)/100
    userData.setUserConfigKey(UserID,'reputation',userRep);
    userData.setUserConfigKey(GiverID,'reputation',giverRep);
    return userRep;
}
module.exports.reduceReputation = (UserID,GiverID,bot)=>{
    const userData = bot.modules.get('users-data');
    let userRep = userData.getUserConfigKey(UserID,'reputation') || 0;
    let giverRep = userData.getUserConfigKey(GiverID,'reputation') || 0;
    const diffrence = (userRep -  giverRep) + 0.1;
    userRep -= diffrence * 0.1;
    userRep = Math.round(userRep*100)/100
    userData.setUserConfigKey(UserID,'reputation',userRep);
    userData.setUserConfigKey(GiverID,'reputation',giverRep);
    return userRep;
}
module.exports.config ={
    name:'user-reputation'
}