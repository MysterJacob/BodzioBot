const discord = require('discord.js');
module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const calendarEmbed = new discord.MessageEmbed();
    calendarEmbed.setTitle('All nearest events');
    calendarEmbed.setTimestamp(new Date());
    calendarEmbed.setThumbnail('');
    calendarEmbed.setColor('FF6633');
    {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const formatedDate = `${day >= 10 ? day : '0' + day}/${month >= 10 ? month : '0' + month}/${date.getFullYear()}`;
        calendarEmbed.setDescription(`Today:${formatedDate}`);
    }
    const calendarEvents = bot.modules.get('calendar-events');
    let events = calendarEvents.getAllEvents(msg.guild.id, bot);
    events = events.concat(calendarEvents.getAllTasks(msg.guild.id, bot));
    const unsortedFields = [];
    events.forEach(event=>{
        const id = Flags.isSet('i') ? `ID:${event.id}` : '';
        const date = new Date(Date.parse(event.date));
        const name = event.name;
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const formatedDate = `${day >= 10 ? day : '0' + day}/${month >= 10 ? month : '0' + month}/${date.getFullYear()}`;
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formatedTime = `${hours >= 10 ? hours : '0' + hours}:${minutes >= 10 ? minutes : '0' + minutes}`;
        if(unsortedFields.some(field=>field.name == formatedDate)) {
            const fieldIndex = unsortedFields.indexOf(unsortedFields.find(field=>field.name == formatedDate));
            unsortedFields[fieldIndex].value += `\n ${formatedTime}-${name} ${id}`;
        }
        else{
            const field = { name:formatedDate, value:`${formatedTime}-${name} ${id}` };
            unsortedFields.push(field);
        }
    });
    const sortedFields = [];
    // Copy array with our refrence
    const buffer = unsortedFields.slice();
    for(let i = 0;i < unsortedFields.length ;i++) {
        let latestIndex = 0;
        let lastBias = 0;
        for(let j = 0;j < buffer.length;j++) {
            const date = buffer[j].name;
            const splited = date.split('/');
            const day = splited[0];
            const month = splited[1];
            const year = splited[2];
            const bias = parseInt(year + month + day);
            if(bias <= lastBias) {
                latestIndex = j;
                lastBias = bias;
            }
        }
        sortedFields.push(buffer[latestIndex]);
        buffer.splice(latestIndex, 1);
    }
    calendarEmbed.addFields(sortedFields);
    if(calendarEmbed.fields.length == 0) {
        calendarEmbed.setDescription('No events!');
    }
    msg.reply(calendarEmbed);
    return ret;
};
module.exports.config = {
    name:'calendar',
    desc:'Used to show all events',
    permissions:'111111',
    parameters:[],
    flags:{ i:{ 'type':'boolean' } },
};