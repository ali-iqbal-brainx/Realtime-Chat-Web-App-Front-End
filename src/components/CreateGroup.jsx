import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPrivateGroup } from "../apis/private";

const CreateGroup = () => {

    const navigate = useNavigate();
    const [name, setName] = useState("");

    const nameEvent = (e) => {
        setName(e.target.value);
    }

    const createChat = (e) => {

        e.preventDefault();
        if (name === '') {
            alert("Empty or Invalid Input");
        } else {

            //create private group chat api
            const helper = async () => {
                return await createPrivateGroup(name);
            }

            helper()
                .then(result => {

                    setName("");
                    navigate("/private-group-chat", {
                        state: {
                            private_group_chat: result
                        },
                    });

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
        }

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
                    <h1>Enter A Name for Group</h1>
                    <br />
                    <form>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Group Name..."
                            onChange={nameEvent}
                            value={name}

                        />
                        <br /><br />
                        <button
                            className="createBtn"
                            type="submit"
                            onClick={createChat}
                        >
                            Create
                        </button>
                        <br />
                        <br />
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateGroup;