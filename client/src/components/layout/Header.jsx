import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/slices/themeSlice';
import { FiSun, FiMoon } from 'react-icons/fi';

const Header = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector(state => state.theme);
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gradient">
              CPMS
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mode === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
