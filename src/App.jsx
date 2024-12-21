import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WebSocketProvider } from "./context/WebSocketContext";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import ChatButton from "./components/chat/ChatButton";
import MainFeed from "./pages/MainFeed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRedirect from "./pages/AuthRedirect";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import EmailVerificationSuccess from "./pages/EmailVerificationSuccess";
import RequestVerificationCode from "./pages/password/RequestVerificationCode";
import ResetPassword from "./pages/password/ResetPassword";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <WebSocketProvider>
        <TopBar />
        <div className="flex pt-16">
          <SideBar />
          <div className="ml-32 mr-32 p-12 pl-64 flex-1">
            <Routes>
              <Route path="/" element={<MainFeed />} />
              <Route path="/posts" element={<MainFeed />} />
              <Route path="/tags" element={<MainFeed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth" element={<AuthRedirect />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post" element={<Post />} ></Route>
              <Route path="/profile" element={<Profile />} />
              <Route path="/posts/:postId" element={<PostDetail />} />
              <Route path="/create-post" element={<CreatePost />}></Route>
              <Route path="/email-verification-success" element={<EmailVerificationSuccess />}></Route>
              <Route path="/request-verification" element={<RequestVerificationCode />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </div>
        </div>
        <ToastContainer />
        <ChatButton />
      </WebSocketProvider>
    </Router>
  );
};

export default App;
