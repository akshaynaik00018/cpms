const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const natural = require('natural');
const compromise = require('compromise');

// Common skills list for matching
const commonSkills = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go',
  'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
  'MongoDB', 'MySQL', 'PostgreSQL', 'Oracle', 'SQL Server', 'Redis', 'Cassandra',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'CI/CD',
  'HTML', 'CSS', 'Bootstrap', 'Tailwind', 'SASS', 'TypeScript',
  'Machine Learning', 'Deep Learning', 'AI', 'Data Science', 'NLP', 'Computer Vision',
  'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'JIRA'
];

const parseResume = async (filePath) => {
  try {
    // Read PDF file
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;

    // Extract information
    const parsedData = {
      rawText: text,
      skills: extractSkills(text),
      email: extractEmail(text),
      phone: extractPhone(text),
      education: extractEducation(text),
      experience: extractExperience(text),
      cgpa: extractCGPA(text),
      github: extractGitHub(text),
      linkedin: extractLinkedIn(text)
    };

    return parsedData;
  } catch (error) {
    console.error('Resume parsing error:', error);
    return null;
  }
};

// Extract skills
const extractSkills = (text) => {
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return [...new Set(foundSkills)]; // Remove duplicates
};

// Extract email
const extractEmail = (text) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
};

// Extract phone
const extractPhone = (text) => {
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
};

// Extract education
const extractEducation = (text) => {
  const education = [];
  const degrees = ['B.Tech', 'B.E.', 'M.Tech', 'M.E.', 'MBA', 'MCA', 'BCA', 'B.Sc', 'M.Sc'];
  
  degrees.forEach(degree => {
    if (text.includes(degree)) {
      education.push(degree);
    }
  });
  
  return education;
};

// Extract experience (in years)
const extractExperience = (text) => {
  const expRegex = /(\d+)\s*(year|yr)/i;
  const match = text.match(expRegex);
  return match ? parseInt(match[1]) : 0;
};

// Extract CGPA
const extractCGPA = (text) => {
  const cgpaRegex = /CGPA[:\s]*(\d+\.?\d*)/i;
  const match = text.match(cgpaRegex);
  if (match) return parseFloat(match[1]);
  
  // Alternative pattern
  const altRegex = /(\d+\.?\d*)\s*\/\s*10/;
  const altMatch = text.match(altRegex);
  return altMatch ? parseFloat(altMatch[1]) : null;
};

// Extract GitHub
const extractGitHub = (text) => {
  const githubRegex = /github\.com\/([a-zA-Z0-9-]+)/i;
  const match = text.match(githubRegex);
  return match ? `https://github.com/${match[1]}` : null;
};

// Extract LinkedIn
const extractLinkedIn = (text) => {
  const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/i;
  const match = text.match(linkedinRegex);
  return match ? `https://linkedin.com/in/${match[1]}` : null;
};

// AI-based skill gap analysis
const analyzeSkillGap = (studentSkills, requiredSkills) => {
  const studentSkillsSet = new Set(studentSkills.map(s => s.toLowerCase()));
  const requiredSkillsSet = new Set(requiredSkills.map(s => s.toLowerCase()));
  
  const missingSkills = [];
  const matchingSkills = [];
  
  requiredSkillsSet.forEach(skill => {
    if (studentSkillsSet.has(skill)) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });
  
  const matchPercentage = requiredSkills.length > 0 
    ? (matchingSkills.length / requiredSkills.length) * 100 
    : 0;
  
  return {
    matchPercentage: Math.round(matchPercentage),
    matchingSkills,
    missingSkills
  };
};

module.exports = {
  parseResume,
  analyzeSkillGap
};
