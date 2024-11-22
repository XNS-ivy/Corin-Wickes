import fs from "fs/promises"
import axios from "axios"

async function loadCoreConfig() {
    try {
        const configPath = './db/core.json'
        const data = await fs.readFile(configPath, 'utf-8')
        global.core = JSON.parse(data)
    } catch (err) {
        console.log("Error ", err)
    }
}
async function wiki(ctr, args) {
    const country = ctr == 'wikien' ? 'en' : 'id'
    const url = `https://${country}.wikipedia.org/w/api.php?action=opensearch&search=${args}`
    const response = await axios.get(url)
    const data = response.data
    return data
}
export {
    loadCoreConfig,
    wiki,
}