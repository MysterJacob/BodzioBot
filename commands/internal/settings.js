const discord = require('discord.js');
module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const guild = msg.guild;
    const guildsConfig = bot.modules.get('guilds-config');
    const guildConfig = guildsConfig.getGuildConfig(guild.id);
    if(!Parameters.isSet('parameter')) {
        const infoEmbed = new discord.MessageEmbed();
        infoEmbed.setTitle(`${guild.name} settings.`);
        infoEmbed.setColor('#3bd999');
        infoEmbed.setDescription('Displayed server config. \n To change type ``settings [PARAMETER] [VALUE]``');
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
        const roles = `Moderator: ${moderatorRole}`;
        infoEmbed.addField('Roles', roles);

        msg.reply(infoEmbed);
    }
    else{
        const parameter = Parameters.get('parameter').toLowerCase();
        const value = Parameters.get('value');
        switch(parameter) {
        case 'prefix':
            const prefix = guildConfig['prefix'];
            if(value) {
                guildsConfig.setGuildConfigKey(guild.id, 'prefix', value);
                msg.reply(`Changed prefix from \`\`${prefix}\`\` to \`\`${value}\`\``);
            }
            else{
                msg.reply(`The ${parameter} for this guild is \`\`${prefix}\`\``);
            }
            break;
        case 'moderator-role':
            const roles = guildConfig.roles;
            if(value) {
                const parser = bot.modules.get('command-parser');
                const parserOutput = await parser.parseArgument('role', value, guild);
                if(parserOutput.error.code != 0) {
                    ret.exitCode = 1;
                    ret.message = `Parser error: ${parserOutput.error.code}:${parserOutput.error.message}`;
                    return ret;
                }
                const newRole = parserOutput.output;
                const fetchedRoles = await guild.roles.fetch();
                const oldModeratorRole = roles.moderator != '' ? fetchedRoles.cache.get(roles.moderator).name : 'not set';
                msg.reply(`Changed moderator-role from \`\`${oldModeratorRole}\`\` to \`\`${newRole.name}\`\``);
                roles.moderator = newRole.id;
                guildsConfig.setGuildConfigKey(guild.id, 'roles', roles);
            }
            else{
                const fetchedRoles = await guild.roles.fetch();
                const oldModeratorRole = roles.moderator != '' ? fetchedRoles.cache.get(roles.moderator).name : 'not set';
                msg.reply(`The ${parameter} for this guild is \`\`${oldModeratorRole}\`\``);
            }
            break;
        case 'clinks-channel':
            const channels = guildConfig.channels;
            if(value) {
                const parser = bot.modules.get('command-parser');
                const parserOutput = await parser.parseArgument('channel', value, guild);
                if(parserOutput.error.code != 0) {
                    ret.exitCode = 1;
                    ret.message = `Parser error: ${parserOutput.error.code}:${parserOutput.error.message}`;
                    return ret;
                }
                const newChannel = parserOutput.output;
                channels.meetingLinks = newChannel.id;
                guildsConfig.setGuildConfigKey(guild.id, 'channels', channels);
                const OldCLinksChannel = channels.meetingLinks != '' ? guild.channels.cache.get(channels.meetingLinks) : 'none';
                msg.reply(`Changed clinks-channel from ${OldCLinksChannel} to ${newChannel.toString()}`);
            }
            else{
                const OldCLinksChannel = channels.meetingLinks != '' ? guild.channels.cache.get(channels.meetingLinks) : 'none';
                msg.reply(`The ${parameter} for this guild is \`\`${OldCLinksChannel}`);
            }
            break;
        default:
            const infoEmbed = new discord.MessageEmbed();
            infoEmbed.setTitle(`No parameter named ${parameter}`);
            infoEmbed.setTimestamp(new Date());
            infoEmbed.setDescription('Possible parameters:');
            infoEmbed.addField('prefix', 'string');
            infoEmbed.addField('moderator-role', 'role');
            infoEmbed.addField('clinks-channel', 'channel');
            msg.reply(infoEmbed);
            break;
        }
    }
    return ret;
};
module.exports.config = {
    name:'settings',
    desc:'Used to set, get, reset guild config/settings',
    permissions:'101011',
    parameters:[{ name:'parameter', type:'string', optional:true }, { name:'value', type:'string', optional:true }],
    flags:{},
};