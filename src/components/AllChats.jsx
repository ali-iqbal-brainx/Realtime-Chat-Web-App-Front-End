import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../assets/css/allChats.css";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4000";

const AllChats = () => {

    const navigate = useNavigate();
    const [publicChat, setPublicChat] = useState([]);
    const [privateChats, setPrivateChats] = useState([]);
    const [oneToOneChats, setOneToOneChats] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [chek, setCehk] = useState(false);
    const [socket, setSocket] = useState(null);

    const publicGroup = () => {
        localStorage.getItem("access_token") ?
            navigate("/public-chat") :
            navigate("/");
    }

    const privateGroup = (privateChatData) => {

        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'GET',
            url: `http://localhost:4000/api/v1/chat/get-private-chat-data/${privateChatData._id}/${true}`
        }).then(res => {

            console.log("success");
            console.log(res.data);
            // clean the msg area
            navigate("/private-group-chat", {
                state: {
                    private_group_chat: res.data.privateChat
                },
            });

        }).catch(e => {

            console.log("Error occured :", e);
            if (e?.response?.request?.status === 401 || e?.response?.request?.status === 403) {
                alert(e.response.data.error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("name");
                localStorage.removeItem("userId");
                navigate('/');
            }
            if (e?.response?.request?.status === 406) {
                alert(e.response.data.error);
            }
            if (e?.response?.request?.status === 400) {
                alert(e.response.data.error);
                navigate(-1);
            } else {
                alert("server error");
            }

        });
    }

    const oneToOneGroup = (oneToOneChat) => {

        axios({
            headers: {
                access_token: 'Bearer ' + localStorage.getItem("access_token")
            },
            method: 'GET',
            url: `http://localhost:4000/api/v1/chat/get-one-to-one-chat-data/${oneToOneChat._id}/${true}`
        }).then(res => {

            console.log("success", res.data);
            // clean the msg area
            navigate("/one-to-one-chat", {
                state: {
                    one_to_one_chat: res.data.oneToOneChat
                },
            });

        }).catch(e => {

            console.log("Error occured :", e);
            if (e?.response?.request?.status === 401 || e?.response?.request?.status === 403) {
                alert(e.response.data.error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("name");
                localStorage.removeItem("userId");
                navigate('/');
            }
            if (e?.response?.request?.status === 406) {
                alert(e.response.data.error);
            }
            if (e?.response?.request?.status === 400) {
                alert(e.response.data.error);
                navigate(-1);
            } else {
                alert("server error");
            }

        });
    }

    useLayoutEffect(() => {

        if (localStorage.getItem("access_token")) {

            axios({
                headers: {
                    access_token: 'Bearer ' + localStorage.getItem("access_token")
                },
                method: 'GET',
                url: 'http://localhost:4000/api/v1/chat/get-all-chats'
            }).then(res => {

                console.log("response of one to one:", res.data.oneToOneChats);
                setOneToOneChats(res.data.oneToOneChats);

            }).catch(e => {

                console.log("Error occured :", e);
                if (e?.response?.request?.status === 401 || e?.response?.request?.status === 403) {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("name");
                    localStorage.removeItem("access_token");
                    navigate('/');
                }

            });

        } else {
            navigate("/");
        }

    }, [chek]);

    //recieve messages from socekt
    useEffect(() => {

        if (socket) {

            // add new user in one to one chat who newly signed up
            socket.on("append_new_user", (data) => {
                console.log("add new user socket :", data);

                if (data) {

                    setCehk((prev) => !prev);
                }

            });

            socket.on("recieve_msg_all_chats", (data) => {

                //socket data from public chat
                if (data[2] === "PUBLIC") {

                    setPublicChat(
                        publicChat.map((chat) => {
                            const unseenCount = ++chat.unseenCount;
                            chat.messages.push(data[0]);
                            return { ...chat, unseenCount };
                        })
                    );

                }

                //socket data from private chat
                if (data[2] === `PRIVATE`) {

                    const chatId = data[1];
                    //if private chat contains a chat with this chatId then set the state otherwise dont
                    for (let i = 0; i < privateChats.length; i++) {

                        if (privateChats[i]._id === chatId) {

                            setPrivateChats(
                                privateChats.map((chat) => {
                                    if (chat._id === chatId) {
                                        const unseenCount = ++chat.unseenCount;
                                        chat.messages.push(data[0]);
                                        return { ...chat, unseenCount };
                                    } else {
                                        return chat;
                                    }

                                })
                            );

                        }

                    }


                }

                //socket data from one to one chat
                if (data[2] === `ONE-TO-ONE`) {

                    setCehk(prev => !prev);

                }

            });
        }
    }, [socket]);

    useLayoutEffect(() => {

        if (localStorage.getItem("access_token")) {

            const newSocket = socketIOClient(ENDPOINT);

            axios({
                headers: {
                    access_token: 'Bearer ' + localStorage.getItem("access_token")
                },
                method: 'GET',
                url: 'http://localhost:4000/api/v1/chat/get-all-chats'
            }).then(res => {

                console.log("response :", res.data);

                setPublicChat(res.data.publicChat);
                setPrivateChats(res.data.privateChats);
                setOneToOneChats(res.data.oneToOneChats);
                setIsLoaded(true);
                setSocket(newSocket);

                //join room socket msg to all users in socket
                newSocket.emit("join_room", "ALLCHATSGROUP");
                //join room socket msg to add new user
                newSocket.emit("join_room", "NEW_USER");

            }).catch(e => {

                console.log("Error occured :", e);
                if (e?.response?.request?.status === 401 || e?.response?.request?.status === 403) {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("name");
                    localStorage.removeItem("access_token");
                    navigate('/');
                }

            });

            // CLEAN UP THE EFFECT
            return () => {
                console.log("off");
                if (newSocket) {
                    console.log("off");
                    newSocket.off('recieve_msg_all_chats');
                    newSocket.off("add_new_user");
                    newSocket.disconnect();
                }

            };

        } else {
            navigate("/");
        }


    }, []);

    return (
        <>
            <div className="main_Div">
                <div className='brand'>
                    <h1>CHATS</h1>
                </div>
                <hr />
                <div className='all_chats'>

                    {isLoaded ? publicChat.map((chat) => {
                        return (
                            <div className='chat_dv' onClick={publicGroup} key={chat._id}>
                                <h4>{chat.name}</h4>
                                <span className='unseen_Div'><p>{chat.unseenCount ? chat.unseenCount : null}</p></span>
                                {(() => {
                                    if (!chat.messages.length) {
                                        return (
                                            <p className='new_convo'>Be first one to message...</p>
                                        )
                                    } else {
                                        if (chat.messages[chat.messages.length - 1].userDetails._id === localStorage.getItem("userId")) {
                                            return (
                                                <p>
                                                    <span style={{ fontWeight: 'bold' }}>You: </span>
                                                    {chat.messages[chat.messages.length - 1].message}
                                                </p>
                                            )
                                        } else {
                                            return (
                                                <p>
                                                    <span style={{ fontWeight: 'bold' }}>{chat.messages[chat.messages.length - 1].userDetails.name}: </span>
                                                    {chat.messages[chat.messages.length - 1].message}
                                                </p>
                                            )
                                        }
                                    }
                                })()}
                            </div>
                        )
                    }) : 'Loading Public Chat data...'}

                    {isLoaded ? privateChats.map((privateChat) => {
                        return (
                            <div className='chat_dv' onClick={() => { privateGroup(privateChat) }} key={privateChat._id}>
                                <h4>{privateChat.name}</h4>
                                <span className='unseen_Div'><p>{privateChat.unseenCount ? privateChat.unseenCount : null}</p></span>
                                {(() => {
                                    if (!privateChat.messages.length) {
                                        return (
                                            <p className='new_convo'>Be first one to message...</p>
                                        )
                                    } else {
                                        if (privateChat.messages[privateChat.messages.length - 1].userDetails._id === localStorage.getItem("userId")) {
                                            return (
                                                <p>
                                                    <span style={{ fontWeight: 'bold' }}>You: </span>
                                                    {privateChat.messages[privateChat.messages.length - 1].message}
                                                </p>
                                            )
                                        } else {
                                            return (
                                                <p>
                                                    <span style={{ fontWeight: 'bold' }}>{privateChat.messages[privateChat.messages.length - 1].userDetails.name}: </span>
                                                    {privateChat.messages[privateChat.messages.length - 1].message}
                                                </p>
                                            )
                                        }
                                    }
                                })()}

                            </div>
                        )
                    }) : 'Loading Private Chats data...'}

                    {isLoaded ? oneToOneChats.map((oneToOneChat) => {
                        return (
                            <div className='chat_dv' onClick={() => { oneToOneGroup(oneToOneChat) }} key={oneToOneChat._id}>
                                <h4>{oneToOneChat.ids[0] === localStorage.getItem("userId") ? oneToOneChat.names[1].name : oneToOneChat.names[0].name}</h4>
                                <span className='unseen_Div'><p>{oneToOneChat.unseenCount ? oneToOneChat.unseenCount : null}</p></span>
                                {(() => {
                                    if (!oneToOneChat.messages.length) {
                                        return (
                                            <p className='new_convo'>Be first one to message...</p>
                                        )
                                    } else {
                                        if (oneToOneChat.messages[oneToOneChat.messages.length - 1].userDetails._id === localStorage.getItem("userId")) {
                                            return (
                                                <p>
                                                    <span style={{ fontWeight: 'bold' }}>You: </span>
                                                    {oneToOneChat.messages[oneToOneChat.messages.length - 1].message}
                                                </p>
                                            )
                                        } else {
                                            return (
                                                <p>
                                                    <span style={{ fontWeight: 'bold' }}>{oneToOneChat.messages[oneToOneChat.messages.length - 1].userDetails.name}: </span>
                                                    {oneToOneChat.messages[oneToOneChat.messages.length - 1].message}
                                                </p>
                                            )
                                        }
                                    }
                                })()}

                            </div>
                        )
                    }) : 'Loading One to One Chats data...'}

                </div>

            </div>
        </>
    );
}

export default AllChats;