const discord = require('discord.js');
module.exports.run = async(msg,Flags,Parameters,bot,ret)=>{
    const calendarEvents = bot.modules.get('calendar-events');
    const author = msg.author;
    const guild = msg.guild;
    let date =Parameters.get('date');
    date.setHours(0,0,0);
    const taskName = Parameters.get('name');

    const embed = new discord.MessageEmbed();
    embed.setColor('#ffc800')
    embed.setTitle('Task list');
    embed.setAuthor(taskName);
    embed.setTimestamp(new Date());
    embed.setDescription(`Termin:${date.toString()}`);

    if(Parameters.isSet('hour')){
        const hour = Parameters.get('hour');
        date.setHours(hour.getHours(),hour.getMinutes(),0);
    }

    //{"name":"","date":"","subtasks":[{"name":"","assigned":[]},{"name":"","assigned":[]}]},
    let subtasks = []
    msg.channel.send(embed).then(em=>{
        msg.reply('Now simply send the sub-task names, type ``END`` to stop.');

        const filter = m => m.author.id ==author.id;
        const collector = msg.channel.createMessageCollector(filter, { time: 15000 });
    
        collector.on('collect', m => {
            const content = m.content
            if(content.toLowerCase() == 'end'){
                taskID = calendarEvents.setTask(taskName,date,subtasks,guild.id,bot);
                embed.setDescription(`Termin:${date.toString()}\n TaskID:${taskID}`);
                em.edit(embed);
                msg.reply('DONE');
            }else{ 
                const prefix = (embed.fields.length+1).toString()+'.'
                const taskName = m.content;     
                const task = {name:prefix+taskName,assigned:[]};
               
                embed.addField(prefix,taskName);
                em.edit(embed);
                subtasks.push(task);
            } 
            m.delete();
        });
    });
    
    return ret;
}
module.exports.config ={
    name:'createtask',
    desc:'Used to create task',
    permissions:'111111',
    parameters:[{name:'name',type:'string',optional:false},{name:'date',type:'date',optional:false},{name:'hour',type:'hour',optional:true}],
    flags:{}
}