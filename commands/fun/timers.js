const discord = require('discord.js');

module.exports.run = async (msg, Flags, Parameters, bot, ret)=>{
    const now = new Date();
    const embed = new discord.MessageEmbed();
    embed.setTitle('Timers');
    embed.setColor('eb5834');
    embed.setDescription('All of the \'most important\' timers');
    {
        const endDay = now.getDate() - (now.getDay() - 4);
        const end = new Date(now.getTime());
        end.setHours(23, 59, 59);
        end.setDate(endDay);
        const ms = end.getTime() - now.getTime();
        let s = Math.floor(ms / 1000);
        let m = Math.floor(s / 60);
        s = s % 60;
        let h = Math.floor(m / 60);
        m = m % 60;
        const d = Math.floor(h / 24);
        h = h % 24;
        const string = `${d} day${d != 1 ? 's' : ''}, ${h} hour${h != 1 ? 's' : ''}, ${m} minute${m != 1 ? 's' : ''} and ${s} second${s != 1 ? 's' : ''}`;
        embed.addField('The weekend', string);
    }
    {
        const endDay = now.getDate() - (now.getDay() - 6);
        const end = new Date(now.getTime());
        end.setHours(23, 59, 59);
        end.setDate(endDay);
        const ms = end.getTime() - now.getTime();
        let s = Math.floor(ms / 1000);
        let m = Math.floor(s / 60);
        s = s % 60;
        let h = Math.floor(m / 60);
        m = m % 60;
        const d = Math.floor(h / 24);
        h = h % 24;
        const string = `${d} day${d != 1 ? 's' : ''}, ${h} hour${h != 1 ? 's' : ''}, ${m} minute${m != 1 ? 's' : ''} and ${s} second${s != 1 ? 's' : ''}`;
        embed.addField('End of the week', string);
    }
    {
        const end = new Date(now.getTime());
        end.setHours(23, 59, 59);
        const ms = end.getTime() - now.getTime();
        let s = Math.floor(ms / 1000);
        let m = Math.floor(s / 60);
        s = s % 60;
        let h = Math.floor(m / 60);
        m = m % 60;
        const d = Math.floor(h / 24);
        h = h % 24;
        const string = `${d} day${d != 1 ? 's' : ''}, ${h} hour${h != 1 ? 's' : ''}, ${m} minute${m != 1 ? 's' : ''} and ${s} second${s != 1 ? 's' : ''}`;
        embed.addField('End of the daye', string);
    }
    {
        const end = new Date(now.getTime());
        end.setHours(21, 37, 0);
        const ms = end.getTime() - now.getTime();
        let s = Math.floor(ms / 1000);
        let m = Math.floor(s / 60);
        s = s % 60;
        let h = Math.floor(m / 60);
        m = m % 60;
        const d = Math.floor(h / 24);
        h = h % 24;
        const string = `${d} day${d != 1 ? 's' : ''}, ${h} hour${h != 1 ? 's' : ''}, ${m} minute${m != 1 ? 's' : ''} and ${s} second${s != 1 ? 's' : ''}`;
        embed.addField('Papaj.dll', string);
    }
    {
        const end = new Date(now.getTime());
        end.setHours(21, 37, 0);
        end.setFullYear(end.getFullYear(), 5, 26);
        console.log(end.toString());
        const ms = end.getTime() - now.getTime();
        let s = Math.floor(ms / 1000);
        let m = Math.floor(s / 60);
        s = s % 60;
        let h = Math.floor(m / 60);
        m = m % 60;
        const d = Math.floor(h / 24);
        h = h % 24;
        const string = `${d} day${d != 1 ? 's' : ''}, ${h} hour${h != 1 ? 's' : ''}, ${m} minute${m != 1 ? 's' : ''} and ${s} second${s != 1 ? 's' : ''}`;
        embed.addField('The Wakacje', string);
    }
    {
        const end = new Date(now.getTime());
        end.setHours(23, 59, 59);
        end.setFullYear(2025, 5, 26);
        const ms = end.getTime() - now.getTime();
        let s = Math.floor(ms / 1000);
        let m = Math.floor(s / 60);
        s = s % 60;
        let h = Math.floor(m / 60);
        m = m % 60;
        let d = Math.floor(h / 24);
        h = h % 24;
        const mo = Math.floor(d / 30);
        d = d % 30;
        const string = `${mo} month${mo != 1 ? 's' : ''}, ${d} day${d != 1 ? 's' : ''}, ${h} hour${h != 1 ? 's' : ''}, ${m} minute${m != 1 ? 's' : ''} and ${s} second${s != 1 ? 's' : ''}`;
        embed.addField('Till I collapse', string);
    }
    msg.reply(embed);
    return ret;
};

module.exports.config = {
    name:'timers',
    desc:'Shows "the most" important timers',
    permissions:'111111',
    parameters:[],
    flags:{},
};