import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateUserInfo } from "../apis/user";

const ProfileSetup = () => {
    const navigate = useNavigate();
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
        if (!localStorage.getItem("access_token")) {
            navigate("/");
        } else {

            //update backend
            const helper = async () => {
                return await getUserInfo();
            }

            helper()
                .then(res => {

                    setName(res.data.data.name);
                    setPassword("");
                    setConfirmPassword("");

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

    }, []);

    const updateUser = (e) => {

        e.preventDefault();
        if (password === '' || name === '' || confirmPassword === '') {
            alert("Empty or Invalid Input");
        } else if (password !== confirmPassword) {
            alert("Passowrd fields mismatch");
        } else {

            //update backend
            const helper = async () => {
                return await updateUserInfo(name, password);
            }

            helper()
                .then(res => {

                    navigate(-1);

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

    return (
        <>
            <div className="log_in">
                <div className="center_div">

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
                            className="updateBtn"
                            type="submit"
                            onClick={(e) => updateUser(e)}
                        >
                            Update
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

export default ProfileSetup;