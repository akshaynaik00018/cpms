# Complete Setup Guide - CPMS

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Common Issues](#common-issues)
7. [Production Deployment](#production-deployment)

## Prerequisites

### Required Software
- **Node.js**: v14.0.0 or higher
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **MongoDB**: v4.4 or higher
  - Download from: https://www.mongodb.com/try/download/community
  - Verify installation: `mongod --version`

- **Git**: Latest version
  - Download from: https://git-scm.com/
  - Verify installation: `git --version`

### Optional but Recommended
- **MongoDB Compass**: GUI for MongoDB
- **Postman**: API testing
- **VS Code**: Code editor with extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux snippets

## Installation Steps

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd college-placement-management-system
```

### Step 2: Install Root Dependencies
```bash
npm install
```

### Step 3: Install Server Dependencies
```bash
cd server
npm install
cd ..
```

Or use the npm script:
```bash
npm run install-server
```

### Step 4: Install Client Dependencies
```bash
cd client
npm install
cd ..
```

Or use the npm script:
```bash
npm run install-client
```

### Step 5: Install All at Once
```bash
npm run install-all
```

## Database Setup

### Option 1: Local MongoDB

1. **Start MongoDB Service**
   - Windows: MongoDB service should start automatically
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

2. **Verify MongoDB is Running**
   ```bash
   mongo --eval "db.version()"
   ```

3. **Create Database** (Optional - will be created automatically)
   ```bash
   mongo
   use cpms
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to you
   - Create cluster

3. **Setup Database User**
   - Database Access → Add New Database User
   - Create username and password
   - Grant read/write access

4. **Whitelist IP**
   - Network Access → Add IP Address
   - For development: Allow access from anywhere (0.0.0.0/0)

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace <password> with your database user password

## Environment Configuration

### Server Environment (.env in /server directory)

Create `server/.env` file:

```env
# Server
NODE_ENV=development
PORT=5000

# Database - Local MongoDB
MONGODB_URI=mongodb://localhost:27017/cpms

# Database - MongoDB Atlas (Alternative)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cpms?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=CPMS <noreply@cpms.com>

# For Gmail, you need to:
# 1. Enable 2-factor authentication
# 2. Generate app-specific password
# 3. Use that password here

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Frontend URL
CLIENT_URL=http://localhost:3000

# Optional: External API Keys
OPENAI_API_KEY=your_openai_api_key
LEETCODE_API_KEY=your_leetcode_api_key
```

### Client Environment (.env in /client directory)

Create `client/.env` file:

```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode

#### Option 1: Run Both Client and Server Together
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:3000

#### Option 2: Run Separately

**Terminal 1 - Server:**
```bash
npm run server
```

**Terminal 2 - Client:**
```bash
npm run client
```

### Production Mode

1. **Build Client**
   ```bash
   cd client
   npm run build
   ```

2. **Start Server**
   ```bash
   cd server
   NODE_ENV=production node server.js
   ```

## Common Issues

### Issue 1: MongoDB Connection Error
**Error:** `MongoNetworkError: failed to connect to server`

**Solution:**
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in .env
- For Atlas, verify IP whitelist and credentials

### Issue 2: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in server/.env
PORT=5001
```

### Issue 3: Module Not Found
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 4: CORS Errors
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Verify CLIENT_URL in server/.env matches your frontend URL
- Check CORS configuration in server/server.js

### Issue 5: Email Not Sending
**Solution:**
- For Gmail:
  1. Enable 2-factor authentication
  2. Generate app-specific password
  3. Use app password in EMAIL_PASSWORD
- Verify EMAIL_HOST and EMAIL_PORT
- Check firewall settings

## Testing the Application

### 1. Create Test Accounts

#### Student Account:
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "student@test.com",
  "password": "Student@123",
  "role": "student",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "enrollmentNumber": "EN001",
  "branch": "CSE",
  "semester": 6,
  "batch": "2020-2024",
  "cgpa": 8.5
}
```

#### Company Account:
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "company@test.com",
  "password": "Company@123",
  "role": "company",
  "companyName": "Tech Corp",
  "industry": "Information Technology"
}
```

#### Admin Account:
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "admin@cpms.com",
  "password": "Admin@123",
  "role": "admin"
}
```

### 2. Verify Installation
- Navigate to http://localhost:3000
- Register a new account
- Login and explore features

## Production Deployment

### Backend Deployment (Heroku)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd server
   heroku create your-cpms-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   # Set all other environment variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd client
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add VITE_API_URL with your backend URL

### Alternative: Deploy Both on Single Server

1. Build client:
   ```bash
   cd client
   npm run build
   ```

2. Copy build to server:
   ```bash
   cp -r dist ../server/public
   ```

3. Update server to serve static files:
   ```javascript
   // In server.js, add before routes:
   app.use(express.static(path.join(__dirname, 'public')));
   
   // Add after all routes:
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'index.html'));
   });
   ```

## Next Steps

1. ✅ Complete installation
2. ✅ Test basic functionality
3. 📝 Read API documentation
4. 🎨 Customize branding and colors
5. 📊 Configure analytics
6. 🔒 Setup SSL certificates for production
7. 📧 Configure email templates
8. 🚀 Deploy to production

## Support

If you encounter any issues:
1. Check this guide first
2. Review error logs
3. Search existing issues on GitHub
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment details

---

Happy Coding! 🚀
