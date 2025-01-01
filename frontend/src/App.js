import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AboutLayout from "./Layout/aboutLayout";
import ActivityDetailsLayout from "./Layout/activityDetailsLayout";
import About from "./pages/about";
import ActivityDetails from "./pages/activityDetails";
import NewArtical from "./pages/newArticale";
import AddActivity from "./pages/add-activity";
import EditActivity from "./pages/edit-activity";
import Gallery from "./pages/Gallery";
import Help from "./pages/Help";
import UserProfile from "./pages/UserProfile";
import Home from "./pages/home";
import Activities from "./pages/Activites";
import EditProfile from "./pages/EditProfile";
import ArticleDetails from "./pages/ArticlesDetails";
import PostDetails from "./pages/PostsDetails";
import Search from "./pages/search";
import Filter from "./pages/filter";
import ForgetPassword from "./pages/forget-password";
import EditPassword from "./pages/edit-password";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/privacy-policy" element={<Help />} />
        <Route path="/content-policy" element={<Help />} />
        <Route path="/terms-of-use" element={<Help />} />
        <Route path="/" element={<AboutLayout />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/gallery" element={<Gallery />} />
        </Route>
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/new-article" element={<NewArtical />} />
        <Route path="/article/search" element={<Search />} />
        <Route path="/article/filter" element={<Filter />} />
        <Route path="/article" element={<ActivityDetailsLayout />}>
          <Route path="/article/new-article" element={<AddActivity />} />
          <Route path="/article/:id" element={<ArticleDetails />} />
        </Route>
        <Route path="/posts" element={<ActivityDetailsLayout />}>
          <Route path="/posts/:id" element={<PostDetails />} />
        </Route>

        <Route path="/activities" element={<ActivityDetailsLayout />}>
          <Route path="/activities" element={<Activities />} />
        </Route>

        <Route path="/activity" element={<ActivityDetailsLayout />}>
          <Route path="/activity/new-activity" element={<AddActivity />} />
          <Route path="/activity/edit-activity" element={<EditActivity />} />
          <Route path="/activity/:id" element={<ActivityDetails />} />
        </Route>
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/edit-password/:id" element={<EditPassword />} />

        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </>
  );
};

export default App;
