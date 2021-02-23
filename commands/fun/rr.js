const discord = require('discord.js');
let userPlaying = [];
module.exports.run = async (msg,Flags,Parameters,bot,ret)=>{

    if(userPlaying.includes(msg.author.id)){
        ret.exitCode = 1;
        ret.message = "You can play once at the time.";
        return ret;
    }

    userPlaying.push(msg.author.id);

    const optionsColors = {':skull:':'#ff0000',':arrow_down_small:':'#8f004c',':up:':'#fff200',':blue_square:':'#00ccff'}
    const options = [':skull:',':arrow_down_small:',':up:',':blue_square:']
    let bar = [':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:'];
    for(let i =0;i<bar.length;i++){
        const randomIndex = Math.round(Math.random() * (options.length-1));
        bar[i]=options[randomIndex];
    }
    const embed = new discord.MessageEmbed();
    //Template
    const template = 
    ':blue_square::blue_square::blue_square::blue_square::arrow_double_down::blue_square::blue_square::blue_square::blue_square:\n'+
    '<RANDOM>\n'+
    ':blue_square::blue_square::blue_square::blue_square::arrow_double_up::blue_square::blue_square::blue_square::blue_square:'
   
    //Initial
    embed.setAuthor(msg.author.tag);
    embed.setColor('#05ff86');
    embed.setTimestamp(new Date());
    embed.setDescription(template.replace('<RANDOM>',bar.join('')));
    let iterations = Math.round(Math.random() * (3))+10;

    msg.channel.send(embed).then(m=>{
        var timerID = setInterval(()=>{
            //Animate
            iterations--;
            bar = bar.splice(1);
            const randomIndex = Math.round(Math.random() * (options.length-1));
            bar.push(options[randomIndex]);
            embed.setDescription(template.replace('<RANDOM>',bar.join('')));
            embed.setColor(optionsColors[bar[4]]);
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
                    case options[3]:
                        embed.setDescription(`Nothing happened ${options[3]}`);
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