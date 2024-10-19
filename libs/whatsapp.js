import { makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'
import { logMsg } from './logger.js'

async function hoshinoSocket() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const hohino = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        emitOwnEvents: false,
        logger: pino({ level: 'silent' }),
        browser: ['Takanashi Hoshino', 'Chrome', '1.0.0'],
    });
    hohino.ev.on("creds.update", saveCreds);
    hohino.ev.on('connection.update', update => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            if (shouldReconnect) {
                hoshinoSocket()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })
    hohino.ev.on('messages.upsert', m => {
        logMsg(m.messages)
    })
}

export { hoshinoSocket }