const discord = require('discord.js');
module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const calendarEvents = bot.modules.get('calendar-events');
    const date = Parameters.get('date');
    const name = Parameters.get('name');
    const guild = msg.guild;
    if(Parameters.isSet('hour')) {
        const dateHour = Parameters.get('hour');
        date.setHours(dateHour.getHours());
        date.setMinutes(dateHour.setHours());
    }
    const taskID = calendarEvents.addEvent(name, date, guild.id, bot);
    msg.reply(`Created event with name \`\`${name}\`\` on ${date.toString()}, with id:${taskID}`);
    return ret;
};
module.exports.config = {
    name:'addevent',
    desc:'Used to register events',
    permissions:'000001',
    parameters:[{ name:'name', type:'string', optional:false }, { name:'date', type:'date', optional:false }, { name:'hour', type:'hour', optional:true }],
    flags:{},
};