module.exports.registerLiveEventForGuild = (guildID, bot)=>{
    setInterval(()=>{
        const now = new Date();
        const tasks = this.getAllTasks(guildID, bot);
        const events = this.getAllEvents(guildID, bot);
        tasks.forEach(task=>{
            const msToDeadLine = Date.parse(task.date) - now.getTime() ;
            // Remove task
            if(msToDeadLine <= 0) {
                this.removeTask(task.id, guildID, bot);
            }
        });
        events.forEach(event=>{
            const msToDeadLine = Date.parse(event.date) - now.getTime() ;
            // Remove task
            if(msToDeadLine <= 0) {
                this.removeEvent(event.id, guildID, bot);
            }
        });

    }, 59 * 1000);
};
module.exports.getAllEvents = (guildID, bot)=>{
    const guildsConfig = bot.modules.get('guilds-config');
    const calenderEvents = guildsConfig.getGuildConfigKey(guildID, 'calendar')['events'];
    return calenderEvents;
};
module.exports.addEvent = (name, date, guildID, bot)=>{
    // Get all
    const guildsConfig = bot.modules.get('guilds-config');
    const calendar = guildsConfig.getGuildConfigKey(guildID, 'calendar');
    const event = { name:name, date:date.toString(), id:(new Date().getTime()) };
    // Add task
    const allEvents = this.getAllEvents(guildID, bot);
    allEvents.push(event);
    // Set tast
    calendar.events = allEvents;
    // Save task
    guildsConfig.setGuildConfigKey(guildID, 'calendar', calendar);
    return event.id;
};
module.exports.removeEvent = (eventID, guildID, bot)=>{
    const guildsConfig = bot.modules.get('guilds-config');
    const calendar = guildsConfig.getGuildConfigKey(guildID, 'calendar');
    const eventIndex = calendar.events.indexOf(calendar.events.find(event=>event.id == eventID));
    calendar.events.splice(eventIndex, 1);
    // calendar.tasks.splice(taskIndex);
    guildsConfig.setGuildConfigKey(guildID, 'calendar', calendar);
    return eventIndex != -1;
};

module.exports.setTask = (name, date, subtasks, GuildID, bot)=>{
    // Get all
    const guildsConfig = bot.modules.get('guilds-config');
    const calendar = guildsConfig.getGuildConfigKey(GuildID, 'calendar');
    const task = { name:name, date:date.toString(), subtasks:subtasks, id:(new Date().getTime()) };
    // Add task
    const allTasks = this.getAllTasks(GuildID, bot);
    allTasks.push(task);
    // Set tast
    calendar.tasks = allTasks;
    // Save task
    guildsConfig.setGuildConfigKey(GuildID, 'calendar', calendar);
    return task.id;
};
module.exports.removeTask = (taskID, GuildID, bot)=>{
    const guildsConfig = bot.modules.get('guilds-config');
    const calendar = guildsConfig.getGuildConfigKey(GuildID, 'calendar');
    const taskIndex = calendar.tasks.indexOf(calendar.tasks.find(task=>task.id == taskID));
    calendar.tasks.splice(taskIndex, 1);
    // calendar.tasks.splice(taskIndex);
    guildsConfig.setGuildConfigKey(GuildID, 'calendar', calendar);
    return taskIndex != -1;
};
module.exports.updateTask = (name, date, subtasks, TaskID, GuildID, bot)=>{
    // Get all
    const guildsConfig = bot.modules.get('guilds-config');
    const task = { name:name, date:date.toString(), subtasks:subtasks, id:TaskID };
    const calendar = guildsConfig.getGuildConfigKey(GuildID, 'calendar');
    const allTasks = this.getAllTasks(GuildID, bot);
    const index = allTasks.indexOf(allTasks.find(t=>t.id == TaskID));
    // Change task
    allTasks[index] = task;
    calendar.tasks = allTasks;
    // Save task
    guildsConfig.setGuildConfigKey(GuildID, 'calendar', calendar);
};
module.exports.setAssignedMembers = (guildID, taskID, subtaskID, IDs, bot)=>{
    // Get task
    const allTasks = this.getAllTasks(guildID, bot);
    const targetTask = allTasks.find(t=>t.id == taskID);
    // Set members
    targetTask.subtasks[subtaskID]['assigned'] = IDs;
    // Save
    this.updateTask(targetTask.name, targetTask.date, targetTask.subtasks, taskID, guildID, bot);
};
module.exports.setDoneMembers = (guildID, taskID, subtaskID, IDs, bot)=>{
    // Get task
    const allTasks = this.getAllTasks(guildID, bot);
    const targetTask = allTasks.find(t=>t.id == taskID);
    // Set members
    targetTask.subtasks[subtaskID]['done'] = IDs;
    // Save
    this.updateTask(targetTask.name, targetTask.date, targetTask.subtasks, taskID, guildID, bot);
};


module.exports.getAllTasks = (GuildID, bot)=>{
    // Get all
    const guildsConfig = bot.modules.get('guilds-config');
    const calenderTasks = guildsConfig.getGuildConfigKey(GuildID, 'calendar')['tasks'];
    return calenderTasks;
};
module.exports.getAllTasksForUser = (GuildID, bot, UserID)=>{
    // Get all
    const guildsConfig = bot.modules.get('guilds-config');
    // Filter only for user
    const calenderTasks = guildsConfig.getGuildConfigKey(GuildID, 'calendar')['tasks'];
    const tasksForUser = calenderTasks.filter(task=>task.subtasks.some(subtask=>subtask.assigned.includes(UserID)));
    tasksForUser.forEach(efu=>{
        efu.subtasks = efu.subtasks.filter(sb=>sb.assigned.includes(UserID));
    });
    // Return
    return tasksForUser;
};
module.exports.config = {
    name:'calendar-events',
};