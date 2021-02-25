const discord = require('discord.js');
module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const calendarEvents = bot.modules.get('calendar-events');
    const author = msg.author;
    const guild = msg.guild;
    const channel = msg.channel;
    const date = Parameters.get('date');
    date.setHours(0, 0, 0);
    const taskName = Parameters.get('name');

    const embed = new discord.MessageEmbed();
    embed.setColor('#ffc800');
    embed.setTitle('Task list');
    embed.setAuthor(taskName);
    embed.setTimestamp(new Date());
    embed.setDescription(`Termin:${date.toString()}`);

    if(Parameters.isSet('hour')) {
        const hour = Parameters.get('hour');
        date.setHours(hour.getHours(), hour.getMinutes(), 0);
    }

    // {"name":"", "date":"", "subtasks":[{"name":"", "assigned":[]}, {"name":"", "assigned":[]}]},
    const subtasks = [];
    msg.channel.send(embed).then(em=>{
        msg.reply('Now simply send the sub-task names,  type ``END`` to stop.');

        const messageFilter = m => m.author.id == author.id;
        const collector = msg.channel.createMessageCollector(messageFilter, { time: 180000 });
        const messageCollector = collector.on('collect', m => {
            const content = m.content;
            // If end
            if(content.toLowerCase() == 'end') {
                messageCollector.stop('FINISH');
                const taskID = calendarEvents.setTask(taskName, date, subtasks, guild.id, bot);
                embed.setDescription(`Termin:${date.toString()}\n TaskID:${ taskID }`);
                em.edit(embed);
                for(let i = 0;i < subtasks.length;i++) {
                    const subtask = subtasks[i];
                    const taskEmbed = new discord.MessageEmbed();
                    taskEmbed.setTitle(subtask.name);
                    taskEmbed.setTimestamp(new Date());
                    taskEmbed.setDescription('Assigned:');

                    channel.send(taskEmbed).then(async me=>{
                        const assigned = [];
                        const done = [];
                        const taskIndex = i;
                        // Await assigment
                        const reactionColletor = (reaction, user) => {
                            return ['✅', '⌛', '❌'].includes(reaction.emoji.name);
                        };
                        const reactionCollector = me.createReactionCollector(reactionColletor, {});
                        collector.on('collect', (reaction, user)=>{
                            // PaxyNN, you know
                            const emoji = reaction._emoji.name;
                            // With out the bot
                            if(user.id != 517422997548564480) {

                                switch(emoji) {
                                case '✅':
                                    if(assigned.some(u=>u.id == user.id) && !done.some(u=>u.id == user.id)) {
                                        done.push(user);
                                    }
                                    break;
                                case '⌛':
                                    if(!assigned.some(u=>u.id == user.id)) {
                                        assigned.push(user);
                                    }
                                    break;

                                case '❌':
                                    if(assigned.some(u=>u.id == user.id)) {
                                        assigned.splice(assigned.indexOf(user), 1);
                                    }
                                    break;
                                }
                            }

                            const assignedIDs = [];
                            const doneIDs = [];
                            assigned.forEach(u=>{
                                assignedIDs.push(u.id);
                            });
                            done.forEach(u=>{
                                doneIDs.push(u.id);
                            });

                            // Assign members
                            calendarEvents.setAssignedMembers(guild.id, taskID, taskIndex, assignedIDs, bot);
                            // Done members
                            calendarEvents.setDoneMembers(guild.id, taskID, taskIndex, doneIDs, bot);
                            taskEmbed.setDescription(`Assigned:${assigned.join()} \n Done:${done.join()}`);
                            me.edit(taskEmbed);
                        });
                        await me.react('⌛');
                        await me.react('❌');
                        await me.react('✅');
                    });
                }
            }
            else{
                // Add subtasks
                const prefix = (embed.fields.length + 1).toString() + '.';
                const subtaskName = m.content;
                const task = { name:prefix + subtaskName, assigned:[], done:[] };

                embed.addField(prefix, subtaskName);
                em.edit(embed);
                subtasks.push(task);
            }
            // Delete messages
            m.delete();
        });
    });

    return ret;
};
module.exports.config = {
    name:'createtask',
    desc:'Used to create task',
    permissions:'111111',
    parameters:[{ name:'name', type:'string', optional:false }, { name:'date', type:'date', optional:false }, { name:'hour', type:'hour', optional:true }],
    flags:{},
};