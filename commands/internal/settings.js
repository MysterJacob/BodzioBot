const discord = require('discord.js');
module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const guild = msg.guild;
    const guildsConfig = bot.modules.get('guilds-config');
    if(!Parameters.isSet('parameter')) {
        const guildConfig = guildsConfig.getGuildConfig(guild.id);
        const infoEmbed = new discord.MessageEmbed();
        infoEmbed.setTitle(`${guild.name} settings.`);
        infoEmbed.setColor('#3bd999');
        infoEmbed.setDescription('Displayed server config.');
        infoEmbed.setTimestamp(new Date());
        infoEmbed.setThumbnail(guild.iconURL());
        // Prefix
        infoEmbed.addField('Prefix', guildConfig.prefix);
        // Channels
        const guildChannels = guildConfig.channels;
        const fetchedChannels = guild.channels;
        const meetingChannel = guildChannels.meetingLinks != '' ? fetchedChannels.cache.get(guildChannels.meetingLinks) : 'not set';
        const channels = `Meting links: ${meetingChannel}`;
        infoEmbed.addField('Channels', channels);
        // Roles
        const guildRoles = guildConfig.roles;
        const fetchedRoles = await guild.roles.fetch();
        const moderatorRole = guildRoles.moderator != '' ? fetchedRoles.cache.get(guildRoles.moderator) : 'not set';
        const roles = `Moderator:${moderatorRole}`;
        infoEmbed.addField('Roles', roles);

        msg.reply(infoEmbed);
    }
    return ret;
};
module.exports.config = {
    name:'settings',
    desc:'Used to set, get, reset guild config/settings',
    permissions:'001011',
    parameters:[{ name:'parameter', type:'string', optional:true }],
    flags:{},
};