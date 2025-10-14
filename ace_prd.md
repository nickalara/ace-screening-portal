# Product Requirements Document (PRD)
## Job Application Screening Portal

### 1. Project Overview

**Product Name:** ACE Role Screening Portal  
**Purpose:** Internal job application and screening system for Application Content Engineers position  
**Target Users:** Job applicants for the ACE role  
**Timeline:** MVP in 1-2 days  

---

### 2. Problem Statement

The company receives numerous job applications and needs an efficient way to:
- Collect standardized responses to screening questions
- Store application data in an AI-parseable format
- Streamline the initial screening process without manual resume review

---

### 3. Goals & Success Metrics

**Goals:**
- Reduce time spent on initial application screening
- Standardize the application process
- Enable AI-powered candidate analysis

**Success Metrics:**
- All applications stored in consistent JSON format
- 100% of required fields captured
- Zero need for manual data entry or reformatting

---

### 4. User Stories

**As an applicant, I want to:**
- Understand what the job entails before applying
- Answer screening questions in a clear, organized interface
- Upload my resume easily
- Know my application was successfully submitted

**As a hiring manager, I want to:**
- Review applications in a structured format
- Use AI to analyze responses and find qualified candidates
- Access all application data without database complexity

---

### 5. Functional Requirements

#### 5.1 Landing Page
- Hero section introducing the ACE role
- Brief overview of the position (from job description)
- Clear "Apply Now" call-to-action button
- Professional but approachable design

#### 5.2 Application Form

**Personal Information Section:**
- Full Name (required)
- Email Address (required, validated)
- Phone Number (required)
- LinkedIn Profile URL (optional)

**Screening Questions Section:**
Display questions from the provided screening document. Each question should:
- Be clearly numbered and formatted
- Support various input types:
  - Short text answers
  - Long text answers (textarea)
  - Multiple choice (if applicable)
- Mark required questions clearly
- DO NOT display time estimates, goals, or "preferred answer" information

**Resume Upload Section:**
- File upload component
- Accept: .pdf, .doc, .docx
- Max file size: 5MB
- Display uploaded filename
- Allow file replacement before submission

**Submission:**
- Clear "Submit Application" button
- Form validation before submission
- Loading state during submission
- Success confirmation page/message

#### 5.3 Data Storage

**Storage Format:**
```json
{
  "applicationId": "uuid-v4",
  "timestamp": "ISO-8601 datetime",
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "linkedin": "string"
  },
  "screeningResponses": [
    {
      "questionId": "string",
      "questionText": "string",
      "answer": "string"
    }
  ],
  "resume": {
    "originalFilename": "string",
    "storedFilename": "string",
    "fileSize": "number",
    "mimeType": "string"
  }
}
```

**Storage Location:**
- JSON files: `/data/applications/[applicationId].json`
- Resume files: `/data/resumes/[applicationId]_[original-filename]`

#### 5.4 Confirmation Page
- Thank you message
- Application ID for reference
- Expected timeline for follow-up
- Simple, clean design

---

### 6. Non-Functional Requirements

**Performance:**
- Page load time < 2 seconds
- Form submission < 3 seconds

**Usability:**
- Mobile-responsive design
- Accessible (WCAG 2.1 Level AA basics)
- Clear error messages for validation

**Security:**
- Basic input sanitization
- File upload validation
- No SQL injection risk (using JSON files)

**Scalability:**
- Handle 100+ applications without performance issues
- Simple file-based storage (no database complexity)

---

### 7. Technical Specifications

**Framework:** Next.js 14+ (App Router)  
**Styling:** Tailwind CSS  
**File Handling:** Next.js API routes with file system operations  
**Form Handling:** React Hook Form (or native React state)  
**Validation:** Zod or native validation  
**Deployment:** Vercel  

**Project Structure:**
```
/app
  /page.tsx                    # Landing page
  /apply
    /page.tsx                  # Application form
  /success
    /page.tsx                  # Confirmation page
  /api
    /submit-application
      /route.ts                # Handle form submission
/data
  /applications                # JSON files
  /resumes                     # Uploaded resumes
/components
  /Hero.tsx
  /ApplicationForm.tsx
  /QuestionField.tsx
  /FileUpload.tsx
/lib
  /validation.ts
  /storage.ts
```

---

### 8. Out of Scope (Future Enhancements)

- Admin authentication/login system
- Application review dashboard
- Email notifications (can be added with n8n later)
- Application status tracking
- Edit/update submitted applications
- Multi-step form with save progress
- Advanced analytics dashboard

---

### 9. Design Guidelines

**Visual Style:**
- Clean, professional aesthetic
- Good use of whitespace
- Clear typography hierarchy
- Accessible color contrast
- Minimal but purposeful animations

**Color Palette:** (suggest neutral professional colors)
- Primary: Modern blue or dark slate
- Secondary: Complementary accent
- Backgrounds: Light grays/whites
- Text: Dark grays for readability

---

### 10. Acceptance Criteria

**The MVP is complete when:**
1. ✅ Landing page displays job information and apply button
2. ✅ Application form collects all required information
3. ✅ All screening questions are displayed correctly
4. ✅ Resume upload works and stores files
5. ✅ Form validation prevents incomplete submissions
6. ✅ Submissions create properly formatted JSON files
7. ✅ Success page confirms application received
8. ✅ Site is deployed on Vercel
9. ✅ Mobile-responsive on common screen sizes
10. ✅ Basic error handling for failed submissions

---

### 11. Implementation Notes

**Development Approach:**
- Start with basic infrastructure and routing
- Build landing page first
- Create application form with hardcoded questions initially
- Implement file upload and storage
- Add validation and error handling
- Polish UI/UX
- Test submission flow end-to-end
- Deploy to Vercel

**Testing Checklist:**
- [ ] Submit complete application successfully
- [ ] Validate required field enforcement
- [ ] Test file upload with various file types
- [ ] Verify JSON file creation and format
- [ ] Test on mobile devices
- [ ] Verify error handling for edge cases

---

### 12. Assumptions & Dependencies

**Assumptions:**
- Screening questions will be provided as a separate document
- Job description content will be provided
- Low concurrent user load (< 50 simultaneous users)
- Applications will be reviewed manually or via AI, not through an admin UI initially

**Dependencies:**
- Screening questions document from Sean
- Job description content
- Vercel deployment access

---

### 13. Questions to Resolve

1. Exact wording/format of screening questions
2. Specific job description content for landing page
3. Company branding guidelines (logo, colors) if any
4. Preferred application ID format
5. Any specific legal disclaimers needed

---

**Document Version:** 1.0  
**Last Updated:** October 13, 2025  
**Owner:** Nick Lara  
**Reviewer:** Sean Patterson
