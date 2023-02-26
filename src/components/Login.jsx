import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const LogIn = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const nameEvent = (e) => {
        setName(e.target.value);
    }
    const passwordEvent = (e) => {
        setPassword(e.target.value);
    }

    const logInUser = (e) => {

        e.preventDefault();
        if (password === '' || name === '') {
            alert("Empty or Invalid Input");
        } else {
            const credentials = { name, password };
            console.log("User credentials :", credentials);
            // axios({
            //     method: 'POST',
            //     url: 'https://locahost:4000/log-in', credentials,
            // }).then(res => {

            //     if (res.message === "success") {
            //         <Navigate to="/" />
            //     }

            //     setName("");
            //     setPassword("");
            //     setConfirmPassword("");

            // }).catch(e => {

            //     console.log("Error occured :", e);

            //     setName("");
            //     setPassword("");
            //     setConfirmPassword("");

            // });
        }

    }
    return (
        <>
            <div className="App">
                <div className="center_div">
                    <br />
                    <h1> Log In</h1>
                    <br />
                    <form>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            onChange={nameEvent}
                            value={name}

                        />
                        <br /><br />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            onChange={passwordEvent}
                            value={password}

                        />
                        <br /><br />
                        <button
                            className="registerBtn"
                            type="submit"
                            onClick={(e) => logInUser(e)}>
                            Register
                        </button>
                        <button className="signUpBtn" onClick={(e)=>e.preventDefault()}>
                            Sign Up
                        </button>
                        <br /><br />
                    </form>

                    <br />
                    <br />
                </div>
            </div>
        </>
    );
}

export default LogIn;