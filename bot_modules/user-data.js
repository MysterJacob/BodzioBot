const fs = require('fs');
const PATH_TO_USERS_DATA = './user_data/'
module.exports.createUserConfig= (UserID)=>{
    const path = PATH_TO_USERS_DATA+UserID+'.json';
    if(!fs.existsSync(path)){
        const template = fs.readFileSync(PATH_TO_USERS_DATA+'template.json');
        fs.writeFileSync(path,template);
    }
}
module.exports.getUserConfig= (UserID)=>{
    const path = PATH_TO_USERS_DATA+UserID+'.json';
    if(fs.existsSync(path)){
        const config = JSON.parse(fs.readFileSync(path));
        return config
    }else{
        this.createUserConfig(UserID)
        return {};
    }
}
module.exports.getUserConfigKey = (UserID,Key)=>{
    const path = PATH_TO_USERS_DATA+UserID+'.json';
    if(fs.existsSync(path)){
        const configValue = JSON.parse(fs.readFileSync(path))[Key];
        return configValue;
    }else{
        this.createUserConfig(UserID);
        return this.getUserConfigKey(UserID,Key);
    }
}
module.exports.setUserConfigKey=(UserID,key,value)=>{
    const path = PATH_TO_USERS_DATA+UserID+'.json';
    var config =this.getUserConfig(UserID);
    config[key] = value;
    fs.writeFileSync(path,JSON.stringify(config));
}

module.exports.config ={
    name:'users-data'
}