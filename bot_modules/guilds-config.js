const fs = require('fs');
const PATH_TO_GUILDS_CONFIG = "./guild_configs/"
module.exports.createGuildConfig= (GuildID)=>{
    const path = PATH_TO_GUILDS_CONFIG+GuildID+".json";
    if(!fs.existsSync(path)){
        fs.writeFileSync(path,"{}");
    }
}
module.exports.getGuildConfig= (GuildID)=>{
    const path = PATH_TO_GUILDS_CONFIG+GuildID+".json";
    if(fs.existsSync(path)){
        const config = JSON.parse(fs.readFileSync(path));
        return config
    }else{
        this.createGuildConfig(GuildID)
        return {};
    }
}
module.exports.getGuildConfig= (GuildID,value)=>{
    const path = PATH_TO_GUILDS_CONFIG+GuildID+".json";
    if(fs.existsSync(path)){
        const configValue = JSON.parse(fs.readFileSync(path))[value];
        return configValue;
    }else{
        this.createGuildConfig(GuildID);
        return undefined;
    }
}
module.exports.setGuildConfigKey=(GuildID,key,value)=>{
    const path = PATH_TO_GUILDS_CONFIG+GuildID+".json";
    var config =this.getGuildConfig(GuildID);
    config[key] = value;
    fs.writeFileSync(path,JSON.stringify(config));
}

module.exports.config ={
    name:"guilds-config"
}