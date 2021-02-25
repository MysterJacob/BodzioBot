const fs = require('fs');
const PATH_TO_GUILDS_CONFIG = './guild_configs/';
module.exports.createGuildConfig = (GuildID)=>{
    const path = PATH_TO_GUILDS_CONFIG + GuildID + '.json';
    if(!fs.existsSync(path)) {
        const template = fs.readFileSync(PATH_TO_GUILDS_CONFIG + 'template.json');
        fs.writeFileSync(path, template);
    }
};
module.exports.getGuildConfig = (GuildID)=>{
    const path = PATH_TO_GUILDS_CONFIG + GuildID + '.json';
    if(fs.existsSync(path)) {
        const config = JSON.parse(fs.readFileSync(path));
        return config;
    }
    else{
        this.createGuildConfig(GuildID);
        return {};
    }
};
module.exports.getGuildConfigKey = (GuildID, Key)=>{
    const path = PATH_TO_GUILDS_CONFIG + GuildID + '.json';
    if(fs.existsSync(path)) {
        const configValue = JSON.parse(fs.readFileSync(path))[Key];
        return configValue;
    }
    else{
        this.createGuildConfig(GuildID);
        return this.getGuildConfigKey(GuildID, Key);
    }
};
module.exports.setGuildConfigKey = (GuildID, key, value)=>{
    const path = PATH_TO_GUILDS_CONFIG + GuildID + '.json';
    const config = this.getGuildConfig(GuildID);
    config[key] = value;
    fs.writeFileSync(path, JSON.stringify(config));
};

module.exports.config = {
    name:'guilds-config',
};