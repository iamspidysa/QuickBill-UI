import React from "react";
import Menubar from "./components/Menubar/Menubar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageCategories from "./pages/ManageCategories/ManageCategories";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import ManageItems from "./pages/ManageItems/ManageItems";
import Explore from "./pages/Explore/Explore";

export default function App() {
  return (
    <div>
      <Menubar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/category" element={<ManageCategories/>} />
        <Route path="/users" element={<ManageUsers/>} />
        <Route path="/items" element={<ManageItems/>} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/" element={<Dashboard/>} />
      </Routes>
    </div>
  );
}
