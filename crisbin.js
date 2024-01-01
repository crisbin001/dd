const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require("@adiwajshing/baileys");
const fs = require("fs");
//const { MessageType, Presence } = require('@adiwajshing/baileys');
const util = require("util");
const chalk = require("chalk");
const { replace } = require("lodash");
const translator = require('./translator')
const { MessageType, MessageOptions, Mimetype } = require('@whiskeysockets/baileys');

const sendSticker = require('./stickerHandler');
//const { WAConnection } = require('@adiwajshing/baileys');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
//const conn = new WAConnection();;
//const handler = require('./play');
const { Baileys, downloadMediaMessage } = require('@adiwajshing/baileys');


const { Hercai } = require('hercai');

/* Create a new instance of the Hercai class */
const herc = new Hercai();

const gtts = require('node-gtts');
//const { Sticker}  = require('wa-sticker-formatter');
const path = require('path');





const ytdl = require('ytdl-core');
const yts = require('yt-search');
//const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const os = require('os');
const limit = 500;


const streamPipeline = promisify(pipeline);


module.exports = crisbin = async (client, m, chatUpdate, store) => {
    try {
        var body =

            m.mtype === "conversation"
                ? m.message.conversation
                : m.mtype == "imageMessage"
                    ? m.message.imageMessage.caption
                    : m.mtype == "videoMessage"
                        ? m.message.videoMessage.caption
                        : m.mtype == "extendedTextMessage"
                            ? m.message.extendedTextMessage.text
                            : m.mtype == "buttonsResponseMessage"
                                ? m.message.buttonsResponseMessage.selectedButtonId
                                : m.mtype == "listResponseMessage"
                                    ? m.message.listResponseMessage.singleSelectReply.selectedRowId
                                    : m.mtype == "templateButtonReplyMessage"
                                        ? m.message.templateButtonReplyMessage.selectedId
                                        : m.mtype === "messageContextInfo"
                                            ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text
                                            : "";
        var budy = typeof m.text == "string" ? m.text : "";
        // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
        const isCmd2 = body.startsWith(prefix);
        const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
        const botNumber = await client.decodeJid(client.user.id);
        const itsMe = m.sender == botNumber ? true : false;
        let text = (q = args.join(" "));
        const arg = budy.trim().substring(budy.indexOf(" ") + 1);
        const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

        const from = m.chat;
        const reply = m.reply;
        const sender = m.sender;
        const mek = chatUpdate.messages[0];

        const color = (text, color) => {
            return !color ? chalk.green(text) : chalk.keyword(color)(text);
        };


        // Group
        const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => { }) : "";
        const groupName = m.isGroup ? groupMetadata.subject : "";

        // Push Message To Console
        let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

        if (isCmd2 && !m.isGroup) {
            console.log(chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`));
        } else if (isCmd2 && m.isGroup) {
            console.log(
                chalk.black(chalk.bgWhite("[ LOGS ]")),
                color(argsLog, "turquoise"),
                chalk.magenta("From"),
                chalk.green(pushname),
                chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
                chalk.blueBright("IN"),
                chalk.green(groupName)
            );
        }
        /* Function to generate an image based on the provided text */
        async function generateImage(text) {
            try {
                /* Use the default model "v2" to generate an image */
                const response = await herc.drawImage({ model: "v2", prompt: text });

                /* Log the image URL to the console */
                console.log(response.url);

                /* Return the image URL */
                return response.url;
            } catch (error) {
                /* Handle errors */
                console.error("Error generating image:", error.message);
                throw 'Oops! Something went wrong while generating the image. 🥺';
            }
        }





        if (isCmd2) {
            switch (command) {
                case "help": case "menu": case "start": case "info":
                    m.reply(`
                            *FLAMES-AI*
┃             ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡       
┣➥what this bot can do?         
┃                                     
                    
┏━━━━━━━━━━━━━━━━━━━┓
┃ *1*:┃*Ask to ai* 
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃
┃
┃ Example:
┃
┣➥ .ai your question
┃
┗━━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━━┓
┃ *2*:┃*Generate image using text* 
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃
┃
┃ Example:
┃
┣➥ .img cat eatting food
┃
┗━━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━━┓
┃ *3*:┃*Calculator* 
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃
┃
┃ Example:
┃
┣➥ .calc 1000/23
┃
┗━━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━━┓
┃ *4*:┃*talk to the bot*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃
┃
┃ Example:
┃
┣➥ .bot how are you?
┃
┗━━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━━┓
┃ *5*:┃*Translate to english*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃
┃
┃ Example:
┃
┣➥ .tr എന്തൊക്കെയുണ്ട് വിശേഷം
┃
┗━━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━━┓
┃ *6*:┃*Download MP3 Songs*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃
┃
┃ Example:
┃
┣➥ .play song name
┃
┗━━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━━┓
┃ *7*:┃*sticker maker*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃
┃
┃ how?:
┃
┣➥ simply send any photo 
┃   or gif with .s as caption
┃
┗━━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━━┓
┃ *8*:┃*download youtube video*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡┃
┃
┃ how?:
┃
┣➥ simply sent youtube video link
┃
┗━━━━━━━━━━━━━━━━━━━┛
                   
`)
                    break;
                case "ai":
                    try {
                        if (!text && m.quoted && m.quoted.text) text = m.quoted.text;
                        if (!text) throw "Please provide a text to ask the AI.";
                        await client.sendPresenceUpdate('composing', m.chat)


                        client.sendMessage(m.sender, {
                            react: {
                                text: "⏳",
                                key: m.key
                            }
                        })

                        let qn = text;

                        // API request
                        let res = await fetch(`https://hercai.onrender.com/v3-beta/hercai?question=${qn}`);


                        if (res.status === 200) {
                            let json = await res.json();
                            if (json.reply) {
                                m.reply(json.reply.replace("@User", `@${sender.split('@')[0]}`).replace("Hercai", "Flame AI").replace("OpenAI", "Crisbin-Ser").replace("artificial intelligence research organization", "an AI Bot Developer").replace("a team of developers and engineers at Crisbin-Ser. They", "Crisbin-Ser. He"));
                            } else {
                                throw "AI service did not return a successful response.";
                            }
                        } else {
                            throw `HTTP Error: ${res.status} - ${res.statusText}`;
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        m.reply(`*Error*: ${error}`);
                    }
                    break;
                case "bot": case "ai-img": case "image": case "images": case "dall-e":
                    try {

                        if (!text) throw `Hii  want to talk? \nrespond ${usedPrefix + command} (your message) \n\n📌 Exemplo : ${usedPrefix + command} Hii bot`

                        client.sendMessage(m.sender, {
                            react: {
                                text: "💖",
                                key: m.key
                            }
                        })
                        await client.sendPresenceUpdate('composing', m.chat)

                        text = text.replace("chat", "").replace("bot", "").replace("cbot", "")
                        //let res = await fetch(global.API('https://api.simsimi.net', '/v2/', { text: encodeURIComponent(m.text), lc: "es" }, ''))
                        let res = await fetch(`https://api.simsimi.net/v2/?text=${text}&lc=en`) //QVibCH0lNVftFNV9HpKTc3_9NSX65vtvHHafVC3e
                        let json = await res.json()
                        if (json.success) m.reply(json.success.replace("chat", "").replace("bot", "").replace("cbot", "").replace("simsimi", "Flames").replace("jc mo", "Angel"))
                        else throw json
                    } catch (err) {
                        m.reply("error occured");
                    }
                    break;
                case "Calc": case "calc": case "Calculator":


                    if (!text) throw `Hii *${name}* want to talk? \nrespond *${usedPrefix + command}* 17+38`
                    await client.sendMessage(m.sender, {
                        react: {
                            text: "⏳",
                            key: m.key
                        }

                    })
                    console.log(text)
                    await client.sendPresenceUpdate('composing', m.chat)


                    let sreq = encodeURIComponent(text.replace('calc', '').replace('x', '*'));

                    let res = await fetch(`http://api.mathjs.org/v4/?expr=${sreq}`)
                    let json = await res.json()
                    if (json.result) m.reply(json.result)
                    else throw json


                    break;


                case "dalle":
                case "img":
                case "imagine":
                    let query = "Type anything to generate e.g.: .dalle cat sitting on a tree";

                    if (args.length >= 1) {
                        text = args.slice(0).join(" ");
                        client.sendMessage(m.sender, {
                            react: {
                                text: "🪄",
                                key: m.key
                            }
                        });

                        await client.sendPresenceUpdate('composing', m.chat);
                        await m.reply(`Let me conjure up an image based on "${text}"...`);
                    } else if (m.quoted && m.quoted.text) {
                        text = m.quoted.text;
                        m.reply(`Ah, I see! Using the quoted text "${text}" to generate an image...`);
                    } else throw query;

                    try {
                        m.reply("Preparing for some AI image... ⚕️");
                        await client.sendPresenceUpdate('composing', m.chat);

                        /* Call the generateImage function with the provided text */
                        const imageUrl = await generateImage(text);


                        const Blobs = await fetch(imageUrl);








                        const arrayBuffer = await Blobs.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        await client.sendMessage(m.chat, { image: buffer }, `*HERE YOU GO*\n"${text}"`);
                    } catch (e) {
                        throw 'Oops! Something went wrong while generating the image. 🥺';
                    }
                    break;




                case "tr":
                    client.sendMessage(m.sender, {
                        react: {
                            text: "⏳",
                            key: m.key
                        }
                    })
                    await client.sendPresenceUpdate('composing', m.chat)

                    translator(m, args, prefix, command);
                    break;

                case 's': case ' S': case ' s': case 'S':



                    if (!m.message) return; // If there is no text or media message
                    client.sendMessage(m.sender, {
                        react: {
                            text: "😎",
                            key: m.key
                        }
                    })
                    // Check if the message is a quoted message
                    if (m.quoted) {
                        // Handle quoted message here
                        const quotedMessageType = Object.keys(m.quoted)[0];
                        console.log("okey")

                        // Download the quoted image
                        const quotedBuffer = downloadMediaMessage(m.quoted)
                        console.log(quotedBuffer);


                        await sendSticker(quotedBuffer, client, m);



                    } else {


                        // Get the type of message (text, image, video, document)
                        const messageType = Object.keys(m.message)[0];
                        m.reply("Preparing sticker... ⚕️");
                        // Check the message type and handle accordingly
                        if (messageType === 'imageMessage' || messageType === 'videoMessage' || messageType === 'documentMessage') {
                            // Download the message
                            const buffer = await downloadMediaMessage(m, 'buffer', {});

                            // Now you have the downloaded media data in `buffer`

                            // Call sendSticker for all message types
                            await sendSticker(buffer, client, m);
                        }
                    }


                    break;
                case "play":


                    if (!text) {
                        m.reply("Please provide a search query for the 'play' command.");
                        break;
                    }



                    // Call the 'play' handler function
                    if (!text) throw `Use example ${prefix}${command} naruto blue bird`;
                    //await m.react(rwait);
                    client.sendMessage(m.sender, {
                        react: {
                            text: "🎧",
                            key: m.key
                        }
                    })

                    let search = await yts(text);
                    let vid = search.videos[Math.floor(Math.random() * search.videos.length)];
                    if (!search) throw 'Video Not Found, Try Another Title';
                    let { title, thumbnail, timestamp, views, ago, url } = vid;
                    let wm = 'Downloading audio please wait';
                    await client.sendPresenceUpdate('composing', m.chat)

                    let captvid = `✼ ••๑⋯ ❀ FLAMES-AI ❀ ⋯⋅๑•• ✼
❏ Title: ${title}
❐ Duration: ${timestamp}
❑ Views: ${views}
❒ Upload: ${ago}               
❒ Link: ${url}
⊱─━━━━⊱༻●༺⊰━━━━─⊰`;

                    client.sendMessage(m.chat, { image: { url: thumbnail }, caption: captvid }, { quoted: m });


                    const audioStream = await ytdl(url, {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                    });

                    // Get the path to the system's temporary directory
                    const tmpDir = await os.tmpdir();

                    // Create writable stream in the temporary directory
                    const sanitizedTitle = title.replace(/[\\/:"*?<>|]+/g, "_");


                    // Create writable stream with the sanitized title
                    const writableStream = fs.createWriteStream(`${tmpDir}/${sanitizedTitle}.mp3`);

                    // Start the download
                    await streamPipeline(audioStream, writableStream);

                    let doc = {
                        audio: {
                            url: `${tmpDir}/${sanitizedTitle}.mp3`
                        },
                        mimetype: 'audio/mp4',
                        fileName: `${sanitizedTitle}`,
                        contextInfo: {
                            externalAdReply: {
                                showAdAttribution: true,
                                mediaType: 2,
                                mediaUrl: url,
                                title: sanitizedTitle,
                                body: wm,
                                sourceUrl: url,
                                //thumbnail: await (await sock.getFile(thumbnail)).data
                            }
                        }
                    };

                    await client.sendMessage(m.chat, doc, { quoted: m });

                    // Delete the audio file
                    fs.unlink(`${tmpDir}/${sanitizedTitle}.mp3`, (err) => {
                        if (err) {
                            console.error(`Failed to delete audio file: ${err}`);
                        } else {
                            console.log(`Deleted audio file: ${tmpDir}/${sanitizedTitle}.mp3`);
                        }
                    });

                    break;
                case "dare": case "Dare":
                    client.sendMessage(m.sender, {
                        react: {
                            text: "🤪",
                            key: m.key
                        }
                    })
                    await client.sendPresenceUpdate('composing', m.chat)
                    let shizokeys = 'shizo'
                    let reso = await fetch(`https://shizoapi.cyclic.app/api/texts/dare?apikey=${shizokeys}`)
                    if (!reso.ok) throw await reso.text()
                    let jsons = await reso.json()

                    let cj = `${jsons.result}`
                    client.sendMessage(m.chat, { text: cj, mentions: [m.sender] }, { quoted: m })

                    break;


                case "ping":
                    m.reply("pong")
                    break;
                case "hai":
                    m.reply("Hello") 
                    break;
                    case "ytd":
                        console.log(text);
                       /* const args = m.chat.split(' ');
                      
                        if (!args[1] || !args[1].match(/youtu/gi)) {
                          throw new Error('❎ Verify that the YouTube link');
                        }*/
                      
                        try {
                          const info = await ytdl.getInfo(text);
                          const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
                          if (!format) {
                            throw new Error('No valid formats found');
                          }
                      
                          if (format.contentLength / (1024 * 1024) >= limit) {
                            return m.reply(`≡ *CASPER YTDL*\n\n▢ *⚖️Size*: ${format.contentLength / (1024 * 1024).toFixed(2)}MB\n▢ *🎞️Quality*: ${format.qualityLabel}\n\n▢ The file exceeds the download limit *+${limit} MB*`);
                          }
                      
                          const tmpDir = os.tmpdir();
                          const fileName = `${tmpDir}/${info.videoDetails.videoId}.mp4`;
                      
                          const writableStream = fs.createWriteStream(fileName);
                          ytdl(text, {
                            quality: format.itag,
                          }).pipe(writableStream);
                      
                          writableStream.on('finish', () => {
                            // Check if the file exists before attempting to read it
                            if (fs.existsSync(fileName)) {
                              // Specify media type and caption in the sendMessage method
                              client.sendMessage(
                                m.chat,
                                { video: fs.readFileSync(fileName) }, // Specify media type as 'video'
                                'Optional caption here',
                                m
                              );
                      
                              // Delete the temporary file
                              fs.unlinkSync(fileName);
                            //  m.react('');
                            } else {
                              m.reply('Error: File does not exist or could not be read.');
                            }
                          });
                      
                          writableStream.on('error', (error) => {
                            console.error(error);
                            m.reply('Error while trying to download the video. Please try again.');
                          });
                        } catch (error) {
                          console.error(error);
                          m.reply('Error while trying to process the video. Please try again.');
                        }
                        break;




                default: {
                    if (isCmd2 && budy.toLowerCase() != undefined) {
                        if (m.chat.endsWith("broadcast")) return;
                        if (m.isBaileys) return;
                        if (!budy.toLowerCase()) return;
                        if (argsLog || (isCmd2 && !m.isGroup)) {
                            // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                            console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
                        } else if (argsLog || (isCmd2 && m.isGroup)) {
                            // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                            console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
                        }
                    }
                }
            }
        }
    } catch (err) {
        m.reply(util.format(err));
    }

};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});
