import makeRequest from "./api";

const getOneToOneChat = async (chatId, check) => {

    return new Promise((resolve, reject) => {
        makeRequest("GET", null, `/api/v1/chat/get-one-to-one-chat-data/${chatId}/${check}`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const postMessageOneToOne = async (msg, groupId) => {

    return new Promise((resolve, reject) => {
        makeRequest("POST", { message: msg.trim() }, `/api/v1/chat/append-message-one-to-one/${groupId}`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

export {
    getOneToOneChat,
    postMessageOneToOne
}