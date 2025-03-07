# Job Application Web App

## Objective
Build a small web application where recruiters can post job listings, and candidates can apply by uploading their resumes. Upon uploading a resume, a third-party API (either mock or real) will parse key details from the resume, which are then displayed in the recruiter's dashboard.

## Features

### User Authentication
- **Login/Register for Recruiters/Candidates**: Both recruiters and candidates need to create accounts to access the app's features.
  
### Job Listings
- **Public Job Listings**: All users can view available job listings.
- **Recruiter Management**: Recruiters have the ability to create, edit, and delete job postings.

### Application Process
- **Apply with Resume Upload**: Candidates can apply for jobs by uploading their resumes. The uploaded resume is processed using a third-party API to extract relevant information.

### Dashboard
- **Recruiter Dashboard**: Displays parsed details from candidate resumes, allowing recruiters to review applications efficiently.
- **Candidate Dashboard**: Candidates can track the status of their applications and view any feedback provided by recruiters.

## Security Measures
- **Role-Based Access Control**:
  - **Recruiters**: Can only manage their own job postings and view applications submitted for those jobs.
  - **Candidates**: Have access to view all job listings, apply for jobs, and check the status of their applications.

## Data Models

### Enumerations

#### `JobStatus`
```typescript
type JobStatus = "open" | "closed";
```

#### `ApplicationStatus`
```typescript
type ApplicationStatus = "new" | "shortlisted" | "rejected";
```

### Interfaces

#### `Job`
```typescript
interface Job {
    id: string;
    title: string;
    description: string;
    requirements: string;
    status: JobStatus; // 'open' or 'closed'
    createdAt: Date;
    updatedAt: Date | null;
}
```

#### `Application`
```typescript
interface Application {
    id: string;
    jobId: string; // References the Job.id
    candidateId: string; // References the User.id of the candidate
    resumeUrl: string; // URL of the uploaded resume file
    parsedDetails: Record<string, any>; // Parsed details from the resume
    status: ApplicationStatus; // 'new', 'shortlisted', or 'rejected'
    createdAt: Date;
    updatedAt: Date | null;
}
```

#### `Resume`
```typescript
interface Resume {
    id: string;
    candidateId: string; // References the User.id of the candidate
    url: string; // URL of the resume file
    fileType: "application/pdf"; // Restrict to PDFs
    fileSize: number; // Size in bytes
    extractedText: string | null; // Parsed text from the resume (optional)
    createdAt: Date;
    updatedAt: Date | null;
}
```

### User Interface

#### Login/Register Page
- Form for user registration/login.
- Validation for email and password fields.

#### Job Listings Page
- List of all available jobs.
- Option for recruiters to add new jobs.

#### Apply Page
- Candidate selects a job and uploads their resume.
- Confirmation message upon successful upload.

#### Recruiter Dashboard
- Table displaying all applications for managed jobs.
- Columns include candidate name, job title, application status, and parsed resume details.

#### Candidate Dashboard
- List of applied jobs with their current status.
- Option to withdraw an application if needed.

## Third-Party API Integration
- Use a third-party API to parse uploaded resumes.
- Mock API can be used during development for testing purposes.
- Real API should be integrated before production deployment.

## Implementation Steps
1. Set up the project structure and dependencies.
2. Develop the backend server using Node.js/Express or similar.
3. Create the database schema based on the defined models.
4. Implement user authentication and role-based access control.
5. Build the frontend using React or Vue.js.
6. Integrate the third-party API for resume parsing.
7. Test the application thoroughly and deploy it to a hosting service.
