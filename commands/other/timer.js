const discord = require('discord.js');
let usersWithTimers = []
module.exports.run = (msg,Flags,Parameters,bot,ret)=>{
    const authorID = msg.author.id;
    
    if(usersWithTimers.includes(authorID)){
        ret.exitCode = 1;
        ret.message = "You can have only one timer at the moment.";
        return ret;
    }
    usersWithTimers.push(authorID);
    const embed = new discord.MessageEmbed();
    const time = Parameters.get('time');

    let hours = time.hours;
    let minutes = time.minutes;
    let seconds = time.seconds;

    embed.setColor(``);
    embed.setDescription(`:clock1: requested by ${msg.author.tag}`);
    embed.setTimestamp(new Date());
    if(Flags.isSet('n')){
        embed.setAuthor(Flags.get('n'));
    }

    const timeString = 'Timer:clock1: is preparing...';
    embed.setTitle(timeString);
    msg.channel.send(embed).then(m=>{
        var timerID=  setInterval(()=>{
            seconds -= 5;
            if(seconds < 0){
                minutes -= 1;
                seconds= 59
            }
            if(minutes < 0){
                hours -= 1;
                minutes= 59
            }
            if(hours <= 0 && minutes <= 0 && seconds <= 0){
                
                clearInterval(timerID);
                usersWithTimers = usersWithTimers.splice(msg.author.id);
                msg.channel.send(msg.author.toString());
                embed.setTitle("Your timer has finished!");
                msg.channel.send(embed);
                m.delete();
               
            }else{
                const timeString = `${(hours >= 10 ? hours : "0"+hours)}:${(minutes >= 10 ? minutes : "0"+minutes)}:${(seconds >= 10 ? seconds : "0"+seconds)}`;
                embed.setTitle(timeString);
                m.edit(embed);
            }
           
        },5000);    
    });
    return ret;
}

module.exports.config ={
    name:'timer',
    permissions:'111111',
    parameters:[{name:'time',type:'time',optional:false}],
    flags:{'n':{'type':'string'}}
}