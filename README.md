# Job Application Tracker

A full-stack Job Application Tracker web application that helps users efficiently manage and track their job applications. The app supports user authentication, secure data handling, and personalized job tracking, ensuring each user sees only their own application data.

🔗 **Live Demo:** https://job-apply-track.netlify.app

---

### Features

- User authentication (Signup / Login using JWT)
- Add, edit, and delete job applications
- Track application status (To Apply, Urgent, Pending, Accepted, Rejected, Expired)
- Manage interview rounds with dynamic round status
- Job statistics dashboard
- Export job data as CSV
- Google Calendar reminder integration
- Real-time search to filter jobs by role or company
- Secure user-specific data handling

---

### Tech Stack

**Frontend**
- React, React Router, Axios, CSS

**Backend**
- Node.js, Express.js, MongoDB (Atlas), Mongoose, JWT Authentication

---

### Getting Started (Local Setup)

1. Clone the repository
```bash
git clone https://github.com/Anushri2005/job-application-tracker.git
```

2. Frontend Setup
```bash
cd job-application-tracker
npm install
npm start
```
Create a `.env` file in the root: REACT_APP_API=http://localhost:5000/api

3. Backend Setup
```bash
cd src/backend
npm install
node server.js
```
Create a `.env` file in `src/backend`:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
---

### Deployment

- Frontend deployed on **Netlify**
- Backend deployed on **Render**
- Database hosted on **MongoDB Atlas**

---

### Future Enhancements

- Job status analytics and charts
- Search and filter by status
- Reminder notifications
- Improved UI/UX design
- AI-powered resume-to-job match scorer
