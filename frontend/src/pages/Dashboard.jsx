import React, { useEffect, useState } from "react";
import Header from "../Components/Header.jsx";
import { useLocation } from "react-router-dom";
import { DashSidebar } from "../Components/DashSidebar.jsx";
import { DashProfile } from "../Components/DashProfile.jsx";
import { DashPosts } from "../Components/DashPosts.jsx";
import { DashUsers } from "../Components/DashUser.jsx";
import DashComment from "../Components/DashComment.jsx";
import DashBoardOverview from "../Components/DashBoardOverview.jsx";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    // console.log(tabFromUrl);
  }, [location.search]);
  // console.log(location);
  return (
    <>
      <Header />
      <div className=" min-h-screen flex flex-col md:flex-row">
        <div className=" md:w-56">
          {/* sidebar */}
          <DashSidebar />
        </div>
        {/* profile... */}
        {tab === "profile" && <DashProfile />}
        {/* dashboar posts */}
        {tab === "posts" && <DashPosts />}
        {tab === "users" && <DashUsers />}
        {tab === "comments" && <DashComment />}
        {tab === "dash" && <DashBoardOverview />}



      </div>
    </>
  );
};

export default Dashboard;
