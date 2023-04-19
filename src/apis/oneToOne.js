import axios from "axios";

const getOneToOneChat = async (chatId, check) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'GET',
            url: `http://localhost:4000/api/v1/chat/get-one-to-one-chat-data/${chatId}/${check}`
        }).then(res => {

            console.log("success in get onetoone chat");
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

const postMessageOneToOne = async (msg, groupId) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'POST',
            url: `http://localhost:4000/api/v1/chat/append-message-one-to-one/${groupId}`,
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

export {
    getOneToOneChat,
    postMessageOneToOne
}