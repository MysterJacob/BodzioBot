const discord = require('discord.js');
module.exports.run = (msg, Flags, Parameters, bot, ret)=>{
    const userReputation = bot.modules.get('user-reputation');
    // Time out
    const target = Parameters.get('member');
    const giver = msg.member;
    const userData = bot.modules.get('users-data');
    const now = new Date();
    if(target.id == giver.id) {
        ret.exitCode = Math.round(Math.random() * 1000) ;
        ret.message = Math.round(Math.random() * 1000) == 0 ? 'Dont you try again.' : 'You can\'t give reputation to yourself';
        return ret;
    }
    const lris = userData.getUserConfigKey(giver.id, 'lastReputationInteraction');
    const lastReputationInteraction = lris != '' ? Date.parse(lris) : 100000000000;
    // Stack overflow (STOLEN CODE HERE)
    const diffMs = now.getTime() - lastReputationInteraction;
    const diffMins = Math.abs(Math.round(((diffMs % 86400000) % 3600000) / 60000)); // minutes

    if(diffMins < 30) {
        const embed = new discord.MessageEmbed();
        embed.setAuthor('You need to wait more time');
        const remainingTime = `00:${(30 - diffMins) >= 10 ? (30 - diffMins) : '0' + (30 - diffMins)}`;
        embed.setTitle(remainingTime);
        embed.setDescription('You need to wait 30 minutes between interactions.');
        embed.setColor('#8ef77e');
        embed.setTimestamp(new Date());
        msg.reply(embed);
        return ret;
    }
    userData.setUserConfigKey(giver.id, 'lastReputationInteraction', now.toString());
    // Rep use

    const newRep = userReputation.reduceReputation(target.id, giver.id, bot);
    msg.reply(`User ${target} has ${newRep} reputation now.`);
    return ret;
};

module.exports.config = {
    name:'-rep',
    desc:'Reduce rep from given member.',
    permissions:'111111',
    parameters:[{ name:'member', type:'member', optional:false }],
    flags:{},
};