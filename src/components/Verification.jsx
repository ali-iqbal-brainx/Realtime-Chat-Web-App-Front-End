import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const Verification = () => {
    const [code, setCode] = useState("");

    const codeEvent = (e) => {
        setCode(e.target.value);
    }

    const joinChat = (e) => {

        e.preventDefault();
        if (code === '') {
            alert("Empty or Invalid Input");
        } else {
            const codeObj = { code };
            console.log("Code :", codeObj);
            // axios({
            //     method: 'POST',
            //     url: 'https://locahost:4000/join-chat', codeObj,
            // }).then(res => {

            //     if (res.message === "success") {
            //         <Navigate to="/" />
            //     }

            //     setCode("");

            // }).catch(e => {

            //     console.log("Error occured :", e);

            //     setCode("");

            // });
        }

    }
    return (
        <>
            <div className="App">
                <div className="center_div">
                    <button onClick={(e) => e.preventDefault()}>back</button>
                    <br />
                    <h1>Enter Chat Code Below</h1>
                    <br />
                    <form>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Chat Code..."
                            onChange={codeEvent}
                            value={code}

                        />
                        <br /><br />
                        <button
                            className="joinBtn"
                            type="submit"
                            onClick={(e) => joinChat(e)}>
                            Join
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Verification;