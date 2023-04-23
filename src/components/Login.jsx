import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";
import { logIn } from "../apis/user";

const Login = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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

            //create private group chat api
            const helper = async () => {
                return await logIn(name, password);
            }

            helper()
                .then(res => {

                    localStorage.setItem('access_token', res.headers.access_token);
                    localStorage.setItem('name', res.data.user.name);
                    localStorage.setItem("userId", res.data.user._id);
                    //redirect to the dashboard
                    navigate("/dash-board");

                })
                .catch(e => {

                    if (e.response.request.status === 400 || e.response.request.status === 406) {
                        alert(e.response.data.error);
                    } else {
                        alert(e.response.data.error);
                    }

                });
        }
    }

    const signUp = (e) => {

        e.preventDefault();
        navigate("/sign-up");

    }

    useEffect(() => {
        localStorage.getItem("access_token") ?
            navigate("/dash-board") :
            console.log("in log in");
    }, []);

    return (
        <>
            <div className="log_in">
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

                        <br />
                        <br />

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            onChange={passwordEvent}
                            value={password}

                        />

                        <br />
                        <br />

                        <button
                            className="registerBtn"
                            type="submit"
                            onClick={(e) => logInUser(e)}
                        >
                            Login
                        </button>

                        <br />
                        <br />

                        <button
                            className="signUpBtn"
                            onClick={(e) => signUp(e)}
                        >
                            Sign Up
                        </button>

                        <br />
                        <br />

                    </form>

                    <br />
                    <br />
                </div>
            </div>
        </>
    );
}

export default Login;