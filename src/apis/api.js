import axios from "axios";

const makeRequest = async (httpMethod, data = null, url) => {
    console.log("endpoint :", process.env.REACT_APP_END_POINT);
    url = process.env.REACT_APP_END_POINT + url;
    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: httpMethod,
            url,
            data
        }).then(res => {

            console.log("success");
            resolve(res);

        }).catch(e => {

            console.log("Error occured :", e);
            reject(e);
            
        });
    });
}

export default makeRequest