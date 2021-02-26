const discord = require('discord.js');
// const logger = require('../../bot_modules/logger')(__filename);
module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    let member = Parameters.get('member');
    if(!Parameters.isSet('member')) {
        member = msg.member;
    }
    // const userData = bot.modules.get('users-data');
    const guild = msg.guild;
    const userPermissions = bot.modules.get('user-permissions');
    const embed = new discord.MessageEmbed();

    embed.setAuthor(bot.user.tag);
    embed.setThumbnail('https://static.thenounproject.com/png/1923543-200.png');
    embed.setColor('#18f08f');
    embed.setTimestamp(new Date());
    embed.setDescription(`Permissions of user ${member.user.tag}`);
    const userPerms = userPermissions.getPermissions(member, guild, bot);

    const perms =
    `[${(userPerms.charAt(0) == 1) ? ':white_check_mark:' : ':x:' }] Normal user \n\r` +
    `[${(userPerms.charAt(1) == 1) ? ':white_check_mark:' : ':x:' }] Guild Moderator \n\r` +
    `[${(userPerms.charAt(2) == 1) ? ':white_check_mark:' : ':x:' }] Guild Administrator \n\r` +
    `[${(userPerms.charAt(3) == 1) ? ':white_check_mark:' : ':x:' }] Bot Administrator \n\r` +
    `[${(userPerms.charAt(4) == 1) ? ':white_check_mark:' : ':x:' }] Guild Owner \n\r` +
    `[${(userPerms.charAt(5) == 1) ? ':white_check_mark:' : ':x:' }] Bot Owner \n\r`;
    embed.addField(`${member.user.tag} has permissons level of ${parseInt(userPerms, 2)}`, perms);

    msg.channel.send(embed);
    return ret;
};

module.exports.config = {
    name:'perm',
    desc:'Used to check users permissions',
    permissions:'111111',
    parameters:[{ name:'member', type:'member', optional:true }],
    flags:{},
};