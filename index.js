import { corinSocket } from './libs/whatsapp.js'
import { loadCoreConfig } from './libs/utility.js'

loadCoreConfig().catch(err => console.error(err)).then(() => {
    corinSocket()
})