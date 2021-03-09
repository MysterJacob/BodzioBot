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
        // Remove Commands
        const deleteCommands = guildConfig.deleteCommands;
        infoEmbed.addField('Delete Commands', deleteCommands ? ':white_check_mark:' : ':x:', true);
        // Announce Unknown Command
        const announceUnknownCommand = guildConfig.hideUnknownCommand == false;
        infoEmbed.addField('Announce Unknown Command', announceUnknownCommand ? ':white_check_mark:' : ':x:', true);
        // Announce No Permissions
        const hideNoPermissionss = guildConfig.hideNoPermissionss == false;
        infoEmbed.addField('Announce No Permissions', hideNoPermissionss ? ':white_check_mark:' : ':x:', true);
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
        case 'delete-commands':
            let deleteCommands = guildConfig['deleteCommands'] == true;
            if(value) {
                if(value == 'on' || value == 'off') {
                    deleteCommands = value == 'on';
                    guildsConfig.setGuildConfigKey(guild.id, 'deleteCommands', deleteCommands);
                    msg.reply(`Changed delete-commands from \`\`${deleteCommands}\`\` to \`\`${value == 'on'}\`\``);
                }
                else{
                    msg.reply('Type ``on`` to enable and ``off`` to disable');
                }
            }
            else{
                msg.reply(`The ${parameter} for this guild is \`\`${deleteCommands}\`\``);
            }
            break;
        case 'announce-unknown-command':
            let announceUnknownCommand = guildConfig['hideUnknownCommand'] == false;
            if(value) {
                if(value == 'on' || value == 'off') {
                    announceUnknownCommand = value == 'off';
                    guildsConfig.setGuildConfigKey(guild.id, 'hideUnknownCommand', announceUnknownCommand);
                    msg.reply(`Changed announce-unknown-command from \`\`${announceUnknownCommand}\`\` to \`\`${value == 'on'}\`\``);
                }
                else{
                    msg.reply('Type ``on`` to enable and ``off`` to disable');
                }
            }
            else{
                msg.reply(`The ${parameter} for this guild is \`\`${announceUnknownCommand}\`\``);
            }
            break;
        case 'announce-no-permissions':
            let announceNoPermissions = guildConfig['hideNoPermissionss'] == false;
            if(value) {
                if(value == 'on' || value == 'off') {
                    announceNoPermissions = value == 'off';
                    guildsConfig.setGuildConfigKey(guild.id, 'hideUnknownCommand', announceNoPermissions);
                    msg.reply(`Changed announce-no-permissions from \`\`${announceNoPermissions}\`\` to \`\`${value == 'on'}\`\``);
                }
                else{
                    msg.reply('Type ``on`` to enable and ``off`` to disable');
                }
            }
            else{
                msg.reply(`The ${parameter} for this guild is \`\`${announceNoPermissions}\`\``);
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
            infoEmbed.addField('announce-unknown-command', 'boolean');
            infoEmbed.addField('announce-no-permissions', 'boolean');
            infoEmbed.addField('delete-commands', 'boolean');
            msg.reply(infoEmbed);
            break;
        }
    }
    return ret;
};
module.exports.config = {
    name:'settings',
    desc:'Used to set, get, reset guild config/settings',
    permissions:'001011',
    parameters:[{ name:'parameter', type:'string', optional:true }, { name:'value', type:'string', optional:true }],
    flags:{},
};