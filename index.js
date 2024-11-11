import { corinSocket } from './libs/whatsapp.js'
import { loadCoreConfig } from './libs/utility.js'

corinSocket().catch(err => console.error(err)).then(() => {
    loadCoreConfig()
})