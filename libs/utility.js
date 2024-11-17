import fs from "fs/promises"

async function loadCoreConfig() {
    try {
        const configPath = './db/core.json'
        const data = await fs.readFile(configPath, 'utf-8')
        global.core = JSON.parse(data)
    } catch (err) {
        console.log("Error ",err)
    }
}
export { loadCoreConfig }