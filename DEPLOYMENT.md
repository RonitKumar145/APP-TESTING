# Deployment Guide for UNI GUYS

This guide will help you deploy your "UNI GUYS" application so your classmates can access it.

## Prerequisites

- A [GitHub](https://github.com/) account.
- A [Render](https://render.com/) account (for the backend).
- A [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) account (for the frontend).
- Your MongoDB connection string (from MongoDB Atlas).
- Your Cloudinary credentials.

## Step 1: Push to GitHub

1.  Make sure your code is committed and pushed to a GitHub repository.
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push origin main
    ```

## Step 2: Deploy Backend (Render.com)

1.  Log in to **Render.com**.
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Select the **server** directory (if asked for Root Directory, enter `server`).
    *   **Name**: `uni-guys-api` (or similar)
    *   **Runtime**: Node
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
5.  **Environment Variables**:
    Add the following variables (copy values from your `server/.env` file):
    *   `MONGODB_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: Your secret key.
    *   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
    *   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
    *   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
6.  Click **Create Web Service**.
7.  Wait for the deployment to finish. **Copy the URL** of your deployed backend (e.g., `https://uni-guys-api.onrender.com`).

## Step 3: Deploy Frontend (Vercel)

1.  Log in to **Vercel.com**.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Framework Preset**: Vite
5.  **Root Directory**: Click "Edit" and select `client`.
6.  **Environment Variables**:
    *   Name: `VITE_API_URL`
    *   Value: The URL of your deployed backend (from Step 2), e.g., `https://uni-guys-api.onrender.com` (Do NOT include a trailing slash).
7.  Click **Deploy**.

## Step 4: Finalize

1.  Once Vercel finishes, you will get a domain (e.g., `uni-guys.vercel.app`).
2.  Share this link with your classmates!
3.  **Important**: You might need to generate a new Invite Code using the Admin Dashboard on the *deployed* version (login as admin first) so they can sign up.

## Troubleshooting

-   **CORS Error**: If you see CORS errors in the browser console, ensure your backend is running and accessible.
-   **Database**: Your deployed app uses the *same* MongoDB database as your local app (if you used the same URI). So your existing users/posts will be there.
