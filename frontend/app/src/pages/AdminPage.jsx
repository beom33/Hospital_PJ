import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminPage() {
  const [tab, setTab] = useState("users"); // "users" | "notices"
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // ── 회원 관리 상태 ──
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  // ── 공지사항 관리 상태 ──
  const [notices, setNotices] = useState([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticesError, setNoticesError] = useState("");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
  }, []);

  // 탭 전환 시 데이터 로드
  useEffect(() => {
    if (tab === "users") fetchUsers();
    if (tab === "notices") fetchNotices();
  }, [tab]);

  const fetchUsers = () => {
    setUsersLoading(true); setUsersError("");
    fetch("http://localhost:8080/api/admin/users", {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setUsers(data); setUsersLoading(false); })
      .catch(() => { setUsersError("회원 목록을 불러오지 못했습니다."); setUsersLoading(false); });
  };

  const fetchNotices = () => {
    setNoticesLoading(true); setNoticesError("");
    fetch("http://localhost:8080/api/notices?page=0&size=100", {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setNotices(data.content || []); setNoticesLoading(false); })
      .catch(() => { setNoticesError("공지사항 목록을 불러오지 못했습니다."); setNoticesLoading(false); });
  };

  const handleForceDelete = async (username) => {
    if (!window.confirm(`"${username}" 회원을 강제 탈퇴시키겠습니까?`)) return;
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${username}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setUsers(prev => prev.filter(u => u.username !== username));
    } catch (err) {
      alert(err.message || "강제 탈퇴 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteNotice = async (id, title) => {
    if (!window.confirm(`"${title}" 공지사항을 삭제하시겠습니까?`)) return;
    try {
      const res = await fetch(`http://localhost:8080/api/notices/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setNotices(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      alert(err.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  const thStyle = {
    padding: "12px 16px", textAlign: "left", fontSize: "13px",
    fontWeight: "600", color: "#555", borderBottom: "2px solid #eee",
    whiteSpace: "nowrap", background: "#f9f9f9",
  };
  const tdStyle = {
    padding: "12px 16px", fontSize: "14px", color: "#333",
    borderBottom: "1px solid #f0f0f0", verticalAlign: "middle",
  };
  const btnDanger = {
    padding: "6px 14px", background: "#e63946", color: "#fff",
    border: "none", borderRadius: "6px", fontSize: "13px",
    cursor: "pointer", fontWeight: "600",
  };

  return (
    <>
      <Header />
      <main className="th-layout-main">
        <div className="th-layout-content">
          <div style={{
            minHeight: "70vh", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            padding: "50px 20px",
          }}>
            <div style={{
              background: "rgba(255,255,255,0.97)", borderRadius: "16px",
              padding: "36px 40px", maxWidth: "960px", margin: "0 auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <h2 className="h3" style={{ marginBottom: "20px", color: "#1a1a2e" }}>관리자 페이지</h2>

              {/* 탭 */}
              <div style={{ display: "flex", marginBottom: "28px", borderBottom: "2px solid #eee" }}>
                {[["users", "회원 관리"], ["notices", "공지사항 관리"]].map(([key, label]) => (
                  <button key={key} type="button"
                    onClick={() => setTab(key)}
                    style={{
                      padding: "12px 24px", border: "none", background: "none",
                      fontSize: "15px", fontWeight: "600", cursor: "pointer",
                      color: tab === key ? "#e63946" : "#999",
                      borderBottom: tab === key ? "2px solid #e63946" : "2px solid transparent",
                      marginBottom: "-2px",
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* ── 회원 관리 탭 ── */}
              {tab === "users" && (
                <>
                  <p style={{ color: "#888", fontSize: "14px", marginBottom: "16px" }}>
                    전체 회원 수: <strong>{users.length}</strong>명
                  </p>
                  {usersError && <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px" }}>{usersError}</div>}
                  {usersLoading ? (
                    <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>불러오는 중...</p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <th style={thStyle}>아이디</th>
                            <th style={thStyle}>이름</th>
                            <th style={thStyle}>닉네임</th>
                            <th style={thStyle}>이메일</th>
                            <th style={thStyle}>역할</th>
                            <th style={thStyle}>가입일</th>
                            <th style={thStyle}>관리</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(u => (
                            <tr key={u.id} style={{ background: u.role === "ADMIN" ? "#fff8f0" : "white" }}>
                              <td style={tdStyle}>{u.username}</td>
                              <td style={tdStyle}>{u.name || "-"}</td>
                              <td style={tdStyle}>{u.nickname || "-"}</td>
                              <td style={tdStyle}>{u.email || "-"}</td>
                              <td style={tdStyle}>
                                <span style={{
                                  padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                                  background: u.role === "ADMIN" ? "#fff0e0" : "#e8f5e9",
                                  color: u.role === "ADMIN" ? "#e67e22" : "#2e7d32",
                                }}>
                                  {u.role === "ADMIN" ? "관리자" : "일반"}
                                </span>
                              </td>
                              <td style={tdStyle}>{u.createdAt ? u.createdAt.slice(0, 10) : "-"}</td>
                              <td style={tdStyle}>
                                {u.role !== "ADMIN" ? (
                                  <button onClick={() => handleForceDelete(u.username)} style={btnDanger}>
                                    강제탈퇴
                                  </button>
                                ) : (
                                  <span style={{ color: "#ccc", fontSize: "13px" }}>-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {users.length === 0 && <p style={{ textAlign: "center", color: "#aaa", padding: "40px" }}>회원이 없습니다.</p>}
                    </div>
                  )}
                </>
              )}

              {/* ── 공지사항 관리 탭 ── */}
              {tab === "notices" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <p style={{ color: "#888", fontSize: "14px" }}>
                      전체 공지 수: <strong>{notices.length}</strong>개
                    </p>
                    <button
                      onClick={() => navigate("/notice/write")}
                      style={{
                        padding: "8px 18px", background: "#1a1a2e", color: "#fff",
                        border: "none", borderRadius: "8px", fontSize: "14px",
                        cursor: "pointer", fontWeight: "600",
                      }}
                    >
                      + 공지 작성
                    </button>
                  </div>
                  {noticesError && <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px" }}>{noticesError}</div>}
                  {noticesLoading ? (
                    <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>불러오는 중...</p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <th style={{ ...thStyle, width: "50px" }}>번호</th>
                            <th style={thStyle}>제목</th>
                            <th style={{ ...thStyle, width: "80px" }}>작성자</th>
                            <th style={{ ...thStyle, width: "80px" }}>조회수</th>
                            <th style={{ ...thStyle, width: "100px" }}>작성일</th>
                            <th style={{ ...thStyle, width: "120px" }}>관리</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notices.map(n => (
                            <tr key={n.id}>
                              <td style={{ ...tdStyle, color: "#aaa" }}>{n.id}</td>
                              <td style={tdStyle}>
                                <span
                                  onClick={() => navigate(`/notice/${n.id}`)}
                                  style={{ cursor: "pointer", color: "#1a1a2e", fontWeight: "500" }}
                                  onMouseEnter={e => e.target.style.textDecoration = "underline"}
                                  onMouseLeave={e => e.target.style.textDecoration = "none"}
                                >
                                  {n.title}
                                </span>
                              </td>
                              <td style={tdStyle}>{n.author}</td>
                              <td style={{ ...tdStyle, textAlign: "center" }}>{n.viewCount ?? 0}</td>
                              <td style={tdStyle}>{n.createdAt ? n.createdAt.slice(0, 10) : "-"}</td>
                              <td style={tdStyle}>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button
                                    onClick={() => navigate(`/notice/edit/${n.id}`)}
                                    style={{
                                      padding: "5px 12px", background: "#1a1a2e", color: "#fff",
                                      border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer",
                                    }}
                                  >
                                    수정
                                  </button>
                                  <button onClick={() => handleDeleteNotice(n.id, n.title)} style={{ ...btnDanger, padding: "5px 12px" }}>
                                    삭제
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {notices.length === 0 && <p style={{ textAlign: "center", color: "#aaa", padding: "40px" }}>공지사항이 없습니다.</p>}
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
