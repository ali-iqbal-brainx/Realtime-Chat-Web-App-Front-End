import React, { useEffect, useState, useLayoutEffect } from 'react';
import socketIOClient from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import "../assets/css/chat.css";
import { postMessagePublic, getPublicChat } from '../apis/public';
import { seeMessage } from '../apis/chats';

const Chat = () => {

    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const [name, setName] = useState("");
    const [chatCode, setChatCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [roomId, setRoomId] = useState("");
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
                return await postMessagePublic(msg);
            }

            helper()
                .then(res => {

                    setMessages((prev) => [...prev, res.data.chat]);
                    //send message to socket.io on server
                    socket.emit(`send_message`, [res.data.chat, roomId]);
                    //send msg to all chats screen
                    socket.emit(`msg_counter`, [res.data.chat, roomId, "PUBLIC"]);
                    setMsg("");

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
    }

    //recieve messages from socekt
    useEffect(() => {
        if (socket) {
            socket.on("recieve_message", (data) => {

                if (data[0].userDetails._id !== localStorage.getItem("userId") && data[1] === roomId) {
                    console.log("message recieved  useEffect:", data);

                    //update backend
                    const helper = async () => {
                        return await seeMessage(data[1], data[0]._id, "PUBLIC");
                    }

                    helper()
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
                return await getPublicChat(true)
            }

            helper()
                .then(res => {
                    setMsg("");
                    setChatCode(res.data.publicChat[0].chatCode);
                    setName(res.data.publicChat[0].name);
                    if (res.data.publicChat[0].messages?.length === 1) {
                        if ('_id' in res.data.publicChat[0].messages[0]) {
                            console.log("in")
                            setMessages(res.data.publicChat[0].messages);
                        } else {
                            setMessages([]);
                        }
                    } else {
                        setMessages(res.data.publicChat[0].messages);
                    }
                    setRoomId(res.data.publicChat[0]._id);
                    setSocket(newSocket);

                    //join room socket msg to all users in socket
                    newSocket.emit("join_room", res.data.publicChat[0]._id);
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

            return () => {
                console.log("off");
                if (newSocket) {
                    console.log("off");
                    newSocket.off('recieve_message');
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
                        <h1>Chat Group</h1>
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
                            onKeyUp={sendMessage} />
                    </div>
                </section>
            </div>
        </>
    );
}

export default Chat;