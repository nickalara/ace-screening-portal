import { ScreeningQuestion } from './types';

// Screening Questions from screening-questions.json
export const SCREENING_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 'q1_technical_learning',
    questionNumber: 1,
    label: 'Describe a time when you had to quickly learn and explain a complex technical system or process. What was the system, and how did you approach learning it?',
    type: 'textarea',
    required: true,
    placeholder: 'Share a specific example with details about the system, your learning approach, timeline, and outcome...',
    helperText: '200-500 words recommended',
    validation: {
      minLength: 100,
      errorMessage: 'Please provide at least 100 characters',
    },
    category: 'technical_learning',
  },
  {
    id: 'q2_field_work_comfort',
    questionNumber: 2,
    label: 'This role requires working in field environments, climbing on/off military equipment, and operating in potentially austere conditions. Describe your experience working in similar environments, or explain your readiness for this type of hands-on work.',
    type: 'textarea',
    required: true,
    placeholder: 'Describe relevant experience or explain what makes you prepared for this type of physical, hands-on work...',
    helperText: '150-300 words recommended',
    validation: {
      minLength: 75,
      errorMessage: 'Please provide at least 75 characters',
    },
    category: 'field_work',
  },
  {
    id: 'q3_ai_tools_proficiency',
    questionNumber: 3,
    label: 'StartGuides is an AI-first company. Describe your experience using AI tools (like ChatGPT, Claude, Midjourney, etc.) or low/no-code platforms in professional or personal projects. What tools have you used and for what purposes?',
    type: 'textarea',
    required: true,
    placeholder: 'List specific AI tools and platforms you\'ve used, with examples of how you\'ve applied them to solve problems or create solutions...',
    helperText: '150-300 words recommended',
    validation: {
      minLength: 75,
      errorMessage: 'Please provide at least 75 characters',
    },
    category: 'ai_proficiency',
  },
  {
    id: 'q4_communication_style',
    questionNumber: 4,
    label: 'You\'ll work independently on customer sites and collaborate remotely with the team. How do you approach communication in this type of environment? Give an example of how you\'ve managed stakeholder expectations while working independently.',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your communication approach, tools you use, and a specific example of managing remote collaboration...',
    helperText: '150-300 words recommended',
    validation: {
      minLength: 75,
      errorMessage: 'Please provide at least 75 characters',
    },
    category: 'communication',
  },
  {
    id: 'q5_clearance_status',
    questionNumber: 5,
    label: 'What is your current security clearance status?',
    type: 'radio',
    required: true,
    options: [
      {
        label: 'I currently hold an active U.S. security clearance',
        value: 'active_clearance',
      },
      {
        label: 'I have held a clearance in the past (now inactive)',
        value: 'past_clearance',
      },
      {
        label: 'I have never held a clearance but am eligible and willing to obtain one',
        value: 'eligible_willing',
      },
      {
        label: 'I am not sure about my eligibility',
        value: 'unsure',
      },
      {
        label: 'I am not eligible for a U.S. security clearance',
        value: 'not_eligible',
      },
    ],
    conditionalFollowUp: {
      triggerValues: ['active_clearance', 'past_clearance'],
      question: {
        id: 'q5_clearance_detail',
        label: 'Please specify your clearance level and the year it was granted/last updated:',
        type: 'text',
        required: false,
        placeholder: 'e.g., Secret (2023) or TS/SCI (2020)',
      },
    },
    category: 'clearance',
  },
  {
    id: 'q6_travel_willingness',
    questionNumber: 6,
    label: 'This role requires travel up to 40% depending on project needs. This includes visiting military installations and customer sites. Are you able and willing to meet this travel requirement?',
    type: 'radio',
    required: true,
    options: [
      {
        label: 'Yes, I am fully available and willing to travel up to 40% or more',
        value: 'fully_available',
      },
      {
        label: 'Yes, I can accommodate up to 40% travel with advance notice',
        value: 'available_with_notice',
      },
      {
        label: 'I have some constraints but can accommodate most travel requirements',
        value: 'some_constraints',
      },
      {
        label: 'No, I cannot meet this travel requirement',
        value: 'cannot_travel',
      },
    ],
    category: 'travel',
  },
  {
    id: 'q7_motivation',
    questionNumber: 7,
    label: 'What draws you to this role at StartGuides specifically? What aspects of working with military systems, frontline personnel, and AI-powered application development excite you most?',
    type: 'textarea',
    required: true,
    placeholder: 'Share what motivates you about this opportunity and why you\'re a strong fit for StartGuides\' mission...',
    helperText: '150-300 words recommended',
    validation: {
      minLength: 75,
      errorMessage: 'Please provide at least 75 characters',
    },
    category: 'motivation',
  },
];

// Job Description Content for Landing Page
export const JOB_TITLE = 'Application Content Engineer';

export const JOB_SUBTITLE = 'Transform complexity into clarity. Join the team redefining how America\'s warfighters learn.';

export const JOB_BADGES = [
  'Field + Tech + AI',
  'High-Impact Mission',
  'Startup Agility',
];

export const WHAT_YOU_WILL_DO = [
  'Work hands-on with cutting-edge military equipment',
  'Transform technical complexity into intuitive step-by-step apps',
  'Travel to field sites and collaborate with operators & experts',
  'Build applications using AI tools and low/no-code platforms',
  'Manage multiple projects with autonomy and ownership',
];

export const WHO_WE_ARE_LOOKING_FOR = [
  'Quick technical learners with strong communication skills',
  'Comfortable in field environments and physical work',
  'Proficient with AI tools and modern digital workflows',
  'Independent problem-solvers who represent us professionally',
  'Eligible for U.S. security clearance (active clearance a plus)',
];

export const WHY_STARTGUIDES = [
  'AI-first culture driving military training transformation',
  'Proven military footprint with startup agility',
  'Direct impact on warfighter readiness and performance',
  'Work with the newest military systems and technology',
];

export const JOB_DESCRIPTION_FULL = `StartGuides is redefining how America's frontline forces learn to operate and maintain the most advanced military equipment. We have a proven footprint across the military ecosystem, yet we operate with the agility and mindset of a startup. At the same time, we lead with an AI‑first culture, driving transformation in how knowledge is captured, designed, and delivered. As an Application Content Engineer, you'll step into a role that blends fieldwork, technology, and creativity working directly with cutting-edge systems and the people who rely on them in high-stakes environments.

This isn't a back-office documentation job. You'll climb onto vehicles, power up systems, and sit shoulder-to-shoulder with operators and experts to capture knowledge firsthand. Then you'll transform that complexity into intuitive, AI-powered, step-by-step applications that make the difference between confusion and confidence in the field.

You'll own the process from discovery through delivery, balancing independence with collaboration across multiple projects. If you're mission-driven, eager to learn fast, and excited to master both advanced equipment and modern digital tools, this is your opportunity to contribute directly to how America's warfighters train, learn, and perform.`;
