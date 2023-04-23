import makeRequest from "./api";

const postMessagePublic = async (msg) => {

    return new Promise((resolve, reject) => {
        makeRequest("POST", { message: msg.trim() }, `/api/v1/chat/append-message`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const getPublicChat = async (check) => {

    return new Promise((resolve, reject) => {
        makeRequest("GET", null, `/api/v1/chat/get-public-chat-data/${check}`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

export {
    postMessagePublic,
    getPublicChat
}