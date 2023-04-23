import makeRequest from "./api";

const logOutUser = async () => {

    return new Promise((resolve, reject) => {
        makeRequest("PUT", null, `/api/v1/auth/sign-out`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const logIn = async (name, password) => {

    return new Promise((resolve, reject) => {
        makeRequest("POST", { name: name, password: password }, `/api/v1/auth/log-in`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const getUserInfo = async () => {

    return new Promise((resolve, reject) => {
        makeRequest("GET", null, `/api/v1/user/get-user-data`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const updateUserInfo = async (name, password) => {

    return new Promise((resolve, reject) => {
        makeRequest("PUT", { name: name, password: password }, `/api/v1/user/profile-setup`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });

}

const signUp = async (name, password) => {

    return new Promise((resolve, reject) => {
        makeRequest("POST", { name: name, password: password }, `/api/v1/auth/sign-up`)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
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