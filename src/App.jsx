import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import MainFeed from "./pages/MainFeed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRedirect from "./pages/AuthRedirect";

const App = () => {
  return (
    <Router>
      <TopBar />
      <div className="flex">
        <SideBar />
        <div className="ml-64 p-6 flex-1">
          <Routes>
            <Route path="/" element={<MainFeed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<AuthRedirect />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
