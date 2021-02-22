const discord = require('discord.js');
let userPlaying = [];
module.exports.run = (msg,Flags,Parameters,bot,ret)=>{

    if(msg.author.id in userPlaying){
        ret.exitCode = 1;
        ret.message = "You can play once at the time.";
        return ret;
    }

    userPlaying.push(msg.author.id);


    const options = [':skull:',':arrow_down_small:',':up:']
    let bar = [':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:'];
    const embed = new discord.MessageEmbed();
    //Template
    const template = 
    ':blue_square::blue_square::blue_square::blue_square::arrow_double_down::blue_square::blue_square::blue_square::blue_square:\n'+
    '<RANDOM>\n'+
    ':blue_square::blue_square::blue_square::blue_square::arrow_double_up::blue_square::blue_square::blue_square::blue_square:'
   
    //Initial
    embed.setAuthor(bot.user.tag);
    embed.setColor('#05ff86');
    embed.setTimestamp(new Date());
    embed.setDescription(template.replace('<RANDOM>',bar.join('')));
    let iterations = Math.round(Math.random() * (8))+2;

    msg.channel.send(embed).then(m=>{
        var timerID = setInterval(()=>{
            //Animate
            iterations--;
            bar = bar.splice(1);
            const randomIndex = Math.round(Math.random() * (options.length-1));
            bar.push(options[randomIndex]);
            embed.setDescription(template.replace('<RANDOM>',bar.join('')));
            m.edit(embed);
            //End
            if(iterations <=0){
                clearInterval(timerID);
                userPlaying = userPlaying.splice(msg.author.id);
                const finish = bar[4];
                switch(finish){
                    case options[0]:
                        embed.setDescription(`You are dead :) ${options[0]}`);
                        break;
                    case options[1]:
                        embed.setDescription(`Down grade for you ${options[1]}`);
                        break;
                    case options[2]:
                        embed.setDescription(`Upgrade time ${options[2]}`);
                        break;
                }
                m.edit(embed);
            }
        },2000)
    })
    
    return ret;
}

module.exports.config ={
    name:'rr',
    desc:'Playing game of chanse.',
    permissions:'111111',
    parameters:[],
    flags:{}
}