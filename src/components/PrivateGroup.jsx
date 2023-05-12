import React, { useEffect, useLayoutEffect, useState } from 'react';
import socketIOClient from "socket.io-client";
import { useLocation, useNavigate } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import "../assets/css/chat.css";
import { seeMessage } from '../apis/chats';
import { modifyTime } from '../utils/helperFunctions';
import { getPrivateChatData, leavePrivateGroup, deletePrivateGroup, postMessagePrivate } from '../apis/private';

const PrivateGroup = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [msg, setMsg] = useState("");
    const [members, setMembers] = useState([]);
    const [name, setName] = useState("");
    const [chatCode, setChatCode] = useState("");
    const [adminId, setAdminId] = useState("");
    const [groupId, setGroupId] = useState("");
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);


    const msgEvent = (e) => {
        if (e.target.value.slice(-1) !== '\n') {
            setMsg(e.target.value);
        }
    }

    const sendMessage = (e) => {

        if (e.key === "Enter" && e.target.value !== '') {

            // Append 
            const helper = async () => {
                return await postMessagePrivate(msg, groupId);
            }

            helper()
                .then(res => {

                    setMessages((prev) => [...prev, res.data.msg]);
                    //send message to socket.io on server
                    socket.emit(`send_private_message`, [res.data.msg, groupId]);
                    //send msg to all chats screen
                    socket.emit(`msg_counter`, [res.data.msg, groupId, "PRIVATE"]);
                    setMsg("");

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
    }

    const leaveGroup = () => {

        let text = "Are you sure you want to leave the group...?";
        if (window.confirm(text) === true) {

            const helper = async () => {
                return await leavePrivateGroup(groupId);
            }

            helper()
                .then((res) => {
                    if (socket) {
                        console.log("off");
                        socket.off('recieve_private_message');
                        socket.disconnect();
                    }
                    navigate('/dash-board');
                })
                .catch((error) => {

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

    }

    const deleteGroup = () => {

        let text = "Are you sure you want to delete the group...?";
        if (window.confirm(text) === true) {

            const helper = async () => {
                return await deletePrivateGroup(groupId);
            }

            helper()
                .then((res) => {

                    if (socket) {
                        console.log("off");
                        socket.off('recieve_private_message');
                        socket.disconnect();
                    }
                    navigate('/dash-board');

                })
                .catch((error) => {

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

    }

    //recieve messages from socekt
    useEffect(() => {

        if (socket) {

            socket.on("recieve_private_message", (data) => {

                if (data[0].userDetails._id !== localStorage.getItem("userId") && data[1] === groupId) {
                    console.log("message recieved  useEffect:", data);

                    //update backend
                    const helper = async () => {
                        return await seeMessage(data[0]._id);
                    }

                    helper()
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

                    setMessages((prev) => [...prev, data[0]]);

                }

            });
        }

    }, [socket]);

    useLayoutEffect(() => {

        if (!localStorage.getItem("access_token")) {
            navigate("/");
        } else {

            const newSocket = socketIOClient(process.env.REACT_APP_END_POINT);

            //call api
            const helper = async () => {
                return await getPrivateChatData(location.state.private_group_chat._id, true)
            }

            helper()
                .then(res => {

                    setMsg("");
                    setGroupId(res.data.privateChat._id);
                    setChatCode(res.data.privateChat.chatCode);
                    setAdminId(res.data.privateChat.adminId);
                    setName(res.data.privateChat.name);
                    setMembers(res.data.privateChat.ids);
                    if (res.data.privateChat.messages?.length === 1) {
                        if ('_id' in res.data.privateChat.messages[0]) {
                            setMessages(res.data.privateChat.messages);
                        } else {
                            setMessages([]);
                        }
                    } else {
                        setMessages(res.data.privateChat.messages);
                    }
                    setSocket(newSocket);
                    //join room socket msg to all users in socket
                    newSocket.emit("join_room", res.data.privateChat._id);

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

            // CLEAN UP THE EFFECT
            return () => {
                if (newSocket) {
                    console.log("off");
                    newSocket.off('recieve_private_message');
                    newSocket.disconnect();
                }

            };

        }

    }, []);

    return (
        <>

            <div className="chat_div">
                <section className="chat__section">
                    <div className="brand">
                        <span>
                            <h1>{name}</h1>
                            {(() => {
                                if (adminId === localStorage.getItem("userId")) {
                                    return (
                                        <h4>Chat Code: {chatCode}</h4>
                                    )
                                } else {
                                    return null
                                }
                            })()}
                        </span>
                    </div>
                    <ScrollToBottom className='message__area'>
                        {messages.map((message) => {
                            return (
                                <div
                                    key={message._id}
                                    className={
                                        message.userDetails._id === localStorage.getItem("userId") ?
                                            "outgoing" :
                                            "incoming"
                                    }
                                >
                                    <h4>
                                        {message.userDetails.name}
                                    </h4>
                                    <p>
                                        {message.message}
                                    </p>
                                    <h6>
                                        {modifyTime(message)}
                                    </h6>
                                </div>
                            )
                        })}
                    </ScrollToBottom>
                    <div>
                        <textarea
                            value={msg}
                            id="textarea"
                            cols="30"
                            rows="1"
                            placeholder="Write a message..."
                            onChange={msgEvent}
                            onKeyUp={sendMessage}
                        />
                    </div>

                    <div className='ldBtn'>
                        {
                            localStorage.getItem("userId") === adminId ?

                                <button
                                    className="registerBtn"
                                    onClick={deleteGroup}
                                >
                                    Delete group
                                </button>

                                :
                                <button
                                    className="registerBtn"
                                    onClick={() => leaveGroup(adminId, localStorage.getItem("userId"))}
                                >
                                    Leave Group
                                </button>

                        }
                    </div>
                </section>
            </div>

        </>
    );
}

export default PrivateGroup;