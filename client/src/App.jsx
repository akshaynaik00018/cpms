import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/slices/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import JobList from './pages/student/JobList';
import JobDetails from './pages/student/JobDetails';
import Applications from './pages/student/Applications';
import Quizzes from './pages/student/Quizzes';
import QuizAttempt from './pages/student/QuizAttempt';
import Forum from './pages/student/Forum';
import Chat from './pages/student/Chat';
import ResumeBuilder from './pages/student/ResumeBuilder';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';
import CompanyProfile from './pages/company/Profile';
import ManageJobs from './pages/company/ManageJobs';
import CreateJob from './pages/company/CreateJob';
import ViewApplications from './pages/company/ViewApplications';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCompanies from './pages/admin/ManageCompanies';
import PlacementStats from './pages/admin/PlacementStats';
import Analytics from './pages/admin/Analytics';

// Common Pages
import Drives from './pages/common/Drives';
import DriveDetails from './pages/common/DriveDetails';
import Notifications from './pages/common/Notifications';
import Settings from './pages/common/Settings';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        {/* Student Routes */}
        <Route path="/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute role="student"><JobList /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute role="student"><JobDetails /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute role="student"><Applications /></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute role="student"><Quizzes /></ProtectedRoute>} />
        <Route path="/quizzes/:id" element={<ProtectedRoute role="student"><QuizAttempt /></ProtectedRoute>} />
        <Route path="/resume-builder" element={<ProtectedRoute role="student"><ResumeBuilder /></ProtectedRoute>} />
        
        {/* Company Routes */}
        <Route path="/company/dashboard" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/profile" element={<ProtectedRoute role="company"><CompanyProfile /></ProtectedRoute>} />
        <Route path="/company/jobs" element={<ProtectedRoute role="company"><ManageJobs /></ProtectedRoute>} />
        <Route path="/company/jobs/create" element={<ProtectedRoute role="company"><CreateJob /></ProtectedRoute>} />
        <Route path="/company/applications/:jobId" element={<ProtectedRoute role="company"><ViewApplications /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/companies" element={<ProtectedRoute role="admin"><ManageCompanies /></ProtectedRoute>} />
        <Route path="/admin/stats" element={<ProtectedRoute role="admin"><PlacementStats /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />
        
        {/* Common Routes */}
        <Route path="/drives" element={<Drives />} />
        <Route path="/drives/:id" element={<DriveDetails />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
