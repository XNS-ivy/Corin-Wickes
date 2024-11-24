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

async function wiki(argumen, country) {
    const region = country === "wikien" ? "en" : "id"
    if (!argumen) return `Please add argument after query Ex: "${global.core.prefix}${global.core.command.regular[2]} anime"`

    try {
        const url = `https://${region}.wikipedia.org/w/api.php`
        const responseUrl = await axios.get(url, {
            params: {
                format: 'json',
                action: 'query',
                list: 'search',
                srsearch: argumen,
                srlimit: 1,
                utf8: 1
            }
        });

        const firstResult = responseUrl.data.query.search[0]
        if (!firstResult) return `Sorry, result not found for: "${argumen}".`

        const title = firstResult.title

        const articleResponse = await axios.get(url, {
            params: {
                format: 'json',
                action: 'query',
                prop: 'extracts',
                exintro: true,
                explaintext: true,
                redirects: 1,
                titles: title
            }
        })

        const pages = articleResponse.data.query.pages
        const extract = pages[Object.keys(pages)[0]]?.extract
        return extract ? `Article: ${title}\n\n${extract}` : `Sorry, article not found!`

    } catch (err) {
        console.error('Error while fetching media Wikipedia:', err)
        return `Error: ${err.message}`
    }
}

export {
    loadCoreConfig,
    wiki,
}