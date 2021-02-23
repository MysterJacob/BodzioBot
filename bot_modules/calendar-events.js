module.exports.getAllTasks=(GuildID,bot)=>{
    const guildConfig = bot.modules.get('guilds-config');
    const calenderEvents = guildConfig.getGuildConfigKey(GuildID,'calendar')['tasks'];
    return calenderEvents;
}

module.exports.config ={
    name:'calendar-events'
}