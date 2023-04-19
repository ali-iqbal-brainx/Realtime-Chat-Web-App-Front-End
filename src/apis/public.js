import axios from "axios";

const postMessagePublic = async (msg) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'POST',
            url: 'http://localhost:4000/api/v1/chat/append-message',
            data: { message: msg.trim() }
        }).then(res => {

            console.log("success in posting message in public :", res.data.chat);
            resolve(res.data.chat);

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

const getPublicChat = async (check) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'GET',
            url: `http://localhost:4000/api/v1/chat/get-public-chat-data/${check}`
        }).then(res => {

            console.log("success");
            console.log("get public chat res :", res.data.publicChat[0]);

            resolve(res.data.publicChat);
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
    postMessagePublic,
    getPublicChat
}