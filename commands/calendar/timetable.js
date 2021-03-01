const discord = require('discord.js');
module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const guild = msg.guild;
    const now = new Date();
    const guildsConfig = bot.modules.get('guilds-config');
    const timetable = guildsConfig.getGuildConfigKey(guild.id, 'timetable');
    const todayTimetable = timetable[now.getDay() - 1] || [];
    const embed = new discord.MessageEmbed();
    embed.setTitle('Today\'s timetable');
    embed.setTimestamp(now);
    embed.setColor('#dde000');
    embed.setDescription('All today\'s lessons.');
    if(Flags.isSet('e')) {
        await this.edit(guild, msg, bot);
        return ret;
    }
    todayTimetable.forEach(lesson=>{
        const time = lesson.time;
        const ts = time.split('-');

        const cHour = now.getHours();
        const cMinute = now.getMinutes();
        const cDate = new Date();
        cDate.setHours(cHour);
        cDate.setMinutes(cMinute);

        const startingTime = ts[0].split(':');
        const startingHour = parseInt(startingTime[0]);
        const startingMinute = parseInt(startingTime[1]);
        const startingDate = new Date();
        startingDate.setHours(startingHour);
        startingDate.setMinutes(startingMinute);


        const endingTime = ts[1].split(':');
        const endingHour = parseInt(endingTime[0]);
        const endingMinute = parseInt(endingTime[1]);
        const endingDate = new Date();
        endingDate.setHours(endingHour);
        endingDate.setMinutes(endingMinute);

        if(cDate > startingDate && cDate < endingDate) {
            const diffMs = endingDate - cDate;
            // const diffDays = Math.floor(diffMs / 86400000); // days
            const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            embed.addField('*' + lesson.time, lesson.name + `\n ${diffHrs} Hours and ${diffMins} minutes to end.`);

        }
        else{
            embed.addField(lesson.time, lesson.name);
        }
    });
    msg.reply(embed);
    return ret;
};
this.displayLessons = (embed, lessons, message) => {
    embed.fields = [];
    lessons.forEach(lesson => {
        embed.addField(lesson.time, lesson.name);
    });
    message.edit(embed);
};
this.edit = async (guild, msg, bot) => {
    const guildsConfig = bot.modules.get('guilds-config');
    const timetable = guildsConfig.getGuildConfigKey(guild.id, 'timetable');
    const embed = new discord.MessageEmbed();
    const emojis = ['⬅️', '⬇️', '⬆️', '➡️'];
    msg.reply(embed).then(async (message)=>{
        const lessonIndex = 0;
        const lessons = timetable[lessonIndex];
        await Promise.all(emojis.forEach(async reaction => {
            await message.react(reaction);
        }));
        this.displayLessons(embed, lessons, message);
    });

};
module.exports.config = {
    name:'timetable',
    desc:'Displays the timetable.',
    permissions:'111111',
    parameters:[],
    flags:{ e:{ type:'boolean' } },
};