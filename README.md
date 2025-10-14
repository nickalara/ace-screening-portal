# ACE Role Screening Portal

A Next.js application for the Application Content Engineer role screening process at StartGuides.

## Features

- **Landing Page**: Hero section with job overview and role details
- **Application Form**: Multi-section form with personal information, screening questions, and resume upload
- **Form Validation**: Client-side validation using React Hook Form and Zod
- **File Upload**: Drag-and-drop resume upload with validation (PDF, DOC, DOCX, max 5MB)
- **Data Storage**: Simple file-based storage (JSON for applications, file system for resumes)
- **Success Page**: Confirmation page with unique application ID
- **Responsive Design**: Mobile-first design following the design specifications
- **Accessibility**: WCAG 2.1 Level AA compliant

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **File Upload**: Formidable
- **Icons**: Lucide React
- **Unique IDs**: UUID

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app                           # Next.js App Router pages
  /page.tsx                    # Landing page
  /apply/page.tsx              # Application form page
  /success/page.tsx            # Success confirmation page
  /layout.tsx                  # Root layout
  /globals.css                 # Global styles with Tailwind
  /api/submit-application/     # Form submission API route
    /route.ts

/components                    # React components
  /ui/                         # Reusable UI components
    Button.tsx
    Input.tsx
    Textarea.tsx
    ErrorMessage.tsx
  /landing/                    # Landing page components
    Hero.tsx
    JobOverview.tsx
  /form/                       # Form components
    ApplicationForm.tsx
    PersonalInfoSection.tsx
    ScreeningSection.tsx
    QuestionField.tsx
    FileUpload.tsx

/lib                           # Utilities and constants
  types.ts                     # TypeScript interfaces
  validation.ts                # Zod schemas
  storage.ts                   # File storage utilities
  constants.ts                 # Screening questions and job content

/data                          # Data storage (gitignored)
  /applications                # Application JSON files
  /resumes                     # Resume files
```

## Application Flow

1. **Landing Page** (`/`): User views job description and role overview
2. **Apply Page** (`/apply`): User fills out application form with:
   - Personal information (name, email, phone, LinkedIn)
   - 7 screening questions
   - Resume upload
3. **Submission**: Form data is validated and sent to API
4. **Storage**: Application data saved as JSON, resume saved to file system
5. **Success Page** (`/success`): User sees confirmation with application ID

## Data Storage

Applications are stored as JSON files in `/data/applications/`:
- Filename: `{applicationId}.json`
- Format: See `lib/types.ts` for `ApplicationData` interface

Resumes are stored in `/data/resumes/`:
- Filename: `{applicationId}_{originalFilename}`
- Allowed formats: PDF, DOC, DOCX
- Max size: 5MB

## Screening Questions

The application includes 7 carefully designed screening questions:

1. **Technical Learning Ability** (long text)
2. **Field Work Comfort** (medium text)
3. **AI Tools Proficiency** (medium text)
4. **Communication Style** (medium text)
5. **Security Clearance Status** (radio with conditional follow-up)
6. **Travel Willingness** (radio)
7. **Motivation & Mission Alignment** (medium text)

## Design Specifications

The application follows comprehensive design specifications including:
- Color palette: Slate/Blue theme
- Typography: Inter font family
- Responsive breakpoints: Mobile, Tablet, Desktop
- Accessibility: WCAG 2.1 Level AA standards
- Animations: Subtle, purposeful transitions

See `front-end-spec.md` and `wireframes.md` for complete design documentation.

## Validation

### Personal Information
- **Full Name**: Required, min 2 characters, letters/spaces/hyphens only
- **Email**: Required, valid email format
- **Phone**: Required, valid U.S. phone number
- **LinkedIn**: Optional, valid URL format

### Screening Questions
- Questions 1, 2, 3, 4, 7: Min 75-100 characters
- Questions 5, 6: Required selection
- Question 5: Conditional follow-up for clearance holders

### Resume Upload
- Required
- Accepted formats: PDF, DOC, DOCX
- Max file size: 5MB

## Environment Variables

Create a `.env.local` file (already exists) with:

```env
NEXT_PUBLIC_APP_NAME="ACE Role Screening Portal"
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=".pdf,.doc,.docx"
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The application is ready to deploy to Vercel:

1. Push to GitHub repository
2. Import to Vercel
3. Deploy automatically

**Note**: Ensure `/data` directory is created on the server or configure a persistent storage solution.

## Testing Checklist

- [x] Landing page displays correctly
- [x] Navigation to apply page works
- [x] All form fields render correctly
- [x] Form validation works (required fields, email format, phone format)
- [x] File upload accepts valid files
- [x] File upload rejects invalid files (wrong type, too large)
- [x] Form submission creates JSON file
- [x] Form submission saves resume file
- [x] Success page displays with application ID
- [x] Mobile responsive design
- [x] Accessibility (keyboard navigation, screen reader support)

## Known Limitations

- File-based storage (not suitable for high-traffic production)
- No authentication or admin dashboard
- No email notifications
- No application status tracking
- Local storage only (not cloud-based)

## Future Enhancements

- Database integration (PostgreSQL, MongoDB, etc.)
- Admin dashboard for reviewing applications
- Email notifications (using n8n or similar)
- Application status tracking
- Edit/update submitted applications
- Advanced analytics and reporting
- Cloud file storage (S3, Cloudinary, etc.)

## License

Proprietary - StartGuides

## Contact

For questions or issues, contact the development team.

---

**Built with** Next.js, TypeScript, Tailwind CSS, and React Hook Form
