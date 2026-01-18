# Job Application Tracker

A full-stack Job Application Tracker web application that helps users efficiently manage and track their job applications. The app supports user authentication, secure data handling, and personalized job tracking, ensuring each user sees only their own application data.

### Features :-
- User authentication (Signup / Login using JWT)
- Add, view, and delete job applications
- Track application status (To Apply, Pending, Accepted, Rejected, Expired)
- Manage interview rounds with dynamic round status
- Job statistics dashboard
- Export job data as CSV
- Google Calendar reminder integration
- Secure user-specific data handling

### Tech Stack :-

#### Frontend
- React
- React Router
- Axios
- CSS

#### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication

### Project Structure :-
<img width="371" height="543" alt="image" src="https://github.com/user-attachments/assets/8d2f7701-c428-42a2-b964-9144fe9b836a" />

### Getting Started (Local Setup)

1. Clone the repository
```bash
git clone https://github.com/Anushri2005/job-application-tracker.git
```
2. Frontend Setup
cd job-application-tracker
npm install
npm start

Create a .env file:
```bash
REACT_APP_API=http://localhost:5000/api
```

3. Backend Setup
cd src/backend
npm install
node server.js

Create a .env file:
```bash
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### Deployment :-

- Frontend deployed on Netlify
- Backend deployed on Render
- MongoDB hosted on MongoDB Atlas

### Future Enhancements :-

- Edit/update job applications
- Job status analytics and charts
- Reminder notifications
- Search and filter functionality
- Improved UI/UX design




