# Component Development Checklist
## ACE Role Screening Portal

Use this checklist to track component development progress and ensure all states, props, and features are implemented correctly.

---

## Component Development Order

Recommended build order (from simple to complex):

1. ✓ Design Tokens & Base Styles
2. ☐ Button Component
3. ☐ FormField Component
4. ☐ Hero Component
5. ☐ QuestionField Component
6. ☐ FileUpload Component
7. ☐ ApplicationForm Component (orchestrator)

---

## 1. Design Tokens & Base Styles

**File:** `/styles/globals.css` or `/app/globals.css`

### Tasks
- [ ] Import/copy design tokens from `design-tokens.css`
- [ ] Verify all CSS variables are defined
- [ ] Test color contrast ratios
- [ ] Verify font loading (Inter, JetBrains Mono)
- [ ] Set up Tailwind config with custom tokens
- [ ] Test responsive typography scaling
- [ ] Verify `prefers-reduced-motion` support

### Verification
- [ ] All CSS variables accessible in DevTools
- [ ] Fonts render correctly across browsers
- [ ] Colors match design spec exactly
- [ ] Typography scales smoothly on mobile

---

## 2. Button Component

**File:** `/components/Button.tsx`

### Props Interface
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}
```

### Implementation Tasks
- [ ] Create component file and interface
- [ ] Implement all variants (primary, secondary, outline, text)
- [ ] Implement all sizes (small, medium, large)
- [ ] Add loading state with spinner
- [ ] Add disabled state
- [ ] Support both button and link (href) modes
- [ ] Add icon support (left/right positioning)
- [ ] Add fullWidth option
- [ ] Implement hover effects
- [ ] Implement focus styles (keyboard navigation)
- [ ] Add transition animations

### States to Test
- [ ] Default state (all variants)
- [ ] Hover state (all variants)
- [ ] Focus state (keyboard navigation)
- [ ] Active/pressed state
- [ ] Loading state (shows spinner, disabled)
- [ ] Disabled state (grayed out, no cursor)
- [ ] With icon (left position)
- [ ] With icon (right position)
- [ ] Full width vs. auto width

### Accessibility
- [ ] Proper button type attribute
- [ ] Disabled attribute when loading
- [ ] ARIA attributes for loading state
- [ ] Focus ring visible and meets contrast requirements
- [ ] Keyboard accessible (Enter/Space triggers)
- [ ] Screen reader announces loading state

### Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Firefox
- [ ] Edge

---

## 3. FormField Component

**File:** `/components/FormField.tsx`

### Props Interface
```typescript
interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  autoComplete?: string;
}
```

### Implementation Tasks
- [ ] Create component file and interface
- [ ] Implement label with htmlFor association
- [ ] Add required indicator (red asterisk)
- [ ] Support all input types (text, email, tel, url)
- [ ] Implement helper text (below input)
- [ ] Implement error message (below input, red)
- [ ] Add aria-describedby for error/helper text
- [ ] Add aria-invalid for error state
- [ ] Implement focus styles
- [ ] Add smooth transitions

### States to Test
- [ ] Empty/default state
- [ ] Focus state
- [ ] Filled state
- [ ] Error state (red border, error message)
- [ ] Disabled state
- [ ] With helper text
- [ ] With error message
- [ ] Required field indicator

### Accessibility
- [ ] Label properly associated with input
- [ ] Required fields marked semantically
- [ ] Error messages announced to screen readers
- [ ] Helper text accessible
- [ ] Focus indicator visible
- [ ] Keyboard navigation works

### Validation Support
- [ ] Email validation (if type="email")
- [ ] URL validation (if type="url")
- [ ] Phone validation (if type="tel")
- [ ] Required field validation
- [ ] Custom validation via props

---

## 4. Hero Component

**File:** `/components/Hero.tsx`

### Props Interface
```typescript
interface HeroProps {
  title: string;
  subtitle: string;
  badges?: string[];
  ctaText?: string;
  ctaHref?: string;
  variant?: 'default' | 'compact';
}
```

### Implementation Tasks
- [ ] Create component file and interface
- [ ] Implement gradient background (slate-950 → slate-900)
- [ ] Add optional texture overlay
- [ ] Center all content
- [ ] Implement responsive typography
- [ ] Create badge pill components
- [ ] Add CTA button (using Button component)
- [ ] Implement mobile layout (stack badges vertically)
- [ ] Add fade-in animation on load (optional)
- [ ] Test contrast ratios (white text on dark bg)

### Layout Tests
- [ ] Desktop (>1024px) - full hero height
- [ ] Tablet (768-1023px) - medium height
- [ ] Mobile (<768px) - reduced height, stacked badges

### Content Tests
- [ ] Long title text (wraps properly)
- [ ] Long subtitle (wraps properly)
- [ ] 3 badges (fit horizontally on desktop)
- [ ] 2 badges (still looks good)
- [ ] No badges (layout doesn't break)

### Accessibility
- [ ] Proper heading hierarchy (h1 or h2)
- [ ] CTA button accessible
- [ ] Sufficient color contrast (AAA)
- [ ] Semantic HTML structure

---

## 5. QuestionField Component

**File:** `/components/QuestionField.tsx`

### Props Interface
```typescript
interface QuestionFieldProps {
  question: ScreeningQuestion;
  questionNumber: number;
  totalQuestions: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

interface ScreeningQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'radio';
  required: boolean;
  placeholder?: string;
  helperText?: string;
  options?: { label: string; value: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
  };
  conditionalFollowUp?: ConditionalQuestion;
}
```

### Implementation Tasks
- [ ] Create component file and interface
- [ ] Implement question number display ("QUESTION X OF Y")
- [ ] Render question label with required indicator
- [ ] Support textarea input type
- [ ] Support text input type
- [ ] Support radio button group
- [ ] Add character counter for textareas
- [ ] Implement conditional follow-up logic
- [ ] Animate conditional questions (slide down)
- [ ] Add error message display
- [ ] Implement helper text

### Input Types
- [ ] **Textarea:**
  - [ ] Minimum height 150px
  - [ ] Vertical resize only
  - [ ] Character counter displays live
  - [ ] Placeholder text
  - [ ] Auto-grow (optional)
- [ ] **Text:**
  - [ ] Standard input styling
  - [ ] Placeholder support
- [ ] **Radio:**
  - [ ] Custom styled radio buttons
  - [ ] Full-row clickable area
  - [ ] Hover states
  - [ ] Proper keyboard navigation

### Conditional Follow-up
- [ ] Detects trigger value
- [ ] Shows follow-up with slide-down animation (300ms)
- [ ] Hides when trigger value deselected
- [ ] Follow-up has distinct styling (blue background)
- [ ] Follow-up validates independently

### States to Test
- [ ] Empty state
- [ ] Partially filled
- [ ] Fully filled
- [ ] Error state
- [ ] Radio selected
- [ ] Conditional follow-up visible
- [ ] Conditional follow-up hidden

### Accessibility
- [ ] Radio groups use fieldset/legend
- [ ] Labels associated correctly
- [ ] Error messages announced
- [ ] Keyboard navigation through radio options
- [ ] Focus indicators visible

---

## 6. FileUpload Component

**File:** `/components/FileUpload.tsx`

### Props Interface
```typescript
interface FileUploadProps {
  accept: string;
  maxSize: number;
  onFileSelect: (file: File) => void;
  error?: string;
  currentFile?: File | null;
}
```

### Implementation Tasks
- [ ] Create component file and interface
- [ ] Implement drag-and-drop zone
- [ ] Implement click-to-upload (hidden input)
- [ ] Add file type validation
- [ ] Add file size validation
- [ ] Show upload icon (empty state)
- [ ] Show document icon + filename (uploaded state)
- [ ] Add remove file button
- [ ] Implement all state styles (default, hover, drag-over, success, error)
- [ ] Add error message display
- [ ] Format file size display (KB, MB)

### Drag-and-Drop
- [ ] Highlight on drag over
- [ ] Prevent default browser behavior
- [ ] Handle dropped files
- [ ] Handle multiple files (reject extras)
- [ ] Validate on drop

### File Validation
- [ ] Check file type against accept prop
- [ ] Check file size against maxSize prop
- [ ] Display specific error messages:
  - [ ] Invalid file type
  - [ ] File too large
  - [ ] Generic upload error

### States to Test
- [ ] Default/empty state (dashed border, gray bg)
- [ ] Hover state (blue border, blue bg)
- [ ] Drag over state (thicker blue border, scale up)
- [ ] File uploaded state (green border, checkmark, filename)
- [ ] Error state (red border, error message)
- [ ] Loading state (optional, if async upload)

### Accessibility
- [ ] Hidden file input has accessible label
- [ ] Keyboard navigation support (Tab to focus, Enter to open)
- [ ] Screen reader announces file selection
- [ ] ARIA labels for drag-and-drop zone
- [ ] Error messages announced

### File Types to Test
- [ ] .pdf (valid)
- [ ] .doc (valid)
- [ ] .docx (valid)
- [ ] .txt (invalid - should error)
- [ ] .jpg (invalid - should error)
- [ ] Large file >5MB (should error)
- [ ] Small file <5MB (should succeed)

---

## 7. ApplicationForm Component

**File:** `/components/ApplicationForm.tsx`

### Props Interface
```typescript
interface ApplicationFormProps {
  questions: ScreeningQuestion[];
  onSubmit: (data: ApplicationData) => Promise<void>;
  initialData?: Partial<ApplicationData>;
}
```

### Implementation Tasks
- [ ] Create component file and interface
- [ ] Load screening questions from JSON
- [ ] Implement 3-section layout (Personal Info, Questions, Resume)
- [ ] Use FormField for personal info fields
- [ ] Use QuestionField for screening questions
- [ ] Use FileUpload for resume
- [ ] Implement form state management
- [ ] Add form validation (all required fields)
- [ ] Handle form submission
- [ ] Show loading state during submission
- [ ] Handle submission errors
- [ ] Scroll to first error on validation failure
- [ ] Implement auto-save to localStorage (optional)

### Personal Information Section
- [ ] Full Name field (required, text)
- [ ] Email Address field (required, email validation)
- [ ] Phone Number field (required, tel validation)
- [ ] LinkedIn URL field (optional, url validation)

### Screening Questions Section
- [ ] Load all 7 questions from `screening-questions.json`
- [ ] Render each with QuestionField component
- [ ] Track answers in form state
- [ ] Validate required questions
- [ ] Validate minimum character counts

### Resume Upload Section
- [ ] FileUpload component
- [ ] Track selected file in state
- [ ] Validate file before submission
- [ ] Display file validation errors

### Form Validation
- [ ] Validate on submit (not on every keystroke)
- [ ] Validate on blur (optional, for better UX)
- [ ] Check all required fields filled
- [ ] Check email format valid
- [ ] Check phone format valid (US format)
- [ ] Check LinkedIn URL valid (if provided)
- [ ] Check textarea min lengths met
- [ ] Check file uploaded
- [ ] Check file valid type and size

### Error Handling
- [ ] Display field-level errors (inline)
- [ ] Display form-level error summary (top of form)
- [ ] Scroll to first error field
- [ ] Focus first error field
- [ ] Announce errors to screen readers

### Submission Flow
1. [ ] User clicks "Submit Application"
2. [ ] Validate all fields
3. [ ] If errors, show errors and stop
4. [ ] If valid, show loading state
5. [ ] Upload resume file (API call)
6. [ ] Submit form data with resume reference (API call)
7. [ ] On success, redirect to success page with application ID
8. [ ] On error, show error message, keep form data intact

### Loading States
- [ ] Disable submit button
- [ ] Show spinner in button
- [ ] Change button text to "Submitting..."
- [ ] Disable all form fields (optional)

### Accessibility
- [ ] Semantic form element
- [ ] Fieldset/legend for sections (optional)
- [ ] All form fields accessible
- [ ] Error summary has role="alert"
- [ ] Focus management on error
- [ ] Keyboard navigation works throughout

### Testing Scenarios
- [ ] Submit empty form (all errors shown)
- [ ] Submit with invalid email (email error shown)
- [ ] Submit with invalid phone (phone error shown)
- [ ] Submit without resume (resume error shown)
- [ ] Submit with short answers (min length errors shown)
- [ ] Submit valid form (succeeds, redirects)
- [ ] Test conditional question (clearance follow-up)
- [ ] Test file upload errors
- [ ] Test API submission error (network error)

---

## Page Development Checklist

### Landing Page (`/app/page.tsx`)

**Components Used:**
- Hero
- Button (in Hero and CTA section)
- Custom role overview cards

**Implementation Tasks:**
- [ ] Create page file
- [ ] Import and use Hero component
- [ ] Create 3-column role overview section
- [ ] Create bottom CTA section
- [ ] Implement responsive layout
- [ ] Add smooth scroll to apply section (optional)
- [ ] Test all breakpoints

**Content:**
- [ ] Hero title: "Application Content Engineer"
- [ ] Hero subtitle: Mission statement
- [ ] Badges: "Field+Tech+AI", "High-Impact Mission", "Startup Agility"
- [ ] Role overview content (What You'll Do, Who We're Looking For, Why StartGuides)
- [ ] Bottom CTA: "Ready to Apply?"

**Testing:**
- [ ] Desktop layout (1024px+)
- [ ] Tablet layout (768-1023px)
- [ ] Mobile layout (<768px)
- [ ] CTA links to /apply page
- [ ] All content readable and accessible

---

### Application Form Page (`/app/apply/page.tsx`)

**Components Used:**
- ApplicationForm
- FormField (within ApplicationForm)
- QuestionField (within ApplicationForm)
- FileUpload (within ApplicationForm)
- Button (submit button)

**Implementation Tasks:**
- [ ] Create page file
- [ ] Import ApplicationForm component
- [ ] Load screening questions from JSON
- [ ] Create submit handler (calls API route)
- [ ] Handle successful submission (redirect to success)
- [ ] Handle submission errors (display error)
- [ ] Add page header (title, subtitle)
- [ ] Implement max-width constraint (800px)
- [ ] Test form submission end-to-end

**API Integration:**
- [ ] Create API route: `/app/api/submit-application/route.ts`
- [ ] Handle file upload
- [ ] Generate application ID (UUID)
- [ ] Save application data to JSON file
- [ ] Save resume file to /data/resumes
- [ ] Return success with application ID
- [ ] Handle errors gracefully

**Testing:**
- [ ] Submit valid application
- [ ] Verify JSON file created in /data/applications
- [ ] Verify resume saved in /data/resumes
- [ ] Verify application ID returned
- [ ] Test with all file types (.pdf, .doc, .docx)
- [ ] Test file size validation
- [ ] Test form validation
- [ ] Test error scenarios

---

### Success Page (`/app/success/page.tsx`)

**Components Used:**
- Button (Return to Home)
- Custom success card

**Implementation Tasks:**
- [ ] Create page file
- [ ] Display application ID (from URL params or state)
- [ ] Show success checkmark with animation
- [ ] Show "What Happens Next?" steps
- [ ] Show timeline callout (3-5 business days)
- [ ] Add "Copy Application ID" button
- [ ] Add "Return to Home" button
- [ ] Implement centered card layout (max-width 600px)
- [ ] Test copy functionality

**Application ID:**
- [ ] Receive from query param or redirect state
- [ ] Display in monospace font
- [ ] Add copy to clipboard functionality
- [ ] Show "Copied!" feedback on copy

**Animation:**
- [ ] Success checkmark draws/scales in (500ms)
- [ ] Card fades in on load (300ms)

**Testing:**
- [ ] Desktop layout
- [ ] Mobile layout
- [ ] Copy button works
- [ ] Return to Home button works
- [ ] Page accessible via direct URL with ID param

---

## API Route Checklist

### Submit Application Route (`/app/api/submit-application/route.ts`)

**Functionality:**
- [ ] Accept POST request with FormData or JSON
- [ ] Extract personal info fields
- [ ] Extract screening responses
- [ ] Extract resume file
- [ ] Validate all required fields
- [ ] Validate file type and size
- [ ] Generate UUID for application ID
- [ ] Create timestamp (ISO-8601)
- [ ] Save resume file to `/data/resumes/[id]_[filename]`
- [ ] Create application JSON in `/data/applications/[id].json`
- [ ] Return success response with application ID
- [ ] Handle errors (return 400/500 with message)

**JSON Structure:**
```typescript
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

