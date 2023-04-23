import makeRequest from "./api";

const seeMessage = async (chatId, messageId, chatType) => {

    return new Promise((resolve, reject) => {
        makeRequest("POST", null, `/api/v1/chat/see-message/${chatId}/${messageId}/${chatType}`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}

const getAllChats = async () => {

    return new Promise((resolve, reject) => {
        makeRequest("GET", null, `/api/v1/chat/get-all-chats`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

export {
    seeMessage,
    getAllChats
}