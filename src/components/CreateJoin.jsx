import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const CreateJoin = () => {

    const navigate = useNavigate();

    const createPrivateGroup = () => {
        localStorage.getItem("access_token") ?
            navigate("/create-group") :
            navigate("/");
    }

    const joinPrivateGroup = () => {
        localStorage.getItem("access_token") ?
            navigate("/verification") :
            navigate("/");
    }

    useEffect(() => {
        if (!localStorage.getItem("access_token")) {
            navigate("/");
        }

    }, []);

    return (
        <>
            <div className="log_in">
                <div className="center_div">

                    <br />
                    <h1>Create or Join a Chat</h1>
                    <br />

                    <button
                        className="createBtn"
                        type="submit"
                        onClick={createPrivateGroup}
                    >
                        Create
                    </button>

                    <br />
                    <br />

                    <button
                        className="joinBtn"
                        type="submit"
                        onClick={joinPrivateGroup}
                    >
                        Join
                    </button>

                    <br />
                    <br />
                </div>
            </div>
        </>
    );
}

export default CreateJoin;