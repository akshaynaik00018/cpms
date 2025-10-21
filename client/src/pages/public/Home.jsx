import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const Home = () => {
  const features = [
    'Comprehensive Student Profile Management',
    'AI-Powered Resume Screening',
    'Placement Prediction & Analytics',
    'Real-time Chat & Communication',
    'Interview Preparation Resources',
    'Mock Tests & Quizzes',
    'Company-Student Matchmaking',
    'Placement Drive Management',
    'Detailed Analytics & Reports'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Ultimate College Placement
              <span className="block text-gradient">Management System</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Streamline and automate the entire college placement process for students,
              companies, and administrators with our comprehensive MERN-based solution.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need for successful placement management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow"
              >
                <FiCheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Core Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Student Module
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Profile management, job applications, resume building, skill assessment,
                and placement tracking.
              </p>
            </div>

            <div className="card text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Company Module
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Job posting, candidate screening, drive management, and analytics.
              </p>
            </div>

            <div className="card text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Admin Module
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                User management, placement statistics, reports generation, and system
                administration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Placement Process?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students, companies, and institutions using CPMS
          </p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
