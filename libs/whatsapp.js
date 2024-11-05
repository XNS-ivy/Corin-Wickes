import { makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'
import { fetchMsg, loggingMessage } from './logger.js'

async function corinSocket() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const corin = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        emitOwnEvents: false,
        logger: pino({ level: 'silent' }),
        browser: ['Corin Wickes', 'Chrome', '1.0.0'],
    });
    corin.ev.on("creds.update", saveCreds)
    corin.ev.on('connection.update', update => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            if (shouldReconnect) {
                corinSocket()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })
    corin.ev.on('messages.upsert', async m => {
        if (m.messages[0].pushName == undefined || !m.messages[0]) return
        const msg = fetchMsg(m.messages[0])
        loggingMessage(msg)
    })
}

export { corinSocket }