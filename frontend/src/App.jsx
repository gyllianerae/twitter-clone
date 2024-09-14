import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/auth/login/LoginPage.jsx";
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";

import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

function App() {

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['authUser'],
    queryFn: async() => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "something went wrong");
        }
        console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error)
      }
    }
  });

  if(isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {/* common component because its not wrapped with Routes */}
      <Sidebar />
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} /> 
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  );
}

export default App;
