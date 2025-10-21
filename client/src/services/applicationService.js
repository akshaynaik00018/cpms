import API from './api';

export const applyForJob = (jobId, data) => API.post(`/applications/apply/${jobId}`, data);

export const getMyApplications = () => API.get('/applications/my-applications');

export const getApplication = (id) => API.get(`/applications/${id}`);

export const withdrawApplication = (id) => API.put(`/applications/${id}/withdraw`);

export const updateApplicationStatus = (id, status) => 
  API.put(`/applications/${id}/status`, status);

export const getJobApplications = (jobId) => API.get(`/applications/job/${jobId}`);
