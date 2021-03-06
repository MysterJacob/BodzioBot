const logger = require('../bot_modules/logger')(__filename);
module.exports.parseArgument = async (type, Input, guild)=>{
    const parsed = { output:'', error:{ code:0, message:'' } };
    Input = Input.toString();
    switch(type.toLowerCase()) {
    case 'string':
        parsed.output = Input.toString();
        break;
    case 'number':
        let numb = Input;
        try{
            numb = parseInt(numb);
        }
        catch(E) {
            parsed.error.code = 1;
            parsed.error.message = 'Argument isn\'t type of int';
        }
        parsed.output = numb;
        break;
    case 'member':
        if(Input.match('^[0-9]{18}') != null) {
            // By id
            try{
                const member = await guild.members.fetch(Input);
                parsed.output = member;
            }
            catch(e) {
                parsed.error.code = 2;
                parsed.error.message = 'Couldn\'t find member by!';
            }
        }
        else if(Input.startsWith('<@')) {
            // By ping
            try{
                const userID = Input.slice(3, 21);
                const member = await guild.members.fetch(userID);
                parsed.output = member;
            }
            catch(e) {
                parsed.error.code = 2;
                parsed.error.message = 'Couldn\'t find member by mention!';
            }

        }
        else{
            // By name
            const members = await guild.members.fetch();
            const member = members.find(m=>m.nickname == Input || m.user.tag == Input || m.user.username == Input || m.user.discriminator == Input);
            if(member != undefined) {
                parsed.output = member;
            }
            else{
                parsed.error.code = 2;
                parsed.error.message = 'Couldn\'t find member by Nickname,tag,username or discriminator!';
            }
        }
        break;
    case 'role':
        if(Input.match('^[0-9]{18}') != null) {
            const role = await guild.roles.fetch(Input);
            if(role != undefined) {
                parsed.output = role;
            }
            else{
                parsed.error.code = 8;
                parsed.error.message = 'Couldn\'t find role by ID!';
            }
        }
        else if(Input.startsWith('<@&')) {
            const roleID = Input.slice(3, 21);
            // console.log(roleID);
            const roles = await guild.roles.fetch();
            const role = roles.cache.find(m=>m.id == roleID);
            if(role != undefined) {
                parsed.output = role;
            }
            else{
                parsed.error.code = 8;
                parsed.error.message = 'Couldn\'t find role by mention!';
            }
        }
        else {
            const roles = await guild.roles.fetch();
            const role = roles.cache.find(m=>m.name == Input);
            if(role != undefined) {
                parsed.output = role;
            }
            else{
                parsed.error.code = 8;
                parsed.error.message = 'Couldn\'t find role by name!';
            }
        }
        break;
    case 'channel':
        if(Input.match('^[0-9]{18}') != null) {
            const channel = await guild.channels.cache.find(ch=>ch.id == Input);
            if(channel != undefined) {
                parsed.output = channel;
            }
            else{
                parsed.error.code = 7;
                parsed.error.message = 'Couldn\'t find channel by ID!';
            }
        }
        else if(Input.startsWith('<#')) {
            const channelID = Input.slice(2, 20);
            // console.log(channelID);
            const channel = await guild.channels.cache.find(ch=>ch.id == channelID);
            if(channel != undefined) {
                parsed.output = channel;
            }
            else{
                parsed.error.code = 7;
                parsed.error.message = 'Couldn\'t find channel by mention!';
            }
        }
        else {
            const channel = await guild.channels.cache.find(ch=>ch.name == Input);
            if(channel != undefined) {
                parsed.output = channel;
            }
            else{
                parsed.error.code = 7;
                parsed.error.message = 'Couldn\'t find channel by name!';
            }
        }
        break;
    case 'date':
        if(Input.match('([0-3][0-9]/[0-1][0-9]/[0-9][0-9][0-9][0-9])')) {
            const splited = Input.split('/');
            const day = parseInt(splited[0]);
            const month = parseInt(splited[1]);
            const year = parseInt(splited[2]);

            const date = new Date();
            date.setHours(0, 0, 0);
            date.setDate(day);
            date.setMonth(month - 1);
            date.setFullYear(year);

            parsed.output = date;

        }
        else if(Input.match('([0-3][0-9].[0-1][0-9].[0-9][0-9][0-9][0-9])')) {
            const splited = Input.split('.');
            const day = parseInt(splited[0]);
            const month = parseInt(splited[1]);
            const year = parseInt(splited[2]);

            const date = new Date();
            date.setHours(0, 0, 0);
            date.setDate(day);
            date.setMonth(month - 1);
            date.setFullYear(year);

            parsed.output = date;
        }
        else{
            parsed.error.code = 5;
            parsed.error.message = 'Wrong date format(dd/mm/yyyy).';
        }
        break;
    case 'hour':
        if(Input.match('([0-2][0-9]:[0-5][0-9])')) {
            const splited = Input.split(':');
            const hours = splited[0];
            const minutes = splited[1];

            if(hours > 23) {
                parsed.error.code = 5;
                parsed.error.message = 'Too much hours!';
            }
            if(hours < 0) {
                parsed.error.code = 4;
                parsed.error.message = 'Not enough hours!';
            }
            if(minutes > 59) {
                parsed.error.code = 5;
                parsed.error.message = 'Too much minutes!';
            }
            if(minutes < 0) {
                parsed.error.code = 4;
                parsed.error.message = 'Not enough minutes!';
            }
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes, 0, 0);
            parsed.output = date;
        }
        else{
            parsed.error.code = 6;
            parsed.error.message = 'Wrong hour format(hh:mm).';
        }
        break;
    case 'time':

        if(Input.includes(':')) {
            const splited = Input.split(':');
            const hours = parseInt(splited[0]);
            const minutes = parseInt(splited[1]);
            let seconds = 0;
            if(hours < 0) {
                parsed.error.code = 4;
                parsed.error.message = 'Not enough hours!';
            }
            if(minutes > 59) {
                parsed.error.code = 5;
                parsed.error.message = 'Too much minutes!';
            }
            if(minutes < 0) {
                parsed.error.code = 4;
                parsed.error.message = 'Not enough minutes!';
            }
            if(splited.length >= 3) {
                seconds = parseInt(splited[2]);
                if(seconds > 59) {
                    parsed.error.code = 6;
                    parsed.error.message = 'Too much seconds!';
                }
                if(seconds < 0) {
                    parsed.error.code = 4;
                    parsed.error.message = 'Not enough seconds!';
                }
            }
            parsed.output = { hours:hours, minutes:minutes, seconds:seconds };
        }
        else{
            parsed.error.code = 3;
            parsed.error.message = 'Wrong hour format!';
        }
        break;

    }
    return parsed;
};
module.exports.parse = async (aParameters, aFlags, args, guild)=>{
    logger.print(`Parsing input ${args}`);


    let Input = [];
    let argBuffer = '';
    let quoteOpen = false;
    let lastChar = '';
    for(let i = 0;i < args.length;i++) {
        const char = args.charAt(i);
        if(char == '"' && lastChar != '\\') {
            quoteOpen = !quoteOpen;
            if(!quoteOpen) {
                Input.push(argBuffer);
                argBuffer = '';
            }
        }
        else if (char == ' ') {
            argBuffer += char;
            if(!quoteOpen) {
                Input.push(argBuffer.replace(' ', ''));
                argBuffer = '';
            }
        }
        else{
            argBuffer += char;
        }
        lastChar = char;
    }
    // In case of error, juts flush
    if(argBuffer != '') {
        Input.push(argBuffer.replace(' ', ''));
        argBuffer = '';
    }

    // Remove command name
    Input = Input.slice(1);
    // Remove only spaces
    Input = Input.filter(i=>i != '' && i != ' ');
    logger.print(`Pre-parsed to ${Input}`);
    const parsed = {
        args:Input,
        flags:{ array:{}, isSet:(name)=>{return (name in parsed.flags.array);}, get:(name)=>{return parsed.flags.array[name];} },
        parameters:{ array:{}, isSet:(name)=>{return (name in parsed.parameters.array);}, get:(name)=>{return parsed.parameters.array[name];} },
        error:{ code:0, message:'', index:-1 } };

    if(quoteOpen) {
        parsed.error.code = 9;
        parsed.error.message = 'The quote (``"``) was not closed.';
        parsed.error.index = 0;
        return parsed;
    }
    let parameterIndex = 0;
    for(let i = 0;i < Input.length;i++) {
        let arg = Input[i];
        // Flag or parameter
        if((arg.startsWith('/') || arg.startsWith('-')) && !arg.startsWith('\\')) {
            // Flag
            const flagName = arg.slice(1).replace(' ', '');
            if(flagName in aFlags) {
                const aFlag = aFlags[flagName];
                if(aFlag.type == 'boolean') {
                    // Boolean
                    parsed.flags.array[flagName] = true;
                }
                else if(Input.length > i + 1) {
                    // Value like
                    i++;
                    const parsedData = await this.parseArgument(aFlag.type, Input[i], guild);

                    if(parsedData.error.code != 0) {
                        parsed.error.code = 5;
                        parsed.error.message = `Flag \`\`${flagName}\`\` not typeof \`\`${aFlag.type}\`\`\nCode ${parsedData.error.code}:${parsedData.error.message} \n`;
                        parsed.error.index = i;
                        return parsed;
                    }
                    parsed.flags.array[flagName] = parsedData.output;
                }
                else{
                    parsed.error.code = 2;
                    parsed.error.message = `No value specified to flag \`\`${flagName}\`\``;
                    parsed.error.index = i;
                    return parsed;
                }
            }
            else{
                parsed.error.code = 1;
                parsed.error.message = `Undefined flag \`\`${flagName}\`\``;
                parsed.error.index = i;
                return parsed;
            }
        }
        // Parameter
        else if(aParameters.length <= parameterIndex) {
            parsed.error.code = 6;
            parsed.error.message = `Undefined parameter \`\`${arg}\`\``;
            parsed.error.index = i;
        }
        else{
            if(arg.startsWith('\\')) {
                arg = arg.slice(1);
            }
            const param = aParameters[parameterIndex];
            const parsedData = await this.parseArgument(param.type, arg, guild);
            if(parsedData.error.code != 0) {
                parsed.error.code = 5;
                parsed.error.message = `Parameter \`\`${param.name}\`\` not typeof \`\`${param.type}\`\`\nCode ${parsedData.error.code}:${parsedData.error.message} \n`;
                parsed.error.index = i;
            }
            parsed.parameters.array[param.name] = parsedData.output;
            parameterIndex++;
        }
    }
    for(let i = parameterIndex;i < aParameters.length;i++) {
        const param = aParameters[i];
        if(param.optional == false) {
            parsed.error.code = 8;
            parsed.error.message = `Parameter \`\`${param.name}\`\` was not provided!`;
            parsed.error.index = parameterIndex;
            return parsed;
        }
    }
    return parsed;
};
module.exports.config = {
    name:'command-parser',
};