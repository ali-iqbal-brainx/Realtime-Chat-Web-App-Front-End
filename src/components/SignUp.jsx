import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { signUp } from "../apis/user";

const SignUp = () => {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [socket, setSocket] = useState(null);

    const nameEvent = (e) => {
        setName(e.target.value);
    }
    const passwordEvent = (e) => {
        setPassword(e.target.value);
    }
    const confirmPasswordEvent = (e) => {
        setConfirmPassword(e.target.value);
    }

    const signUpUser = (e) => {

        e.preventDefault();
        if (password === '' || name === '' || confirmPassword === '') {
            alert("Empty or Invalid Input");
        } else if (password !== confirmPassword) {
            alert("Passowrd fields mismatch");
        } else {

            //update backend
            const helper = async () => {
                return await signUp(name, password);
            }

            helper()
                .then(res => {

                    //send msg to all chats screen to add this new user
                    if (socket && socket.connected) {
                        console.log("new user added");
                        socket.emit("add_new_user", true)
                    }
                    navigate("/");

                })
                .catch(error => {

                    if (error.response.request.status === 406) {
                        alert(error.response.data.error);
                    }

                });
        }

    }

    useEffect(() => {

        const newSocket = socketIOClient(process.env.REACT_APP_END_POINT);
        setSocket(newSocket);
        //join room socket msg to all users in socket
        newSocket.emit("join_room", "NEW_USER");

        // CLEAN UP THE EFFECT
        return () => {
            console.log("off");
            if (newSocket) {
                console.log("off");
                newSocket.disconnect();
            }

        };
    }, []);

    return (
        <>
            <div className="log_in">
                <div className="center_div">
                    <br />
                    <h1> Sign Up</h1>
                    <br />
                    <form>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Your Name..."
                            onChange={nameEvent}
                            value={name}

                        />

                        <br />
                        <br />

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password..."
                            onChange={passwordEvent}
                            value={password}

                        />

                        <br />
                        <br />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password..."
                            onChange={confirmPasswordEvent}
                            value={confirmPassword}

                        />

                        <br />
                        <br />

                        <button
                            className="registerBtn"
                            type="submit"
                            onClick={(e) => signUpUser(e)}
                        >
                            Register
                        </button>

                        <br />
                        <br />

                    </form>

                    <br />
                    <br />
                </div>
            </div>
        </>
    )
}


export default SignUp;