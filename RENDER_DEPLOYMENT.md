# Deploy ChatGPT Clone to Render

This guide will walk you through deploying your ChatGPT-style chat application to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your OpenAI API key
3. A GitHub account (to push your code)

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

## Step 2: Create a PostgreSQL Database on Render

1. Log in to your Render dashboard
2. Click **New** → **PostgreSQL**
3. Configure your database:
   - **Name**: chatgpt-clone-db (or any name you prefer)
   - **Region**: Choose a region close to you
   - **Plan**: Free (or choose a paid plan if needed)
4. Click **Create Database**
5. Once created, copy the **Internal Database URL** (this will be your `DATABASE_URL`)
6. **Important**: You must append `?sslmode=require` to the database URL for secure connections
   - Example: If your URL is `postgresql://user:pass@host/db`, use `postgresql://user:pass@host/db?sslmode=require`

## Step 3: Create a Web Service on Render

1. From your Render dashboard, click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure your web service:
   - **Name**: chatgpt-clone (or any name you prefer)
   - **Region**: Choose the same region as your database
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run db:push && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan if needed)

## Step 4: Set Environment Variables

In the **Environment** section of your web service settings, add the following environment variables:

1. **OPENAI_API_KEY**
   - Value: Your OpenAI API key

2. **DATABASE_URL**
   - Value: The Internal Database URL from Step 2 **with `?sslmode=require` appended**
   - Example: `postgresql://user:pass@host/db?sslmode=require`

3. **NODE_ENV**
   - Value: `production`

**Note**: Render's PostgreSQL includes the `pgcrypto` extension by default, which is required for UUID generation. If you're using a different PostgreSQL provider, ensure this extension is enabled.

## Step 5: Deploy

1. Click **Create Web Service**
2. Render will automatically:
   - Install dependencies
   - Push the database schema to PostgreSQL
   - Build your frontend and backend
   - Start your application
3. Wait for the deployment to complete (this may take 5-10 minutes)
4. Once deployed, you'll get a URL like: `https://chatgpt-clone.onrender.com`

## Verify Your Deployment

1. Visit your Render URL
2. You should see the ChatGPT-style chat interface
3. Try creating a new chat and sending a message
4. If everything works, your deployment is successful!

## Troubleshooting

### Build Fails

- Check the build logs in Render dashboard
- Ensure all environment variables are set correctly
- Verify your `DATABASE_URL` is the Internal Database URL (not External)

### Database Connection Issues

- Make sure you're using the **Internal Database URL** from Render with `?sslmode=require` appended
- Verify the database is in the same region as your web service
- Check that `db:push` ran successfully in the build logs
- If you see "gen_random_uuid() does not exist" errors, ensure the `pgcrypto` extension is enabled (Render enables it by default)

### OpenAI API Errors

- Verify your `OPENAI_API_KEY` is correct
- Ensure you have credits in your OpenAI account
- Check the application logs for specific error messages

## Updating Your Application

To deploy updates:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Render will automatically detect the push and redeploy

## Notes

- The free tier on Render will spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- For production use, consider upgrading to a paid plan for better performance
- Your chat history is stored in PostgreSQL and persists between deployments

## Project Structure

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT-4o-mini

Enjoy your deployed ChatGPT clone!
