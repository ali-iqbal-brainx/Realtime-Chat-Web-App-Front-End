import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const ProfileSetup = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const nameEvent = (e) => {
        setName(e.target.value);
    }
    const passwordEvent = (e) => {
        setPassword(e.target.value);
    }
    const confirmPasswordEvent = (e) => {
        setConfirmPassword(e.target.value);
    }

    useEffect(() => {
        // axios({
        //     method: 'GET',
        //     url: 'https://localhost:4000/get-user',
        //     params: { userId: "123" }
        // }).then(res => {
        //     setName(res.name);
        //     setPassword("");
        //     setConfirmPassword("");
        // }).catch(e => {
        //     console.log("Error occured :", e);
        // });
    }, []);

    const updateUser = (e) => {

        e.preventDefault();
        if (password === '' || name === '' || confirmPassword === '') {
            alert("Empty or Invalid Input");
        } else if (password !== confirmPassword) {
            alert("Passowrd fields mismatch");
        } else {
            const profileObj = { name, password };
            console.log("Profile Object :", profileObj);
            // axios({
            //     method: 'POST',
            //     url: 'https://locahost:4000/update-profile', profileObj,
            // }).then(res => {

            //     if (res.status === 200) {
            //         <Navigate to="/dashboard" />
            //     }

            //     setName("");
            //     setPassword("");
            //     setConfirmPassword("");

            // }).catch(e => {
            //     console.log("Error occured :", e);
            //     setName("");
            //     setPassword("");
            //     setConfirmPassword("");
            // })
        }

    }
    return (
        <>
            <div className="App">
                <div className="center_div">
                <button>back</button>
                    <br />
                    <h1> Update Profile</h1>
                    <br />
                    <form>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Your Name..."
                            onChange={nameEvent}
                            value={name}

                        />
                        <br /><br />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password..."
                            onChange={passwordEvent}
                            value={password}

                        />
                        <br /><br />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password..."
                            onChange={confirmPasswordEvent}
                            value={confirmPassword}

                        />
                        <br /><br />
                        <button
                            className="updateBtn"
                            type="submit"
                            onClick={(e) => updateUser(e)}>
                            Update
                        </button>
                        <br /><br />
                    </form>

                    <br />
                    <br />
                </div>
            </div>
        </>
    )
}

export default ProfileSetup;