**Error Handling:**
- [ ] Missing required fields (400)
- [ ] Invalid file type (400)
- [ ] File too large (400)
- [ ] File system errors (500)
- [ ] JSON parsing errors (400)
- [ ] Generic server errors (500)

**Security:**
- [ ] Sanitize file names (prevent path traversal)
- [ ] Validate MIME types
- [ ] Limit file size (5MB)
- [ ] Sanitize text inputs (basic XSS prevention)

**Testing:**
- [ ] Valid submission succeeds
- [ ] Invalid file type rejected
- [ ] Oversized file rejected
- [ ] Missing fields rejected
- [ ] Files saved correctly
- [ ] JSON created correctly
- [ ] Application ID returned

---

## Testing Checklist

### Functional Testing
- [ ] Landing page displays correctly
- [ ] Apply button navigates to form
- [ ] Form displays all sections
- [ ] All 7 questions render correctly
- [ ] Conditional question appears when triggered
- [ ] File upload accepts valid files
- [ ] File upload rejects invalid files
- [ ] Form validation works (all fields)
- [ ] Submit button shows loading state
- [ ] Successful submission redirects to success page
- [ ] Success page displays application ID
- [ ] Copy button copies application ID
- [ ] Return home button navigates back

### Responsive Testing
- [ ] Desktop (1920×1080)
- [ ] Desktop (1366×768)
- [ ] Tablet (iPad, 768px)
- [ ] Mobile (iPhone, 375px)
- [ ] Mobile landscape
- [ ] All breakpoints transition smoothly

