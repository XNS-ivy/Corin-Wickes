async function menu(command, m) {
    let text = false
    let image = false
    let audio = false
    let video = false
    let outputText
    let mediaUrl

    switch (command.query) {
        case global.core.command.regular[0]:
            outputText = 'Hello!'
            mediaUrl = "hhhhaudahsudias"
            text = true
            break;
    
        default:
            text = false
            image = false
            audio = false
            video = false
            break;
    }
    const typeQuery = text ? 'text' : image ? 'image' : audio ? 'audio' : video ? 'video' : false
    return text ? {
        payload : typeQuery,
        text : outputText,
        url : false
    } : image ? {
        payload : typeQuery,
        url : mediaUrl,
        text : outputText,
    } : audio ? {
        payload : typeQuery,
        url: mediaUrl,
        text : false,
    } : video ? {
        payload : typeQuery,
        url : mediaUrl,
        text : outputText,
    } : false
}

export {
    menu
}