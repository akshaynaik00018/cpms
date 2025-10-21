import API from './api';

export const getJobs = (filters) => API.get('/jobs', { params: filters });

export const getJob = (id) => API.get(`/jobs/${id}`);

export const createJob = (jobData) => API.post('/jobs', jobData);

export const updateJob = (id, jobData) => API.put(`/jobs/${id}`, jobData);

export const deleteJob = (id) => API.delete(`/jobs/${id}`);

export const getCompanyJobs = () => API.get('/jobs/company/my-jobs');

export const getEligibleJobs = () => API.get('/students/eligible-jobs');
