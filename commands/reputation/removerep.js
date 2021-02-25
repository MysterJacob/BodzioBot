const logger = require("../../bot_modules/logger");
const discord = require('discord.js');
module.exports.run = (msg,Flags,Parameters,bot,ret)=>{
    const userReputation = bot.modules.get('user-reputation');
    //Time out
    const target = Parameters.get('member');
    const giver = msg.member;
    const userData = bot.modules.get('users-data');
    const now = new Date();
    const lastReputationInteraction = Date.parse(userData.getUserConfigKey(giver.id,'lastReputationInteraction')) || new Date(-100);

    const diffMs = now - lastReputationInteraction;
    const diffDays =Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    
    if(diffMins < 30){
        const embed = new discord.MessageEmbed();
        embed.setAuthor('You need to wait more time');
        const remainingTime = `00:${(30 -diffMins) >= 10 ? (30 -diffMins) : '0'+(30 -diffMins)}`;
        embed.setTitle(remainingTime);
        embed.setDescription('You need to wait 30 minutes between interactions.');
        embed.setColor('#8ef77e');
        embed.setTimestamp(new Date());
        msg.reply(embed);
        return ret;
    }
    userData.setUserConfigKey(giver.id,'lastReputationInteraction',now.toString());
    //Rep use
     
    const newRep = userReputation.reduceReputation(target.id,giver.id,bot);
    msg.reply(`Użytkownik ${target} ma teraz ${newRep} punktów reputacji.`);
    return ret;
}

module.exports.config ={
    name:'-rep',
    desc:'Reduce rep from given member.',
    permissions:'111111',
    parameters:[{name:'member',type:'member',optional:false}],
    flags:{}
}