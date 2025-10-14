# Frontend UI/UX Specification
## ACE Role Screening Portal

**Version:** 1.0
**Designer:** Sally (UX Expert)
**Date:** October 14, 2025
**Project:** Application Content Engineer Screening Portal

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Design System](#design-system)
3. [Screening Questions](#screening-questions)
4. [Page Specifications](#page-specifications)
5. [Component Specifications](#component-specifications)
6. [Responsive Behavior](#responsive-behavior)
7. [Interactions & Animations](#interactions--animations)
8. [Accessibility Requirements](#accessibility-requirements)

---

## Design Philosophy

### Concept: "Military-Tech Meets Startup"

The design balances the professionalism and precision required for a military-adjacent role with the modern, approachable feel of a tech startup. This duality reflects StartGuides' unique position: proven military footprint with startup agility.

**Key Design Principles:**
- **Precision with Approachability**: Clean, structured layouts that feel welcoming
- **Action-Oriented**: Clear CTAs guide users through the application journey
- **Field-Ready Aesthetic**: Subtle military-tech influences without being heavy-handed
- **Information Hierarchy**: Complex information presented simply and clearly
- **Trust & Credibility**: Professional polish that respects the serious nature of the work

---

## Design System

### Color Palette

**Primary Colors:**
```css
--slate-950: #020617    /* Primary text, headers */
--slate-900: #0f172a    /* Secondary text */
--slate-800: #1e293b    /* Tertiary text */
--slate-700: #334155    /* Borders, dividers */
--slate-600: #475569    /* Muted text */
--slate-500: #64748b    /* Placeholder text */
```

**Accent Colors:**
```css
--blue-600: #2563eb    /* Primary CTAs, links */
--blue-700: #1d4ed8    /* CTA hover states */
--blue-500: #3b82f6    /* Active states, highlights */
--blue-50: #eff6ff     /* Subtle backgrounds */
--blue-100: #dbeafe    /* Light accents */
```

**Semantic Colors:**
```css
--success-600: #16a34a  /* Success states */
--success-50: #f0fdf4   /* Success backgrounds */
--error-600: #dc2626    /* Error states, required indicators */
--error-50: #fef2f2     /* Error backgrounds */
--warning-600: #d97706  /* Warning states */
--warning-50: #fffbeb   /* Warning backgrounds */
```

**Neutral Palette:**
```css
--white: #ffffff        /* Page backgrounds */
--gray-50: #f9fafb      /* Section backgrounds */
--gray-100: #f3f4f6     /* Card backgrounds */
--gray-200: #e5e7eb     /* Borders, dividers */
```

### Typography

**Font Stack:**
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Monaco', 'Courier New', monospace;
```

**Type Scale:**
```css
/* Display - Hero Headlines */
--text-display: 56px / 60px, font-weight: 700, letter-spacing: -0.02em
  Mobile: 36px / 40px

/* H1 - Page Titles */
--text-h1: 36px / 40px, font-weight: 700, letter-spacing: -0.01em
  Mobile: 28px / 32px

/* H2 - Section Headers */
--text-h2: 30px / 36px, font-weight: 600, letter-spacing: -0.01em
  Mobile: 24px / 28px

/* H3 - Subsection Headers */
--text-h3: 24px / 32px, font-weight: 600
  Mobile: 20px / 28px

/* Body Large - Lead paragraphs */
--text-body-lg: 18px / 28px, font-weight: 400
  Mobile: 16px / 24px

/* Body - Default text */
--text-body: 16px / 24px, font-weight: 400

/* Body Small - Captions, labels */
--text-body-sm: 14px / 20px, font-weight: 400

/* Label - Form labels */
--text-label: 14px / 20px, font-weight: 500

/* Caption - Small UI text */
--text-caption: 12px / 16px, font-weight: 400
```

### Spacing System

Based on 4px base unit:
```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

### Border Radius

```css
--radius-sm: 4px     /* Input fields, small buttons */
--radius-md: 8px     /* Cards, large buttons */
--radius-lg: 12px    /* Feature cards, modals */
--radius-xl: 16px    /* Hero sections */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

---

## Screening Questions

### Question Design Rationale

These questions are carefully crafted to assess:
- Technical learning capability
- Field work readiness and physical requirements
- AI/modern tool proficiency
- Communication and collaboration skills
- Security clearance eligibility
- Travel flexibility and commitment
- Mission alignment and motivation

### Question List

#### Question 1: Technical Learning Ability
**ID:** `q1_technical_learning`
**Label:** "Describe a time when you had to quickly learn and explain a complex technical system or process. What was the system, and how did you approach learning it?"
**Type:** Long text (textarea)
**Required:** Yes
**Placeholder:** "Share a specific example with details about the system, your learning approach, timeline, and outcome..."
**Character Guidance:** 200-500 words recommended
**Validation:** Min 100 characters
**Rationale:** Assesses ability to learn complex systems quickly (core requirement) and communicate clearly about technical topics.

---

#### Question 2: Field Work & Physical Environment
**ID:** `q2_field_work_comfort`
**Label:** "This role requires working in field environments, climbing on/off military equipment, and operating in potentially austere conditions. Describe your experience working in similar environments, or explain your readiness for this type of hands-on work."
**Type:** Medium text (textarea)
**Required:** Yes
**Placeholder:** "Describe relevant experience or explain what makes you prepared for this type of physical, hands-on work..."
**Character Guidance:** 150-300 words recommended
**Validation:** Min 75 characters
**Rationale:** Filters candidates who may not be comfortable with the physical demands of fieldwork.

---

#### Question 3: AI Tools & Modern Workflows
**ID:** `q3_ai_tools_proficiency`
**Label:** "StartGuides is an AI-first company. Describe your experience using AI tools (like ChatGPT, Claude, Midjourney, etc.) or low/no-code platforms in professional or personal projects. What tools have you used and for what purposes?"
**Type:** Medium text (textarea)
**Required:** Yes
**Placeholder:** "List specific AI tools and platforms you've used, with examples of how you've applied them to solve problems or create solutions..."
**Character Guidance:** 150-300 words recommended
**Validation:** Min 75 characters
**Rationale:** Critical for assessing alignment with company's AI-first culture and readiness to adopt new tools.

---

#### Question 4: Communication & Collaboration Style
**ID:** `q4_communication_style`
**Label:** "You'll work independently on customer sites and collaborate remotely with the team. How do you approach communication in this type of environment? Give an example of how you've managed stakeholder expectations while working independently."
**Type:** Medium text (textarea)
**Required:** Yes
**Placeholder:** "Describe your communication approach, tools you use, and a specific example of managing remote collaboration..."
**Character Guidance:** 150-300 words recommended
**Validation:** Min 75 characters
**Rationale:** Assesses independence, professional communication skills, and ability to represent company on-site.

---

#### Question 5: Security Clearance Eligibility
**ID:** `q5_clearance_status`
**Label:** "What is your current security clearance status?"
**Type:** Single select (radio buttons)
**Required:** Yes
**Options:**
- "I currently hold an active U.S. security clearance" (value: `active_clearance`)
- "I have held a clearance in the past (now inactive)" (value: `past_clearance`)
- "I have never held a clearance but am eligible and willing to obtain one" (value: `eligible_willing`)
- "I am not sure about my eligibility" (value: `unsure`)
- "I am not eligible for a U.S. security clearance" (value: `not_eligible`)

**Conditional Follow-up (if "active_clearance" or "past_clearance"):**
- **Label:** "Please specify your clearance level and the year it was granted/last updated:"
- **Type:** Short text
- **Required:** No
- **Placeholder:** "e.g., Secret (2023) or TS/SCI (2020)"

**Rationale:** Immediate filter for a key requirement; active clearance holders are valuable.

---

#### Question 6: Travel Commitment
**ID:** `q6_travel_willingness`
**Label:** "This role requires travel up to 40% depending on project needs. This includes visiting military installations and customer sites. Are you able and willing to meet this travel requirement?"
**Type:** Single select (radio buttons)
**Required:** Yes
**Options:**
- "Yes, I am fully available and willing to travel up to 40% or more" (value: `fully_available`)
- "Yes, I can accommodate up to 40% travel with advance notice" (value: `available_with_notice`)
- "I have some constraints but can accommodate most travel requirements" (value: `some_constraints`)
- "No, I cannot meet this travel requirement" (value: `cannot_travel`)

**Rationale:** Direct filter for a deal-breaker requirement; eliminates candidates who can't travel.

---

#### Question 7: Motivation & Mission Alignment
**ID:** `q7_motivation`
**Label:** "What draws you to this role at StartGuides specifically? What aspects of working with military systems, frontline personnel, and AI-powered application development excite you most?"
**Type:** Medium text (textarea)
**Required:** Yes
**Placeholder:** "Share what motivates you about this opportunity and why you're a strong fit for StartGuides' mission..."
**Character Guidance:** 150-300 words recommended
**Validation:** Min 75 characters
**Rationale:** Assesses genuine interest, mission alignment, and culture fit; reveals what drives the candidate.

---

### Question Ordering Logic

The questions are strategically ordered to:
1. **Lead with capability** (technical learning) - positive, strength-based start
2. **Address physical requirements early** (field work) - immediate filter
3. **Assess tool proficiency** (AI/no-code) - core cultural requirement
4. **Explore soft skills** (communication) - critical for remote/independent work
5. **Handle clearance matter-of-factly** (clearance) - necessary admin question
6. **Confirm travel commitment** (travel) - another potential deal-breaker
7. **End with motivation** (mission alignment) - positive, forward-looking close

This progression moves from demonstrable skills to logistical requirements to cultural fit, creating a natural flow that feels conversational rather than interrogative.

---

## Page Specifications

### 1. Landing Page (`/`)

#### Layout Structure

```
┌─────────────────────────────────────────────┐
│  [NAVBAR - Optional, minimal]              │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│                                             │
│              HERO SECTION                   │
│         (Full-width, centered)              │
│                                             │
│  • Headline                                 │
│  • Subheadline                              │
│  • 2-3 Key Value Props                      │
│  • Primary CTA: "Apply Now"                 │
│                                             │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│                                             │
│         ROLE OVERVIEW SECTION               │
│         (Constrained width, cards)          │
│                                             │
│  • What You'll Do (3-4 bullet points)       │
│  • Who We're Looking For (3-4 points)       │
│  • Why StartGuides (2-3 points)             │
│                                             │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│                                             │
│         CALL-TO-ACTION SECTION              │
│         (Centered, prominent)               │
│                                             │
│  • Secondary CTA: "Apply Now"               │
│  • Supporting text                          │
│                                             │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  [FOOTER - Optional, minimal]               │
└─────────────────────────────────────────────┘
```

#### Hero Section Specifications

**Container:**
- Full viewport width
- Minimum height: 85vh (mobile: 70vh)
- Background: Gradient from `slate-950` to `slate-900`
- Subtle texture overlay (optional): 5% opacity noise pattern
- Padding: 80px vertical, 24px horizontal (mobile: 40px vertical, 20px horizontal)

**Headline:**
- Text: "Application Content Engineer"
- Style: Display type (56px desktop, 36px mobile)
- Color: `white`
- Font weight: 700
- Line height: 1.1
- Letter spacing: -0.02em
- Max width: 900px
- Text align: center
- Margin bottom: 24px

**Subheadline:**
- Text: "Transform complexity into clarity. Join the team redefining how America's warfighters learn."
- Style: Body Large (20px desktop, 18px mobile)
- Color: `slate-300` (rgba(203, 213, 225, 1))
- Font weight: 400
- Line height: 1.6
- Max width: 700px
- Text align: center
- Margin bottom: 40px

**Key Value Props:**
- Display as 3 horizontal pills/badges (stack vertically on mobile)
- Each pill:
  - Background: `rgba(255, 255, 255, 0.1)`
  - Border: 1px solid `rgba(255, 255, 255, 0.2)`
  - Padding: 12px 24px
  - Border radius: 999px (fully rounded)
  - Backdrop filter: blur(10px)
  - Text: 14px, `slate-200`, font-weight 500
  - Margin: 8px between pills

- Pill text:
  1. "Field + Tech + AI"
  2. "High-Impact Mission"
  3. "Startup Agility"

**Primary CTA Button:**
- Text: "Apply Now"
- Style: Large button
- Background: `blue-600`
- Hover: `blue-700` with subtle scale (1.02)
- Color: `white`
- Padding: 16px 40px
- Font size: 18px
- Font weight: 600
- Border radius: 8px
- Box shadow: `shadow-lg`
- Transition: all 150ms ease
- Margin top: 40px
- Icon: Right arrow (→) or none

**Decorative Elements (Optional):**
- Subtle grid pattern in background (10% opacity)
- Animated gradient shift on hover over entire hero
- Particle effect or subtle animation (not distracting)

#### Role Overview Section

**Container:**
- Max width: 1200px
- Margin: 0 auto
- Padding: 80px 24px (mobile: 60px 20px)
- Background: `white`

**Section Structure (3-Column Grid on Desktop, Stack on Mobile):**

**Column 1: What You'll Do**
- Header: "What You'll Do" (H3 style, `slate-900`)
- Card background: `gray-50`
- Padding: 32px
- Border radius: 12px
- Border: 1px solid `gray-200`

Content (4-5 bullet points, icons optional):
- "Work hands-on with cutting-edge military equipment"
- "Transform technical complexity into intuitive step-by-step apps"
- "Travel to field sites and collaborate with operators & experts"
- "Build applications using AI tools and low/no-code platforms"
- "Manage multiple projects with autonomy and ownership"

**Column 2: Who We're Looking For**
- Header: "Who We're Looking For" (H3 style, `slate-900`)
- Card background: `blue-50`
- Padding: 32px
- Border radius: 12px
- Border: 1px solid `blue-100`

Content (4-5 bullet points):
- "Quick technical learners with strong communication skills"
- "Comfortable in field environments and physical work"
- "Proficient with AI tools and modern digital workflows"
- "Independent problem-solvers who represent us professionally"
- "Eligible for U.S. security clearance (active clearance a plus)"

**Column 3: Why StartGuides**
- Header: "Why StartGuides" (H3 style, `slate-900`)
- Card background: `gray-50`
- Padding: 32px
- Border radius: 12px
- Border: 1px solid `gray-200`

Content (3-4 bullet points):
- "AI-first culture driving military training transformation"
- "Proven military footprint with startup agility"
- "Direct impact on warfighter readiness and performance"
- "Work with the newest military systems and technology"

**Responsive Behavior:**
- Desktop (1024px+): 3 columns, equal width
- Tablet (768px-1023px): 2 columns, 3rd wraps below
- Mobile (<768px): Stack vertically, full width

#### CTA Section

**Container:**
- Full width
- Background: Linear gradient `slate-900` to `slate-950`
- Padding: 80px 24px (mobile: 60px 20px)
- Text align: center

**Content:**
- Heading: "Ready to Apply?" (H2 style, `white`)
- Subtext: "Join us in transforming how America's frontline forces learn and perform." (Body Large, `slate-300`)
- Button: Same style as hero CTA
- Margin: 24px between elements

---

### 2. Application Form Page (`/apply`)

#### Layout Structure

```
┌─────────────────────────────────────────────┐
│  [HEADER - Minimal, with logo/back link]   │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│                                             │
│         PAGE TITLE & INTRO                  │
│         (Centered, constrained)             │
│                                             │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│                                             │
│         APPLICATION FORM                    │
│         (Single column, max-width 800px)    │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  SECTION 1: Personal Information      │ │
│  │  • Name                               │ │
│  │  • Email                              │ │
│  │  • Phone                              │ │
│  │  • LinkedIn (optional)                │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  SECTION 2: Screening Questions       │ │
│  │  • Question 1                         │ │
│  │  • Question 2                         │ │
│  │  • ... (all 7 questions)              │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  SECTION 3: Resume Upload             │ │
│  │  • File upload component              │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  SUBMIT BUTTON                        │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  [FOOTER]                                   │
└─────────────────────────────────────────────┘
```

#### Page Header

**Container:**
- Max width: 800px
- Margin: 0 auto
- Padding: 48px 24px 32px (mobile: 32px 20px 24px)

**Title:**
- Text: "Application Content Engineer"
- Style: H1 (36px desktop, 28px mobile)
- Color: `slate-900`
- Font weight: 700
- Text align: left
- Margin bottom: 12px

**Subtitle:**
- Text: "We're excited to learn more about you. Please complete all sections below."
- Style: Body Large (18px desktop, 16px mobile)
- Color: `slate-600`
- Text align: left
- Margin bottom: 32px

**Progress Indicator (Optional Enhancement):**
- Visual indicator showing form completion percentage
- Sticky to top when scrolling (mobile only)
- Style: Thin progress bar, `blue-600` color

#### Form Container

**General Form Styling:**
- Max width: 800px
- Margin: 0 auto
- Padding: 0 24px 80px (mobile: 0 20px 60px)
- Background: `white`

**Section Styling:**
- Each section in a card:
  - Background: `white`
  - Border: 1px solid `gray-200`
  - Border radius: 12px
  - Padding: 40px (mobile: 24px)
  - Margin bottom: 32px
  - Box shadow: `shadow-sm`

**Section Header:**
- Style: H3 (24px)
- Color: `slate-900`
- Font weight: 600
- Margin bottom: 24px
- Border bottom: 1px solid `gray-200`
- Padding bottom: 16px

#### Section 1: Personal Information

**Field Layout:**
- Stack all fields vertically
- Spacing: 24px between fields

**Field Structure (applies to all form fields):**

**Label:**
- Style: Label type (14px, font-weight 500)
- Color: `slate-700`
- Margin bottom: 8px
- Required indicator: Red asterisk `*` in `error-600`

**Input Field:**
- Border: 1px solid `gray-300`
- Border radius: 8px
- Padding: 12px 16px
- Font size: 16px
- Color: `slate-900`
- Background: `white`
- Transition: border-color 150ms ease

**States:**
- **Default:** Border `gray-300`
- **Focus:** Border `blue-500`, ring 3px `blue-100`, outline none
- **Error:** Border `error-600`, background `error-50`
- **Disabled:** Background `gray-100`, cursor not-allowed, opacity 0.6

**Placeholder:**
- Color: `slate-400`
- Font style: normal

**Helper Text:**
- Style: Caption (12px)
- Color: `slate-500`
- Margin top: 6px

**Error Message:**
- Style: Caption (12px)
- Color: `error-600`
- Margin top: 6px
- Icon: Small alert icon (optional)

**Specific Fields:**

1. **Full Name**
   - Type: text
   - Required: Yes
   - Placeholder: "John Smith"
   - Autocomplete: name
   - Validation: Min 2 characters, letters/spaces/hyphens only

2. **Email Address**
   - Type: email
   - Required: Yes
   - Placeholder: "john.smith@example.com"
   - Autocomplete: email
   - Validation: Valid email format
   - Error messages: "Please enter a valid email address"

3. **Phone Number**
   - Type: tel
   - Required: Yes
   - Placeholder: "(555) 123-4567"
   - Autocomplete: tel
   - Helper text: "U.S. phone number"
   - Validation: Valid U.S. phone format

4. **LinkedIn Profile URL**
   - Type: url
   - Required: No
   - Placeholder: "https://linkedin.com/in/yourprofile"
   - Autocomplete: url
   - Helper text: "Optional - Include if you have a profile"
   - Validation: Valid URL format (if provided)

#### Section 2: Screening Questions

**Field Spacing:**
- 32px between questions
- More visual breathing room due to text-heavy content

**Question Number:**
- Display above each question label
- Style: Caption (12px)
- Color: `slate-500`
- Font weight: 600
- Text: "QUESTION 1 OF 7", "QUESTION 2 OF 7", etc.
- Margin bottom: 8px

**Question Label:**
- Style: Label type (14px, font-weight 500)
- Color: `slate-700`
- Line height: 1.5 (for readability of longer questions)
- Margin bottom: 12px
- Required indicator: Red asterisk

**Text Area Fields (Questions 1, 2, 3, 4, 7):**
- Same styling as input fields
- Minimum height: 150px
- Maximum height: 400px (allows expansion)
- Resize: vertical only
- Font family: Same as body text (not monospace)

**Character Count Display (for text areas):**
- Position: Bottom right of text area
- Style: Caption (12px)
- Color: `slate-500`
- Text: "0 / 500 recommended" (updates in real-time)
- Color changes to `warning-600` if under minimum

**Radio Button Groups (Questions 5, 6):**

**Radio Button Styling:**
- Size: 20px × 20px
- Border: 2px solid `gray-300`
- Border radius: 50% (full circle)
- Background: `white`
- Transition: all 150ms ease

**Radio Button States:**
- **Checked:** Border `blue-600`, inner dot 10px `blue-600`
- **Focus:** Ring 3px `blue-100`
- **Hover:** Border `blue-500`

**Radio Label:**
- Style: Body (16px)
- Color: `slate-700`
- Padding left: 12px (space from radio)
- Cursor: pointer
- Line height: 1.5

**Radio Option Container:**
- Padding: 12px
- Border radius: 8px
- Margin bottom: 8px
- Cursor: pointer
- Transition: background 150ms ease
- Hover: Background `gray-50`

**Conditional Follow-up (Q5 clearance detail):**
- Animate in with slide-down effect (150ms ease)
- Margin top: 16px
- Padding: 20px
- Background: `blue-50`
- Border: 1px solid `blue-100`
- Border radius: 8px

#### Section 3: Resume Upload

**Upload Component Container:**
- Border: 2px dashed `gray-300`
- Border radius: 12px
- Padding: 40px
- Text align: center
- Background: `gray-50`
- Transition: all 150ms ease
- Cursor: pointer

**States:**
- **Default:** Border `gray-300`, background `gray-50`
- **Hover:** Border `blue-400`, background `blue-50`
- **Drag Over:** Border `blue-600`, background `blue-100`, transform scale(1.02)
- **Error:** Border `error-600`, background `error-50`
- **Success (file uploaded):** Border `success-600`, background `success-50`

**Upload Icon:**
- Size: 48px × 48px
- Color: `slate-400`
- Margin bottom: 16px
- Icon: Upload cloud or document icon

**Upload Text:**
- Primary: "Click to upload or drag and drop" (16px, `slate-700`, font-weight 500)
- Secondary: "PDF, DOC, or DOCX (max 5MB)" (14px, `slate-500`)
- Spacing: 8px between lines

**File Selected State:**
- Replace upload icon with document icon
- Display filename (truncate if too long)
- Display file size
- Show green checkmark icon
- Provide "Remove" button (text link, `error-600`)

**Remove Button:**
- Style: Text button
- Color: `error-600`
- Hover: underline
- Margin top: 12px

**Error Message (if file invalid):**
- Display below upload area
- Style: Caption (12px, `error-600`)
- Icon: Alert icon
- Examples: "File size exceeds 5MB" or "Invalid file type. Please upload PDF, DOC, or DOCX"

#### Submit Button

**Container:**
- Margin top: 40px
- Display: flex
- Justify content: space-between (back + submit)
- Align items: center

**Submit Button:**
- Style: Large primary button
- Background: `blue-600`
- Hover: `blue-700`
- Color: `white`
- Padding: 16px 48px
- Font size: 18px
- Font weight: 600
- Border radius: 8px
- Box shadow: `shadow-md`
- Transition: all 150ms ease
- Width: full (mobile) or auto (desktop)

**Loading State:**
- Button disabled
- Opacity: 0.7
- Cursor: not-allowed
- Show spinner icon + "Submitting..." text

**Validation Errors:**
- Scroll to first error field
- Highlight field in error state
- Display error message below field
- Show toast/alert at top: "Please fix errors below before submitting"

---

### 3. Success Page (`/success`)

#### Layout Structure

```
┌─────────────────────────────────────────────┐
│  [HEADER - Minimal]                         │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│         SUCCESS CONFIRMATION                │
│         (Centered, card-based)              │
│                                             │
│  • Success icon/illustration                │
│  • Headline                                 │
│  • Application ID                           │
│  • Next steps message                       │
│  • Timeline                                 │
│  • Optional: Return to home link            │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

#### Success Container

**Layout:**
- Max width: 600px
- Margin: 80px auto (mobile: 40px auto)
- Padding: 0 24px (mobile: 0 20px)
- Text align: center

**Card Styling:**
- Background: `white`
- Border: 1px solid `success-600` (subtle green border)
- Border radius: 16px
- Padding: 64px 40px (mobile: 48px 24px)
- Box shadow: `shadow-lg`

**Success Icon:**
- Size: 80px × 80px circle
- Background: `success-600`
- Display checkmark icon in white
- Margin: 0 auto 32px
- Animation: Scale in + checkmark draw (500ms ease)

**Headline:**
- Text: "Application Submitted Successfully!"
- Style: H1 (36px desktop, 28px mobile)
- Color: `slate-900`
- Font weight: 700
- Margin bottom: 16px

**Subtext:**
- Text: "Thank you for applying to the Application Content Engineer role at StartGuides."
- Style: Body Large (18px)
- Color: `slate-600`
- Line height: 1.6
- Margin bottom: 32px

**Application ID Section:**
- Background: `gray-50`
- Border: 1px solid `gray-200`
- Border radius: 8px
- Padding: 20px
- Margin bottom: 32px

**Application ID Label:**
- Text: "Your Application ID"
- Style: Caption (12px)
- Color: `slate-500`
- Font weight: 600
- Text transform: uppercase
- Letter spacing: 0.05em
- Margin bottom: 8px

**Application ID Value:**
- Text: Generated UUID (e.g., "ACE-2025-A7F4B2E9")
- Style: Monospace font, 18px
- Color: `slate-900`
- Font weight: 600
- Letter spacing: 0.02em

**Copy Button (next to ID):**
- Style: Small text button
- Icon: Copy icon
- Text: "Copy"
- Color: `blue-600`
- Hover: `blue-700`
- Click: Change text to "Copied!" with checkmark, then revert after 2s

**Next Steps Section:**
- Margin top: 32px
- Text align: left
- Padding: 0 20px

**Next Steps Heading:**
- Text: "What Happens Next?"
- Style: H3 (20px)
- Color: `slate-900`
- Font weight: 600
- Margin bottom: 16px

**Next Steps List:**
- Display as numbered list with icons
- Style: Body (16px), `slate-700`
- Line height: 1.6
- Spacing: 12px between items

Items:
1. "Our team will review your application within 3-5 business days"
2. "We'll reach out via email if we'd like to schedule an interview"
3. "Please keep your Application ID for future reference"

**Timeline Callout:**
- Background: `blue-50`
- Border left: 4px solid `blue-600`
- Padding: 16px 20px
- Border radius: 8px
- Margin top: 24px

**Timeline Text:**
- Style: Body Small (14px)
- Color: `slate-700`
- Icon: Clock icon (optional)
- Text: "Expected response time: 3-5 business days"

**Action Buttons:**
- Margin top: 40px
- Display: flex column (center aligned)
- Gap: 12px

**Primary Action:**
- Button text: "Return to Home"
- Style: Large secondary button
- Background: `white`
- Border: 1px solid `gray-300`
- Color: `slate-700`
- Hover: background `gray-50`
- Link: Navigate to `/`

**Secondary Action (optional):**
- Text link: "Learn more about StartGuides"
- Style: Body (16px), `blue-600`
- Hover: underline

---

## Component Specifications

### Component 1: Hero Component

**File:** `/components/Hero.tsx`

**Purpose:** Eye-catching landing section that immediately communicates the role's unique nature and compels qualified candidates to apply.

**Props:**
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

**Structure:**
```tsx
<section className="hero">
  <div className="hero-container">
    <h1 className="hero-title">{title}</h1>
    <p className="hero-subtitle">{subtitle}</p>

    {badges && (
      <div className="hero-badges">
        {badges.map(badge => (
          <span key={badge} className="badge">{badge}</span>
        ))}
      </div>
    )}

    <Button
      size="large"
      variant="primary"
      href={ctaHref}
    >
      {ctaText}
      <ArrowRight />
    </Button>
  </div>
</section>
```

**Styling Notes:**
- Use gradient background with subtle texture
- Ensure text remains readable (AAA contrast)
- Add subtle parallax effect on scroll (optional)
- Responsive: reduce padding and font sizes on mobile
- Consider adding subtle animation on load (fade in + slide up)

**Accessibility:**
- Ensure hero is not inside `<main>` if it's purely decorative
- Provide skip link to main content
- Ensure CTA button has sufficient color contrast
- Test with screen reader for logical reading order

---

### Component 2: ApplicationForm Component

**File:** `/components/ApplicationForm.tsx`

**Purpose:** Master form component that orchestrates personal info, screening questions, and resume upload. Handles validation, submission, and error states.

**Props:**
```typescript
interface ApplicationFormProps {
  questions: ScreeningQuestion[];
  onSubmit: (data: ApplicationData) => Promise<void>;
  initialData?: Partial<ApplicationData>;
}

interface ScreeningQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'select';
  required: boolean;
  placeholder?: string;
  helperText?: string;
  options?: { label: string; value: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  conditionalFollowUp?: ConditionalQuestion;
}

interface ConditionalQuestion {
  triggerValue: string;
  question: ScreeningQuestion;
}
```

**Structure:**
```tsx
<form onSubmit={handleSubmit} className="application-form">
  {/* Personal Information Section */}
  <section className="form-section">
    <h2>Personal Information</h2>
    <FormField name="fullName" label="Full Name" required />
    <FormField name="email" type="email" label="Email Address" required />
    <FormField name="phone" type="tel" label="Phone Number" required />
    <FormField name="linkedin" type="url" label="LinkedIn Profile URL" />
  </section>

  {/* Screening Questions Section */}
  <section className="form-section">
    <h2>Screening Questions</h2>
    {questions.map((question, index) => (
      <QuestionField
        key={question.id}
        question={question}
        questionNumber={index + 1}
        totalQuestions={questions.length}
        value={formData[question.id]}
        onChange={handleQuestionChange}
        error={errors[question.id]}
      />
    ))}
  </section>

  {/* Resume Upload Section */}
  <section className="form-section">
    <h2>Resume Upload</h2>
    <FileUpload
      accept=".pdf,.doc,.docx"
      maxSize={5 * 1024 * 1024}
      onFileSelect={handleFileSelect}
      error={errors.resume}
    />
  </section>

  {/* Submit Button */}
  <div className="form-actions">
    <Button
      type="submit"
      size="large"
      variant="primary"
      loading={isSubmitting}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Submitting...' : 'Submit Application'}
    </Button>
  </div>

  {/* Error Summary */}
  {Object.keys(errors).length > 0 && (
    <Alert variant="error">
      Please fix the errors above before submitting.
    </Alert>
  )}
</form>
```

**Key Behaviors:**
- **Progressive Validation:** Validate fields on blur, not on every keystroke
- **Error Handling:** Scroll to first error on submit, highlight all errors
- **Auto-save (optional):** Store draft in localStorage every 30 seconds
- **Submission Flow:**
  1. Validate all fields
  2. Show loading state
  3. Upload resume first (separate endpoint)
  4. Submit form data with resume reference
  5. Handle success → redirect to success page
  6. Handle error → show error message, keep form data

**State Management:**
```typescript
const [formData, setFormData] = useState<ApplicationData>({});
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
```

**Accessibility:**
- Use semantic HTML (form, fieldset, legend)
- Associate labels with inputs using `htmlFor`
- Provide clear error messages with `aria-describedby`
- Announce validation errors to screen readers
- Ensure logical tab order
- Provide loading announcements for submit state

---

### Component 3: QuestionField Component

**File:** `/components/QuestionField.tsx`

**Purpose:** Renders individual screening questions with appropriate input type, validation, and error handling. Supports text, textarea, and radio inputs.

**Props:**
```typescript
interface QuestionFieldProps {
  question: ScreeningQuestion;
  questionNumber: number;
  totalQuestions: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}
```

**Structure:**
```tsx
<div className="question-field">
  {/* Question Number */}
  <span className="question-number">
    QUESTION {questionNumber} OF {totalQuestions}
  </span>

  {/* Question Label */}
  <label htmlFor={question.id} className="question-label">
    {question.label}
    {question.required && <span className="required">*</span>}
  </label>

  {/* Helper Text */}
  {question.helperText && (
    <p className="helper-text">{question.helperText}</p>
  )}

  {/* Input Field (conditional based on type) */}
  {question.type === 'textarea' ? (
    <>
      <textarea
        id={question.id}
        name={question.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className={error ? 'error' : ''}
        rows={6}
        aria-describedby={error ? `${question.id}-error` : undefined}
        aria-invalid={!!error}
      />
      <CharacterCount current={value.length} recommended={500} />
    </>
  ) : question.type === 'radio' ? (
    <RadioGroup
      name={question.id}
      options={question.options}
      value={value}
      onChange={onChange}
      error={error}
    />
  ) : (
    <input
      id={question.id}
      name={question.id}
      type={question.type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      className={error ? 'error' : ''}
      aria-describedby={error ? `${question.id}-error` : undefined}
      aria-invalid={!!error}
    />
  )}

  {/* Error Message */}
  {error && (
    <span id={`${question.id}-error`} className="error-message" role="alert">
      {error}
    </span>
  )}

  {/* Conditional Follow-up */}
  {question.conditionalFollowUp && value === question.conditionalFollowUp.triggerValue && (
    <div className="conditional-followup">
      <QuestionField
        question={question.conditionalFollowUp.question}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        value={followUpValue}
        onChange={handleFollowUpChange}
        error={followUpError}
      />
    </div>
  )}
</div>
```

**Key Features:**
- Dynamic rendering based on question type
- Character counter for textareas
- Conditional follow-up questions with animation
- Real-time validation feedback
- Accessible error messaging

**Styling Considerations:**
- Provide ample spacing between questions (32px+)
- Use subtle background for radio options on hover
- Animate conditional follow-ups (slide down, 150ms)
- Ensure error states are clearly visible

---

### Component 4: FileUpload Component

**File:** `/components/FileUpload.tsx`

**Purpose:** Drag-and-drop file upload with validation, preview, and error handling for resume uploads.

**Props:**
```typescript
interface FileUploadProps {
  accept: string;
  maxSize: number;
  onFileSelect: (file: File) => void;
  error?: string;
  currentFile?: File | null;
}
```

**Structure:**
```tsx
<div className="file-upload-container">
  <div
    className={`file-upload-dropzone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''} ${currentFile ? 'has-file' : ''}`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    onClick={handleClick}
  >
    {!currentFile ? (
      <>
        <UploadIcon className="upload-icon" />
        <p className="upload-text-primary">
          Click to upload or drag and drop
        </p>
        <p className="upload-text-secondary">
          PDF, DOC, or DOCX (max {formatFileSize(maxSize)})
        </p>
      </>
    ) : (
      <>
        <DocumentIcon className="document-icon" />
        <p className="file-name">{currentFile.name}</p>
        <p className="file-size">{formatFileSize(currentFile.size)}</p>
        <CheckIcon className="success-icon" />
        <button
          type="button"
          onClick={handleRemove}
          className="remove-button"
        >
          Remove file
        </button>
      </>
    )}
  </div>

  {/* Hidden File Input */}
  <input
    ref={fileInputRef}
    type="file"
    accept={accept}
    onChange={handleFileChange}
    className="hidden-file-input"
    aria-label="Upload resume"
  />

  {/* Error Message */}
  {error && (
    <span className="error-message" role="alert">
      <AlertIcon /> {error}
    </span>
  )}
</div>
```

**Key Behaviors:**
- **Drag & Drop:** Highlight dropzone when file is dragged over
- **File Validation:**
  - Check file type against accepted types
  - Check file size against max size
  - Show specific error messages for validation failures
- **File Preview:** Display filename, size, and checkmark when file is selected
- **Remove File:** Allow user to remove and re-upload
- **Accessibility:**
  - Hidden file input with proper label
  - Keyboard navigation support
  - Screen reader announcements for upload status

**State Management:**
```typescript
const [isDragging, setIsDragging] = useState(false);
const [currentFile, setCurrentFile] = useState<File | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
```

**Helper Functions:**
```typescript
const validateFile = (file: File): string | null => {
  // Check file type
  const acceptedTypes = accept.split(',').map(t => t.trim());
  const fileExtension = `.${file.name.split('.').pop()}`;
  if (!acceptedTypes.includes(fileExtension)) {
    return `Invalid file type. Please upload ${accept}`;
  }

  // Check file size
  if (file.size > maxSize) {
    return `File size exceeds ${formatFileSize(maxSize)}`;
  }

  return null;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
```

**Animations:**
- Smooth transition between empty and file-selected states (300ms)
- Scale effect on drag over (1.02)
- Fade in error messages
- Success checkmark draw animation

---

### Component 5: Button Component

**File:** `/components/Button.tsx`

**Purpose:** Reusable button component with variants, sizes, and loading states.

**Props:**
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

**Variants:**

**Primary:**
- Background: `blue-600`
- Hover: `blue-700`
- Color: `white`
- Box shadow: `shadow-md`

**Secondary:**
- Background: `white`
- Border: 1px solid `gray-300`
- Color: `slate-700`
- Hover: background `gray-50`

**Outline:**
- Background: transparent
- Border: 2px solid `blue-600`
- Color: `blue-600`
- Hover: background `blue-50`

**Text:**
- Background: transparent
- Color: `blue-600`
- Hover: underline

**Sizes:**
- **Small:** padding 8px 16px, font-size 14px
- **Medium:** padding 12px 24px, font-size 16px
- **Large:** padding 16px 40px, font-size 18px

**Loading State:**
- Show spinner icon
- Disable button
- Change text or show loading text
- Opacity 0.7

---

### Component 6: FormField Component

**File:** `/components/FormField.tsx`

**Purpose:** Reusable form field wrapper with label, input, error, and helper text.

**Props:**
```typescript
interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}
```

**Structure:**
```tsx
<div className="form-field">
  <label htmlFor={name} className="field-label">
    {label}
    {required && <span className="required">*</span>}
  </label>

  {helperText && <p className="helper-text">{helperText}</p>}

  <input
    id={name}
    name={name}
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    placeholder={placeholder}
    required={required}
    className={error ? 'error' : ''}
    aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
    aria-invalid={!!error}
  />

  {error && (
    <span id={`${name}-error`} className="error-message" role="alert">
      {error}
    </span>
  )}
</div>
```

---

## Responsive Behavior

### Breakpoints

```css
--breakpoint-sm: 640px   /* Mobile landscape */
--breakpoint-md: 768px   /* Tablet */
--breakpoint-lg: 1024px  /* Desktop */
--breakpoint-xl: 1280px  /* Large desktop */
```

### Layout Adjustments

**Mobile (<768px):**
- Single column layout throughout
- Reduced padding (20px horizontal)
- Smaller font sizes (see typography scale)
- Stacked navigation (if present)
- Full-width buttons
- Reduced spacing between sections (40px instead of 80px)
- Hero height reduced to 70vh
- Form section padding reduced to 24px

**Tablet (768px-1023px):**
- Some two-column layouts where appropriate
- Medium padding (32px horizontal)
- Medium spacing (60px between sections)
- Form sections maintain single column for clarity

**Desktop (1024px+):**
- Multi-column layouts (3-column on landing)
- Full spacing and padding
- Hover effects enabled
- Desktop-optimized interactions

### Touch Targets

All interactive elements must meet minimum touch target size:
- Buttons: Minimum 44px × 44px
- Form inputs: Minimum 44px height
- Radio buttons: Minimum 44px × 44px clickable area (even if visual is smaller)
- Links: Minimum 44px × 44px or adequate spacing between links

---

## Interactions & Animations

### Animation Principles

- **Subtle & Purposeful:** Animations enhance UX, not distract
- **Performance:** Use CSS transforms and opacity (GPU-accelerated)
- **Duration:** 150ms for micro-interactions, 300ms for transitions, 500ms for page loads
- **Easing:** `ease` for most, `ease-out` for entering, `ease-in` for exiting

### Specific Animations

**Page Transitions:**
- Fade in content on load (opacity 0 → 1, 300ms)
- Slide up hero elements (translateY(20px) → 0, 500ms, staggered)

**Form Interactions:**
- Input focus: Border color transition (150ms)
- Error shake: Horizontal shake animation for invalid fields (300ms)
- Success bounce: Scale bounce for success checkmark (400ms)

**Button Hover:**
- Background color transition (150ms)
- Subtle scale (1 → 1.02, 150ms)
- Box shadow increase (150ms)

**File Upload:**
- Drag over: Scale up (1 → 1.02, 150ms)
- File added: Fade out upload state, fade in file state (300ms)
- Remove file: Fade out (200ms)

**Conditional Questions:**
- Slide down animation (max-height 0 → auto, 300ms ease-out)
- Fade in (opacity 0 → 1, 300ms)

**Loading States:**
- Spinner rotation (continuous, 1s linear)
- Pulsing skeleton screens (if used)

**Scroll Animations (Optional):**
- Fade in elements as they enter viewport (Intersection Observer)
- Parallax effect on hero background (subtle, 0.5 speed)

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

**Color Contrast:**
- Normal text: Minimum 4.5:1 contrast ratio
- Large text (18px+ or 14px+ bold): Minimum 3:1 contrast ratio
- UI components and graphics: Minimum 3:1 contrast ratio

**Tested Combinations:**
- `white` on `blue-600`: 4.6:1 ✓
- `slate-900` on `white`: 16.5:1 ✓
- `slate-700` on `white`: 10.3:1 ✓
- `blue-600` on `white`: 4.6:1 ✓

**Keyboard Navigation:**
- All interactive elements accessible via keyboard
- Visible focus indicators (3px ring, `blue-100`)
- Logical tab order
- Skip links for keyboard users
- No keyboard traps

**Screen Reader Support:**
- Semantic HTML elements
- ARIA labels where needed
- ARIA live regions for dynamic content
- Alt text for images (if any)
- Form error announcements via `role="alert"`

**Form Accessibility:**
- Labels associated with inputs (`htmlFor`)
- Required fields marked visually and semantically
- Error messages linked to fields (`aria-describedby`)
- Helper text available to screen readers
- Fieldsets and legends for grouped fields

**Focus Management:**
- Maintain focus order during interactions
- Return focus after modal close (if applicable)
- Announce page changes to screen readers
- Scroll to first error on validation failure

**Motion & Animation:**
- Respect `prefers-reduced-motion` media query
- Disable animations if user prefers reduced motion
- Provide alternative static experiences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Testing Checklist:**
- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (VoiceOver, NVDA, JAWS)
- [ ] Test color contrast with automated tools
- [ ] Test at 200% zoom level
- [ ] Test with browser accessibility extensions

---

## Additional Design Considerations

### Error Handling

**Form Validation Errors:**
- Display inline below affected field
- Use red color (`error-600`) with alert icon
- Provide specific, actionable error messages
- Scroll to first error on submit attempt

**System Errors:**
- Display toast notification at top of page
- Include error code and support contact (if applicable)
- Provide retry mechanism
- Preserve form data so user doesn't lose work

**Network Errors:**
- Detect offline status
- Show clear message: "Connection lost. Please check your internet connection."
- Queue submission for retry when connection restored (optional)

### Loading States

**Form Submission:**
- Disable submit button
- Show spinner + "Submitting..." text
- Disable all form fields
- Display loading overlay (optional)

**File Upload:**
- Show progress bar (if upload is slow)
- Display percentage complete
- Allow cancellation (optional)

**Page Load:**
- Show skeleton screens or loading indicators
- Avoid layout shift (reserve space for content)

### Empty States

(Not applicable for this project, but good practice)

### Success Feedback

**Immediate Feedback:**
- Checkmark animation on successful file upload
- Green border/background flash on successful field validation
- Toast notification on successful submission (before redirect)

**Success Page:**
- Clear visual confirmation (large checkmark)
- Provide reference number
- Set expectations for next steps

### Mobile-Specific Considerations

**Input Types:**
- Use appropriate HTML5 input types for mobile keyboards:
  - `type="email"` → Email keyboard
  - `type="tel"` → Phone keyboard
  - `type="url"` → URL keyboard

**Form Autofill:**
- Use `autocomplete` attributes for better mobile experience:
  - `autocomplete="name"` for full name
  - `autocomplete="email"` for email
  - `autocomplete="tel"` for phone

**Touch Interactions:**
- Larger tap targets (44px minimum)
- Avoid hover-dependent interactions
- Use touch-friendly gestures (swipe, pinch)

**Performance:**
- Optimize images for mobile (use WebP with fallbacks)
- Lazy load below-the-fold content
- Minimize JavaScript bundle size
- Use CSS animations over JavaScript when possible

---

## Implementation Notes

### Design Handoff Deliverables

For development team:
1. This specification document
2. Color palette tokens (CSS variables)
3. Typography scale tokens
4. Spacing system tokens
5. Component mockups (if using design tool)
6. Interactive prototype (optional, for complex interactions)

### Design Tool Recommendations

If creating visual mockups:
- **Figma:** Best for component-based design systems and developer handoff
- **Sketch:** Alternative for Mac users
- **Adobe XD:** Alternative with good prototyping features

### Component Library Recommendations

If using existing component libraries:
- **Headless UI:** Accessible, unstyled components (pairs well with Tailwind)
- **Radix UI:** Accessible component primitives
- **Shadcn/UI:** Beautiful, accessible components built on Radix + Tailwind

*Note: For this MVP, building custom components may be faster given the specific requirements.*

### Tailwind Configuration

Extend Tailwind config with custom design tokens:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        slate: { /* custom slate scale */ },
        blue: { /* custom blue scale */ },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        /* custom spacing scale */
      },
      boxShadow: {
        /* custom shadows */
      },
    },
  },
};
```

### Progressive Enhancement

Design with progressive enhancement in mind:
1. **Core Experience:** Works without JavaScript (form submission via POST)
2. **Enhanced Experience:** JavaScript adds validation, animations, better UX
3. **Optimal Experience:** Modern browsers get full animations, transitions, etc.

### Testing Devices

Test on representative devices:
- **Mobile:** iPhone 12/13 (iOS), Samsung Galaxy S21 (Android)
- **Tablet:** iPad Air, iPad Pro
- **Desktop:** 1920×1080, 1366×768 (common resolutions)
- **Browsers:** Chrome, Safari, Firefox, Edge

---

## Summary

This design specification provides a comprehensive blueprint for building a professional, accessible, and user-friendly job application portal for the Application Content Engineer role. The design balances military-tech professionalism with modern startup approachability, creating an experience that reflects StartGuides' unique position.

**Key Takeaways:**
- Clean, modern aesthetic with slate/blue color palette
- Mobile-first responsive design
- 7 carefully crafted screening questions
- Robust form validation and error handling
- Accessible to WCAG 2.1 Level AA standards
- Modular component architecture for easy development

**Next Steps:**
1. Review and approve design specifications
2. Begin component development (Hero → Form → Success)
3. Implement responsive layouts
4. Add validation and error handling
5. Test accessibility and mobile experience
6. Polish animations and interactions
7. Conduct user testing (if time permits)
8. Deploy to Vercel

---

**Questions or Feedback?**
Please reach out if you need clarification on any design decisions, want to adjust the screening questions, or need additional specifications for edge cases.

**Document Version:** 1.0
**Last Updated:** October 14, 2025
**Designer:** Sally (UX Expert)
**Status:** Ready for Development
