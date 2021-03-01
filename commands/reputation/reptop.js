const discord = require('discord.js');
module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const count = Flags.get('c') || 3;
    const guild = msg.guild;
    const list = bot.modules.get('user-reputation').getRanking(count, guild, bot);
    const embed = new discord.MessageEmbed();
    embed.setTimestamp('Reputation top');
    embed.setThumbnail('https://freesvg.org/img/Chess-Knight.png');
    embed.setTimestamp(new Date());
    embed.setColor('#969e90');
    embed.setDescription(`Reputation top ${count} for this server.`);
    let index = 1;
    list.forEach(rt=>{
        const memberID = rt.id;
        const reputation = rt.reputation;
        const member = guild.members.cache.find(m=>m.id == memberID);
        embed.addField(`${index}.${member.user.tag}`, reputation);
        index++;
    });
    msg.reply(embed);
    return ret;
};

module.exports.config = {
    name:'reptop',
    desc:'Reputation top 3 for this server.',
    permissions:'111111',
    parameters:[],
    flags:{ c:{ type:'number' } },
};