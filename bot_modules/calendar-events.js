module.exports.registerLiveEventForGuild=(guildID,bot)=>{
    setInterval(()=>{
        const now = new Date();
        const tasks = this.getAllTasks(guildID,bot);
        
        tasks.forEach(task=>{
            const msToDeadLine = Date.parse(task.date) - now.getTime() ;
            console.log(timeToDeadline.toString());
            const days = msToDeadLine / (1000*60*60*24);
            const hours = (msToDeadLine - days*(1000*60*60*24))/(1000*60*60);
            const minutes = (msToDeadLine - hours*(1000*60*60))/(1000*60);
            const seconds = (msToDeadLine - minutes*(1000*60))/(1000);
            if(msToDeadLine <= 0){
                this.removeTask(task.id,guildID,bot);
            }
        })
        
    },59*1000)
}
module.exports.setTask=(name,date,subtasks,GuildID,bot)=>{
    //Get all
    const guildsConfig = bot.modules.get('guilds-config');
    const calendar = guildsConfig.getGuildConfigKey(GuildID,'calendar');
    const task = {name:name,date:date.toString(),subtasks:subtasks,id:(new Date().getTime())};
    //Add task
    allTasks = this.getAllTasks(GuildID,bot);
    allTasks.push(task);
    //Set tast
    calendar.tasks = allTasks;
    //Save task
    guildsConfig.setGuildConfigKey(GuildID,'calendar',calendar);
    return task.id;
}
module.exports.removeTask = (taskID,GuildID,bot)=>{
    const guildsConfig = bot.modules.get('guilds-config');
    let calendar = guildsConfig.getGuildConfigKey(GuildID,'calendar');
    const taskIndex = calendar.tasks.indexOf(calendar.tasks.find(task=>task.id == taskID));
    calendar.tasks = calendar.tasks.splice(taskIndex);
    guildsConfig.setGuildConfigKey(GuildID,'calendar',calendar);
}
module.exports.updateTask=(name,date,subtasks,GuildID,bot,TaskID)=>{
    //Get all
    const guildsConfig = bot.modules.get('guilds-config');
    const task = {name:name,date:date.toString(),subtasks:subtasks,id:TaskID};
    const calendar = guildsConfig.getGuildConfigKey(GuildID,'calendar');
    let allTasks = this.getAllTasks(GuildID,bot);
    const index = allTasks.indexOf(allTasks.find(t=>t.id == TaskID));
    //Change task
    allTasks[index]=task
    calendar.tasks = allTasks;
    //Save task
    guildsConfig.setGuildConfigKey(GuildID,'calendar',calendar);
}
module.exports.setAssignedMembers=(guildID,taskID,subtaskID,bot,IDs)=>{ 
    //Get task
    const allTasks = this.getAllTasks(guildID,bot);
    const targetTask = allTasks.find(t=>t.id == taskID);
    //Set members
    targetTask.subtasks[0]["assigned"] = IDs;
    //Save
    this.updateTask(targetTask.name,targetTask.date,targetTask.subtasks,guildID,bot,taskID);
}
module.exports.getAllTasks=(GuildID,bot)=>{
    //Get all
    const guildsConfig = bot.modules.get('guilds-config');
    const calenderTasks = guildsConfig.getGuildConfigKey(GuildID,'calendar')['tasks'];
    return calenderTasks;
}
module.exports.getAllTasksForUser=(GuildID,bot,UserID)=>{
    //Get all
    const guildsConfig = bot.modules.get('guilds-config');
    //Filter only for user
    const calenderTasks = guildsConfig.getGuildConfigKey(GuildID,'calendar')['tasks'];
    let tasksForUser = calenderTasks.filter(task=>task.subtasks.some(subtask=>subtask.assigned.includes(UserID)));
    tasksForUser.forEach(efu=>{
        efu.subtasks = efu.subtasks.filter(sb=>sb.assigned.includes(UserID))
    });
    //Return
    return tasksForUser;
}
module.exports.config ={
    name:'calendar-events'
}