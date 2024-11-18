import { makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'
import { fetchMsg, loggingMessage, initialQuery, loggingQuery } from './logger.js'
import fs from 'fs/promises'
import { menu } from './waMenu.js'

async function corinSocket() {
    const { state, saveCreds } = await useMultiFileAuthState("./session")
    const corin = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        emitOwnEvents: false,
        logger: pino({ level: 'silent' }),
        browser: ['Corin Wickes', 'Chrome', '1.0.0'],
    })

    corin.ev.on("creds.update", saveCreds)
    corin.ev.on('connection.update', async update => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) {
                corinSocket();
            } else if (lastDisconnect.error.output.statusCode == 401) {
                try {
                    await fs.rm('./session', { recursive: true, force: true })
                    console.log('Session cleaned due to 401 status code.')
                    corinSocket().then(() => {
                        console.log('Socket restarted after cleaning session.')
                    }).catch(err => {
                        console.error('Error restarting socket:', err)
                    });
                } catch (error) {
                    console.error('Error cleaning session:', error)
                }
            } else {
                console.log('Connection closed due to ', lastDisconnect.error.output)
            }
        } else if (connection === 'open') {
            console.log('Opened connection')
        }
    })

    corin.ev.on('messages.upsert', async m => {
        if (!m.messages[0] || m.messages[0].pushName === undefined || !m.messages[0].message || !Object.keys(m.messages[0].message).length || m.messages[0].key.remoteJid === 'status@broadcast') return
        const ms = m.messages[0]
        const msg = await fetchMsg(ms)
        const query = await initialQuery(msg.msg.text)
        const logging = query ? await loggingQuery(query, msg) : await loggingMessage(msg)

        console.log(logging)
        if (query) {
            const command = await menu(query, msg)
            command.payload == 'text' ? await sendTextMesage(command.text, msg.msg, ms) :
                await sendTextMesage(`Command Not Found! try ${global.core.prefix}${global.core.command.regular[0]}`, msg.msg, ms)
        }
    })
    async function sendTextMesage(text, msg, m) {
        corin.sendMessage(msg.id, { text: text }, { quoted: m, ephemeralExpiration: msg.expiration }).catch((err) => {
            console.error(err)
        })
    }
}

export { corinSocket };