module.exports.censore = (quote, bot)=>{
    const badwords = bot.modules.get('bad-words');
    const lowerQuote = quote.toLowerCase();
    console.log(lowerQuote);
    badwords.forEach(bw=>{
        const bwLower = bw.toLowerCase();
        if(lowerQuote.includes(bwLower)) {
            const index = lowerQuote.indexOf(bwLower);
            const firstHalf = quote.slice(0, index + 1);
            const secondHalf = quote.slice(index + bw.length - 1);
            let padding = '';
            for(let i = 2;i < bw.length;i++) { padding += '*'; }
            quote = firstHalf + padding + secondHalf;
        }
    });
    return quote;
};


module.exports.config = {
    name:'quotes',
};