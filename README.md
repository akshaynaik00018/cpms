# Ultimate College Placement Management System (CPMS)

A comprehensive MERN stack application that streamlines and automates the entire college placement process for students, companies, and administrators.

## 🚀 Features

### Core Modules

#### 🧑‍🎓 Student Module
- Complete profile management (personal info, academic details, skills)
- Resume upload with AI-powered parsing
- Skill portfolio with certifications, projects, and achievements
- Platform integration (LeetCode, HackerRank, Coursera, etc.)
- Eligibility tracker for job matching
- Comprehensive dashboard with application tracking
- Status updates (Applied/Shortlisted/Rejected/Selected)
- Notifications and reminders

#### 🏢 Company Module
- Company registration and profile management
- Job posting with detailed criteria
- Placement drive scheduling and management
- Candidate shortlisting and tracking
- Automated notifications to eligible students
- Analytics and reporting

#### 🧑‍💼 Admin/Placement Officer Module
- Complete user management
- Placement statistics and analytics
- Branch-wise and company-wise reports
- Drive coordination
- PDF/CSV report generation
- Email/SMS broadcasting

### Advanced Features

#### 📊 Analytics & Insights
- **AI Resume Screening**: Automatic analysis and skill matching
- **Placement Prediction**: ML-based prediction of placement probability
- **Skill Gap Analysis**: Personalized upskilling recommendations
- **Trend Analysis**: Hiring patterns and placement trends

#### 💬 Communication
- Real-time chat system
- Discussion forums for interview experiences
- Centralized event calendar
- Unified notifications (web and email)

#### 🧠 Interview Preparation
- Mock tests and quizzes (Aptitude, Logical, Technical, Coding)
- Interview experience repository
- Resume builder with templates
- Integrated coding practice

#### 🎯 Additional Features
- Offer letter management with e-signature
- Multi-round tracking
- Company feedback system
- Internship portal
- Alumni referral network
- Dark mode support
- Role-based access control
- Two-factor authentication
- Activity/audit logs

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **Multer** - File uploads
- **PDFKit** - PDF generation
- **Nodemailer** - Email service

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Socket.IO Client** - Real-time updates
- **Axios** - HTTP client

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd college-placement-management-system
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/cpms

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@cpms.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB

```bash
# Make sure MongoDB is running
mongod
```

### 5. Run the application

```bash
# Development mode (runs both client and server)
npm run dev

# Run server only
npm run server

# Run client only
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
college-placement-management-system/
├── server/                 # Backend application
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── uploads/          # File uploads
│   └── server.js         # Server entry point
├── client/               # Frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   ├── services/    # API services
│   │   ├── layouts/     # Layout components
│   │   └── App.jsx      # App component
│   └── package.json
└── package.json          # Root package file
```

## 🔐 Default Credentials

After initial setup, you can create an admin account using:

```bash
Email: admin@cpms.com
Password: Admin@123
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Student Endpoints
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile
- `POST /api/students/resume` - Upload resume
- `GET /api/students/dashboard` - Get student dashboard

### Job Endpoints
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job (Company/Admin)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Application Endpoints
- `POST /api/applications/apply/:jobId` - Apply for job
- `GET /api/applications/my-applications` - Get student applications
- `PUT /api/applications/:id/status` - Update application status
- `GET /api/applications/job/:jobId` - Get job applications

## 🎨 Features Breakdown

### Student Features
- ✅ Profile creation and management
- ✅ Resume upload and parsing
- ✅ Skill portfolio management
- ✅ Job application tracking
- ✅ Eligibility checking
- ✅ Mock tests and quizzes
- ✅ Interview preparation resources
- ✅ Resume builder
- ✅ Chat and forums
- ✅ Placement prediction

### Company Features
- ✅ Company profile management
- ✅ Job posting
- ✅ Candidate screening (AI-powered)
- ✅ Drive management
- ✅ Application tracking
- ✅ Analytics dashboard

### Admin Features
- ✅ User management
- ✅ Company verification
- ✅ Placement statistics
- ✅ Report generation
- ✅ Drive coordination
- ✅ System administration

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku example)
```bash
cd server
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Vercel example)
```bash
cd client
vercel --prod
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@cpms.com or create an issue in the repository.

## 🙏 Acknowledgments

- All contributors who helped build this system
- Open source community for the amazing tools and libraries

## 📱 Screenshots

*(Add screenshots of your application here)*

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Student, Company, and Admin modules
  - AI-powered features
  - Chat and forum
  - Interview preparation
  - Complete placement management workflow

---

**Built with ❤️ using the MERN Stack**
