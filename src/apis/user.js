import axios from "axios";

const logOutUser = async () => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'PUT',
            url: 'http://localhost:4000/api/v1/auth/sign-out',
        }).then(res => {

            console.log("success in log out :", res.data.message);
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

const logIn = async (name, password) => {

    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/auth/log-in',
            data: {
                name: name,
                password: password
            }
        }).then(res => {

            console.log("success in log in :", res.data.user);
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

const getUserInfo = async () => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'GET',
            url: 'http://localhost:4000/api/v1/user/get-user-data'
        }).then(res => {

            console.log("success in getting user info");
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

const updateUserInfo = async (name, password) => {

    return new Promise((resolve, reject) => {
        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'PUT',
            url: 'http://localhost:4000/api/v1/user/profile-setup',
            data: {
                name: name,
                password: password
            }
        }).then(res => {

            console.log("success in updating user info");
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

const signUp = async (name, password) => {

    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/auth/sign-up',
            data: {
                name: name,
                password: password
            }
        }).then(res => {

            console.log("success in sign up");
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
    logOutUser,
    logIn,
    getUserInfo,
    updateUserInfo,
    signUp
}