const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const token = '';

const PREFIX = '!';

var servers = {};

client.on('ready', () => {
    console.log("This bot is online!");
})

client.on('message', msg => {
    let args = msg.content.substring(PREFIX.length).split(/ +/);   //source 1
    
    switch (args[0]){
        case 'ping':
            msg.channel.send('pong')
            break;
        case 'play':

            function play(connection, msg){
                var server = servers[msg.guild.id];
                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
                server.queue.shift();
                server.dispatcher.on("end", function(){
                    if (server.queue[0]){
                        play(connection, msg);
                    } else {
                        connection.disconnect();
                    }
                });
                console.log("HERE IN MY PLAY FUNCTION!")
            }

            if (!args[1]){
                msg.reply("what song?");
                return;
            } 
            if (!msg.member.voice.channel){
                msg.channel.send("You must be in a channel!")
                return;
            }
            if (!servers[msg.guild.id]){
                servers[msg.guild.id] = {
                    queue : [] 
                }
            }
      //      var songName = args.join(' ').substring(5); 
            var server = servers[msg.guild.id];
            server.queue.push(args[1]);

            if (!msg.guild.voiceConnection){
                msg.member.voice.channel.join().then(function(connection){
                    play(connection, msg);
                })
            }
            console.log("HERE IN MY PLAY FUNCTION!");
            break;
        case 'clear':
            if (!args[1])
                return msg.reply("Please enter second argument.")
            msg.channel.bulkDelete(args[1]);
            break;
    }
})

client.login(token);


//notes:
//3/8/2020: Program should run, but console gives error Type null to int in oppusscript. Will need to research more.

//sources:
//1. https://discordjs.guide/creating-your-bot/commands-with-user-input.html#basic-arguments
