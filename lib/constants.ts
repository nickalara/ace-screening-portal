import { ScreeningQuestion, QuestionSection } from './types';

// Screening Questions organized by section from ACE Role Assessment
export const SCREENING_SECTIONS: QuestionSection[] = [
  {
    id: 'section_1',
    title: 'Section 1: Role Fit & Mindset',
    sectionNumber: 1,
    estimatedMinutes: 5,
    questions: [
      {
        id: 'q1_motivation',
        questionNumber: 1,
        label: 'Why are you interested in the ACE role at StartGuides?',
        type: 'textarea',
        required: true,
        placeholder: 'Share what motivates you about this opportunity...',
        helperText: '100-200 words',
        validation: {
          minLength: 100,
          errorMessage: 'Please provide at least 100 characters',
        },
        category: 'motivation',
        section: 'section_1',
        sectionNumber: 1,
      },
      
      {
        id: 'q2_travel_willingness',
        questionNumber: 2,
        label: 'This role involves periods of travel up to 40%. How do you feel about that?',
        type: 'radio',
        required: true,
        options: [
          {
            label: 'I prefer fully remote work',
            value: 'prefer_remote',
          },
          {
            label: 'Occasional travel (under 10%) is okay',
            value: 'occasional_travel',
          },
          {
            label: 'Comfortable traveling frequently if it supports mission and learning',
            value: 'comfortable_frequent',
          },
          {
            label: 'Prefer to stay local',
            value: 'prefer_local',
          },
        ],
        category: 'travel',
        section: 'section_1',
        sectionNumber: 1,
      },
      {
        id: 'q3_technical_learning',
        questionNumber: 3,
        label: 'Describe a time you had to learn a complex system or process quickly. What did you do?',
        type: 'textarea',
        required: true,
        placeholder: 'Share a specific example with details about your learning approach...',
        validation: {
          minLength: 75,
          errorMessage: 'Please provide at least 75 characters',
        },
        category: 'technical_learning',
        section: 'section_1',
        sectionNumber: 1,
      },
    ],
  },
  {
    id: 'section_2',
    title: 'Section 2: Technical & AI Fluency',
    sectionNumber: 2,
    estimatedMinutes: 7,
    questions: [
      {
        id: 'q4_ai_tools_proficiency',
        questionNumber: 1,
        label: 'Which of these tools have you used? (check all that apply)',
        type: 'checkbox',
        required: true,
        options: [
          {
            label: 'ChatGPT or other LLM tools',
            value: 'llm_tools',
          },
          {
            label: 'Zapier / n8n / Make (Integromat)',
            value: 'automation_tools',
          },
          {
            label: 'Figma or similar design software',
            value: 'design_software',
          },
          {
            label: 'Python, JavaScript, or other scripting',
            value: 'scripting',
          },
          {
            label: 'None of the above',
            value: 'none',
          },
        ],
        category: 'ai_proficiency',
        section: 'section_2',
        sectionNumber: 2,
      },
      {
        id: 'q5_manual_to_app',
        questionNumber: 2,
        label: 'Scenario: You\'re asked to turn a 30-page technical manual into a digital, step-by-step app. What three things do you do first?',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your approach...',
        validation: {
          minLength: 75,
          errorMessage: 'Please provide at least 75 characters',
        },
        category: 'technical_fluency',
        section: 'section_2',
        sectionNumber: 2,
      },
      {
        id: 'q6_ai_prompt_judgment',
        questionNumber: 3,
        label: 'AI prompt judgment question: Which of these prompts would likely produce the best structured step-by-step guide from a technical manual?',
        type: 'radio',
        required: true,
        options: [
          {
            label: 'Summarize this manual.',
            value: 'summarize',
          },
          {
            label: 'Convert this technical procedure into clear, numbered steps with tool names and safety warnings preserved.',
            value: 'structured_steps',
          },
          {
            label: 'Explain this like I\'m five.',
            value: 'explain_simple',
          },
          {
            label: 'Make this manual shorter.',
            value: 'make_shorter',
          },
        ],
        category: 'ai_proficiency',
        section: 'section_2',
        sectionNumber: 2,
      },
    ],
  },
  {
    id: 'section_3',
    title: 'Section 3: Communication & Translation Skill',
    sectionNumber: 3,
    estimatedMinutes: 7,
    questions: [
      {
        id: 'q7_technical_rewrite',
        questionNumber: 1,
        label: 'Rewrite this statement for a non-technical user: "Before initiating the BIT (Built-In Test), ensure the hydraulic accumulator is charged to 2800 psi ±100 psi and that the data bus has completed handshake with the central processor."',
        type: 'textarea',
        required: true,
        placeholder: 'Your simplified version...',
        validation: {
          minLength: 50,
          errorMessage: 'Please provide at least 50 characters',
        },
        category: 'communication',
        section: 'section_3',
        sectionNumber: 3,
      },
      {
        id: 'q8_clarity_judgment',
        questionNumber: 2,
        label: 'Short writing test: Which of these sentences is clearest for an operator?',
        type: 'radio',
        required: true,
        options: [
          {
            label: 'Verify accumulator pressurization prior to BIT initiation.',
            value: 'option_a',
          },
          {
            label: 'Check pressure before starting the test.',
            value: 'option_b',
          },
          {
            label: 'Ensure accumulator has achieved optimal pre-BIT pressure.',
            value: 'option_c',
          },
          {
            label: 'Pressurize system in accordance with BIT sequence.',
            value: 'option_d',
          },
        ],
        category: 'communication',
        section: 'section_3',
        sectionNumber: 3,
      },
    ],
  },
  {
    id: 'section_4',
    title: 'Section 4: Field & Military Awareness',
    sectionNumber: 4,
    estimatedMinutes: 5,
    questions: [
      {
        id: 'q9_field_scenario',
        questionNumber: 1,
        label: 'You\'re onsite collecting data about a new vehicle system, but the operator is busy. What do you do?',
        type: 'radio',
        required: true,
        options: [
          {
            label: 'Wait until you\'re told what to do',
            value: 'wait',
          },
          {
            label: 'Politely ask when you can observe or request time with another qualified person',
            value: 'ask_politely',
          },
          {
            label: 'Try to figure it out from manuals only',
            value: 'use_manuals',
          },
          {
            label: 'Leave and document that data was unavailable',
            value: 'leave_document',
          },
        ],
        category: 'field_work',
        section: 'section_4',
        sectionNumber: 4,
      },
      {
        id: 'q10_safety_scenario',
        questionNumber: 2,
        label: 'Scenario: You\'re climbing onto a vehicle to photograph components, and you realize your safety gear is missing. What do you do?',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your action...',
        validation: {
          minLength: 50,
          errorMessage: 'Please provide at least 50 characters',
        },
        category: 'field_work',
        section: 'section_4',
        sectionNumber: 4,
      },
    ],
  },
];

// Flatten sections into legacy flat array for backward compatibility
export const SCREENING_QUESTIONS: ScreeningQuestion[] = SCREENING_SECTIONS.flatMap(section => section.questions);

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
