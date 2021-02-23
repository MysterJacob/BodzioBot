const crypto = require('crypto');
const discord = require('discord.js');
const { copyFileSync } = require('fs');
module.exports.run = (msg,Flags,Parameters,bot,ret)=>{
    let member =Parameters.get('member');
    if(!Parameters.isSet('member')){
        member = msg.member;
    }
    const user = member.user;
    const infoEmbed = new discord.MessageEmbed();
    infoEmbed.setAuthor('INFO CARD');
    infoEmbed.setTitle(member.user.tag);
    infoEmbed.setColor(member.displayHexColor);
    infoEmbed.setTimestamp(new Date());
    const a = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS'
    ]
    //USER

    //User image
    const avatarURL = user.avatarURL();;
    infoEmbed.setURL(avatarURL);
    infoEmbed.setThumbnail(avatarURL);
    //Username
    infoEmbed.addField('Username',user.username,true);
    //discriminator
    infoEmbed.addField('Discriminator',user.discriminator,true);
    //ID
    infoEmbed.addField('ID',user.id,true);
    //Is bot
    infoEmbed.addField('Type',user.bot ? 'BOT' : 'Normal');
    //Created at
    infoEmbed.addField('Created At',user.createdAt.toUTCString(),true)
    //Last message sent
    if(user.lastMessage != null)
        infoEmbed.addField('Last message sent',user.lastMessage.createdAt);
    //Flags
    if(Flags.isSet('f')){
        if(user.flags == null){
            infoEmbed.addField('Flags',"None");
        }else{
            let flags = user.flags.toArray().join(',');
            if(flags == ''){
                flags = 'None';
            }
            infoEmbed.addField('Flags',flags);
        }
        
    }
    
    //Member
    //Display name
    infoEmbed.addField('Display name',member.displayName,true);
    //displayHexColor
    infoEmbed.addField('Display color',member.displayHexColor,true);
    //ID
    infoEmbed.addField('Member ID',member.id);
    //joinedAt
    infoEmbed.addField('Joined At',member.joinedAt);
    //Roles
    infoEmbed.addField('Roles',member.roles.cache.array().join(','));
    //Permissons
    if(Flags.isSet('p')){
        let perms1 = ''
        let perms2 = ''
        const memberPermissions = member.permissions.toArray(false);
        for(let i =0;i<a.length;i++){
            const perm = a[i];
            const value =`${perm}[${(memberPermissions.includes(perm)) ? ':white_check_mark:' : ':x:'}]\n`;
            if(i >= a.length/2){
                perms1+= value
            }else{
                perms2 += value;
            }
        }
        infoEmbed.addField('Guild Permissions',perms1,true);
        infoEmbed.addField('Guild Permissions',perms2,true);
    }
    //Bot permissions
    const userPermissions = bot.modules.get('user-permissions');
    const userPerms = userPermissions.getPermissions(member,msg.guild,bot);
    const perms = 
    `[${(userPerms.charAt(0) == 1) ? ':white_check_mark:' : ':x:' }] Normal user \n\r`+
    `[${(userPerms.charAt(1) == 1) ? ':white_check_mark:' : ':x:' }] Guild Moderator \n\r`+
    `[${(userPerms.charAt(2) == 1) ? ':white_check_mark:' : ':x:' }] Guild Administrator \n\r`+
    `[${(userPerms.charAt(3) == 1) ? ':white_check_mark:' : ':x:' }] Bot Administrator \n\r`+
    `[${(userPerms.charAt(4) == 1) ? ':white_check_mark:' : ':x:' }] Guild Owner \n\r`+
    `[${(userPerms.charAt(5) == 1) ? ':white_check_mark:' : ':x:' }] Bot Owner \n\r`;
    infoEmbed.addField(`Permission level:${parseInt(userPerms,2)}`,perms);
    //Kickable
    infoEmbed.addField('Kickable',member.kickable,true);
    //Banable
    infoEmbed.addField('Bannable',member.bannable,true);

    //MD5

    const md5 = crypto.createHash('md5');
    md5.update(user.toString()+member.toString())
    const hash = md5.digest('hex');
    infoEmbed.setFooter(hash);


    msg.reply(infoEmbed);

    return ret;
}

module.exports.config ={
    name:'card',
    desc:'Used to show user info.',
    permissions:'111111',
    parameters:[{name:'member',type:'member',optional:true}],
    flags:{'p':{type:'boolean'},'f':{type:'boolean'}}
}