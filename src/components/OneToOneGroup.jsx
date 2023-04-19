import React, { useEffect, useState, useLayoutEffect } from 'react';
import socketIOClient from "socket.io-client";
import { useLocation, useNavigate } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import "../assets/css/chat.css";
import { getOneToOneChat } from '../apis/oneToOne';
import { seeMessage } from '../apis/chats';
import { postMessageOneToOne } from '../apis/oneToOne';

const ENDPOINT = "http://localhost:4000";

const OneToOneGroup = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [msg, setMsg] = useState("");
    const [members, setMembers] = useState([]);
    const [name, setName] = useState("");
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
                return await postMessageOneToOne(msg, groupId);
            }

            helper()
                .then(res => {

                    setMessages((prev) => [...prev, res.data.chat]);
                    //send message to socket.io on server
                    socket.emit(`send_one_to_one_message`, [res.data.chat, groupId]);
                    //send msg to all chats screen
                    socket.emit(`msg_counter`, [res.data.chat, groupId, "ONE-TO-ONE"]);
                    setMsg("");

                })
                .catch(error => {

                    if (error === 401 || error === 403) {
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("name");
                        localStorage.removeItem("userId");
                        navigate('/');
                    } else if (error === 406) {
                        alert(error);
                    } else {
                        alert(error);
                        navigate("/dash-board");
                    }

                });
        }
    }

    //recieve messages from socekt
    useEffect(() => {

        if (socket) {

            socket.on("recieve_one_to_one_message", (data) => {

                if (data[0].userDetails._id !== localStorage.getItem("userId") && data[1] === groupId) {
                    console.log("message recieved  useEffect:", data);

                    //update backend
                    const helper = async () => {
                        return await seeMessage(data[1], data[0]._id, "ONE_TO_ONE");
                    }

                    helper()
                        .catch(error => {

                            if (error === 401 || error === 403) {
                                localStorage.removeItem("access_token");
                                localStorage.removeItem("name");
                                localStorage.removeItem("userId");
                                navigate('/');
                            } else if (error === 406) {
                                alert(error);
                            } else {
                                alert(error);
                                navigate("/");
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

            const newSocket = socketIOClient(ENDPOINT);

            //call api
            const helper = async () => {
                return await getOneToOneChat(location.state.one_to_one_chat._id, true)
            }

            helper()
                .then(res => {

                    setMsg("");
                    setGroupId(res.data.oneToOneChat._id);
                    localStorage.getItem("userId") === res.data.oneToOneChat.ids[0] ? setName(res.data.oneToOneChat.names[1].name) : setName(res.data.oneToOneChat.names[0].name);
                    setMembers(res.data.oneToOneChat.ids);
                    if (res.data.oneToOneChat.messages?.length === 1) {
                        if ('_id' in res.data.oneToOneChat.messages[0]) {
                            setMessages(res.data.oneToOneChat.messages);
                        } else {
                            setMessages([]);
                        }
                    } else {
                        setMessages(res.data.oneToOneChat.messages);
                    }
                    setSocket(newSocket);
                    //join room socket msg to all users in socket
                    newSocket.emit("join_room", res.data.oneToOneChat._id);

                })
                .catch(error => {

                    if (error === 401 || error === 403) {
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("name");
                        localStorage.removeItem("userId");
                        navigate('/');
                    } else if (error === 406) {
                        alert(error);
                    } else {
                        alert(error);
                        navigate("/");
                    }

                });

            // CLEAN UP THE EFFECT
            return () => {

                if (newSocket) {
                    console.log("off");
                    newSocket.off('recieve_one_to_one_message');
                    newSocket.disconnect();
                }

            };

        }
    }, []);

    return (
        <>
            <div className='chat_div'>
                <section className="chat__section">
                    <div className="brand">
                        <h1>{name}</h1>
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
                                    <h4>{message.userDetails.name}</h4>
                                    <p>{message.message}</p>
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
                </section>
            </div>
        </>
    );
}

export default OneToOneGroup;