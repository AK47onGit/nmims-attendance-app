import { useState, useEffect, useMemo } from "react";
import Ring from "./Ring.jsx";
import AIChat from "./AIChat.jsx";
import { HOLIDAYS, CLASSES, DAYS, TODAY, calcPct, safeLeaves, needMore, fmtDate, dayName, seedAttendance } from "./data.js";

const ACCENT = "#6366f1";

export default function App() {
  const [page, setPage]         = useState("dashboard");
  const [cls, setCls]           = useState("2nd Year – Div A");
  const [darkMode, setDarkMode] = useState(true);
  const [showAI, setShowAI]     = useState(false);
  const [marking, setMarking]   = useState(null);
  const [toast, setToast]       = useState(null);
  const [calMonth, setCalMonth] = useState(new Date(2026, 4, 1));
  const [simSub, setSimSub]     = useState("");
  const [newAsgn, setNewAsgn]   = useState(false);
  const [asgnForm, setAsgnForm] = useState({ sub: "", title: "", due: "", pri: "medium" });
  const [assignments, setAssignments] = useState([
    { id: 1, sub: "DBMS",  title: "ER Diagram – Hospital DB",        due: "2026-05-15", done: false, pri: "high"   },
    { id: 2, sub: "WP",    title: "Responsive Portfolio Website",    due: "2026-05-20", done: false, pri: "medium" },
    { id: 3, sub: "DAA",   title: "Graph Algorithms Implementation", due: "2026-05-12", done: false, pri: "high"   },
    { id: 4, sub: "CVT",   title: "Complex Integration Problem Set", due: "2026-05-18", done: true,  pri: "low"    },
    { id: 5, sub: "DAIoT", title: "IoT Sensor Data Dashboard",       due: "2026-05-25", done: false, pri: "medium" },
  ]);

  const classInfo = CLASSES[cls];

  const [attData, setAttData] = useState(() => {
    try { const s = localStorage.getItem(`att_${cls}`); return s ? JSON.parse(s) : seedAttendance(classInfo.subjects); }
    catch { return seedAttendance(classInfo.subjects); }
  });

  useEffect(() => {
    try { const s = localStorage.getItem(`att_${cls}`); setAttData(s ? JSON.parse(s) : seedAttendance(CLASSES[cls].subjects)); }
    catch { setAttData(seedAttendance(CLASSES[cls].subjects)); }
  }, [cls]);

  useEffect(() => {
    try { localStorage.setItem(`att_${cls}`, JSON.stringify(attData)); } catch {}
  }, [attData, cls]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  function doMark(subCode, status) {
    setAttData(prev => {
      const n = { ...prev, [subCode]: { ...prev[subCode] } };
      if (status === "present")  { n[subCode].attended++; n[subCode].total++; }
      else if (status === "absent") { n[subCode].total++; }
      n[subCode].log = [...(n[subCode].log || []), { date: fmtDate(TODAY), status }];
      return n;
    });
    showToast(`Marked ${status} for ${subCode}`);
    setMarking(null);
  }

  const overallPct = useMemo(() => {
    const a = Object.values(attData).reduce((s, v) => s + v.attended, 0);
    const t = Object.values(attData).reduce((s, v) => s + v.total, 0);
    return calcPct(a, t);
  }, [attData]);

  const todaySlots = classInfo.schedule[dayName(TODAY)] || [];
  const criticals  = classInfo.subjects.filter(s => {
    const d = attData[s.code] || { attended: 0, total: 0 };
    return calcPct(d.attended, d.total) < 75;
  });

  // ── THEME ──
  const T = {
    bg:      darkMode ? "#0a0a0f" : "#f1f1f8",
    surface: darkMode ? "#111118" : "#ffffff",
    card:    darkMode ? "#16161f" : "#ffffff",
    border:  darkMode ? "#1e1e2e" : "#e5e5ef",
    text:    darkMode ? "#e8e8f0" : "#1a1a2e",
    muted:   darkMode ? "#6b6b8a" : "#8888aa",
  };

  // ── SHARED STYLES ──
  const S = {
    card:  { background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18 },
    h1:    { fontSize: 22, fontWeight: 800, letterSpacing: -0.5, margin: "0 0 3px", color: T.text },
    h2:    { fontSize: 15, fontWeight: 700, margin: "0 0 14px", color: T.text },
    g2:    { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 },
    g3:    { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 12 },
    btn:   (c = ACCENT) => ({ background: c, color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }),
    btnO:  { background: "transparent", color: T.muted, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 13px", fontWeight: 600, fontSize: 13, cursor: "pointer" },
    sel:   { background: T.card, color: T.text, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
    badge: (c) => ({ background: c + "22", color: c, border: `1px solid ${c}33`, borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700 }),
  };

  // ── DASHBOARD ──
  function Dashboard() {
    const totAtt = Object.values(attData).reduce((s, v) => s + v.attended, 0);
    const totTot = Object.values(attData).reduce((s, v) => s + v.total, 0);

    return (
      <div className="fade-up">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={S.h1}>Good morning 👋</h1>
            <p style={{ color: T.muted, fontSize: 13 }}>Mon, May 11, 2026 · NMIMS Shirpur · Sem {classInfo.sem}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select value={cls} onChange={e => setCls(e.target.value)} style={S.sel}>
              {Object.keys(CLASSES).map(k => <option key={k}>{k}</option>)}
            </select>
            <button onClick={() => setShowAI(true)} style={S.btn()}>🤖 Ask AI</button>
          </div>
        </div>

        {/* Overall + stat grid */}
        <div style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: 12, marginBottom: 12 }}>
          <div style={{ ...S.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: darkMode ? "#12122a" : "#f0f0ff", border: "1px solid #6366f133" }}>
            <Ring pct={overallPct} color={ACCENT} size={96} stroke={8} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: T.text }}>Overall</div>
              <div style={{ color: T.muted, fontSize: 11 }}>Attendance</div>
            </div>
            {overallPct < 80 && (
              <div style={{ background: "#ef444422", color: "#ef4444", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>⚠ Below 80%</div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
            {[
              { label: "Today's Classes",  val: todaySlots.length,                                  icon: "📚", col: ACCENT    },
              { label: "Pending Tasks",    val: assignments.filter(a => !a.done).length,             icon: "📝", col: "#f59e0b" },
              { label: "Critical Subs",   val: criticals.length,                                    icon: "⚠️", col: "#ef4444" },
              { label: "Safe Leaves",     val: safeLeaves(totAtt, totTot),                          icon: "🌿", col: "#10b981" },
              { label: "Holidays Left",   val: HOLIDAYS.filter(h => h.date >= "2026-05-11").length, icon: "🎉", col: "#8b5cf6" },
              { label: "Semester",        val: `SEM ${classInfo.sem}`,                              icon: "🎓", col: "#06b6d4" },
            ].map((st, i) => (
              <div key={i} style={{ ...S.card, display: "flex", alignItems: "center", gap: 9, padding: 12 }}>
                <span style={{ fontSize: 20 }}>{st.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: st.col }}>{st.val}</div>
                  <div style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{st.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today schedule + subject bars */}
        <div style={{ ...S.g2, marginBottom: 12 }}>
          <div style={S.card}>
            <h2 style={S.h2}>Today's Schedule</h2>
            {todaySlots.length === 0
              ? <div style={{ color: T.muted, textAlign: "center", padding: 24 }}>No classes today 🎉</div>
              : todaySlots.map(([time, sub, type], i) => {
                  const si = classInfo.subjects.find(s => s.code === sub);
                  const d  = attData[sub] || { attended: 0, total: 0 };
                  const p  = calcPct(d.attended, d.total);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < todaySlots.length - 1 ? `1px solid ${T.border}` : "none" }}>
                      <div style={{ width: 4, height: 34, borderRadius: 4, background: si?.color || ACCENT, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{sub} <span style={{ color: T.muted, fontWeight: 500, fontSize: 12 }}>· {type}</span></div>
                        <div style={{ color: T.muted, fontSize: 11 }}>{time}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: p >= 80 ? "#10b981" : p >= 65 ? "#f59e0b" : "#ef4444" }}>{p}%</span>
                      <button onClick={() => setMarking({ sub, time, color: si?.color || ACCENT })}
                        style={{ background: (si?.color || ACCENT) + "22", color: si?.color || ACCENT, border: `1px solid ${(si?.color || ACCENT)}33`, borderRadius: 8, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        Mark
                      </button>
                    </div>
                  );
                })
            }
          </div>

          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ ...S.h2, margin: 0 }}>Subject Attendance</h2>
              <button onClick={() => setShowAI(true)} style={{ background: "#6366f111", color: ACCENT, border: "1px solid #6366f133", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                🤖 AI Advice
              </button>
            </div>
            {classInfo.subjects.map(s => {
              const d    = attData[s.code] || { attended: 0, total: 0 };
              const p    = calcPct(d.attended, d.total);
              const safe = safeLeaves(d.attended, d.total);
              const need = needMore(d.attended, d.total);
              const pc   = p >= 80 ? "#10b981" : p >= 65 ? "#f59e0b" : "#ef4444";
              return (
                <div key={s.code} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color + "22", border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: s.color, flexShrink: 0 }}>
                    {s.code.slice(0, 3)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{s.code}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: pc }}>{p}%</span>
                    </div>
                    <div style={{ height: 4, background: T.border, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p}%`, background: pc, borderRadius: 99, transition: "width 1s" }} />
                    </div>
                    <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>
                      {d.attended}/{d.total} · {p >= 80 ? `${safe} leaves safe` : `Need ${need} more`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Criticals */}
        {criticals.length > 0 && (
          <div style={{ ...S.card, marginBottom: 12, background: "#ef444411", border: "1px solid #ef444433" }}>
            <div style={{ fontWeight: 800, color: "#ef4444", marginBottom: 10 }}>⚠ Critical Attendance Warning</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {criticals.map(s => {
                const d = attData[s.code] || { attended: 0, total: 0 };
                const p = calcPct(d.attended, d.total);
                return (
                  <div key={s.code} style={{ background: "#ef444422", border: "1px solid #ef444444", borderRadius: 10, padding: "7px 13px" }}>
                    <div style={{ fontWeight: 800, color: "#ef4444", fontSize: 13 }}>{s.code} — {p}%</div>
                    <div style={{ fontSize: 11, color: "#ef4444aa" }}>Attend {needMore(d.attended, d.total)} more</div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowAI(true)} style={{ ...S.btn("#ef4444"), marginTop: 12, fontSize: 12, padding: "7px 14px" }}>
              🤖 Get Recovery Plan
            </button>
          </div>
        )}

        {/* Deadlines */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ ...S.h2, margin: 0 }}>Upcoming Deadlines</h2>
            <button onClick={() => setPage("assignments")} style={S.btnO}>View all</button>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {assignments.filter(a => !a.done).slice(0, 3).map(a => {
              const si = classInfo.subjects.find(s => s.code === a.sub);
              const dl = Math.ceil((new Date(a.due) - TODAY) / 864e5);
              return (
                <div key={a.id} style={{ ...S.card, flex: "1 1 160px", borderLeft: `3px solid ${si?.color || ACCENT}`, padding: 12, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: si?.color || ACCENT, fontWeight: 700, marginBottom: 3 }}>{a.sub}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 5, color: T.text }}>{a.title}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: dl <= 2 ? "#ef4444" : "#f59e0b" }}>{dl <= 0 ? "Overdue!" : dl === 1 ? "Tomorrow" : `${dl}d left`}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── ATTENDANCE ──
  function Attendance() {
    const simResult = useMemo(() => {
      if (!simSub) return null;
      const d    = attData[simSub] || { attended: 0, total: 0 };
      const oldP = calcPct(d.attended, d.total);
      const newP = calcPct(d.attended, d.total + 1);
      return { oldP, newP, safe: newP >= 80, need: needMore(d.attended, d.total + 1) };
    }, [simSub]);

    return (
      <div className="fade-up">
        <h1 style={S.h1}>Attendance Tracker</h1>
        <p style={{ color: T.muted, fontSize: 13, marginBottom: 20 }}>Mark classes, simulate skips, track 80% target</p>

        <div style={{ ...S.card, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ ...S.h2, margin: 0 }}>Mark Today's Attendance</h2>
            <button onClick={() => setShowAI(true)} style={{ background: "#6366f111", color: ACCENT, border: "1px solid #6366f133", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              🤖 AI Suggestions
            </button>
          </div>
          <div style={S.g3}>
            {classInfo.subjects.map(s => {
              const d    = attData[s.code] || { attended: 0, total: 0 };
              const p    = calcPct(d.attended, d.total);
              return (
                <div key={s.code} style={{ ...S.card, border: `1px solid ${s.color}33`, background: s.color + "0a", padding: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                    <span style={{ fontWeight: 800, color: s.color, fontSize: 13 }}>{s.code}</span>
                    <Ring pct={p} color={s.color} size={40} stroke={4} />
                  </div>
                  <div style={{ fontSize: 10, color: T.muted, marginBottom: 9 }}>{d.attended}/{d.total} · {safeLeaves(d.attended, d.total)} leaves safe</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[["present", "✓", "#10b981", "#064e3b"], ["absent", "✗", "#ef4444", "#7f1d1d"], ["cancelled", "—", "#f59e0b", "#78350f"]].map(([st, l, c, bg]) => (
                      <button key={st} onClick={() => doMark(s.code, st)} style={{ flex: 1, background: bg, color: c, border: `1px solid ${c}44`, borderRadius: 7, padding: "6px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{l}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Simulator */}
        <div style={{ ...S.card, marginBottom: 12 }}>
          <h2 style={S.h2}>🔮 "What if I skip?" Simulator</h2>
          <select value={simSub} onChange={e => setSimSub(e.target.value)} style={{ ...S.sel, width: "100%", marginBottom: simResult ? 12 : 0 }}>
            <option value="">Select a subject to simulate missing...</option>
            {classInfo.subjects.map(s => <option key={s.code} value={s.code}>{s.code} – {s.name}</option>)}
          </select>
          {simResult && (
            <div style={{ padding: 14, background: simResult.safe ? "#064e3b22" : "#7f1d1d22", border: `1px solid ${simResult.safe ? "#10b98144" : "#ef444444"}`, borderRadius: 12 }}>
              <div style={{ fontWeight: 800, color: simResult.safe ? "#10b981" : "#ef4444", fontSize: 15, marginBottom: 5 }}>
                {simResult.safe ? "✅ Safe to skip!" : "❌ Don't skip this!"}
              </div>
              <div style={{ color: T.muted, fontSize: 13 }}>
                Attendance: <strong style={{ color: T.text }}>{simResult.oldP}%</strong> → <strong style={{ color: simResult.safe ? "#10b981" : "#ef4444" }}>{simResult.newP}%</strong>
                {!simResult.safe && `. Need ${simResult.need} more consecutive classes.`}
              </div>
              <button onClick={() => setShowAI(true)} style={{ ...S.btn(simResult.safe ? "#10b981" : "#ef4444"), marginTop: 10, fontSize: 12, padding: "6px 13px" }}>
                🤖 Ask AI for advice
              </button>
            </div>
          )}
        </div>

        {/* Full table */}
        <div style={S.card}>
          <h2 style={S.h2}>Full Report</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                  {["Subject", "Att/Tot", "%", "Safe", "Need", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: T.muted, fontWeight: 700, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classInfo.subjects.map(s => {
                  const d  = attData[s.code] || { attended: 0, total: 0 };
                  const p  = calcPct(d.attended, d.total);
                  const sc = p >= 80 ? "#10b981" : p >= 65 ? "#f59e0b" : "#ef4444";
                  return (
                    <tr key={s.code} style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
                          <span style={{ fontWeight: 700, color: T.text }}>{s.code}</span>
                        </div>
                      </td>
                      <td style={{ padding: "8px 10px", color: T.muted }}>{d.attended}/{d.total}</td>
                      <td style={{ padding: "8px 10px" }}><span style={{ fontWeight: 800, color: sc }}>{p}%</span></td>
                      <td style={{ padding: "8px 10px", color: "#10b981", fontWeight: 700 }}>{safeLeaves(d.attended, d.total)}</td>
                      <td style={{ padding: "8px 10px", color: needMore(d.attended, d.total) > 0 ? "#ef4444" : T.muted, fontWeight: 700 }}>{needMore(d.attended, d.total)}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={S.badge(sc)}>{p >= 80 ? "Safe" : p >= 65 ? "Warning" : "Critical"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── CALENDAR ──
  function Calendar() {
    const yr  = calMonth.getFullYear(), mo = calMonth.getMonth();
    const dim = new Date(yr, mo + 1, 0).getDate();
    const firstDay = new Date(yr, mo, 1).getDay();
    const offset   = firstDay === 0 ? 6 : firstDay - 1;
    const MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const evMap = {};
    HOLIDAYS.forEach(h => { evMap[h.date] = [...(evMap[h.date] || []), { label: h.name, color: "#ef4444" }]; });
    assignments.forEach(a => {
      const si = classInfo.subjects.find(s => s.code === a.sub);
      evMap[a.due] = [...(evMap[a.due] || []), { label: a.title, color: si?.color || ACCENT }];
    });

    const cells = Array(offset).fill(null).concat(Array.from({ length: dim }, (_, i) => i + 1));

    return (
      <div className="fade-up">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <h1 style={S.h1}>Academic Calendar</h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setCalMonth(new Date(yr, mo - 1, 1))} style={S.btnO}>‹</button>
            <span style={{ fontWeight: 700, fontSize: 14, minWidth: 130, textAlign: "center", color: T.text }}>{MONTHS[mo]} {yr}</span>
            <button onClick={() => setCalMonth(new Date(yr, mo + 1, 1))} style={S.btnO}>›</button>
          </div>
        </div>
        <div style={S.card}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
              <div key={d} style={{ padding: "6px 0", textAlign: "center", fontSize: 11, fontWeight: 700, color: T.muted }}>{d}</div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const ds  = `${yr}-${String(mo + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const evs = evMap[ds] || [];
              const hol = evs.find(e => e.color === "#ef4444");
              const isT = ds === "2026-05-11";
              const isW = (i + 1) % 7 === 0 || (i + 1) % 7 === 6;
              return (
                <div key={i} style={{ minHeight: 64, padding: 4, borderRadius: 7, border: `1px solid ${T.border}`, background: isT ? "#6366f122" : hol ? "#ef444411" : "transparent", opacity: isW ? 0.5 : 1 }}>
                  <div style={{ fontSize: 11, fontWeight: isT ? 800 : 600, color: isT ? ACCENT : hol ? "#ef4444" : T.text, marginBottom: 2 }}>{day}</div>
                  {evs.slice(0, 2).map((e, ei) => (
                    <div key={ei} style={{ fontSize: 9, background: e.color + "22", color: e.color, borderRadius: 3, padding: "1px 4px", marginBottom: 1, fontWeight: 600, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{e.label}</div>
                  ))}
                  {evs.length > 2 && <div style={{ fontSize: 9, color: T.muted }}>+{evs.length - 2}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ ...S.card, marginTop: 12, display: "flex", gap: 16, flexWrap: "wrap", padding: "11px 16px" }}>
          {[["#ef4444","Holiday"],[ACCENT,"Today"],["#818cf8","Assignment Due"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
              <span style={{ color: T.muted, fontWeight: 600 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── TIMETABLE ──
  function Timetable() {
    const TIMES = ["09:00","10:00","11:00","14:00","15:00","16:00"];
    return (
      <div className="fade-up">
        <h1 style={S.h1}>Class Timetable</h1>
        <p style={{ color: T.muted, fontSize: 13, marginBottom: 16 }}>Sem {classInfo.sem} · {cls} · {classInfo.room} · W.E.F 2nd Jan 2026</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {classInfo.subjects.map(s => (
            <div key={s.code} style={{ display: "flex", alignItems: "center", gap: 5, background: s.color + "15", border: `1px solid ${s.color}33`, borderRadius: 20, padding: "3px 10px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.code}</span>
            </div>
          ))}
        </div>
        <div style={{ ...S.card, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580, fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                <th style={{ padding: "8px 10px", textAlign: "left", color: T.muted, fontSize: 11, fontWeight: 700, width: 70 }}>TIME</th>
                {DAYS.map(d => <th key={d} style={{ padding: "8px 10px", textAlign: "center", color: T.muted, fontSize: 11, fontWeight: 700 }}>{d.slice(0, 3)}</th>)}
              </tr>
            </thead>
            <tbody>
              {TIMES.map((time, ti) => (
                <tr key={time} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "8px 10px", fontSize: 11, color: T.muted, fontWeight: 700 }}>{time}</td>
                  {DAYS.map(day => {
                    const slots = (classInfo.schedule[day] || []).filter(([t]) => t === time);
                    return (
                      <td key={day} style={{ padding: 3, verticalAlign: "top" }}>
                        {slots.map(([, sub, type], si) => {
                          const s = classInfo.subjects.find(x => x.code === sub);
                          return (
                            <div key={si} style={{ background: (s?.color || ACCENT) + "22", border: `1px solid ${(s?.color || ACCENT)}33`, borderRadius: 6, padding: "4px 7px", marginBottom: 2 }}>
                              <div style={{ fontSize: 11, fontWeight: 800, color: s?.color || ACCENT }}>{sub}</div>
                              <div style={{ fontSize: 9, color: T.muted }}>{type}</div>
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "10px 10px 2px", fontSize: 11, color: T.muted }}>* Lunch 12:00–14:00 not shown</div>
        </div>
        <div style={{ ...S.card, marginTop: 12 }}>
          <h2 style={S.h2}>Upcoming Holidays – NMIMS Shirpur</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {HOLIDAYS.filter(h => h.date >= "2026-05-11").map(h => (
              <div key={h.date} style={{ background: "#ef444411", border: "1px solid #ef444433", borderRadius: 9, padding: "6px 12px" }}>
                <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 700 }}>{new Date(h.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{h.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── ASSIGNMENTS ──
  function Assignments() {
    const [filter, setFilter] = useState("all");
    const filtered = assignments.filter(a =>
      filter === "all" || (filter === "pending" && !a.done) || (filter === "completed" && a.done)
    );
    const PRI_COL = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };

    return (
      <div className="fade-up">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <h1 style={S.h1}>Assignments</h1>
          <button onClick={() => setNewAsgn(v => !v)} style={S.btn()}>+ Add</button>
        </div>

        {newAsgn && (
          <div style={{ ...S.card, marginBottom: 12, border: "1px solid #6366f144" }}>
            <h2 style={S.h2}>New Assignment</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 9, marginBottom: 12 }}>
              <select value={asgnForm.sub} onChange={e => setAsgnForm(f => ({ ...f, sub: e.target.value }))} style={S.sel}>
                <option value="">Subject</option>
                {classInfo.subjects.map(s => <option key={s.code} value={s.code}>{s.code}</option>)}
              </select>
              <input placeholder="Title" value={asgnForm.title} onChange={e => setAsgnForm(f => ({ ...f, title: e.target.value }))}
                style={{ ...S.sel, fontWeight: 400 }} />
              <input type="date" value={asgnForm.due} onChange={e => setAsgnForm(f => ({ ...f, due: e.target.value }))} style={S.sel} />
              <select value={asgnForm.pri} onChange={e => setAsgnForm(f => ({ ...f, pri: e.target.value }))} style={S.sel}>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => {
                if (!asgnForm.sub || !asgnForm.title || !asgnForm.due) return;
                setAssignments(p => [...p, { ...asgnForm, id: Date.now(), done: false }]);
                setAsgnForm({ sub: "", title: "", due: "", pri: "medium" });
                setNewAsgn(false);
                showToast("Assignment added!");
              }} style={S.btn()}>Add</button>
              <button onClick={() => setNewAsgn(false)} style={S.btnO}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
          {["all", "pending", "completed"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={f === filter ? S.btn() : { ...S.btnO, textTransform: "capitalize" }}>{f}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(a => {
            const si = classInfo.subjects.find(s => s.code === a.sub);
            const dl = Math.ceil((new Date(a.due) - TODAY) / 864e5);
            return (
              <div key={a.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 11, borderLeft: `3px solid ${si?.color || ACCENT}`, opacity: a.done ? 0.55 : 1 }}>
                <input type="checkbox" checked={a.done}
                  onChange={() => setAssignments(p => p.map(x => x.id === a.id ? { ...x, done: !x.done } : x))}
                  style={{ width: 16, height: 16, cursor: "pointer", accentColor: ACCENT }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 13, textDecoration: a.done ? "line-through" : "none", color: T.text }}>{a.title}</span>
                    <span style={S.badge(si?.color || ACCENT)}>{a.sub}</span>
                    <span style={S.badge(PRI_COL[a.pri])}>{a.pri}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>Due: {new Date(a.due).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: a.done ? "#10b981" : dl <= 0 ? "#ef4444" : dl <= 3 ? "#f59e0b" : "#10b981", whiteSpace: "nowrap" }}>
                  {a.done ? "Done ✓" : dl <= 0 ? "Overdue!" : dl === 1 ? "Tomorrow" : `${dl}d left`}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ ...S.card, textAlign: "center", padding: 36, color: T.muted }}>No {filter} assignments 🎉</div>
          )}
        </div>
      </div>
    );
  }

  // ── ANALYTICS ──
  function Analytics() {
    const subs    = classInfo.subjects.map(s => {
      const d = attData[s.code] || { attended: 0, total: 0 };
      return { ...s, pct: calcPct(d.attended, d.total), attended: d.attended, total: d.total };
    });
    const totAtt  = Object.values(attData).reduce((s, v) => s + v.attended, 0);
    const totTot  = Object.values(attData).reduce((s, v) => s + v.total, 0);

    return (
      <div className="fade-up">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={S.h1}>Analytics</h1>
            <p style={{ color: T.muted, fontSize: 13 }}>Visual breakdown of your semester performance</p>
          </div>
          <button onClick={() => setShowAI(true)} style={S.btn()}>🤖 AI Insights</button>
        </div>

        <div style={{ ...S.g3, marginBottom: 14 }}>
          {subs.map(s => (
            <div key={s.code} style={{ ...S.card, textAlign: "center", padding: 16 }}>
              <Ring pct={s.pct} color={s.color} size={72} stroke={6} />
              <div style={{ marginTop: 8, fontWeight: 800, fontSize: 13, color: T.text }}>{s.code}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.attended}/{s.total}</div>
              <div style={{ marginTop: 6 }}>
                <span style={S.badge(s.pct >= 80 ? "#10b981" : s.pct >= 65 ? "#f59e0b" : "#ef4444")}>
                  {s.pct >= 80 ? "Safe" : s.pct >= 65 ? "Warning" : "Critical"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...S.card, marginBottom: 14 }}>
          <h2 style={S.h2}>Attendance Comparison</h2>
          {[...subs].sort((a, b) => b.pct - a.pct).map(s => (
            <div key={s.code} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
              <div style={{ width: 44, fontSize: 11, fontWeight: 700, color: s.color, textAlign: "right", flexShrink: 0 }}>{s.code}</div>
              <div style={{ flex: 1, height: 24, background: T.border, borderRadius: 7, overflow: "hidden", position: "relative" }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 7, transition: "width 1s cubic-bezier(.4,0,.2,1)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 7 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{s.pct}%</span>
                </div>
                <div style={{ position: "absolute", top: 0, left: "80%", width: 1.5, height: "100%", background: "#fff5" }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>Thin line = 80% minimum</div>
        </div>

        <div style={S.g2}>
          <div style={S.card}>
            <h2 style={S.h2}>Semester Summary</h2>
            {[
              ["Overall", `${overallPct}%`,              overallPct >= 80 ? "#10b981" : "#ef4444"],
              ["Attended", totAtt,                       ACCENT],
              ["Total Held", totTot,                     T.text],
              ["Safe Leaves", safeLeaves(totAtt, totTot),"#10b981"],
              ["Above 80%", subs.filter(s => s.pct >= 80).length, "#10b981"],
              ["Critical", subs.filter(s => s.pct < 75).length,   "#ef4444"],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ color: T.muted, fontSize: 13 }}>{l}</span>
                <span style={{ fontWeight: 800, color: c, fontSize: 14 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <h2 style={S.h2}>Upcoming Holidays</h2>
            {HOLIDAYS.filter(h => h.date >= "2026-05-11").map(h => (
              <div key={h.date} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 12, color: T.text }}>{h.name}</span>
                <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700 }}>{new Date(h.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const PAGES = { dashboard: Dashboard, attendance: Attendance, calendar: Calendar, timetable: Timetable, assignments: Assignments, analytics: Analytics };
  const Page = PAGES[page] || Dashboard;
  const NAV_ITEMS = [["dashboard","🏠"],["attendance","✅"],["calendar","📅"],["timetable","📋"],["assignments","📝"],["analytics","📊"]];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* TOP NAV (desktop) */}
      <nav style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 20px", display: "flex", alignItems: "center", gap: 2, position: "sticky", top: 0, zIndex: 100, flexWrap: "nowrap", overflowX: "auto" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: ACCENT, marginRight: 18, letterSpacing: -0.5, padding: "12px 0", flexShrink: 0 }}>NMIMS</div>
        {NAV_ITEMS.map(([k, icon]) => (
          <div key={k} onClick={() => setPage(k)} style={{ padding: "13px 13px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: page === k ? ACCENT : T.muted, borderBottom: page === k ? `2px solid ${ACCENT}` : "2px solid transparent", transition: "all .2s", whiteSpace: "nowrap", textTransform: "capitalize" }}>
            <span style={{ marginRight: 5 }}>{icon}</span>{k}
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 7, alignItems: "center", paddingLeft: 12 }}>
          <button onClick={() => setShowAI(true)} style={{ ...S.btn(), padding: "7px 13px", fontSize: 12, flexShrink: 0 }}>🤖 AI</button>
          <button onClick={() => setDarkMode(d => !d)} style={{ ...S.btnO, fontSize: 14, padding: "6px 8px", flexShrink: 0 }}>{darkMode ? "☀️" : "🌙"}</button>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "20px 18px 90px", maxWidth: 1340, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <Page />
      </main>

      {/* BOTTOM NAV (mobile) */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.surface, borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom)" }}>
        {NAV_ITEMS.map(([k, icon]) => (
          <button key={k} onClick={() => setPage(k)} style={{ flex: 1, background: "transparent", border: "none", padding: "10px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", color: page === k ? ACCENT : T.muted }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: "capitalize" }}>{k.slice(0, 6)}</span>
          </button>
        ))}
      </div>

      {/* AI CHAT */}
      {showAI && <AIChat attendanceData={attData} classInfo={classInfo} className={cls} onClose={() => setShowAI(false)} />}

      {/* MARK MODAL */}
      {marking && (
        <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setMarking(null)}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 24, width: "min(300px,100%)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 17, color: T.text, marginBottom: 3 }}>{marking.sub}</div>
            <div style={{ color: T.muted, fontSize: 13, marginBottom: 22 }}>{marking.time}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[["present","✓  Present","#10b981","#064e3b"],["absent","✗  Absent","#ef4444","#7f1d1d"],["cancelled","—  Cancelled","#f59e0b","#78350f"]].map(([s, l, c, bg]) => (
                <button key={s} onClick={() => doMark(marking.sub, s)} style={{ background: bg, color: c, border: `1px solid ${c}44`, borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>{l}</button>
              ))}
              <button onClick={() => setMarking(null)} style={{ ...S.btnO, marginTop: 4 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fade-up" style={{ position: "fixed", bottom: 80, right: 16, background: toast.type === "success" ? "#064e3b" : "#7f1d1d", color: toast.type === "success" ? "#6ee7b7" : "#fca5a5", borderRadius: 12, padding: "11px 18px", fontWeight: 600, fontSize: 13, zIndex: 600, boxShadow: "0 8px 32px #0008" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
