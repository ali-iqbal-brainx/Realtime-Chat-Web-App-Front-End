import React, { useState } from 'react';
import { Link, Navigate } from "react-router-dom";

const CreateJoin = () => {

    return (
        <>
            <div className="App">
                <div className="center_div">
                    <br />
                    <h1>Create or Join a Chat</h1>
                    <select name="Settings" id="settins">
                        <option value="profile">Profile</option>
                        <option value="log out">Log Out</option>
                    </select>
                    <br />
                    <button>back</button>
                    <br />
                    <button>Create</button>
                    <button>Join</button>
                    <br />
                </div>
            </div>
        </>
    );
}

export default CreateJoin;