### Browser Testing
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing
- [ ] Keyboard navigation (Tab through all elements)
- [ ] Focus indicators visible
- [ ] Screen reader test (VoiceOver/NVDA)
- [ ] Color contrast check (WCAG AA)
- [ ] Form labels announced correctly
- [ ] Error messages announced
- [ ] All images have alt text (if any)
- [ ] Heading hierarchy correct (h1→h2→h3)
- [ ] No keyboard traps
- [ ] Skip links work (if implemented)

### Performance Testing
- [ ] Lighthouse audit (score >90)
- [ ] Page load time <2 seconds
- [ ] Form submission <3 seconds
- [ ] No layout shift (CLS <0.1)
- [ ] Images optimized (if any)
- [ ] Fonts load efficiently
- [ ] JavaScript bundle <100KB gzipped

### Data Validation Testing
- [ ] Email validation works
- [ ] Phone validation works
- [ ] URL validation works
- [ ] Textarea min length validation works
- [ ] Required field validation works
- [ ] File type validation works
- [ ] File size validation works

### Edge Cases
- [ ] Submit form with very long name (200+ chars)
- [ ] Submit with emoji in name
- [ ] Submit with special characters in fields
- [ ] Submit with 5MB file (exactly at limit)
- [ ] Submit with 5.1MB file (just over limit)
- [ ] Submit with 0KB file (empty file)
- [ ] Navigate back after submission
- [ ] Refresh during submission
- [ ] Submit form twice quickly (double-submit prevention)
- [ ] Test on slow 3G connection

