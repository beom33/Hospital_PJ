import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notice from "./pages/Notice";
import NoticeWrite from "./pages/NoticeWrite";
import HospitalSearch from "./pages/HospitalSearch";
import NoticeDetail from "./pages/NoticeDetail";
import NoticeEdit from "./pages/NoticeEdit";
import Insurance from "./pages/Insurance";
import FindAccount from "./pages/FindAccount";
import ChangePassword from "./pages/ChangePassword";
import MyPage from "./pages/MyPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import ReservationPage from "./pages/ReservationPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/write" element={
          <ProtectedRoute>
            <NoticeWrite />
          </ProtectedRoute>
        } />
        <Route path="/notice/edit/:id" element={
          <ProtectedRoute>
            <NoticeEdit />
          </ProtectedRoute>
        } />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/hospital" element={<HospitalSearch />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/find-account" element={<FindAccount />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reservation" element={
          <ProtectedRoute>
            <ReservationPage />
          </ProtectedRoute>
        } />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
