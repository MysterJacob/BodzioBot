const myArgs = process.argv.slice(2);
const debug = myArgs.includes('-debug');
// Modules
const discord = require('discord.js');
const fs = require('fs');
const logger = require('./bot_modules/logger')(__filename);
// botClient
const intents = new discord.Intents(discord.Intents.NON_PRIVILEGED);
intents.add('GUILD_MEMBERS');
const botClient = new discord.Client({ ws: { intents: intents } });
// Config.json
const config = JSON.parse(fs.readFileSync('./config.json'));
botClient.config = config;
// Load modules
function loadModules() {
    botClient.modules = new discord.Collection();
    const PATH_TO_MODULES = './bot_modules/';
    fs.readdir(PATH_TO_MODULES, (err, files)=>{
        if(err) {
            logger.error(err);
        }
        else{
            files.forEach(file=>{
                const filename = file.split('.')[0];
                const module = require(PATH_TO_MODULES + filename);
                const modulename = module.config.name;
                logger.print('Loading module ' + modulename);
                botClient.modules.set(modulename, module);
                logger.print('Loaded module ' + modulename);
            });
        }
    });
}

// Load commands
function loadCommands() {
    botClient.commands = new discord.Collection();
    botClient.categories = new discord.Collection();
    const PATH_TO_COMMANDS = './commands/';
    fs.readdir(PATH_TO_COMMANDS, (err, files)=>{
        if(err) {
            logger.error(err);
        }
        else{
            files.forEach(category=>{
                const pathtocategory = PATH_TO_COMMANDS + category + '/';
                const descryption = fs.readFileSync(pathtocategory + 'description.txt');
                botClient.categories.set(category, descryption);
                fs.readdir(pathtocategory, (err, commands)=>{
                    if(err) {
                        logger.error(err);
                    }
                    else{
                        commands.forEach(file=>{
                            const filename = file.split('.')[0];
                            if(filename != 'description') {
                                const module = require(pathtocategory + filename);
                                const modulename = module.config.name;
                                module.config.category = category;
                                botClient.commands.set(modulename, module);
                            }
                        });
                    }
                });
            });
        }
    });
}

loadModules();
loadCommands();

// On ready
botClient.on('ready', async ()=>{
    // Bot events

    logger.print('Bot is up and running');
    botClient.modules.forEach(module=>{
        if(module.init != undefined) {
            logger.print('Initialized module ' + module.config.name);
            module.init(botClient);
        }
    });
    if(debug) {
        logger.print('Bot isrunning in debug mode! All prefix are fixed to *');
    }
    const calendarEvents = botClient.modules.get('calendar-events');
    const allGuilds = await botClient.guilds.cache;
    allGuilds.forEach(guild=>{
        calendarEvents.registerLiveEventForGuild(guild.id, botClient);
    });
});

