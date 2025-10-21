# CPMS API Documentation

Base URL: `http://localhost:5000/api`

## Table of Contents
1. [Authentication](#authentication)
2. [Student APIs](#student-apis)
3. [Company APIs](#company-apis)
4. [Job APIs](#job-apis)
5. [Application APIs](#application-apis)
6. [Admin APIs](#admin-apis)
7. [Drive APIs](#drive-apis)
8. [Chat APIs](#chat-apis)
9. [Forum APIs](#forum-apis)
10. [Analytics APIs](#analytics-apis)
11. [Notification APIs](#notification-apis)
12. [Quiz APIs](#quiz-apis)
13. [Offer APIs](#offer-apis)
14. [Internship APIs](#internship-apis)
15. [Referral APIs](#referral-apis)

---

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "role": "student",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "enrollmentNumber": "EN001",
  "branch": "CSE",
  "semester": 6,
  "batch": "2020-2024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@example.com",
    "role": "student"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Enable 2FA
```http
POST /auth/enable-2fa
Authorization: Bearer <token>
```

### Confirm 2FA
```http
POST /auth/confirm-2fa
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "123456"
}
```

---

## Student APIs

### Get Student Profile
```http
GET /students/profile
Authorization: Bearer <token>
```

### Update Student Profile
```http
PUT /students/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "cgpa": 8.5,
  "skills": [
    { "name": "JavaScript", "level": "advanced" },
    { "name": "React", "level": "intermediate" }
  ]
}
```

### Upload Resume
```http
POST /students/resume
Authorization: Bearer <token>
Content-Type: multipart/form-data

resume: <file>
```

### Add Skill
```http
POST /students/skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Python",
  "level": "intermediate"
}
```

### Add Project
```http
POST /students/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "E-commerce Website",
  "description": "Full-stack e-commerce platform",
  "technologies": ["React", "Node.js", "MongoDB"],
  "startDate": "2023-01-01",
  "endDate": "2023-06-01",
  "projectUrl": "https://example.com",
  "githubUrl": "https://github.com/user/repo"
}
```

### Add Certification
```http
POST /students/certifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "AWS Certified Developer",
  "issuedBy": "Amazon Web Services",
  "issueDate": "2023-01-15",
  "credentialId": "ABC123",
  "credentialUrl": "https://aws.amazon.com/..."
}
```

### Get Eligible Jobs
```http
GET /students/eligible-jobs
Authorization: Bearer <token>
```

### Get Student Dashboard
```http
GET /students/dashboard
Authorization: Bearer <token>
```

---

## Company APIs

### Get Company Profile
```http
GET /companies/profile
Authorization: Bearer <token>
```

### Update Company Profile
```http
PUT /companies/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Tech Corp",
  "about": "Leading tech company",
  "industry": "Information Technology",
  "companySize": "501-1000",
  "website": "https://techcorp.com"
}
```

### Upload Company Logo
```http
POST /companies/logo
Authorization: Bearer <token>
Content-Type: multipart/form-data

logo: <file>
```

---

## Job APIs

### Get All Jobs
```http
GET /jobs?status=open&branch=CSE&page=1&limit=10
```

**Query Parameters:**
- `status` - Job status (open, closed, cancelled)
- `jobType` - Type of job (full-time, internship, contract)
- `branch` - Branch filter (CSE, IT, ECE, etc.)
- `minPackage` - Minimum package
- `maxPackage` - Maximum package
- `search` - Search term
- `page` - Page number
- `limit` - Items per page

### Get Job by ID
```http
GET /jobs/:id
```

### Create Job (Company/Admin)
```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Developer",
  "description": "Looking for talented developers",
  "jobType": "full-time",
  "package": {
    "min": 500000,
    "max": 800000,
    "currency": "INR"
  },
  "locations": [
    {
      "city": "Bangalore",
      "state": "Karnataka",
      "country": "India",
      "isRemote": false
    }
  ],
  "eligibility": {
    "branches": ["CSE", "IT"],
    "minCGPA": 7.0,
    "maxBacklogs": 0,
    "batches": ["2024"]
  },
  "requiredSkills": ["JavaScript", "React", "Node.js"],
  "selectionProcess": [
    {
      "round": "Aptitude Test",
      "type": "aptitude",
      "duration": 60
    },
    {
      "round": "Technical Interview",
      "type": "technical",
      "duration": 45
    }
  ],
  "applicationDeadline": "2024-12-31",
  "openings": 5
}
```

### Update Job
```http
PUT /jobs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "closed"
}
```

### Delete Job
```http
DELETE /jobs/:id
Authorization: Bearer <token>
```

### Get Company Jobs
```http
GET /jobs/company/my-jobs
Authorization: Bearer <token>
```

---

## Application APIs

### Apply for Job
```http
POST /applications/apply/:jobId
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "I am very interested in this position..."
}
```

### Get My Applications
```http
GET /applications/my-applications
Authorization: Bearer <token>
```

### Get Application by ID
```http
GET /applications/:id
Authorization: Bearer <token>
```

### Update Application Status (Company/Admin)
```http
PUT /applications/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shortlisted",
  "round": {
    "roundName": "Technical Interview",
    "roundType": "technical",
    "status": "cleared",
    "score": 85,
    "feedback": "Good performance"
  }
}
```

### Withdraw Application
```http
PUT /applications/:id/withdraw
Authorization: Bearer <token>
```

### Get Job Applications (Company/Admin)
```http
GET /applications/job/:jobId?status=shortlisted
Authorization: Bearer <token>
```

---

## Admin APIs

### Get All Users
```http
GET /admin/users?role=student&page=1&limit=20
Authorization: Bearer <token>
```

### Get All Students
```http
GET /admin/students?branch=CSE&batch=2024&placementStatus=placed
Authorization: Bearer <token>
```

### Get All Companies
```http
GET /admin/companies?isVerified=true&status=approved
Authorization: Bearer <token>
```

### Verify Company
```http
PUT /admin/companies/:id/verify
Authorization: Bearer <token>
```

### Get Placement Statistics
```http
GET /admin/placement-stats?batch=2024&branch=CSE
Authorization: Bearer <token>
```

### Generate Placement Report
```http
GET /admin/generate-report?batch=2024
Authorization: Bearer <token>
```

### Toggle User Status
```http
PUT /admin/users/:id/toggle-status
Authorization: Bearer <token>
```

### Delete User
```http
DELETE /admin/users/:id
Authorization: Bearer <token>
```

---

## Drive APIs

### Get All Drives
```http
GET /drives?status=upcoming
```

### Get Drive by ID
```http
GET /drives/:id
```

### Create Drive (Admin/Coordinator)
```http
POST /drives
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": "507f1f77bcf86cd799439011",
  "driveName": "Tech Corp Campus Drive 2024",
  "description": "Full-time hiring for graduates",
  "startDate": "2024-01-15",
  "mode": "hybrid",
  "venue": {
    "name": "Main Auditorium",
    "address": "College Campus"
  },
  "rounds": [
    {
      "name": "Aptitude Test",
      "type": "aptitude",
      "date": "2024-01-15",
      "startTime": "10:00",
      "duration": 60
    }
  ],
  "registrationDeadline": "2024-01-10"
}
```

### Update Drive
```http
PUT /drives/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ongoing"
}
```

### Register for Drive (Student)
```http
POST /drives/:id/register
Authorization: Bearer <token>
```

---

## Chat APIs

### Get All Chats
```http
GET /chat
Authorization: Bearer <token>
```

### Get Chat by ID
```http
GET /chat/:id
Authorization: Bearer <token>
```

### Create Chat
```http
POST /chat/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "participantId": "507f1f77bcf86cd799439011",
  "chatType": "individual"
}
```

### Send Message
```http
POST /chat/:id/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello! How are you?",
  "messageType": "text"
}
```

---

## Forum APIs

### Get Forum Posts
```http
GET /forum?category=interview_experience&page=1&limit=20
```

### Get Post by ID
```http
GET /forum/:id
```

### Create Forum Post
```http
POST /forum
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Google Interview Experience 2024",
  "content": "I recently interviewed with Google...",
  "category": "interview_experience",
  "company": "507f1f77bcf86cd799439011",
  "tags": ["google", "sde", "campus"],
  "interviewDetails": {
    "role": "Software Engineer",
    "year": 2024,
    "rounds": [
      {
        "name": "Coding Round",
        "type": "coding",
        "questions": ["Two Sum", "Binary Tree"],
        "experience": "Questions were challenging but fair"
      }
    ],
    "difficulty": "medium",
    "result": "selected"
  }
}
```

### Add Reply
```http
POST /forum/:id/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Thanks for sharing! Very helpful."
}
```

### Upvote Post
```http
POST /forum/:id/upvote
Authorization: Bearer <token>
```

---

## Analytics APIs

### Get Placement Prediction (Student)
```http
GET /analytics/prediction
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overallScore": 75.5,
    "percentage": 75.5,
    "probability": "High",
    "factors": [
      {
        "factor": "CGPA",
        "score": 34,
        "maxScore": 40,
        "percentage": "85.00"
      }
    ],
    "recommendations": [
      "Build more projects to showcase your skills",
      "Obtain relevant certifications"
    ]
  }
}
```

### Get Skill Gap Analysis (Student)
```http
GET /analytics/skill-gap
Authorization: Bearer <token>
```

### Get Placement Trends (Admin)
```http
GET /analytics/trends
Authorization: Bearer <token>
```

### Get Company Analytics (Admin)
```http
GET /analytics/company/:companyId
Authorization: Bearer <token>
```

---

## Notification APIs

### Get Notifications
```http
GET /notifications?isRead=false&type=job&page=1
Authorization: Bearer <token>
```

### Mark as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

### Mark All as Read
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

---

## Quiz APIs

### Get All Quizzes
```http
GET /quiz?category=aptitude&difficulty=medium
```

### Get Quiz by ID
```http
GET /quiz/:id
```

### Create Quiz (Admin)
```http
POST /quiz
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Aptitude Test - Quantitative",
  "description": "Test your quantitative skills",
  "category": "aptitude",
  "difficulty": "medium",
  "duration": 30,
  "questions": [
    {
      "question": "What is 2 + 2?",
      "questionType": "mcq",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4",
      "marks": 1
    }
  ],
  "totalMarks": 10,
  "passingMarks": 6
}
```

### Start Quiz Attempt (Student)
```http
POST /quiz/:id/attempt
Authorization: Bearer <token>
```

### Submit Quiz
```http
POST /quiz/attempt/:attemptId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [
    {
      "answer": "4",
      "timeTaken": 30
    }
  ],
  "timeTaken": 1800
}
```

### Get My Quiz Attempts
```http
GET /quiz/my-attempts
Authorization: Bearer <token>
```

---

## Offer APIs

### Get My Offers (Student)
```http
GET /offers/my-offers
Authorization: Bearer <token>
```

### Create Offer (Company/Admin)
```http
POST /offers
Authorization: Bearer <token>
Content-Type: multipart/form-data

student: 507f1f77bcf86cd799439011
company: 507f1f77bcf86cd799439012
position: Software Engineer
offerType: full-time
package.ctc: 1200000
joiningDate: 2024-07-01
offerLetter: <file>
```

### Get Offer by ID
```http
GET /offers/:id
Authorization: Bearer <token>
```

### Respond to Offer (Student)
```http
PUT /offers/:id/respond
Authorization: Bearer <token>
Content-Type: application/json

{
  "decision": "accepted",
  "reason": ""
}
```

---

## Internship APIs

### Get All Internships
```http
GET /internships?status=open&page=1
```

### Create Internship (Company/Admin)
```http
POST /internships
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Development Intern",
  "description": "6-month internship program",
  "duration": {
    "value": 6,
    "unit": "months"
  },
  "stipend": {
    "amount": 30000,
    "currency": "INR",
    "type": "paid"
  },
  "startDate": "2024-06-01",
  "ppo": {
    "available": true,
    "package": 800000
  },
  "applicationDeadline": "2024-05-15"
}
```

---

## Referral APIs

### Get All Referrals
```http
GET /referrals?type=job&isActive=true
```

### Create Referral
```http
POST /referrals
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": "Google",
  "position": "Software Engineer",
  "type": "job",
  "description": "Looking for talented developers",
  "requirements": ["3+ years experience", "Python", "Django"],
  "applicationLink": "https://apply.google.com/...",
  "contactEmail": "recruiter@google.com",
  "isAlumni": true,
  "alumniDetails": {
    "graduationYear": 2020,
    "currentCompany": "Google",
    "currentPosition": "Senior SDE"
  }
}
```

### Show Interest in Referral
```http
POST /referrals/:id/interested
Authorization: Bearer <token>
```

---

## Error Responses

All APIs return errors in the following format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (only in development)"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API endpoints are rate-limited to:
- **100 requests per 15 minutes** per IP address

When limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

---

## Pagination

List endpoints support pagination with the following parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

Response includes:
```json
{
  "success": true,
  "count": 50,
  "totalPages": 5,
  "currentPage": 1,
  "data": [...]
}
```

---

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires in 7 days by default.

---

For more information, visit the [GitHub Repository](https://github.com/your-repo/cpms)
