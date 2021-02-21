const logger = require("../bot_modules/logger")(__filename);
module.exports.parseArgument = async (type,Input,guild)=>{
    let parsed = {output:"",error:{code:0,message:""}}
    switch(type.toLowerCase()){
        case "string":
            parsed.output = Input.toString();
            break;
        case "number":
            let numb = Input;
            try{
                numb = parseInt(numb);
            }catch(E){
                parsed.error.code = 1;
                parsed.error.message = "Argument isn't type of int";
            }
            parsed.output = numb;
            break;
        case "member":
                Input = Input.toString();
                logger.print(Input);
                if(Input.length == 18){
                    //By id
                    try{
                        const member = await guild.members.fetch({Input, force: true });
                        parsed.output = member;
                    }catch(e){
                        parsed.error.code = 2;
                        parsed.error.message = "Couldn't find member!";
                    }
                }else if(Input.startsWith("<@")){
                    //By ping
                    try{
                        const userID = Input.slice(3,17);
                        const member = await guild.members.fetch({userID, force: true });
                        parsed.output = member;
                    }catch(e){
                        parsed.error.code = 2;
                        parsed.error.message = "Couldn't find member!";
                    }
                    
                }else{
                    //By name 
                    const member = guild.members.cache.find(m=>m.tag == Input || m.username == Input || m.discriminator == Input);
                    if(member != undefined){
                        parsed.output = user;
                    }else{
                        parsed.error.code = 2;
                        parsed.error.message = "Couldn't find member!";
                    }
                }
            break;
        case "time":
            if(Input.includes(":")){
                const splited = Input.split(":");
                const hours = splited[0];
                const minutes = splited[1];
                if(hours > 23){
                    parsed.error.code = 4;
                    parsed.error.message = "Too much hours!";
                }
                if(minutes > 59){
                    parsed.error.code = 5;
                    parsed.error.message = "Too much minutes!";
                }
                if(splited.length >= 3){
                    const seconds = splited[2];
                    if(seconds > 59){
                        parsed.error.code = 6;
                        parsed.error.message = "Too much seconds!";
                    }
                    parsed.output = {hours:hours,minute:minutes,seconds:seconds}
                }else{
                    parsed.output = {hours:hours,minute:minutes}
                }
                
            }else{
                parsed.error.code = 3;
                parsed.error.message = "Wrong hour format!";
            }
            break;

    }
    return parsed;
}
module.exports.parse = async (aParameters,aFlags,Input,guild)=>{
    logger.print(`Parsing input ${Input}`);
    var parsed = new Object(
    {flags:{array:{},
    //Functions
    isSet:(name)=>{return (name in parsed.flags.array);}
    ,get:(name)=>{return parsed.flags.array.get(name);
    }},parameters:{array:{},
    isSet:(name)=>{name in parsed.parameters.array},
    get:(name)=>{}
    },error:{code:0,message:"",index:-1}});
    let parameterIndex =0;
    for(let i =0;i<Input.length;i++){
        const arg = Input[i];
        //Flag or parameter
        if(arg.startsWith("/") || arg.startsWith("-")){
            //Flag
            const flagName = arg.slice(1);
            if(flagName in aFlags){
                const aFlag = aFlags[flagName];
                if(aFlag.type == "boolean"){
                    parsed.flags.array[flagName] = true;
                }else{
                    if(Input.length >= i +1){
                        i++;
                        const parsedData = this.parseArgument(aFlag.type,Input[i],guild);
                        if(parsedData.error.code != 0){
                            parsed.error.code = 5;
                            parsed.error.message = `Flag \`\`${flagName}\`\` not typeof \`\`${aFlag.type}\`\``;
                            parsed.error.index = i; 
                            return parsed;
                        }
                        const value = parsed.output;
                        parsed.flags.array[flagName] = value;
                    }else{
                        parsed.error.code = 2;
                        parsed.error.message = `No value specified to flag \`\`${flagName}\`\``;
                        parsed.error.index = i;
                        return parsed;
                    }
                }
            }else{
                parsed.error.code = 1;
                parsed.error.message = `Undefined flag \`\`${flagName}\`\``;
                parsed.error.index = i;
                return parsed;
            }
        }else{
            //Parameter
            
            if(aParameters.length <= parameterIndex){
                parsed.error.code = 6;
                parsed.error.message = `Undefined parameter \`\`${arg}\`\``;
                parsed.error.index = i;
            }else{
                const param = aParameters[parameterIndex];
                const parsedData = await this.parseArgument(param.type,arg,guild);
                if(parsedData.error.code != 0){
                    parsed.error.code = 5;
                    parsed.error.message = `Parameter \`\`${param.name}\`\` not typeof \`\`${param.type}\`\``;
                    parsed.error.index = i; 
                }
                parsed.parameters.array[param.name] = parsedData.output;
                parameterIndex++;
            }
            
        }
    }
    for(let i =parameterIndex;i<aParameters.length;i++){
        const param = aParameters[i];
        if(param.optional == false){
            parsed.error.code = 8;
            parsed.error.message = `Parameter \`\`${param.name}\`\` was not provided!`;
            parsed.error.index = parameterIndex;
            return parsed;
        }
    }
    return parsed
}
module.exports.config ={
    name:"command-parser"
}