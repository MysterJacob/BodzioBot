module.exports.run = (msg,Flags,Parameters,bot,ret)=>{
    if(Flags.isSet('l')){
        msg.channel.send('Your ping is `' + `${Date.now() - msg.createdTimestamp}` + ' ms`🏓')
    }else{
        msg.reply('Pong🏓')
    }
    return ret;
}

module.exports.config ={
    name:'ping',
    desc:'Used to check for services.',
    permissions:'111111',
    parameters:[],
    flags:{'l':{'type':'boolean'}}
}