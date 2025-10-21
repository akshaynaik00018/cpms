import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    firstName: '',
    lastName: '',
    phone: '',
    enrollmentNumber: '',
    companyName: ''
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'student') {
        userData.firstName = formData.firstName;
        userData.lastName = formData.lastName;
        userData.phone = formData.phone;
        userData.enrollmentNumber = formData.enrollmentNumber;
      } else if (formData.role === 'company') {
        userData.companyName = formData.companyName;
      }

      await dispatch(register(userData)).unwrap();
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join the best placement management platform
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="label">I am a</label>
            <select
              name="role"
              value={formData.role}
              onChange={onChange}
              className="input"
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  className="input pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {formData.role === 'student' && (
              <div>
                <label className="label">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    className="input pl-10"
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Student Specific Fields */}
          {formData.role === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChange}
                  className="input"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChange}
                  className="input"
                  placeholder="Doe"
                  required
                />
              </div>
              <div>
                <label className="label">Enrollment Number</label>
                <input
                  type="text"
                  name="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={onChange}
                  className="input"
                  placeholder="EN12345"
                  required
                />
              </div>
            </div>
          )}

          {/* Company Specific Fields */}
          {formData.role === 'company' && (
            <div>
              <label className="label">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={onChange}
                className="input"
                placeholder="Your Company Name"
                required
              />
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
