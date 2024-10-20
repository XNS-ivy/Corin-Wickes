import { corinSocket } from './libs/whatsapp.js'

corinSocket().catch(err => console.error(err))

process.on('uncaughtException', process.exit)