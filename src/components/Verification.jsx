import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinPrivateGroup } from "../apis/private";

const Verification = () => {
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const codeEvent = (e) => {
        setCode(e.target.value);
    }

    const joinChat = (e) => {

        e.preventDefault();
        if (code === '') {
            alert("Empty or Invalid Input");
        } else {

            //update backend
            const helper = async () => {
                return await joinPrivateGroup(code);
            }

            helper()
                .then(res => {

                    navigate("/private-group-chat", {
                        state: {
                            private_group_chat: res.data.chat
                        },
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

    }

    return (
        <>
            <div className="log_in">
                <div className="center_div">

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

                        <br />
                        <br />

                        <button
                            className="joinBtn"
                            type="submit"
                            onClick={joinChat}
                        >
                            Join
                        </button>

                    </form>
                    <br />
                </div>
            </div>
        </>
    );
}

export default Verification;