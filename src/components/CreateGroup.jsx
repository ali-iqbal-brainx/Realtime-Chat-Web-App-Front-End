import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const CreateGroup = () => {
    const [name, setName] = useState("");

    const nameEvent = (e) => {
        setName(e.target.value);
    }

    const createChat = (e) => {

        e.preventDefault();
        if (name === '') {
            alert("Empty or Invalid Input");
        } else {
            const nameObj = { name };
            console.log("name obj :", nameObj);
            // axios({
            //     method: 'POST',
            //     url: 'https://locahost:4000/create-chat', codeObj,
            // }).then(res => {

            //     if (res.message === "success") {
            //         <Navigate to="/" />
            //     }

            //     setName("");

            // }).catch(e => {

            //     console.log("Error occured :", e);

            //     setName("");

            // });
        }

    }
    return (
        <>
            <div className="App">
                <div className="center_div">
                    <button onClick={(e) => e.preventDefault()}>back</button>
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
                            onClick={(e) => createChat(e)}>
                            Join
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateGroup;