import makeRequest from "./api";

const createPrivateGroup = async (name) => {

    return new Promise((resolve, reject) => {
        makeRequest("POST", { name: name }, `/api/v1/chat/create-private-chat-group`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const getPrivateChatData = async (chatId, check) => {

    return new Promise((resolve, reject) => {
        makeRequest("GET", null, `/api/v1/chat/get-private-chat-data/${chatId}/${check}`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const postMessagePrivate = async (msg, groupId) => {

    return new Promise((resolve, reject) => {
        makeRequest("POST", { message: msg.trim() }, `/api/v1/chat/append-message-private-group/${groupId}`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const leavePrivateGroup = async (groupId) => {

    return new Promise((resolve, reject) => {
        makeRequest("PUT", null, `/api/v1/chat/leave-private-group/${groupId}`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const deletePrivateGroup = async (groupId) => {

    return new Promise((resolve, reject) => {
        makeRequest("DELETE", null, `/api/v1/chat/delete-group/${groupId}`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const joinPrivateGroup = async (code) => {

    return new Promise((resolve, reject) => {
        makeRequest("POST", null, `/api/v1/chat/join-private-chat-group/${code}`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

export {
    createPrivateGroup,
    getPrivateChatData,
    postMessagePrivate,
    leavePrivateGroup,
    deletePrivateGroup,
    joinPrivateGroup
}