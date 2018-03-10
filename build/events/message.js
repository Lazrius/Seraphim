import { commands } from "../index.js"; // Import commands because I made a mistake!
import { client } from "../index.js"; // Wow. I am starting to see how this could be more efficent

import Discord from 'discord.js'; // Turns out I am going to need this. Sue me.
import winston from 'winston'; // Winston for logging
import fs from 'fs'; // Import FS for command handler.
import secrets from "../settings/secrets.json"; // suprsekrt documents



module.exports = (msg, db) => {
    // search everything inside guildConfig until you find the current server ID.
    if (msg.author.bot && msg.channel.type !== "text") return;
    if (msg.channel.type !== "text") return msg.reply(`Sorru, this bot is server only!\n Feel free to add it with this:\n <${secrets.inviteCode}>`); // Ignore DM channels.

    const ID = msg.guild.id;

    var prefix = "|" // If for some reason the Guild doesn't have a default function.
    // Get Guild Prefix for the guild
    db.r.table('guilds').get(ID).getField('prefix').run(async function(err, result) {
        if (err) throw err; // Was there an issue with the DB?
        prefix = result // Update prefix 

        if (msg.author.bot) return; // Don't allow bot users
        /*
            This little area is for reaction texts, should I choose to use them.
        */

        /*const sleepWords = ["sleepy", "tired", "sleep"];
        if (sleepWords.some(word => msg.content.includes(word))) {
            var embed = new Discord.RichEmbed()
                .setColor('#663399')
                .setImage('https://78.media.tumblr.com/d01b8fbef3330601513a0f0eacc83276/tumblr_nymaloSqjh1tydz8to1_500.gif');
            await msg.channel.send(embed);
            msg.reply("If you're tired, why not go to sleep?");
        }

        const remyWords = ["remy", "Remy"];
        if (remyWords.some(word => msg.content.includes(word))) {
            msg.channel.send("Remy? I hate that guy. Forlorn killed him though.")
        }*/ // Removed because of stupid dan face

        const danWords = ["DAN THE CUNT"]
        if (danWords.some(word => msg.content.includes(word))) {
            var embed = new Discord.RichEmbed()
                .setColor('#663399')
                .setImage('http://www.reactiongifs.us/wp-content/uploads/2013/07/ill_kill_you_office.gif');
            await msg.channel.send(embed);
            msg.reply("DEATH TO DAN");
        }
        const hekiboh = ["heki", "hek", "h e k i", "h e k", "boh", "b o h", "b oh",
            "bo h", "he ki", "h eki", "hek i", "хеки", "хе ки", "х еки", "хек и", "х е к и",
            "hëki", "h ë k i", "hë ki", "hëk i", "h ëki", "h3ki", "h3 ki", "h 3ki", "h3k i", "h3k1",
            "hecki", "heck i", "hec ki", "he cki", "h ecki", "x e k i", "x eki", "xe ki", "xek i", "xeki",
            "ηκι", "h3 k1", "h 3 k 1", "h3k 1", "hêki", "h êki", "hê ki", "hêk i", "hĕki", 
            "hḝ", "hȇ", "h̄ki", "hê", "hê̄̌", "hê̌", "hḕ", "hę́", "he̩", "hⱸ","hᶒ", "hề", "hẻ",
            "hė", "hẹ", "hé̩", "hẽ", "hę̃", "hȩ","hế", "hể", "hḙ", "hễ", "hè̩", "hḗ", "hę́",
            "hḛ", "hē", "hé", "hë", "hè", "hȅ", "hě", "hɇ", "hė́", "hệ", "h̃ė̃"]
               
        if (hekiboh.some(word => msg.content.toLowerCase().includes(word))) {
            msg.delete().catch((err) => winston.error(err))
        }

        /*
            Section over, go back to whatever you were doing.
        */

        let messageArray = msg.content.split(/\s+/g);
        let command = messageArray[0]; // Turn our messages into an array
        let args = messageArray.slice(1); // Each arg is a entry in the array

        if (command == "prefix") // In case we forget our prefix, 
        // the word prefix will trigger the bot to print what is currently being used.
        {
            msg.channel.send(`Info: The current server prefix is \`${prefix}\``) // Our current prefix
        }

        if (command == prefix + "eval") // If we want to execute custom JS with the bot.
        {
            if (msg.author.id !== secrets.ownerID) return; // Protect our eval function from evil-dooers (Eval-Dooers)
            try {
                const r = eval(msg.content.substr(5))
                msg.channel.send(`Evaled: \n\`\`\`${msg.content.substr(5)}\n\n> ${r}\n\`\`\``)

                return
            }
                catch (err) {
                msg.channel.send(`${err.name}: ${err.message}`)
            }
        }
        if (!command.startsWith(prefix)) return; // Unless a message has the prefix at the start of it, ignore it.

        let cmd = client.commands.get(command.slice(prefix.length))
        if (cmd) cmd.run(msg, args, client, db, ID) // Send our command to the handler if none of the commands are listed here
    })


};
