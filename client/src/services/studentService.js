import API from './api';

export const getProfile = () => API.get('/students/profile');

export const updateProfile = (data) => API.put('/students/profile', data);

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return API.post('/students/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const addSkill = (skill) => API.post('/students/skills', skill);

export const addProject = (project) => API.post('/students/projects', project);

export const addCertification = (cert) => API.post('/students/certifications', cert);

export const getEligibleJobs = () => API.get('/students/eligible-jobs');

export const getDashboard = () => API.get('/students/dashboard');