// On message
botClient.on('message', async msg=>{
    if(msg.channel == 'bango') {
        msg.reply('Bango');
    }
    if(msg.channel.type == 'dm' || msg.author.bot) {return;}
    const content = msg.content;
    const guild = msg.guild;
    const channel = msg.channel;
    const author = msg.author;
    const member = msg.member;
    const userPermissions = botClient.modules.get('user-permissions');
    const guildConfigs = botClient.modules.get('guilds-config');
    const guildPrefix = debug ? '*' : guildConfigs.getGuildConfigKey(guild.id, 'prefix');
    const guildChannels = guildConfigs.getGuildConfigKey(guild.id, 'channels');
    const deleteCommands = guildConfigs.getGuildConfigKey(guild.id, 'deleteCommands') == true;
    const showNoPermissions = guildConfigs.getGuildConfigKey(guild.id, 'hideNoPermissionss') == false;
    const showUnknownCommand = guildConfigs.getGuildConfigKey(guild.id, 'hideUnknownCommand') == false;
    // If pinged
    if(msg.mentions.members.some(m=>m.user.id == botClient.user.id)) {
        msg.reply(`You stupid, my prefix is \`\`${guildPrefix}\`\` here.`);
    }


    // cLinks
    if(channel.id == guildChannels.meetingLinks) {
        botClient.modules.get('clinks-veryfier').checkLink(msg);
    }


    if(content.startsWith(guildPrefix)) {
        logger.print(content);
        const withoutprefix = content.slice(guildPrefix.length);
        const splited = withoutprefix.split(' ');
        const commandName = splited[0];

        logger.print(`${author.tag} requested executing command ${commandName}`);
        const command = botClient.commands.get(commandName);
        if(command == undefined) {
            if(showUnknownCommand) {
                msg.reply(`No command named \`\`${commandName}\`\``);
            }
            logger.print(`${author.tag} failed to execute command ${commandName}`);
        }
        else{
            logger.print(`Parsing command ${commandName} requested by ${author.tag} `);
            const commandParser = botClient.modules.get('command-parser');
            const commandConfig = command.config;
            const parsed = await commandParser.parse(commandConfig.parameters, commandConfig.flags, withoutprefix, guild);
            const args = parsed.args;
            // {flags:{array:{}},parameters:{array:{}},error:{code:0,message:'',index:-1}}
            const error = parsed.error;

            if(error.code != 0) {
                logger.print(`Parsing error with command ${commandName} requested by ${author.tag}`);
                logger.print(`Error code ${error.code}:${error.message}`);
                const errorEmbed = new discord.MessageEmbed();
                errorEmbed.setTitle('Parser error');
                errorEmbed.setTimestamp(new Date());
                errorEmbed.setColor('#ff5b0f');
                errorEmbed.setDescription('Error occurred while parsing your command:\n\r ' +
                error.message);
                errorEmbed.setAuthor(botClient.user.tag);
                errorEmbed.setThumbnail('https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png');
                errorEmbed.setURL('https://github.com/MysterJacob/BodzioBot/blob/main/BASICS.md');
                const problematicArgumet = args[error.index] || '   ';
                let pointer = '';
                for(let i = 1;i < content.indexOf(problematicArgumet);i++) {
                    pointer += '- ';
                }
                for(let i = 0;i < problematicArgumet.length;i++) {
                    pointer += '^';
                }
                errorEmbed.addField(msg.content, pointer);
                channel.send(errorEmbed);
            }
            else{
                logger.print(`Parsing success with command ${commandName} requested by ${author.tag}, checking perms...`);

                const commandPermissions = command.config.permissions;
                const userperms = userPermissions.getPermissions(member, guild, botClient);
                logger.print(`${author.tag} perms ${parseInt(userperms, 2)}, needed ${parseInt(commandPermissions, 2)}`);
                if(userPermissions.matchPerms(userperms, commandPermissions)) {
                    logger.print(`Command ${commandName} run, requested by ${author.tag} `);
                    const initialRet = { exitCode:0, message:'' };
                    try{
                        const ret = await command.run(msg, parsed.flags, parsed.parameters, botClient, initialRet);
                        if(ret.exitCode != 0) {
                            const errorEmbed = new discord.MessageEmbed();
                            errorEmbed.setTitle('Execution error');
                            errorEmbed.setTimestamp(new Date());
                            errorEmbed.setColor('#ff5b0f');
                            errorEmbed.setDescription(`Error ocurred while executing your command:\n ${commandName}`);
                            errorEmbed.addField(`Error code:${ret.exitCode}`, ret.message);
                            errorEmbed.setThumbnail('https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png');
                            errorEmbed.setAuthor(botClient.user.tag);
                            channel.send(errorEmbed);
                        }
                        if(deleteCommands) {
                            msg.delete();
                        }
                    }
                    catch(e) {
                        const errorEmbed = new discord.MessageEmbed();
                        errorEmbed.setTitle('Internal error');
                        errorEmbed.setTimestamp(new Date());
                        errorEmbed.setColor('#ff5b0f');
                        errorEmbed.setDescription(`Error ocurred while executing your command:${commandName}\n \`\`It's probably due to error in bot modules or command,\nnot your fault.\`\``);
                        errorEmbed.setThumbnail('https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png');
                        errorEmbed.setAuthor(botClient.user.tag);
                        errorEmbed.addField(e.name, e.message);
                        channel.send(errorEmbed);
                        logger.error(e);
                    }

                }
                else if(showNoPermissions) {
                    logger.print(`Command ${commandName} not run, user ${author.tag} doesn't have permissions!`);
                    msg.reply('You have no valid permissions to do that!');
                }
                // Execute the command!
            }
        }
    }
});

// Login
logger.print('Starting bot....');
botClient.login(config.bot.token);

