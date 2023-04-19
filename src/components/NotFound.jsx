import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            !localStorage.getItem("access_token") ?
                navigate("/") :
                navigate("/dash-board");

        }, 1500)
    }, []);
    return <h1>Page Not Found 404...</h1>;
}

export default NotFound;