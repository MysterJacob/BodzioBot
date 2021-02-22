const discord = require('discord.js');
let usersWithTimers = []
module.exports.run = (msg,Flags,Parameters,bot,ret)=>{
    const authorID = msg.author.id;
    //No more timers.dll
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

    embed.setColor(`#8000ff`);
    embed.setDescription(`:clock1: requested by ${msg.author.tag}`);
    embed.setTimestamp(new Date());
    if(Flags.isSet('n')){
        const name = Flags.get('n')
        embed.setAuthor(name);
        if(name.toLowerCase().includes('bomb')){
            embed.setThumbnail('https://images-na.ssl-images-amazon.com/images/I/61UZ1SeWj6L.jpg')
        }
    }

    const timeString = 'Timer:clock1: is preparing...';
    embed.setTitle(timeString);
    msg.channel.send(embed).then(m=>{

        //Cancel mechanism
        m.react('❌');
        const filter = (reaction, user) => {
            return ['❌'].includes(reaction.emoji.name) && user.id == authorID;
        };

        const collector = m.createReactionCollector(filter, {
            max: 1
        });
        
        //Counting and stuff[Next line is illegal]
        seconds = seconds - (seconds % 5);
        var timerID=  setInterval(()=>{
            seconds -= 5;
            if(seconds < 0){
                minutes -= 1;
                seconds= 60 + seconds;
            }
            if(minutes < 0){
                hours -= 1;
                minutes= 60 + minutes;
            }
            if(hours <= 0 && minutes <= 0 && seconds <= 0 ){
                //End
                clearInterval(timerID);
                usersWithTimers = usersWithTimers.splice(msg.author.id);
                msg.channel.send(msg.author.toString());
                embed.setTitle("Your timer has finished!");
                msg.channel.send(embed);
                m.delete();
               
            }else{
                //Display Time
                const timeString = `${(hours >= 10 ? hours : "0"+hours)}:${(minutes >= 10 ? minutes : "0"+minutes)}:${(seconds >= 10 ? seconds : "0"+seconds)}`;
                embed.setTitle(timeString);
                m.edit(embed);
            }
           
        },5000);  

        //Cancel
        collector.on('end', (collected, reason) => {
            usersWithTimers = usersWithTimers.splice(msg.author.id);
            clearInterval(timerID);
            embed.setTitle("Your timer has been canceled.");
            msg.channel.send(embed);
            m.delete();
        });  
    });
    return ret;
}

module.exports.config ={
    name:'timer',
    desc:'Counts down.',
    permissions:'111111',
    parameters:[{name:'time',type:'time',optional:false}],
    flags:{'n':{'type':'string'}}
}