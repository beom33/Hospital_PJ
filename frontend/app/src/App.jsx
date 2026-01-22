import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notice from "./pages/Notice";
import NoticeWrite from "./pages/NoticeWrite";
import NoticeDetail from "./pages/NoticeDetail";
import Insurance from "./pages/Insurance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/write" element={<NoticeWrite />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/insurance" element={<Insurance />} />
      </Routes>
    </Router>
  );
}

export default App;
