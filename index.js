import { hoshinoSocket } from './libs/whatsapp.js'

hoshinoSocket().catch(err => console.error(err))

process.on('uncaughtException', process.exit)