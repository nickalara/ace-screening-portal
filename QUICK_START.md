# Quick Start Guide - ACE Role Screening Portal

## Running the Application

### 1. Start the Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 2. Test the Complete Flow

#### Landing Page (http://localhost:3000)
- View the hero section
- Read job overview
- Click "Apply Now"

#### Application Form (http://localhost:3000/apply)
- Fill in personal information
- Answer all 7 screening questions
- Upload a resume (PDF, DOC, or DOCX, max 5MB)
- Click "Submit Application"

#### Success Page (http://localhost:3000/success?id=...)
- See confirmation with application ID
- Copy application ID
- Read next steps
- Return to home

### 3. View Submitted Applications

**Application Data (JSON):**
```bash
ls /Users/nlara/ClaudeCodeProjects/applicant-screen-portal/data/applications/
```

**Resume Files:**
```bash
ls /Users/nlara/ClaudeCodeProjects/applicant-screen-portal/data/resumes/
```

**View Application Content:**
```bash
cat /Users/nlara/ClaudeCodeProjects/applicant-screen-portal/data/applications/ACE-*.json
```

---

## Application Structure

```
Landing Page (/)
    ↓ Click "Apply Now"
Application Form (/apply)
    ↓ Fill form + Submit
API Endpoint (/api/submit-application)
    ↓ Save data
Success Page (/success?id=ACE-XXX)
    ↓ Click "Return to Home"
Landing Page (/)
```

---

## Form Validation Rules

### Personal Information
- **Full Name**: Required, min 2 characters
- **Email**: Required, valid email format
- **Phone**: Required, valid U.S. phone number
- **LinkedIn**: Optional, valid URL

### Screening Questions
- **Q1 (Technical Learning)**: Min 100 characters
- **Q2 (Field Work)**: Min 75 characters
- **Q3 (AI Tools)**: Min 75 characters
- **Q4 (Communication)**: Min 75 characters
- **Q5 (Clearance)**: Required selection, conditional follow-up
- **Q6 (Travel)**: Required selection
- **Q7 (Motivation)**: Min 75 characters

### Resume Upload
- **Required**: Yes
- **File Types**: PDF, DOC, DOCX
- **Max Size**: 5MB

---

## Testing Tips

### Valid Test Data

**Personal Info:**
```
Full Name: John Smith
Email: john.smith@example.com
Phone: (555) 123-4567
LinkedIn: https://linkedin.com/in/johnsmith
```

**Question Responses:**
- Minimum 75-100 characters per text answer
- Use realistic scenarios and examples
- Select appropriate radio options

**Resume:**
- Any PDF, DOC, or DOCX under 5MB
- File name doesn't matter (will be sanitized)

### Error Testing

**Test these error cases:**
- Submit without filling required fields
- Enter invalid email (e.g., "notanemail")
- Enter invalid phone (e.g., "1234")
- Upload wrong file type (e.g., .txt, .jpg)
- Upload file over 5MB
- Provide answers under minimum character count

---

## Build for Production

```bash
npm run build
npm start
```

Production build will be in `.next/` directory.

---

## Deploy to Vercel

### Option 1: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Via GitHub

1. Push to GitHub
2. Import repository in Vercel dashboard
3. Deploy automatically

**Important**: Set environment variables in Vercel dashboard (copy from .env.local)

---

## File Locations

**Application Code:**
- `/app` - Pages and API routes
- `/components` - React components
- `/lib` - Utilities and types

**Data Storage:**
- `/data/applications` - Application JSON files
- `/data/resumes` - Resume files

**Configuration:**
- `/package.json` - Dependencies
- `/tsconfig.json` - TypeScript config
- `/tailwind.config.ts` - Styling config
- `/.env.local` - Environment variables

**Documentation:**
- `/README.md` - Detailed documentation
- `/BUILD_SUMMARY.md` - Build details
- `/QUICK_START.md` - This file

---

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Troubleshooting

### Server Won't Start
- Check if port 3000 is available
- Run `npm install` to ensure dependencies are installed
- Check for errors in terminal

### Form Won't Submit
- Open browser console (F12) for errors
- Check network tab for API call failures
- Verify all required fields are filled

### Files Not Saving
- Check if `/data` directory exists
- Check file permissions
- View terminal for storage errors

### Build Errors
- Run `npm run build` to see specific errors
- Check TypeScript types
- Verify all imports are correct

---

## Support

For issues or questions:
1. Check BUILD_SUMMARY.md for detailed information
2. Review README.md for comprehensive documentation
3. Check browser console for client-side errors
4. Check terminal for server-side errors

---

**Application Status:** ✅ Ready to Run
**Current Location:** `/Users/nlara/ClaudeCodeProjects/applicant-screen-portal`
**Access URL:** http://localhost:3000 (when running)
