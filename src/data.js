export const HOLIDAYS = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-26", name: "Republic Day" },
  { date: "2026-03-03", name: "Holi" },
  { date: "2026-03-19", name: "Gudhi Padwa" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-05-01", name: "Maharashtra Day" },
  { date: "2026-05-28", name: "Bakri Eid" },
  { date: "2026-08-15", name: "Independence Day" },
  { date: "2026-09-04", name: "Janmashtami" },
  { date: "2026-09-14", name: "Ganesh Chaturthi" },
  { date: "2026-10-02", name: "Gandhi Jayanti" },
  { date: "2026-10-20", name: "Dushera" },
  { date: "2026-11-09", name: "Diwali" },
  { date: "2026-11-10", name: "Diwali (Balipratipada)" },
  { date: "2026-11-11", name: "Diwali (Bhaubeej)" },
  { date: "2026-12-25", name: "Christmas" },
];

export const CLASSES = {
  "2nd Year – Div A": {
    sem: "IV", room: "LR-09",
    subjects: [
      { code: "CVT",   name: "Complex Variables & Transforms",    faculty: "Dr. Bipin Jadhav",          color: "#818cf8" },
      { code: "DM",    name: "Discrete Mathematics",              faculty: "Dr. Dileep Kumar",           color: "#fb923c" },
      { code: "DAA",   name: "Design & Analysis of Algorithms",   faculty: "Dr. Nitin Choubey",          color: "#34d399" },
      { code: "DBMS",  name: "Database Management Systems",       faculty: "Dr. RadhaKrishna Rambola",   color: "#f87171" },
      { code: "WP",    name: "Web Programming",                   faculty: "Dr. Suraj Patil",            color: "#a78bfa" },
      { code: "DAIoT", name: "Design & Applications of IoT",      faculty: "Dr. Bhushan Inje",           color: "#22d3ee" },
      { code: "TCS",   name: "Theoretical Computer Science",      faculty: "Dr. Dhananjay Joshi",        color: "#facc15" },
      { code: "OOPJ",  name: "OOP through JAVA",                  faculty: "Prof. Anjali Rodwal",        color: "#f472b6" },
    ],
    schedule: {
      Monday:    [["10:00","DAIoT","Lab"],["12:00","DM","Theory"],["14:00","DAA","Theory"],["15:00","CVT","Theory"],["16:00","DBMS","Theory"]],
      Tuesday:   [["10:00","DBMS","Lab"],["12:00","TCS","Theory"],["14:00","CVT","Tutorial"],["15:00","WP","Theory"],["16:00","DAIoT","Theory"]],
      Wednesday: [["10:00","OOPJ","Lab"],["12:00","DBMS","Theory"],["14:00","WP","Theory"],["15:00","DAIoT","Theory"],["16:00","CVT","Theory"]],
      Thursday:  [["09:00","TCS","Tutorial"],["10:00","DAA","Lab"],["12:00","DAIoT","Theory"],["14:00","DM","Tutorial"],["15:00","OOPJ","Lab"]],
      Friday:    [["09:00","TCS","Tutorial"],["10:00","WP","Lab"],["12:00","DM","Theory"],["14:00","DAA","Theory"],["15:00","CVT","Theory"],["16:00","TCS","Theory"]],
    },
  },
  "2nd Year – Div B": {
    sem: "IV", room: "LR-12",
    subjects: [
      { code: "CVT",   name: "Complex Variables & Transforms",    faculty: "Dr. Bipin Jadhav",           color: "#818cf8" },
      { code: "DM",    name: "Discrete Mathematics",              faculty: "Dr. Anubhuti Raturi",         color: "#fb923c" },
      { code: "DAA",   name: "Design & Analysis of Algorithms",   faculty: "Prof. Piyush Kumar Soni",     color: "#34d399" },
      { code: "DBMS",  name: "Database Management Systems",       faculty: "Dr. Sachin Bhandari",         color: "#f87171" },
      { code: "WP",    name: "Web Programming",                   faculty: "Dr. Suraj Patil",             color: "#a78bfa" },
      { code: "DAIoT", name: "Design & Applications of IoT",      faculty: "Dr. Bhushan Inje",            color: "#22d3ee" },
      { code: "TCS",   name: "Theoretical Computer Science",      faculty: "Dr. Dhananjay Joshi",         color: "#facc15" },
      { code: "OOPJ",  name: "OOP through JAVA",                  faculty: "Prof. Anjali Rodwal",         color: "#f472b6" },
    ],
    schedule: {
      Monday:    [["10:00","DBMS","Lab"],["12:00","CVT","Theory"],["14:00","DM","Theory"],["15:00","DAIoT","Theory"],["16:00","WP","Theory"]],
      Tuesday:   [["09:00","TCS","Tutorial"],["10:00","DAIoT","Lab"],["12:00","CVT","Tutorial"],["14:00","DAA","Theory"],["15:00","OOPJ","Lab"]],
      Wednesday: [["10:00","DAA","Lab"],["12:00","DAIoT","Theory"],["14:00","CVT","Theory"],["15:00","TCS","Theory"],["16:00","DM","Theory"]],
      Thursday:  [["10:00","WP","Lab"],["12:00","DM","Tutorial"],["14:00","DAA","Theory"],["15:00","DBMS","Theory"],["16:00","TCS","Theory"]],
      Friday:    [["10:00","OOPJ","Lab"],["11:00","TCS","Tutorial"],["12:00","CVT","Theory"],["14:00","DAIoT","Theory"],["15:00","DBMS","Theory"],["16:00","WP","Theory"]],
    },
  },
  "3rd Year": {
    sem: "VI", room: "LR-11",
    subjects: [
      { code: "AI",    name: "Artificial Intelligence",           faculty: "Prof. Kiran Salunke",  color: "#818cf8" },
      { code: "CS",    name: "Cyber Security",                    faculty: "Dr. Upendra Verma",    color: "#f87171" },
      { code: "DC",    name: "Distributed Computing",             faculty: "Dr. Sachin Chavan",    color: "#34d399" },
      { code: "ECOMM", name: "E-Commerce (DE-II)",                faculty: "Dr. Pravin Landge",    color: "#fb923c" },
      { code: "HCI",   name: "Human-Computer Interaction",        faculty: "Dr. Deepti Barhate",   color: "#a78bfa" },
      { code: "IS",    name: "Interpersonal Skills",              faculty: "Dr. Abhijeet Dawle",   color: "#22d3ee" },
      { code: "OE-III",name: "Open Elective III",                 faculty: "Various",              color: "#facc15" },
      { code: "OE-IV", name: "Open Elective IV",                  faculty: "Various",              color: "#f472b6" },
    ],
    schedule: {
      Monday:    [["09:00","OE-III","Theory"],["10:00","AI","Theory"],["13:00","AI","Lab"],["15:00","HCI","Lab"]],
      Tuesday:   [["09:00","OE-IV","Theory"],["10:00","HCI","Theory"],["11:00","ECOMM","Theory"],["13:00","CS","Lab"],["15:00","OE-III","Lab"]],
      Wednesday: [["09:00","OE-III","Theory"],["10:00","CS","Theory"],["13:00","DC","Theory"],["14:00","OE-IV","Theory"],["15:00","ECOMM","Lab"]],
      Thursday:  [["09:00","OE-IV","Theory"],["10:00","ECOMM","Theory"],["11:00","HCI","Theory"],["13:00","DC","Lab"],["15:00","OE-III","Lab"]],
      Friday:    [["09:00","OE-III","Theory"],["10:00","AI","Lab"],["11:00","CS","Theory"],["13:00","IS","Lab"],["15:00","DC","Theory"],["16:00","AI","Theory"]],
    },
  },
};

export const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
export const TODAY = new Date(2026, 4, 11);

export const calcPct    = (a, t) => t === 0 ? 100 : Math.round((a / t) * 100);
export const safeLeaves = (a, t) => Math.max(0, Math.floor(a / 0.8) - t);
export const needMore   = (a, t) => Math.max(0, Math.ceil((0.8 * t - a) / 0.2));
export const fmtDate    = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
export const dayName    = (d) => ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];

export function seedAttendance(subjects) {
  const d = {};
  subjects.forEach(s => {
    const total = Math.floor(Math.random() * 12) + 20;
    const att   = Math.floor(total * (0.6 + Math.random() * 0.35));
    d[s.code]   = { attended: att, total, log: [] };
  });
  return d;
}
