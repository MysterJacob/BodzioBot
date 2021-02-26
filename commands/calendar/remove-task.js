module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const calendarEvents = bot.modules.get('calendar-events');
    const taskID = Parameters.get('taskID');
    if(calendarEvents.removeTask(taskID, msg.guild.id, bot)) {
        msg.reply(`Task with id ${taskID} has been removed.`);
    }
    else{
        ret.exitCode = 1;
        ret.message = `Could not find task with id ${taskID}`;
    }
    return ret;
};
module.exports.config = {
    name:'deltask',
    desc:'Used to remove task',
    permissions:'011111',
    parameters:[{ name:'taskID', type:'string', optional:false }],
    flags:{},
};