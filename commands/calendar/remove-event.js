module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const calendarEvents = bot.modules.get('calendar-events');
    const eventID = Parameters.get('ID');
    const guild = msg.guild;
    if(calendarEvents.removeEvent(eventID, guild.id, bot)) {
        msg.reply(`Removed event with id ${eventID}`);
    }
    else{
        ret.exitCode = 1;
        ret.message = `Couldn't find event with id ${eventID}`;
    }
    return ret;
};
module.exports.config = {
    name:'delevent',
    desc:'Used to remove events',
    permissions:'011010',
    parameters:[{ name:'ID', type:'string', optional:false }],
    flags:{},
};