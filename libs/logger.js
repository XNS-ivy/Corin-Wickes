async function fetchMsg(m) {
    const msg = m.message;
    const fetchNumber = m.key.participant == undefined ? m.key.remoteJid.split('@')[0] : m.key.participant.split('@')[0];
    const msgObject = Object.keys(msg)[0] === 'senderKeyDistributionMessage' ? Object.keys(msg)[2] : Object.keys(msg)[0];

    const text = msgObject === 'conversation' ? msg.conversation :
        msgObject === 'extendedTextMessage' ? msg.extendedTextMessage.text :
            msgObject === 'imageMessage' ? msg.imageMessage.caption :
                msgObject === 'stickerMessage' ? 'Sticker' :
                    msgObject === 'videoMessage' ? 'Video' : undefined;

    const expirationMessage = msgObject === 'conversation' ? msg.conversation?.contextInfo?.expiration || 0 :
        msgObject === 'extendedTextMessage' ? msg.extendedTextMessage?.contextInfo?.expiration || 0 :
            msgObject === 'imageMessage' ? msg.imageMessage?.contextInfo?.expiration || 0 :
                msgObject === 'videoMessage' ? msg.videoMessage?.contextInfo?.expiration || 0 :
                    msgObject === 'stickerMessage' ? msg.stickerMessage?.contextInfo?.expiration || 0 : 0;

    const media = msgObject === 'extendedTextMessage' || msgObject === 'conversation' ? 'Text' :
        msgObject === 'imageMessage' ? 'Image' :
            msgObject === 'videoMessage' ? 'Video' :
                msgObject === 'stickerMessage' ? 'Sticker' : undefined;

    const messageStructure = {
        id: m.key.remoteJid,
        name: m.pushName,
        number: fetchNumber,
        messageType: msgObject,
        mediaType: media,
        text: text,
        expiration: expirationMessage,
    };

    let mediaKey = 'empty';
    if (msgObject === 'imageMessage' || msgObject === 'videoMessage' || msgObject === 'stickerMessage') {
        const url = msgObject === 'imageMessage' ? msg.imageMessage.url :
            msgObject === 'stickerMessage' ? msg.stickerMessage.url :
                msgObject === 'videoMessage' ? msg.videoMessage.url : undefined;
        const mimetype = msgObject === 'imageMessage' ? msg.imageMessage.mimetype :
            msgObject === 'stickerMessage' ? msg.stickerMessage.mimetype :
                msgObject === 'videoMessage' ? msg.videoMessage.mimetype : undefined;

        mediaKey = {
            url: url,
            mimetype: mimetype,
        };
    }

    return {
        msg: messageStructure,
        mediaKey: mediaKey,
    };
}

async function loggingMessage(m) {
    const log = `+ -------------\n` +
        `ID \t\t: ${m.msg.id}\n` +
        `NUMBER \t\t: ${m.msg.number}\n` +
        `NAME \t\t: ${m.msg.name}\n` +
        `MESSAGE \t: ${m.msg.text}\n` +
        `TYPE \t\t: ${m.msg.mediaType}\n` +
        `EXPIRATION \t: ${m.msg.expiration}\n` +
        `+ -------------\n`

    return log
}

async function loggingQuery(m, msg) {
    const log = `+ -------------\n` +
        `EMIT QUERY\n` +
        `ID \t\t: ${msg.msg.id}\n` +
        `NUMBER \t\t: ${msg.msg.number}\n` +
        `QUERY \t\t: ${m.query}\n` +
        `QUERY TYPE \t: ${m.menu}\n` +
        `ARGUMENT \t: ${m.args}\n` +
        `+ -------------\n`

    return log
}

async function initialQuery(msg) {
    const stringify = String(msg)
    const isHitPrefix = stringify.startsWith(global.core.prefix) ? stringify.split(global.core.prefix)[1] : null

    const [command, ...args] = isHitPrefix ? isHitPrefix.split(/\s+/) : [null]
    const argument = args.length > 0 && args[0] !== '' ? args.join(' ') : null

    const definitionQuery = global.core.command.regular.includes(command) ? 'regular' :
        global.core.command.premium.includes(command) ? 'premium' :
            global.core.command.adminGroup.includes(command) ? 'admin' :
                global.core.command.owner.includes(command) ? 'owner' : false

    return isHitPrefix ? {
        query: command,
        args: argument,
        menu: definitionQuery,
    } : false
}

export {
    fetchMsg,
    loggingMessage,
    initialQuery,
    loggingQuery
}