import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "안녕하세요! 의료 AI 상담 도우미입니다 🏥\n\n다음과 같은 도움을 드릴 수 있어요:\n• 증상 문진 → 진료과 추천\n• 복약 정보 및 주의사항\n• 건강 정보 안내\n\n증상이나 궁금한 점을 편하게 말씀해주세요."
};

export default function ChatBot() {
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  if (!isLoggedIn) return null;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // API에는 user로 시작하는 메시지만 전송
      const firstUserIdx = newMessages.findIndex(m => m.role === "user");
      const apiMessages = newMessages.slice(firstUserIdx).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.message || "오류가 발생했습니다. 다시 시도해주세요." },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "네트워크 오류가 발생했습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      {/* 채팅 창 */}
      {isOpen && (
        <div style={{
          width: "360px",
          height: "520px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          marginBottom: "12px",
          overflow: "hidden",
          border: "1px solid #e0e0e0",
        }}>
          {/* 헤더 */}
          <div style={{ background: "linear-gradient(135deg, #1a5f7a, #2196f3)", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🏥</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#fff", fontWeight: "700", margin: 0, fontSize: "14px" }}>의료 AI 상담</p>
              <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: "11px" }}>증상·복약·건강정보 문의</p>
            </div>
            <button onClick={handleReset} title="대화 초기화" style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "11px" }}>
              초기화
            </button>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>

          {/* 메시지 목록 */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px", background: "#f8fafc" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "6px" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1a5f7a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                    🤖
                  </div>
                )}
                <div style={{
                  maxWidth: "78%",
                  padding: "10px 13px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user" ? "#1a5f7a" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#333",
                  fontSize: "13px",
                  lineHeight: "1.65",
                  whiteSpace: "pre-wrap",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1a5f7a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🤖</div>
                <div style={{ background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "10px 14px", fontSize: "13px", color: "#888", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <span style={{ animation: "pulse 1.5s infinite" }}>답변 생성 중...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 빠른 질문 버튼 */}
          {messages.length === 1 && (
            <div style={{ padding: "8px 14px", borderTop: "1px solid #eee", display: "flex", gap: "6px", flexWrap: "wrap", background: "#fff" }}>
              {["두통이 있어요", "복약 정보 알고 싶어요", "건강 정보 알려줘"].map(q => (
                <button key={q} onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  style={{ padding: "5px 10px", background: "#e8f4fd", border: "1px solid #2196f3", borderRadius: "20px", fontSize: "11px", color: "#1a5f7a", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* 입력창 */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid #eee", display: "flex", gap: "8px", background: "#fff" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="증상이나 질문을 입력하세요..."
              disabled={loading}
              style={{ flex: 1, padding: "9px 14px", border: "1px solid #ddd", borderRadius: "24px", fontSize: "13px", outline: "none", background: loading ? "#f5f5f5" : "#fff" }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: "38px", height: "38px", borderRadius: "50%",
                background: loading || !input.trim() ? "#ccc" : "#1a5f7a",
                border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "15px", color: "#fff", flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: isOpen ? "#888" : "linear-gradient(135deg, #1a5f7a, #2196f3)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          marginLeft: "auto", transition: "background 0.2s",
        }}
      >
        {isOpen ? "✕" : "🏥"}
      </button>
    </div>
  );
}
