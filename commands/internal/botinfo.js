const discord = require('discord.js');
module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const infoEmbed = new discord.MessageEmbed();
    infoEmbed.setTitle('Info');
    infoEmbed.setColor('#00ccff');
    infoEmbed.setURL('https://github.com/MysterJacob/BodzioBot/blob/main/README.md');
    infoEmbed.setDescription('Informacje i kod:\nhttps://github.com/MysterJacob/BodzioBot');
    infoEmbed.setThumbnail(bot.user.avatarURL());
    infoEmbed.addField('Author', 'Myster#7218', true);
    infoEmbed.addField('Data publikacji', '26.02.2021 20:00');
    infoEmbed.addField('Wersja discord.js', discord.version);
    infoEmbed.setTimestamp(new Date());
    msg.reply(infoEmbed);
    return ret;
};

module.exports.config = {
    name:'info',
    desc:'Get info about the bot.',
    permissions:'111111',
    parameters:[],
    flags:{},
};