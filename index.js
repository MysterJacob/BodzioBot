//Modules 
const discord = require("discord.js")
const fs = require("fs");
const { log } = require("util");
const logger = require("./bot_modules/logger")(__filename);
//botClient
const intents = new discord.Intents(discord.Intents.NON_PRIVILEGED);
intents.add('GUILD_MEMBERS');
const botClient = new discord.Client({ ws: {intents: intents} })
//Config.json
const config = JSON.parse(fs.readFileSync("./config.json"))

//Load modules
function loadModules(){
    botClient.modules = new discord.Collection()
    const PATH_TO_MODULES = "./bot_modules/"
    fs.readdir(PATH_TO_MODULES,(err,files)=>{
        if(err){
            logger.error(err);
        }else{
            files.forEach(file=>{              
                const filename = file.split(".")[0];
                const module = require(PATH_TO_MODULES+filename);
                const modulename = module.config.name;
                logger.print("Loading module "+modulename);
                botClient.modules.set(modulename,module);
                logger.print("Loaded module "+modulename);
            })
        }
    })
}
//Load commands
function loadCommands(){
    botClient.commands = new discord.Collection();
    const PATH_TO_COMMANDS = "./commands/";
    fs.readdir(PATH_TO_COMMANDS,(err,files)=>{
        if(err){
            logger.error(err);
        }else{
            files.forEach(category=>{
                const pathtocategory = PATH_TO_COMMANDS + category+"/"
                fs.readdir(pathtocategory,(err,commands)=>{
                    if(err){
                        logger.error(err);
                    }else{
                        commands.forEach(file=>{
                            const filename = file.split(".")[0];
                            const module = require(pathtocategory+filename);
                            const modulename = module.config.name;
                            module.category = category;
                            botClient.commands.set(modulename,module);
                        })
                    }
                })
            });
        }
    })
}

//Bot events
loadModules();
loadCommands();
//On ready
botClient.on("ready", ()=>{
    logger.print("Bot is up and running")
    
})
//On message
botClient.on("message",msg=>{
    const content = msg.content;
    const guild = msg.guild;
    const author = msg.author;
    const guildConfigs = botClient.modules.get("guilds-config");
    const guildPrefix = guildConfigs.getGuildConfigKey(guild.id,"prefix");
    if(content.startsWith(guildPrefix)){
        const commandName = content.slice(guildPrefix.length);
        logger.print(`${author.tag} requested executing command ${commandName}`);
        const command = botClient.commands.get(commandName);
        if(command == undefined){
            msg.reply(`Brak komendy o nazwie \`\`${commandName}\`\``);
            logger.print(`${author.tag} failed to execute command ${commandName}`);
        }else{
            logger.print(`Parsing command ${commandName} requested by ${author.tag} `);
            const commandParser = botClient.modules.get("command-parser");
        }
    }
})

//Login
logger.print("Starting bot....")
botClient.login(config.bot.token)

