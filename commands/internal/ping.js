module.exports.run = (msg,Flags,Parameters,bot)=>{
        msg.reply(Flags.get("l"));
}

module.exports.config ={
    name:"ping",
    permissions:111111,
    parameters:{},
    flags:{"l":{"type":"number"}}
}