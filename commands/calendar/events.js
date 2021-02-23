const discord = require('discord.js');
module.exports.run = async (msg,Flags,Parameters,bot,ret)=>{
    const guild = msg.guild;
    const calendarEvents = bot.modules.get('calendar-events');
    const parser = bot.modules.get('command-parser');
    const now = new Date();

    const embed = new discord.MessageEmbed();
    embed.setColor('#4a8dff');
    embed.setTimestamp(now);
    if(Flags.isSet('a')){
        embed.setTitle('All Tasks');
        
        const exercices = calendarEvents.getAllTasks(guild.id,bot);
        await Promise.all(exercices.map(async e=>{
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
            let subTasks = '';

            await Promise.all( e.subtasks.map(async t=>{
                const name = t.name;
                let assigned = 'Assigned:';
                await Promise.all(t.assigned.map(async a=>{
                    const parsedMember = await parser.parseArgument('member',a,guild);

                    assigned+= parsedMember.output.user.tag;
                }));
                subTasks += `${name}\n ${assigned}\n`;
            }));

            const fieldName = `${name}`;
            const fieldValue= `\`\`${formattedDate}\n${formattedTimeToEvent}\`\`\n${subTasks}`;
            embed.addField(fieldName,fieldValue)
        }));
        console.log('sent');
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