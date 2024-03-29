import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../assets/css/allChats.css"
import socketIOClient from "socket.io-client";
import { getAllChats } from '../apis/chats';
import { getOneToOneChat } from '../apis/oneToOne';
import { getPrivateChatData } from '../apis/private';

const AllChats = () => {

    const navigate = useNavigate();
    const [allChats, setAllChats] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [chek, setCehk] = useState(false);
    const [socket, setSocket] = useState(null);

    const publicGroup = () => {
        localStorage.getItem("access_token") ?
            navigate("/public-chat") :
            navigate("/");
    }

    const privateGroup = (privateChatData) => {

        // call API
        const helper = async () => {
            return await getPrivateChatData(privateChatData._id, true);
        }

        helper()
            .then(res => {

                navigate("/private-group-chat", {
                    state: {
                        private_group_chat: res.data.privateChat
                    }
                });

            })
            .catch(e => {

                if (e.response.request.status === 401 || e.response.request.status === 403) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("name");
                    localStorage.removeItem("userId");
                    navigate('/');
                } else if (e.response.request.status === 406) {
                    alert(e.response.data.error);
                } else {
                    alert(e.response.data.error);
                    navigate("/dash-board");
                }

            });
    }

    const oneToOneGroup = (oneToOneChat) => {

        // call API
        const helper = async () => {
            return await getOneToOneChat(oneToOneChat._id, true);
        }

        helper()
            .then(res => {

                navigate("/one-to-one-chat", {
                    state: {
                        one_to_one_chat: res.data.oneToOneChat
                    }
                });

            })
            .catch(error => {

                if (error.response.request.status === 401 || error.response.request.status === 403) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("name");
                    localStorage.removeItem("userId");
                    navigate('/');
                } else if (error.response.request.status === 406) {
                    alert(error.response.data.error);
                } else {
                    alert(error.response.data.error);
                    navigate("/dash-board");
                }

            });
    }

    const redirectToChat = (chat) => {

        if (chat?.adminId) {
            privateGroup(chat);
        } else if (chat?.names) {
            oneToOneGroup(chat);
        } else {
            publicGroup(chat);
        }

    }

    useLayoutEffect(() => {

        if (localStorage.getItem("access_token")) {

            // call API
            const helper = async () => {
                return await getAllChats();
            }

            helper()
                .then(res => {

                    setAllChats(res.data.allChats);

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
                        navigate("/dash-board");
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

                    setCehk((prev) => !prev);

                }

                //socket data from private chat
                if (data[2] === `PRIVATE`) {

                    const chatId = data[1];
                    //if private chat contains a chat with this chatId then set the state otherwise dont
                    for (let i = 0; i < allChats.length; i++) {

                        if (allChats[i]._id === chatId) {

                            setCehk((prev) => !prev);

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

            const newSocket = socketIOClient(process.env.REACT_APP_END_POINT);

            // call api 
            const helper = async () => {
                return await getAllChats();
            }

            helper()
                .then(res => {

                    setAllChats(res.data.allChats);
                    setIsLoaded(true);
                    setSocket(newSocket);

                    //join room socket msg to all users in socket
                    newSocket.emit("join_room", "ALLCHATSGROUP");
                    //join room socket msg to add new user
                    newSocket.emit("join_room", "NEW_USER");

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
                        navigate("/dash-board");
                    }

                });

            // CLEAN UP THE EFFECT
            return () => {
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

                    {isLoaded ? allChats.map((chat) => {
                        return (
                            <div
                                className='chat_dv' onClick={() => { redirectToChat(chat) }} key={chat._id}>
                                {(() => {
                                    if (chat.name) {
                                        return (<h4>{chat.name}</h4>);
                                    } else {
                                        return (<h4>{chat.ids[0] === localStorage.getItem("userId") ? chat.names[1].name : chat.names[0].name}</h4>);
                                    }
                                })()}
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
                    }) : 'Loading All Chats data...'}

                </div>

            </div>
        </>
    );
}

export default AllChats;