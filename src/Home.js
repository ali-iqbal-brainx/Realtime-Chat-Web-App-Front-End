import { Route, Routes } from "react-router-dom"
import Login from "./components/Login";
import Chat from "./components/Chat";
import Verification from "./components/Verification";
import CreateJoin from "./components/CreateJoin";
import CreateGroup from "./components/CreateGroup";
import ProfileSetup from "./components/ProfileSetup";
import SignUp from "./components/SignUp";
import DashBoard from "./components/DashBoard";
import NotFound from "./components/NotFound";
import PrivateGroup from "./components/PrivateGroup";
import AllChats from "./components/AllChats";
import OneToOneGroup from "./components/OneToOneGroup";

const Home = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/public-chat" element={<Chat />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/create-group" element={<CreateGroup />} />
                <Route path="/create-join" element={<CreateJoin />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/dash-board" element={<DashBoard />} />
                <Route path="/all-chats" element={<AllChats />} />
                <Route path="/private-group-chat" element={<PrivateGroup />} />
                <Route path="/one-to-one-chat" element={<OneToOneGroup />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </>
    )
}

export default Home;