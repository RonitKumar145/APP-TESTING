# UNI GUYS - Twitter Clone

A class project Twitter clone with invite-only registration, polls, and file sharing.

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB Atlas Account (Free)
- Cloudinary Account (Free)

### 2. Environment Variables
You need to configure the backend with your own credentials.
Open `server/.env` and update the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Installation

**Backend:**
```bash
cd server
npm install
npm start
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## Features
- **Invite Only**: Users need a valid Invite Code to sign up.
- **Polls**: Create and vote on polls.
- **File Sharing**: Upload images and documents.
