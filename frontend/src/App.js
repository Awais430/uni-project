import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Project from "./pages/Project";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Footer from "./Components/Footer.jsx";
import { PrivateRoute } from "./Components/PrivateRoute.jsx";
import { OnlyAdminPrivateRoute } from "./Components/OnlyAdminPrivateRoute.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import UpdatePost from "./pages/UpdatePost.jsx";
import { PostPage } from "./pages/PostPage.jsx";
import  GetPosts  from "./pages/GetPosts.jsx";


import { ScrollToTop } from "./Components/ScrollToTop.jsx";
import Search from "./pages/Search.jsx";
const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/project" element={<Project />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/search" element={<Search />} />

        <Route path="/" element={<Home />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/get-posts" element={<GetPosts />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
