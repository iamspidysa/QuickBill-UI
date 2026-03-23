import React, { useContext } from "react";
import Menubar from "./components/Menubar/Menubar";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageCategories from "./pages/ManageCategories/ManageCategories";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import ManageItems from "./pages/ManageItems/ManageItems";
import Explore from "./pages/Explore/Explore";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login/Login";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import { AppContext } from "./Context/AppContext";
import NotFound from "./pages/NotFound/NotFound";

// OUTSIDE App (top-level)
const LoginRoute = ({ element, auth }) => {
  if (isValidToken(auth.token)) {
    return <Navigate to="/dashboard" replace />;
  }
  return element;
};

const ProtectedRoute = ({ element, allowedRoles, auth }) => {
  if (!isValidToken(auth.token)) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

const isValidToken = (token) => {
  return token && token !== "null" && token !== "undefined";
};
export default function App() {
  // const location = useLocation();

  const { auth } = useContext(AppContext);

  /* Render Issue */

  // const LoginRoute = ({element}) => {
  //   if(auth.token) {
  //     return <Navigate to="/dashboard" replace/>;
  //   }
  //   return element;
  // }

  // const ProtectedRoute = ({element, allowedRoles}) => {
  //   if(!auth.token) {
  //   return <Navigate to="/login" replace/>
  //   }

  //   if (allowedRoles && !allowedRoles.includes(auth.role)){
  //     return <Navigate to="/dashboard" replace/>
  //   }
  //   return element;
  // }

  return (
    <div>
      {isValidToken(auth.token) && <Menubar />}
      <Toaster />
      <Routes>
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} auth={auth} />}
        />

        <Route
          path="/explore"
          element={<ProtectedRoute element={<Explore />} auth={auth} />}
        />

        {/* ADMIN ONLY ROUTES */}
        <Route
          path="/category"
          element={
            <ProtectedRoute
              element={<ManageCategories />}
              allowedRoles={["ROLE_ADMIN"]}
              auth={auth}
            />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute
              element={<ManageUsers />}
              allowedRoles={["ROLE_ADMIN"]}
              auth={auth}
            />
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute
              element={<ManageItems />}
              allowedRoles={["ROLE_ADMIN"]}
              auth={auth}
            />
          }
        />

        <Route
          path="/login"
          element={<LoginRoute element={<Login />} auth={auth} />}
        />

        <Route
          path="/orders"
          element={<ProtectedRoute element={<OrderHistory />} auth={auth} />}
        />
        <Route
          path="/"
          element={<ProtectedRoute element={<Dashboard />} auth={auth} />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
