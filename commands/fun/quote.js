module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const quotes = bot.modules.get('quotes');
    const qAuthor = Parameters.get('author');
    const quote = Parameters.get('quote');
    const censoredQuote = quotes.censore(quote, bot);
    const allQuotes = quotes.getAll();
    if(allQuotes.some(q=>q.value.toLowerCase() == censoredQuote.toLowerCase())) {
        msg.reply('You can\'t add same quote twice!');
        return ret;
    }

    if(quote != censoredQuote) {
        const message = await msg.channel.send(`Your qoute has been censored to \`\`\` ${censoredQuote}\`\`\` are you ok with it? `);
        message.react('✅');
        const filter = (reaction, author) => {
            return ['✅'].includes(reaction.emoji.name) && author.id == msg.author.id;
        };
        message.createReactionCollector(filter, { time: 15000, max:1 }).on('collect', ()=>{
            msg.channel.send('Quote added!');
            quotes.addQuote(quotes.censore(qAuthor, bot), censoredQuote);
        });
    }
    else {
        msg.channel.send('Quote added!');
        quotes.addQuote(quotes.censore(qAuthor, bot), censoredQuote);
    }
    return ret;
};

module.exports.config = {
    name:'quote',
    desc:'Adds quote!',
    permissions:'1111111',
    parameters:[{ name:'author', type:'string', optional:false }, { name:'quote', type:'string', optional:false }],
    flags:{},
};