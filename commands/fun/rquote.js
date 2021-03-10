module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const quotes = bot.modules.get('quotes');
    const random = quotes.getRandom();
    msg.reply(`Today's quote is \`\`\`${random.value}\`\`\` by ${random.author}!`);
    return ret;
};

module.exports.config = {
    name:'rquote',
    desc:'Gives you a quote!',
    permissions:'1111111',
    parameters:[],
    flags:{},
};