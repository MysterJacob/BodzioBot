const discord = require('discord.js');
module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const calendarEmbed = new discord.MessageEmbed();
    calendarEmbed.setTitle('All nearest events');
    calendarEmbed.setTimestamp(new Date());
    calendarEmbed.setThumbnail('');
    calendarEmbed.setColor('FF6633');
    const calendarEvents = bot.modules.get('calendar-events');
    const events = calendarEvents.getAllEvents(msg.guild.id, bot);
    const fields = [];
    events.forEach(event=>{
        const id = Flags.isSet('i') ? `ID:${event.id}` : '';
        const date = new Date(Date.parse(event.date));
        const name = event.name;
        const formatedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formatedTime = `${hours >= 10 ? hours : '0' + hours}:${minutes >= 10 ? minutes : '0' + minutes}`;
        if(fields.some(field=>field.name == formatedDate)) {
            const fieldIndex = fields.indexOf(fields.find(field=>field.name == formatedDate));
            fields[fieldIndex].value += `\n ${formatedTime}-${name} ${id}`;
        }
        else{
            const field = { name:formatedDate, value:`${formatedTime}-${name} ${id}` };
            fields.push(field);
        }
    });
    calendarEmbed.addFields(fields);
    if(calendarEmbed.fields.length == 0) {
        calendarEmbed.setDescription('No events!');
    }
    msg.reply(calendarEmbed);
    return ret;
};
module.exports.config = {
    name:'calendar',
    desc:'Used to show all events',
    permissions:'000001',
    parameters:[],
    flags:{ i:{ 'type':'boolean' } },
};