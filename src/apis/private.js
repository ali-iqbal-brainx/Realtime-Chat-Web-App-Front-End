import axios from "axios";

const createPrivateGroup = async (name) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'POST',
            url: `http://localhost:4000/api/v1/chat/create-private-chat-group`,
            data: {
                name: name
            }
        }).then(res => {

            console.log("success in creating group :", res.data.private_group_chat);
            resolve(res.data.private_group_chat);

        }).catch(e => {

            console.log("Error occured :", e);
            reject(
                e?.response?.request?.status ?
                    e.response.request.status :
                    "Something went wrong!"
            );

        });
    });

}

const getPrivateChatData = async (chatId, check) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'GET',
            url: `http://localhost:4000/api/v1/chat/get-private-chat-data/${chatId}/${check}`
        }).then(res => {

            console.log("success in get private chat");
            resolve(res);

        }).catch(e => {

            console.log("Error occured :", e);
            reject(
                e?.response?.request?.status ?
                    e.response.request.status :
                    "Something went wrong!"
            );

        });
    });

}

const postMessagePrivate = async (msg, groupId) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'POST',
            url: `http://localhost:4000/api/v1/chat/append-message-private-group/${groupId}`,
            data: { message: msg.trim() }
        }).then(res => {

            console.log("success in posting message in group");
            resolve(res);

        }).catch(e => {

            console.log("Error occured :", e);
            reject(
                e?.response?.request?.status ?
                    e.response.request.status :
                    "Something went wrong!"
            );
        });
    });

}

const leavePrivateGroup = async (groupId) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'PUT',
            url: `http://localhost:4000/api/v1/chat/leave-private-group/${groupId}`
        }).then(res => {

            console.log("success in leaving group");
            resolve(res);

        }).catch(e => {

            console.log("Error occured :", e);
            reject(
                e?.response?.request?.status ?
                    e.response.request.status :
                    "Something went wrong!"
            );
        });
    });

}

const deletePrivateGroup = async (groupId) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'DELETE',
            url: `http://localhost:4000/api/v1/chat/delete-group/${groupId}`
        }).then(res => {

            console.log("success in deleting group");
            resolve(res);

        }).catch(e => {

            console.log("Error occured :", e);
            reject(
                e?.response?.request?.status ?
                    e.response.request.status :
                    "Something went wrong!"
            );
        });
    });

}

const joinPrivateGroup = async (code) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'POST',
            url: `http://localhost:4000/api/v1/chat/join-private-chat-group/${code}`
        }).then(res => {

            console.log("success in joining group");
            resolve(res);

        }).catch(e => {

            console.log("Error occured :", e);
            reject(
                e?.response?.request?.status ?
                    e.response.request.status :
                    "Something went wrong!"
            );
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