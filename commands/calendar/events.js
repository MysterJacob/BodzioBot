const discord = require('discord.js');
module.exports.run = (msg,Flags,Parameters,bot,ret)=>{
    const now = new Date();
    const embed = new discord.MessageEmbed();
    embed.setColor('#4a8dff');
    embed.setTimestamp(now);
    if(Flags.isSet('a')){
        embed.setTitle('All exercices');
        const calendarEvents = bot.modules.get('calendar-events');
        const exercices = calendarEvents.getAllTasks(msg.guild.id,bot);
        exercices.forEach(e=>{
            //overhaul
            const endDate = new Date(Date.parse(e.date));
            const name = e.name;
            const days = parseInt((endDate - now) / (1000 * 60 * 60 * 24));
            const hours = parseInt(Math.abs(endDate - now) / (1000 * 60 * 60) % 24);
            const minutes = parseInt(Math.abs(endDate.getTime() - now.getTime()) / (1000 * 60) % 60);
            const seconds = parseInt(Math.abs(endDate.getTime() - now.getTime()) / (1000) % 60); 
            const daysOfTheWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            const formattedDate = `Date: ${endDate.getFullYear()}/${endDate.getMonth()}/${endDate.getDate()}(${daysOfTheWeek[endDate.getDay()]}) ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`
            const formattedTimeToEvent = `Time left: ${days} days, ${hours} hours, ${minutes} minutes`;
            //Sub-tasks
            const subTasks = '';

            e.subtasks.forEach(t=>{
                const name = t.name;
                const assigned = '';
                t.assigned.forEach(a=>{
                    
                })
            })

            const fieldName = `${name}`;
            const fieldValue= `\`\`${formattedDate}\n${formattedTimeToEvent}\`\``;
            embed.addField(fieldName,fieldValue)
        });
        msg.reply(embed);
    }else{

    }
    return ret;
}
module.exports.config ={
    name:'tasks',
    desc:'Used to list task',
    permissions:'111111',
    parameters:[],
    flags:{'a':{'type':'boolean'}}
}