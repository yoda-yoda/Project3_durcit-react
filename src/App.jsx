import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import MainFeed from "./pages/MainFeed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRedirect from "./pages/AuthRedirect";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";

const App = () => {
  return (
    <Router>
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
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
