const fs = require('fs');
module.exports.censore = (quote, bot)=>{
    const badwords = bot.modules.get('bad-words');
    const lowerQuote = quote.toLowerCase();
    // console.log(lowerQuote);
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
module.exports.getAll = ()=>{
    const path = './quotes.json';
    if(!fs.existsSync(path)) {
        fs.writeFileSync(path, '{"q":[]}');
    }
    const quotes = JSON.parse(fs.readFileSync(path)).q;
    return quotes;
};
module.exports.addQuote = (author, quote)=> {
    const path = './quotes.json';
    if(!fs.existsSync(path)) {
        fs.writeFileSync(path, '{"q":[]}');
    }
    const quotes = JSON.parse(fs.readFileSync(path));
    const value = { author:author, value: quote };

    quotes.q.push(value);
    fs.writeFileSync(path, JSON.stringify(quotes));
};
module.exports.getRandom = () => {
    const path = './quotes.json';
    if(!fs.existsSync(path)) {
        fs.writeFileSync(path, '{"q":[]}');
    }
    const quotes = JSON.parse(fs.readFileSync(path)).q;
    if(quotes.length == 0) {
        return { author:'Bagno.', value:'Ruh moment' };
    }
    const randomIndex = Math.round(Math.random() * (quotes.length - 1));
    const randomQuote = quotes[randomIndex];
    return randomQuote;
};
module.exports.init = (bot) =>{
    setInterval(()=>{
        const randomQuote = this.getRandom();
        // https://stackoverflow.com/questions/58568377/how-can-i-set-custom-status-in-discord-bot-according-to-new-update
        bot.user.setPresence({ activity: { name: `${randomQuote.value} by ${randomQuote.author}` }, status: 'custom' });
    }, (30 * 1000));
};

module.exports.config = {
    name:'quotes',
};