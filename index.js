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
botClient.config = config;
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
    logger.print(content);
    const guild = msg.guild;
    const channel = msg.channel;
    const author = msg.author;
    const member = msg.member;
    const userPermissions = botClient.modules.get("user-permissions");


    const guildConfigs = botClient.modules.get("guilds-config");
    const guildPrefix = guildConfigs.getGuildConfigKey(guild.id,"prefix");
    if(content.startsWith(guildPrefix)){
        const splited =  content.slice(guildPrefix.length).split(" ");
        const commandName =splited[0];
        const args = splited.slice(1);
        logger.print(`${author.tag} requested executing command ${commandName}`);
        const command = botClient.commands.get(commandName);
        if(command == undefined){
            msg.reply(`Brak komendy o nazwie \`\`${commandName}\`\``);
            logger.print(`${author.tag} failed to execute command ${commandName}`);
        }else{
            logger.print(`Parsing command ${commandName} requested by ${author.tag} `);
            const commandParser = botClient.modules.get("command-parser");
            const commandConfig = command.config
            const parsed = commandParser.parse(commandConfig.parameters,commandConfig.flags,args,guild);
            //{flags:{array:{}},parameters:{array:{}},error:{code:0,message:"",index:-1}}
            const error = parsed.error;

            if(error.code != 0){
                logger.print(`Parsing error with command ${commandName} requested by ${author.tag}`);
                logger.print(`Error code ${error.code}:${error.message}`);
                const errorEmbed = new discord.MessageEmbed();
                errorEmbed.setTitle("Parser error");
                errorEmbed.setTimestamp(new Date());
                errorEmbed.setColor("#ff5b0f");
                errorEmbed.setDescription("Error ocurred while parsing your command:\n\r "+
                error.message);
                const problematicArgumet = args[error.index];
                let pointer = "";
                for(let i=0;i<content.indexOf(problematicArgumet)+1;i++){
                    pointer += "-";
                }
                for(let i=0;i<problematicArgumet.length;i++){
                    pointer += "^";
                }
                errorEmbed.addField(msg.content,pointer);
                channel.send(errorEmbed);
            }else{
                logger.print(`Parsing success with command ${commandName} requested by ${author.tag}, checking perms...`);
                
                const commandPermissions = command.config.permissions
                const userperms = userPermissions.getPermissions(member,guild,botClient)
                logger.print(`${author.tag} perms ${parseInt(userperms,2)}, needed ${parseInt(commandPermissions,2)}`);
                if(userPermissions.matchPerms(userperms,commandPermissions)){
                    logger.print(`Command ${commandName} run, requested by ${author.tag} `);
                    command.run(msg,parsed.flags,parsed.parameters,botClient);
                }else{
                    logger.print(`Command ${commandName} not run, user ${author.tag} doesn't have permissions!`);
                    msg.reply("You have no valid permissions to do that!");
                }
                //Execute the command!
            }
        }
    }
})

//Login
logger.print("Starting bot....")
botClient.login(config.bot.token)

