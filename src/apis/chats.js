import axios from "axios";

const seeMessage = async (chatId, messageId, chatType) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'POST',
            url: `http://localhost:4000/api/v1/chat/see-message/${chatId}/${messageId}/${chatType}`
        }).then(res => {

            console.log(res.data.message);
            resolve(res.data.message);

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
    seeMessage
}