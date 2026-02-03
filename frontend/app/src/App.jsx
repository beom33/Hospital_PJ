import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notice from "./pages/Notice";
import NoticeWrite from "./pages/NoticeWrite";
import NoticeDetail from "./pages/NoticeDetail";
import NoticeEdit from "./pages/NoticeEdit";
import Insurance from "./pages/Insurance";
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
          <ProtectedRoute adminOnly>
            <NoticeWrite />
          </ProtectedRoute>
        } />
        <Route path="/notice/edit/:id" element={
          <ProtectedRoute adminOnly>
            <NoticeEdit />
          </ProtectedRoute>
        } />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/insurance" element={<Insurance />} />
      </Routes>
    </Router>
  );
}

export default App;
