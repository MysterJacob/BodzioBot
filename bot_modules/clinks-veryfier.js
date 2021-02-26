// const logger = require('./logger');

module.exports.checkLink = (msg)=>{
    const channel = msg.channel;
    const author = msg.author;

    const content = msg.content;
    let link = content;

    if(!link.startsWith('https://meet.google.com/')) {
        msg.delete();
        return author.send('To nie jest prawidłowy link. \r\t Prawidłowy link musi się zaczynać od ``https://meet.google.com/``.');
    }
    if(link.length != 36) {
        msg.delete();
        author.send('To nie jest prawidłowy link. \r\t Prawidłowy link musi mieć 36 liter.');
        link = link.slice(0, 36);
    }
    if(!link.match('(https://meet.google.com/[a-z]{3}-[a-z]{4}-[a-z]{3})')) {
        msg.delete();
        return author.send('To nie jest prawidłowy link. \r\t Nie jest to poprawna budowa linku dla ``meet.google.com``.');
    }


    if(content != link) {
        channel.send(link);
        return author.send('Poprawiony link został wysłany na kanał z linkami.');
    }
    msg.delete(45 * 60 * 1000);
};
module.exports.config = {
    name:'clinks-veryfier',
};