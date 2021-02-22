const discord = require('discord.js');
module.exports.run = (msg,Flags,Parameters,bot,ret)=>{
    const embed = new discord.MessageEmbed();
    embed.setAuthor(bot.user.tag);
    embed.setColor('#0345fc');
    embed.setThumbnail('https://img.icons8.com/ios/452/help.png');
    embed.setTimestamp(new Date());
    if(!Parameters.isSet('category')){
        const categ = bot.categories;
        const embed = new discord.MessageEmbed();
        embed.setDescription('Command category list for bot.');
        embed.setFooter('To list all comands in category type help and category name')
        embed.setTitle('Category list');
        categ.keyArray().forEach(c=>{
            embed.addField(c,categ.get(c).toString())
        });
        msg.channel.send(embed);
    }else{      
        const category = Parameters.get('category');
        const commands = bot.commands;
        embed.setDescription('Command list for bot.');
        embed.setTitle(`Command list in category ${category}`);
        commands.keyArray().forEach(c=>{
            const commandName = c;
            const command = commands.get(c);
            if(command.config.category == category.toString()){
                embed.addField(commandName,command.config.desc)
            }
        });
        msg.channel.send(embed);
    }
    return ret;
}

module.exports.config ={
    name:'help',
    desc:'Displays help',
    permissions:'111111',
    parameters:[{name:'category',type:'string',optional:true}],
    flags:{}
}