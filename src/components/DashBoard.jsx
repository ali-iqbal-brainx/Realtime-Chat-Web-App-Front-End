import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../assets/css/dashboard.css';
import { logOutUser } from '../apis/user';

const DashBoard = () => {

    const navigate = useNavigate();

    const logOut = () => {

        //create private group chat api
        const helper = async () => {
            return await logOutUser();
        }

        helper()
            .then(res => {

                localStorage.removeItem("access_token");
                localStorage.removeItem("name");
                localStorage.removeItem("userId");
                navigate("/");

            })
            .catch(error => {

                if (error.response.request.status === 401 || error.response.request.status === 403) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("name");
                    localStorage.removeItem("userId");
                    navigate('/');
                } else if (error.response.data.error === 406) {
                    alert(error.response.data.error);
                } else {
                    alert(error.response.data.error);
                    navigate("/");
                }

            });
    }

    const updateProfile = () => {

        localStorage.getItem("access_token") ?
            navigate("/profile-setup") :
            navigate("/");

    }

    const dashBoard = () => {

        localStorage.getItem("access_token") ?
            navigate("/dash-board") :
            navigate("/");

    }

    const publicGroup = () => {
        localStorage.getItem("access_token") ?
            navigate("/public-chat") :
            navigate("/");
    }

    const privateGroup = () => {
        localStorage.getItem("access_token") ?
            navigate("/create-join") :
            navigate("/");
    }

    const allChats = () => {
        localStorage.getItem("access_token") ?
            navigate("/all-chats") :
            navigate("/");
    }

    useEffect(() => {

        if (!localStorage.getItem("access_token")) {
            navigate("/");
        }

    }, []);

    return (
        <>
            <div>
                <ul>
                    <li><p className="active" onClick={dashBoard}>Home</p></li>
                    <li><p onClick={updateProfile}>Profile Setup</p></li>
                    <li><p onClick={logOut} href="/log-in">Log Out</p></li>
                </ul>

            </div>
            <div className='dashboard'>
                <h1> DashBoard</h1>
                <br />
                <button onClick={publicGroup}>Public Group</button>
                <button onClick={privateGroup}>Private Group</button>
                <br /> <br />
                <button onClick={allChats}>Existing Chats</button>

            </div>

        </>
    );
}

export default DashBoard;