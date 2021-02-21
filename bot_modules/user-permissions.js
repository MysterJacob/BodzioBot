const logger = require("./logger");

module.exports.getPermissions = (Member,guild,bot)=>{
    let perms = '1';
    const guildsConfig = bot.modules.get('guilds-config');
    const guildRoles = guildsConfig.getGuildConfigKey(guild.id,'roles');
    const moderator = guildRoles.moderator;
    
    //Moderator
    perms += Member.roles.cache.has(moderator) ? '1' : '0';
    //Admin of guild 
    perms += Member.hasPermission('ADMINISTRATOR') ? '1' : '0';
    //Admin of bot FIX
    perms += (bot.config.bot.AdminsIDs.includes(Member.user.id)) ? '1' : '0';
    //Owner of guild
    perms += (guild.ownerID == Member.id) ? '1' : '0';
    //Owner of bot
    perms += (Member.user.id == '330768055468818435') ? '1' : '0';
    return perms;
}
module.exports.matchPerms = (perms1,perms2)=>{
    for(let i =0;i<perms1.length;i++){
        if(perms1.charAt(i) == perms2.charAt(i)){
            return true;
        }
    }
    return false;
}
module.exports.config ={
    name:'user-permissions'
}