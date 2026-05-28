import { useState, useEffect, useRef, useMemo } from "react";
import { calcPct, safeLeaves, needMore, HOLIDAYS, DAYS, TODAY } from "./data.js";

export default function AIChat({ attendanceData, classInfo, className, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm your NMIMS AI attendance assistant 🎓\n\nI know your full timetable for **${className}** and your live attendance data.\n\nTry asking me:\n- "Can I skip DAA tomorrow?"\n- "Which subjects are critical?"\n- "Give me a recovery plan"\n- "How many classes to hit 80% in DBMS?"`
    }
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const systemPrompt = useMemo(() => {
    const subLines = classInfo.subjects.map(s => {
      const d    = attendanceData[s.code] || { attended: 0, total: 0 };
      const pct  = calcPct(d.attended, d.total);
      const safe = safeLeaves(d.attended, d.total);
      const need = needMore(d.attended, d.total);
      return `  - ${s.code} (${s.name}): ${d.attended}/${d.total} classes = ${pct}% | safe leaves left: ${safe} | classes to recover: ${need}`;
    }).join("\n");

    const schedLines = DAYS.map(day => {
      const slots = classInfo.schedule[day] || [];
      if (!slots.length) return `  ${day}: No classes`;
      return `  ${day}: ` + slots.map(([t, sub, type]) => `${sub}(${type} @${t})`).join(", ");
    }).join("\n");

    const upcomingHols = HOLIDAYS
      .filter(h => h.date >= "2026-05-11")
      .slice(0, 6)
      .map(h => `  ${h.date}: ${h.name}`)
      .join("\n");

    return `You are a smart, friendly NMIMS B.Tech attendance assistant for MPSTME Shirpur campus.
Today is Monday, May 11, 2026.
Student class: ${className}, Semester ${classInfo.sem}

CURRENT ATTENDANCE DATA:
${subLines}

WEEKLY TIMETABLE:
${schedLines}

UPCOMING HOLIDAYS:
${upcomingHols}

KEY RULES:
- Minimum attendance required: 80%
- Attendance% = (Attended / Total) × 100
- Safe leaves = floor(attended/0.8) - total
- Classes needed to recover = ceil((0.8×total - attended) / 0.2)
- Cancelled classes don't affect total count
- Holidays are excluded from attendance calculation

Be concise, friendly and precise. Use exact numbers. Format responses with markdown for clarity. When simulating skipping a class, show the exact before/after percentage.`;
  }, [attendanceData, classInfo, className]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data  = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Sorry, I couldn't respond. Try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  }

  function renderMd(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code style='background:#ffffff18;padding:1px 5px;border-radius:4px;font-size:12px'>$1</code>")
      .replace(/\n/g, "<br/>");
  }

  const quickPrompts = [
    "Which subjects are critical?",
    "Can I skip one class of each subject?",
    "Give me a full recovery plan",
    "How many more classes do I need?",
  ];

  const s = styles;

  return (
    <div style={s.overlay}>
      <div style={s.panel} className="slide-in">
        {/* Header */}
        <div style={s.header}>
          <div style={s.avatar}>🤖</div>
          <div>
            <div style={s.headerTitle}>AI Attendance Assistant</div>
            <div style={s.headerSub}>Powered by Claude · {className}</div>
          </div>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        {/* Messages */}
        <div style={s.messages}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
              <div
                style={m.role === "user" ? s.userBubble : s.aiBubble}
                dangerouslySetInnerHTML={{ __html: renderMd(m.content) }}
              />
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
              <div style={s.aiBubble}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#6366f1", marginRight: 4, animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 2 && (
          <div style={s.quickArea}>
            {quickPrompts.map((q, i) => (
              <button key={i} onClick={() => setInput(q)} style={s.quickBtn}>{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={s.inputRow}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about your attendance..."
            style={s.input}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ ...s.sendBtn, opacity: loading || !input.trim() ? 0.5 : 1 }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay:     { position: "fixed", inset: 0, background: "#000b", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 16 },
  panel:       { width: "min(420px, 100%)", height: "85vh", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 64px #000c" },
  header:      { padding: "14px 18px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 12, background: "#16161f", flexShrink: 0 },
  avatar:      { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
  headerTitle: { fontWeight: 700, fontSize: 14, color: "#e8e8f0" },
  headerSub:   { fontSize: 11, color: "#6b6b8a" },
  closeBtn:    { marginLeft: "auto", background: "#1e1e2e", border: "none", color: "#6b6b8a", borderRadius: 8, width: 28, height: 28, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  messages:    { flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column" },
  userBubble:  { maxWidth: "85%", padding: "10px 14px", borderRadius: "14px 14px 4px 14px", background: "#6366f1", color: "#fff", fontSize: 13, lineHeight: 1.6 },
  aiBubble:    { maxWidth: "85%", padding: "10px 14px", borderRadius: "14px 14px 14px 4px", background: "#1e1e2e", color: "#e8e8f0", fontSize: 13, lineHeight: 1.6 },
  quickArea:   { padding: "0 14px 10px", display: "flex", flexWrap: "wrap", gap: 6 },
  quickBtn:    { background: "#1e1e2e", border: "1px solid #2e2e3e", color: "#a0a0c0", borderRadius: 20, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontWeight: 600 },
  inputRow:    { padding: "12px 14px", borderTop: "1px solid #1e1e2e", display: "flex", gap: 8, flexShrink: 0 },
  input:       { flex: 1, background: "#1e1e2e", border: "1px solid #2e2e3e", borderRadius: 12, padding: "10px 14px", color: "#e8e8f0", fontSize: 13 },
  sendBtn:     { background: "#6366f1", border: "none", borderRadius: 12, padding: "10px 16px", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" },
};
