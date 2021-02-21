module.exports.getPermissions = (Member,guild,bot)=>{
    let perms = "0";
    const guildsConfig = bot.modules.get("guilds-config");
    const guildRoles = guildsConfig.getGuildConfigKey(guild.id,"roles");
    const moderator = guildRoles.moderator;
    
    //Moderator
    perms += Member.roles.cache.has(moderator) ? "1" : "0";
    //Admin of guild 
    perms += Member.hasPermission("ADMINISTRATOR") ? "1" : "0";
    //Admin of bot
    perms += bot.config.bot.AdminsIDs.includes(Member.user.id) ? "1" : "0";
    //Owner of guild
    perms += (guild.OwnerID == Member.user.id) ? "1" : "0";
    //Owner of bot
    perms += ("330768055468818435" == Member.user.id) ? "1" : "0";
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
    name:"user-permissions"
}