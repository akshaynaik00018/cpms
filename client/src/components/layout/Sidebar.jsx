import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiHome, FiBriefcase, FiFileText, FiMessageSquare,
  FiUsers, FiBarChart2, FiSettings, FiCalendar,
  FiAward, FiEdit, FiTrendingUp, FiBook, FiGift
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useSelector(state => state.auth);

  const studentLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/student/profile', icon: FiUsers, label: 'Profile' },
    { to: '/jobs', icon: FiBriefcase, label: 'Jobs' },
    { to: '/applications', icon: FiFileText, label: 'Applications' },
    { to: '/drives', icon: FiCalendar, label: 'Drives' },
    { to: '/quizzes', icon: FiAward, label: 'Quizzes' },
    { to: '/forum', icon: FiMessageSquare, label: 'Forum' },
    { to: '/resume-builder', icon: FiEdit, label: 'Resume Builder' },
    { to: '/chat', icon: FiMessageSquare, label: 'Chat' },
    { to: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  const companyLinks = [
    { to: '/company/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/company/profile', icon: FiUsers, label: 'Profile' },
    { to: '/company/jobs', icon: FiBriefcase, label: 'Manage Jobs' },
    { to: '/drives', icon: FiCalendar, label: 'Drives' },
    { to: '/forum', icon: FiMessageSquare, label: 'Forum' },
    { to: '/chat', icon: FiMessageSquare, label: 'Chat' },
    { to: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
    { to: '/admin/companies', icon: FiBriefcase, label: 'Companies' },
    { to: '/admin/stats', icon: FiBarChart2, label: 'Placement Stats' },
    { to: '/admin/analytics', icon: FiTrendingUp, label: 'Analytics' },
    { to: '/drives', icon: FiCalendar, label: 'Drives' },
    { to: '/forum', icon: FiMessageSquare, label: 'Forum' },
    { to: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  let navLinks = [];
  if (user?.role === 'student') navLinks = studentLinks;
  else if (user?.role === 'company') navLinks = companyLinks;
  else if (user?.role === 'admin') navLinks = adminLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 overflow-y-auto`}
      >
        <nav className="p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => window.innerWidth < 768 && onClose()}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
