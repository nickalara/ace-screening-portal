# Card-Based Form Implementation

## Overview
Refactored the entire application form into a card-based, one-way flow with integrated timed questions. Users progress through one card at a time with no ability to go back, ensuring test integrity.

## Implementation Summary

### Card Flow Structure
1. **Personal Information** (Untimed)
2. **Introduction Card** (Explains timed questions ahead)
3. **Screening Questions** (Mixed - some timed, some not)
4. **Timed Assessment Questions** (4 questions @ 90 seconds each)
5. **Resume Upload** (Final card with Submit button)

## Timed Questions

### Form Questions (from SCREENING_SECTIONS)
- **Section 2, Question 2** (`q5_manual_to_app`) - **3 minutes** (180 seconds)
  - "You're asked to turn a 30-page technical manual into a digital, step-by-step app..."

- **Section 3, Question 1** (`q7_technical_rewrite`) - **5 minutes** (300 seconds)
  - "Rewrite this statement for a non-technical user..."

- **Section 4, Question 2** (`q10_safety_scenario`) - **3 minutes** (180 seconds)
  - "You're climbing onto a vehicle to photograph components..."

### Timed Assessment Questions
All 4 questions from the original timed assessment - **90 seconds each**:
- Part A: Question 1 & 2 (Product Judgment)
- Part B: Question 1 & 2 (Design Eye)

### Non-Timed Questions
All other questions including:
- Multiple choice (radio)
- Checkboxes
- Text questions without time limits

## Key Features

### 1. One-Way Flow
- No back button
- No retake option
- Users can only click "Next" when requirements are met
- Auto-advance on timer expiration

### 2. Timer Indicator
- **Red background** with red text
- Label: "Time Remaining:"
- Format: "M:SS" (e.g., "3:00", "1:30")
- Displays prominently at top of timed question cards

### 3. Responsive Design
- Mobile-first approach
- Cards sized appropriately for all viewports:
  - Mobile: Full width with padding
  - Tablet: max-w-3xl
  - Desktop: max-w-3xl with better spacing
- Text sizes adjust: `text-xl md:text-2xl`
- Padding adjusts: `p-6 md:p-10`
- Image heights responsive: `h-48 md:h-64`

### 4. Progress Tracking
- Progress bar at top shows completion percentage
- "Step X of Y" counter
- Percentage complete display

### 5. Validation
- **Personal Info**: All fields required, format validation
- **Multiple Choice**: Must select an option
- **Text/Textarea**: Minimum character requirements enforced
- **Timed Questions**: Word count must be within min/max range
- **Resume**: Valid file type and size
- Next button disabled until requirements met

### 6. Introduction Card
Displays after Personal Info, before questions start:
- Warns users about timed questions
- Explains no going back
- Encourages careful reading

## Files Created/Modified

### New Files:
- `/components/form/CardBasedApplicationForm.tsx` - Main card-based form component

### Modified Files:
- `/app/apply/page.tsx` - Updated to use CardBasedApplicationForm
- Original ApplicationForm and TimedAssessment remain for reference

## Technical Details

### State Management
- `currentStep`: Tracks which card user is on
- `timeRemaining`: Current timer value (null if not timed)
- `currentAnswer`: For timed questions only
- `file`: Resume file
- React Hook Form for all form values

### Card Types
```typescript
type CardType = 'personal_info' | 'intro' | 'question' | 'timed_question' | 'resume';
```

### Timer Logic
- Uses `setInterval` with 1-second updates
- Auto-advances when timer reaches 0
- Saves current answer state before advancing
- Resets for each new timed question

### Validation Logic
- Per-card validation in `canProceed()`
- Type-specific validation (radio, textarea, timed, etc.)
- Next button disabled state tied to validation
- Resume validation on final card

## User Experience

### Flow:
1. User enters personal info → Next
2. Reads introduction about timed questions → Next
3. Progresses through all questions:
   - Untimed: Answer and click Next when ready
   - Timed: Timer starts automatically, must meet word count, auto-advance or manual Next
4. Uploads resume → Submit Application
5. Redirects to success page

### Visual Feedback:
- Red timer indicator for timed questions
- Progress bar updates on each step
- Disabled Next button when requirements not met
- Word/character count for text inputs
- Error messages for validation failures

## Testing Completed

✅ Build successful with no TypeScript errors
✅ All timed questions properly configured
✅ Timer auto-advance working
✅ Word count validation working
✅ Responsive on mobile, tablet, desktop
✅ One-way flow (no back navigation)
✅ Form submission working
✅ Resume upload validation working

## Access

Navigate to: **http://localhost:3000/apply**

Total cards: ~20 (1 personal + 1 intro + ~12 questions + 4 timed assessment + 1 resume)
