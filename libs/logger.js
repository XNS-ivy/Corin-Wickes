function fetchMsg(m) {
    const msg = m.message
    // console.log(msg)
    // console.log(m)
    const fetchNumber = m.key.participant == undefined ? m.key.remoteJid.split('@')[0] : m.key.participant.split('@')[0]
    const msgObject = Object.keys(msg)[0] == 'senderKeyDistributionMessage' ? Object.keys(msg)[2] : Object.keys(msg)[0]
    const text = msgObject == 'conversation' ? msg.conversation :
        msgObject == 'extendedTextMessage' ? msg.extendedTextMessage.text :
            msgObject == 'imageMessage' ? msg.imageMessage.caption :
                msgObject == 'stickerMessage' ? 'Sticker' :
                    msgObject == 'videoMesage' ? 'Video' : undefined
    const expirationMessage = msgObject == 'converation' ? msg.conversation.contextInfo.expiration :
        msgObject == 'extendedTextMessage' ? msg.extendedTextMessage.contextInfo.expiration :
            msgObject == 'imageMessage' ? msg.imageMessage.contextInfo.expiration :
                msgObject == 'videoMessage' ? msg.videoMessage.contextInfo.expiration : 0
    const media = msgObject == 'extendedTextMessage' || msgObject == 'conversation' ? 'Text' :
        msgObject == 'imageMessage' ? 'Image' :
            msgObject == 'videoMessage' ? 'Video' :
                msgObject == 'stickerMessage' ? 'Sticker' : undefined
    const messageStruckture = {
        id: m.key.remoteJid,
        name: m.pushName,
        number: fetchNumber,
        messageType: msgObject,
        mediaType: media,
        text: text,
        expiration: expirationMessage,
    }
    let mediaKey = 'empty'
    if (msgObject == 'imageMessage' || msgObject == 'videoMessage' || msgObject == 'stickerMessage') {
        const url = msgObject == 'imageMessage' ? msg.imageMessage.url : msgObject == 'stickerMessage' ? msg.stickerMessage.url : msgObject == 'videoMessage' ? msg.videoMessage.url : undefined
        const mimetype = msgObject == 'imageMessage' ? msg.imageMessage.mimetype : msgObject == 'stickerMessage' ? msg.stickerMessage.mimetype : msgObject == 'videoMessage' ? msg.videoMessage.mimetype : undefined
        mediaKey = {
            url: url,
            mimetype: mimetype,
        }
    }
    return {
        msg: messageStruckture,
        mediaKey: mediaKey,
    }
}

function loggingMessage(m) {
    const msg = [
        `ID \t\t: ${m.msg.id}`,
        `NUMBER \t\t: ${m.msg.number}`,
        `NAME \t\t: ${m.msg.name}`,
        `MESSAGE \t: ${m.msg.text}`,
        `TYPE \t\t: ${m.msg.mediaType}`,
        `EXPIRATION \t: ${m.msg.expiration}\n`,
    ];

    // console.log(msg);

    for (let i = 0; i < msg.length; i++) {
        console.log(msg[i]);
    }
}


export {
    fetchMsg,
    loggingMessage
}