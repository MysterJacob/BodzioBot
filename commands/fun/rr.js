const discord = require('discord.js');
module.exports.run = (msg,Flags,Parameters,bot,ret)=>{

    const options = [':skull:',':arrow_down_small:',':up:']
    let bar = [':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:',':blue_square:'];
    const embed = new discord.MessageEmbed();
    const template = 
    ':blue_square::blue_square::blue_square::blue_square::arrow_double_down::blue_square::blue_square::blue_square::blue_square:\n'+
    '<RANDOM>\n'+
    ':blue_square::blue_square::blue_square::blue_square::arrow_double_up::blue_square::blue_square::blue_square::blue_square:'
    embed.setAuthor(bot.user.tag);
    embed.setColor('#05ff86');
    embed.setTimestamp(new Date());
    embed.setDescription(template.replace('<RANDOM>',bar.join('')));
    msg.channel.send(embed).then(m=>{
        var timer = setInterval(()=>{
            bar = bar.splice(1);
            const randomIndex = Math.round(Math.random() * (options.length-1));
            bar.push(options[randomIndex]);
            embed.setDescription(template.replace('<RANDOM>',bar.join('')));
            m.edit(embed);
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