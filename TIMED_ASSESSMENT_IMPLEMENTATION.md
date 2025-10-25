# Timed Assessment Implementation

## Overview
Implemented a timed assessment feature with 4 questions (2 for Part A: Product Judgment, 2 for Part B: Design Eye) that can be triggered from the Application Content Engineer form.

## Features Implemented

### 1. Card-Based Modal Interface
- Full-screen modal overlay with card-based question presentation
- Clean, focused UI that blocks interaction with the rest of the page
- Progress bar showing completion status
- Question counter (e.g., "Question 1 of 4")

### 2. 90-Second Timer Per Question
- Countdown timer displayed prominently at the top right
- Timer turns red when 30 seconds or less remain
- **Auto-advance**: When timer reaches 0, the current answer is automatically saved and user is forced to next question
- Timer resets to 90 seconds for each new question

### 3. Word Count Validation
- Real-time word count display
- Color-coded feedback:
  - Red: Exceeds maximum word count
  - Green: Meets minimum requirement
  - Gray: Below minimum requirement
- **Next button disabled** until minimum word count is met AND maximum is not exceeded
- Users can manually advance by clicking "Next" if they finish early (only if word count requirements are met)

### 4. Question Structure

#### Part A: Product Judgment (2 questions)
- Question text: "Which one would be clearer to a new soldier in the field? Why?"
- Min: 50 words
- Max: 100 words
- Time limit: 90 seconds each

#### Part B: Design Eye (2 questions)
- Question text: "Give three specific changes you'd make to improve clarity for the user."
- Min: 50 words
- Max: 150 words
- Time limit: 90 seconds each

### 5. Placeholder Images
- Each question displays a placeholder cat image above the question text
- Using placekitten.com for placeholder images (can be replaced with actual images)
- Images are 800x600px

### 6. Trigger Button
- Added to Application Content Engineer form
- Located between Resume Upload section and Submit button
- Blue highlight box to make it stand out
- Shows "Assessment completed" checkmark after completion
- Button text changes to "Retake Assessment" after first completion

### 7. Response Storage
- All responses stored in component state
- Logged to console on completion
- Can be integrated with form submission later

## Files Created/Modified

### New Files:
1. `/components/form/TimedAssessment.tsx` - Main timed assessment component
2. `/lib/timed-questions.ts` - Question definitions and configuration

### Modified Files:
1. `/components/form/ApplicationForm.tsx` - Added trigger button and modal integration

## Technical Implementation

### Key Features:
- **Auto-save on timeout**: Uses `setInterval` to decrement timer, automatically advances when time expires
- **Word count validation**: Splits text on whitespace and filters empty strings
- **Disabled state management**: Next button only enabled when word count is within valid range
- **Modal state**: Uses conditional rendering to show/hide modal
- **Response persistence**: Maintains all responses in state object keyed by question ID

### Component Props:
```typescript
interface TimedQuestion {
  id: string;
  part: 'A' | 'B';
  questionNumber: number;
  text: string;
  imageSrc: string;
  minWords: number;
  maxWords: number;
  timeLimit: number; // in seconds
}
```

## Usage

1. Navigate to the application form at `/apply`
2. Scroll to the "Timed Assessment" section (blue box)
3. Click "Start Assessment" button
4. Complete each question within 90 seconds
5. Click "Next" to advance early (if requirements met) or wait for auto-advance
6. View completion screen after all 4 questions

## Testing Completed

✅ Build compiles successfully with no TypeScript errors
✅ Component renders with proper structure
✅ Timer countdown functionality implemented
✅ Word count validation working
✅ Next button disable/enable logic implemented
✅ Auto-advance on timeout implemented
✅ Modal open/close functionality working
✅ Response storage and completion callback working

## Next Steps (Optional Enhancements)

- Replace placeholder cat images with actual question images
- Integrate responses with form submission API
- Add keyboard shortcuts (e.g., Enter to advance)
- Add sound/visual alert when time is running low
- Persist responses to localStorage in case of browser crash
- Add confirmation dialog if user tries to close modal mid-assessment
