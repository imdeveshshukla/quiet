# Quiet - Anonymous Social Media

## 📌Project Overview

Quiet is an anonymous social media platform designed for college users to post thoughts, create topic-specific rooms, and interact freely while ensuring privacy and anonymity. The platform features secure login and user authentication, allowing only college-verified users to participate.

## 🚀Features
- **Anonymous Posting**: Users can share their thoughts without revealing their identity.

- **Topic-Specific Rooms**: Organize discussions into dedicated rooms.

- **Secure Authentication**: College-only access with verified emails.

- **Nested Comments**: Enhance discussions with threaded comments.

- **CI/CD Pipeline**: Seamless deployment with GitHub Actions.

- **Cloud Deployment**: Backend hosted on Azure (Dockerized), frontend on Render.

## 🌐 Live Demo
### [**bequiet.live**](https://www.bequiet.live/)

## 🛠️ Setup Instructions

### Backend Setup

```bash
cd backend
cp .env.example .env   # Configure environment variables
npm install
npm run migrate         # Run Prisma migrations
npm run dev             # Start the backend server
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env   # Configure environment variables
npm install
npm run dev            # Start the frontend
```

## 🔧 Technologies Used

- Frontend: React.js, Redux, TailwindCSS

- Backend: Node.js, Express.js, Prisma ORM

- Database: PostgreSQL (NeonDB)

- DevOps: Docker, GitHub Actions, Azure, Render
