//Modules 
const discord = require("discord.js")
const fs = require("fs")
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
            files.forEach(async file=>{
                
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

//Bot events
//On ready
botClient.on("ready",()=>{
    logger.print("Bot is up and running")
    loadModules()
})


//Login
logger.print("Starting bot....")
botClient.login(config.bot.token)

