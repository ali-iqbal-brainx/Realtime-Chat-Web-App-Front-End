import React, { useState } from 'react';
import { Link, Navigate } from "react-router-dom";
import "../assets/css/dashboard.css";

const DashBoard = () => {

    return (
        <>
            <div className="App">
                <div className="center_div">
                    <br />
                    <h1> DashBoard</h1>
                    <select name="Settings" id="settins">
                        <option value="profile">Profile</option>
                        <option value="log out">Log Out</option>
                    </select>
                    <br />
                    <button>Public Group</button>
                    <button>Private Group</button>
                    <br />
                    <button>One-One Chat</button>
                    <button>Existing Chats</button>

                </div>
            </div>
        </>
    );
}

export default DashBoard;