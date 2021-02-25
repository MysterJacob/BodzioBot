const discord = require('discord.js');
module.exports.run = async (msg,Flags,Parameters,bot,ret)=>{
    const guild = msg.guild;
    const now = new Date();
    const guildsConfig = bot.modules.get('guilds-config');
    const timetable =guildsConfig.getGuildConfigKey(guild.id,"timetable");
    const todayTimetable = timetable[now.getDay()];
    const embed = new discord.MessageEmbed();
    embed.setTitle('Today\'s timetable');
    embed.setTimestamp(now);
    embed.setColor('#dde000');
    embed.setDescription('All today\'s lessons.');
    todayTimetable.forEach(lesson=>{
        embed.addField(lesson.time,lesson.name);
    });
    msg.reply(embed);
    return ret;
}
module.exports.config ={
    name:'timetable',
    desc:'Displays the timetable.',
    permissions:'111111',
    parameters:[],
    flags:{}
}