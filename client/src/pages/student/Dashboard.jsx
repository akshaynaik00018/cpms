import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboard } from '../../store/slices/studentSlice';
import { FiBriefcase, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector(state => state.student);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  const stats = dashboard?.stats || {
    totalApplications: 0,
    shortlisted: 0,
    selected: 0,
    rejected: 0,
    pending: 0
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.email}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's your placement dashboard overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                {stats.totalApplications}
              </p>
            </div>
            <FiBriefcase size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="card bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">
                {stats.pending}
              </p>
            </div>
            <FiClock size={40} className="text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="card bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Shortlisted</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                {stats.shortlisted}
              </p>
            </div>
            <FiCheckCircle size={40} className="text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="card bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Rejected</p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">
                {stats.rejected}
              </p>
            </div>
            <FiXCircle size={40} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      {dashboard?.profileCompletion < 100 && (
        <div className="card bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-800 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                Complete Your Profile
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                {dashboard?.profileCompletion}% complete
              </p>
            </div>
          </div>
          <div className="w-full bg-orange-200 dark:bg-orange-700 rounded-full h-3">
            <div
              className="bg-orange-600 dark:bg-orange-400 h-3 rounded-full transition-all"
              style={{ width: `${dashboard?.profileCompletion || 0}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Applications
        </h2>
        {dashboard?.recentApplications && dashboard.recentApplications.length > 0 ? (
          <div className="space-y-4">
            {dashboard.recentApplications.map((application) => (
              <div
                key={application._id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {application.job?.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {application.job?.company?.companyName}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    application.status === 'selected'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : application.status === 'shortlisted'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : application.status === 'rejected'
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  }`}
                >
                  {application.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No applications yet. Start applying to jobs!
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
