const discord = require('discord.js');
module.exports.run = (msg, Flags, Parameters, bot, ret)=>{
    let member = Parameters.get('member');
    if(!Parameters.isSet('member')) {
        member = msg.member;
    }
    const userReputation = bot.modules.get('user-reputation');
    const embed = new discord.MessageEmbed();
    embed.setColor('#6e0265') ;
    embed.setAuthor(`Reputation of user ${member.user.tag.toString()}`);
    embed.setTimestamp(new Date());
    embed.setTitle(userReputation.getUserReputation(member.id, bot));
    msg.reply(embed);
    return ret;
};

module.exports.config = {
    name:'rep',
    desc:'Displays rp of member.',
    permissions:'111111',
    parameters:[{ name:'member', type:'member', optional:true }],
    flags:{},
};