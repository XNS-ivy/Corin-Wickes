async function menu(command, m) {
    let outputText = '';
    let mediaUrl = false;
    let typeQuery = false;

    switch (command.query) {
        case global.core.command.regular[0]:
            outputText = 'Hello! Here is some text.';
            typeQuery = 'text';
            break;

        default:
            outputText = 'Command not recognized.';
            typeQuery = 'text';
            break;
    }
    const response = {
        payload: typeQuery,
        text: outputText,
        url: mediaUrl,
    };

    return response;
}

export {
    menu
}