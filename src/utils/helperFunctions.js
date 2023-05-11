const modifyTime = (message) => {

    const date = new Date(message.createdAt);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

export {
    modifyTime
}