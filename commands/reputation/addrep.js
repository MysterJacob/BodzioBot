const logger = require("../../bot_modules/logger");
const discord = require('discord.js');
module.exports.run = (msg,Flags,Parameters,bot,ret)=>{
    //Time out
    const target = Parameters.get('member');
    const giver = msg.member;
    const userData = bot.modules.get('users-data');
    const now = new Date();
    const lastReputationInteraction = Date.parse(userData.getUserConfigKey(giver.id,'lastReputationInteraction')) || new Date(0);

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
    
    const userReputation = bot.modules.get('user-reputation');
    
    const userRep = userData.getUserConfigKey(target.id,'reputation') || 0;
    const giverRep = userData.getUserConfigKey(giver.id,'reputation') || 0;

    if(userRep >= giverRep){
        const newRep = userReputation.giveReputation(target.id,giver.id,bot);
        msg.reply(`Użytkownik ${target} ma teraz ${newRep} punktów reputacji.`);
    }else{
        ret.exitCode = 1;
        ret.message = `You need to have at least ${userRep} reputation to do that!`;
        return ret;
    }
    return ret;
}

module.exports.config ={
    name:'+rep',
    desc:'Adds rep to given member.',
    permissions:'111111',
    parameters:[{name:'member',type:'member',optional:false}],
    flags:{}
}