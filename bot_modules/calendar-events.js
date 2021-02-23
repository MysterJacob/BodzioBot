module.exports.setTask=(name,date,subtasks,GuildID,bot)=>{
    const guildConfig = bot.modules.get('guilds-config');
    const task = {name:name,date:date.toString(),subtasks:subtasks,id:(new Date().getTime())};
    allTasks = this.getAllTasks(GuildID,bot);
    allTasks.push(task);
    let calendar = guildConfig.getGuildConfigKey(GuildID,'calendar');
    calendar.tasks = allTasks;
    guildConfig.setGuildConfigKey(GuildID,'calendar',calendar);
    return task.id;
}


module.exports.getAllTasks=(GuildID,bot)=>{
    const guildConfig = bot.modules.get('guilds-config');
    const calenderTasks = guildConfig.getGuildConfigKey(GuildID,'calendar')['tasks'];
    return calenderTasks;
}
module.exports.getAllTasksForUser=(GuildID,bot,UserID)=>{
    const guildConfig = bot.modules.get('guilds-config');
    const calenderTasks = guildConfig.getGuildConfigKey(GuildID,'calendar')['tasks'];
    let tasksForUser = calenderTasks.filter(t=>t.subtasks.some(st=>st.assigned.includes(UserID)));
    tasksForUser.forEach(efu=>{
        efu.subtasks = efu.subtasks.filter(sb=>sb.assigned.includes(UserID))
    })
    return tasksForUser;
}
module.exports.config ={
    name:'calendar-events'
}