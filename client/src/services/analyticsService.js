import API from './api';

export const getPlacementPrediction = () => API.get('/analytics/prediction');

export const getSkillGapAnalysis = () => API.get('/analytics/skill-gap');

export const getPlacementTrends = () => API.get('/analytics/trends');

export const getCompanyAnalytics = (companyId) => API.get(`/analytics/company/${companyId}`);