---

## Deployment Checklist

### Pre-Deployment
- [ ] All components implemented and tested
- [ ] All pages implemented and tested
- [ ] API routes working correctly
- [ ] Environment variables configured (if any)
- [ ] Data directories created (/data/applications, /data/resumes)
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Accessibility tested
- [ ] Performance optimized

### Vercel Deployment
- [ ] Project connected to Vercel
- [ ] Environment variables set (if any)
- [ ] Build succeeds locally
- [ ] Deploy to preview (test preview URL)
- [ ] Deploy to production
- [ ] Test production URL
- [ ] Verify file uploads work in production
- [ ] Verify JSON files are created (check Vercel file system)

### Post-Deployment Testing
- [ ] Submit test application on production
- [ ] Verify application data saved
- [ ] Test on real mobile devices
- [ ] Test with real resume files
- [ ] Monitor for errors (Vercel logs)
- [ ] Test performance on production

### Documentation
- [ ] Update README with deployment URL
- [ ] Document API endpoints
- [ ] Document data storage structure
- [ ] Document environment variables (if any)
- [ ] Create user guide (optional)

---

## Quality Assurance Summary

### Code Quality
- [ ] TypeScript types defined for all components
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] Code formatted consistently
- [ ] Components are reusable
- [ ] Props are well-documented

### Design Compliance
- [ ] Colors match design spec
- [ ] Typography matches design spec
- [ ] Spacing matches design spec
- [ ] Components match wireframes
- [ ] Animations match spec (subtle, 150-300ms)
- [ ] Hover states implemented
- [ ] Focus states implemented

### User Experience
- [ ] Form is easy to complete
- [ ] Error messages are clear and helpful
- [ ] Loading states provide feedback
- [ ] Success page is celebratory
- [ ] Navigation is intuitive
- [ ] Mobile experience is smooth

---

## Final Checklist

Before considering the project complete:

- [ ] All components built and tested
- [ ] All pages built and tested
- [ ] API routes working
- [ ] Form submission working end-to-end
- [ ] All acceptance criteria met (see PRD)
- [ ] Accessibility requirements met (WCAG AA)
- [ ] Responsive design working on all breakpoints
- [ ] Browser compatibility tested
- [ ] Performance benchmarks met
- [ ] Deployed to Vercel
- [ ] Production testing complete
- [ ] Documentation updated

---

**Document Version:** 1.0
**Date:** October 14, 2025
**Status:** Ready for Development

Use this checklist to track your progress. Check off items as you complete them and refer back to the design spec for detailed specifications.
