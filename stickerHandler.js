const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
async function sendSticker(mediaData, client, m) {
    try {
        let stickerType = StickerTypes.FULL; // Default sticker type

        // Determine the media type based on its extension or other criteria
        if (mediaData.includes('.mp4')) {
            // Video
            stickerType = StickerTypes.WEBP;
        } else if (mediaData.includes('.gif')) {
            // GIF
            stickerType = StickerTypes.WEBP;
        }

        // Create a new Sticker based on mediaData and stickerType
        const sticker = new Sticker(mediaData, {
            pack: 'Flames-Bot', // The pack name
            author: 'CJ', // The author name
            type: 'crop', // The determined sticker type
            categories: ['🤩', '🎉'], // The sticker category
            id: '12345', // The sticker id
            quality: 100, // The quality of the output file
            background: '#000000' // The sticker background color (only for full stickers)
        });

        // Convert the sticker to a buffer
        const buffer = await sticker.toBuffer();

        // Send the sticker as a message
        await client.sendMessage(m.chat, await sticker.toMessage());
    } catch (error) {
        console.error('Error sending media as sticker:', error);
    }
}

module.exports = sendSticker;
