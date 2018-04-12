const sql = require("sqlite");
const Discord = require("discord.js");
const bot = new Discord.Client();

function toSQLReadable(str = "") {
    let resp = "";
    str.split("").forEach(char => {
        resp += char.replace(char, ["a","b","c","d","e","f","g","h","i","j"][parseInt(char)]);
    });
    return resp;
}

bot.on("message", msg => {
    if(!msg.content.startsWith("!warn") || msg.channel.type !== "text" || !msg.mentions.users) return;
    let user = msg.mentions.users.first();
    sql.open("./warnings.sqlite").then(() => {
        sql.get(`SELECT * FROM main WHERE id = "${toSQLReadable(user.id)}"`).then(row => {
            if(!row) sql.run("INSERT INTO main (id, amt) VALUES (?, ?)", [toSQLReadable(user.id), 1]).then(() => {
                msg.channel.send(`**Warned:** \`${user.tag}\``);
            });
            else sql.run(`UPDATE main SET amt = ${row.amt+1} WHERE id = "${toSQLReadable(user.id)}"`).then(() => {
                msg.channel.send(`**Warned:** \`${user.tag}\``);
            });
        }).catch(() => {
            sql.run("CREATE TABLE IF NOT EXISTS main (id TEXT, amt INTEGER)").then(() => {
                sql.run("INSERT INTO main (id, amt) VALUES (?, ?)", [toSQLReadable(user.id), 1]);
            });
        });
    });
});

bot.login("");