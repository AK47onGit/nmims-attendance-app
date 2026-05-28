# NMIMS Attendance Tracker 🎓

Smart attendance management for NMIMS B.Tech students (MPSTME Shirpur).

---

## 🚀 Deploy in 10 Minutes (Free)

### Step 1 — Install Node.js
Go to https://nodejs.org and download the **LTS version**. Install it normally.

### Step 2 — Upload to GitHub
1. Go to https://github.com and create a free account
2. Click **"New repository"** → name it `nmims-attendance` → click **Create**
3. Download this project folder to your computer
4. On the GitHub repo page, drag and drop ALL the project files into the browser
5. Click **"Commit changes"**

### Step 3 — Deploy to Vercel (Free hosting)
1. Go to https://vercel.com and sign up with your GitHub account
2. Click **"Add New Project"**
3. Select your `nmims-attendance` repository
4. Click **"Deploy"** — Vercel auto-detects Vite/React
5. Wait ~2 minutes

✅ **Your app is now live at:** `https://nmims-attendance.vercel.app`

---

## 📱 Install on Phone (Works like a real app)

### Android (Chrome):
1. Open your Vercel URL in Chrome
2. Tap the **3-dot menu** (⋮) → **"Add to Home screen"**
3. Tap **Add**
4. App icon appears on your home screen — opens fullscreen, no browser bar!

### iPhone (Safari):
1. Open your Vercel URL in Safari
2. Tap the **Share button** (□↑) → **"Add to Home Screen"**
3. Tap **Add**

---

## 🖥️ Run Locally (Optional)

```bash
cd nmims-attendance
npm install
npm run dev
```
Open http://localhost:5173

---

## 📁 Project Structure

```
nmims-attendance/
├── index.html              # App entry point
├── vite.config.js          # Build + PWA config
├── package.json            # Dependencies
├── vercel.json             # Deployment config
└── src/
    ├── main.jsx            # React root
    ├── App.jsx             # Main app + all pages
    ├── AIChat.jsx          # Claude AI assistant
    ├── Ring.jsx            # Circular progress component
    ├── data.js             # Timetable + holiday data
    └── index.css           # Global styles
```

---

## ✏️ How to Update Data

### Change timetable or add subjects:
Edit `src/data.js` → `CLASSES` object

### Add/change holidays:
Edit `src/data.js` → `HOLIDAYS` array

### Change your class/division:
The app has a dropdown in the top-right to switch between Div A, Div B, and 3rd Year.

After any edit → push to GitHub → Vercel auto-redeploys in ~1 min.

---

## ✨ Features
- 📊 Subject-wise attendance with 80% logic
- 🔮 "What if I skip?" simulator
- 🤖 Claude AI assistant with full context
- 📅 Academic calendar with holidays + deadlines
- 📋 Full timetable (Div A, Div B, 3rd Year)
- 📝 Assignment tracker with deadlines
- 📈 Analytics dashboard
- 🌙 Dark / Light mode
- 📱 Mobile-first with bottom navigation
- 💾 Data saved locally in browser

---

Built for NMIMS MPSTME Shirpur · B.Tech Computer Science · 2025-26
