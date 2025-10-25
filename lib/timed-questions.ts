import { TimedQuestion } from '@/components/form/TimedAssessment';

// Placeholder cat images from Lorem Picsum (can be replaced with actual images later)
const PLACEHOLDER_IMAGES = [
  'https://placekitten.com/800/600?image=1',
  'https://placekitten.com/800/600?image=2',
  'https://placekitten.com/800/600?image=3',
  'https://placekitten.com/800/600?image=4',
];

export const TIMED_ASSESSMENT_QUESTIONS: TimedQuestion[] = [
  // Part A: Product Judgment - Question 1
  {
    id: 'timed_part_a_q1',
    part: 'A',
    questionNumber: 1,
    text: 'Which one would be clearer to a new soldier in the field? Why?',
    imageSrc: PLACEHOLDER_IMAGES[0],
    minWords: 50,
    maxWords: 100,
    timeLimit: 90, // 90 seconds
  },
  // Part A: Product Judgment - Question 2
  {
    id: 'timed_part_a_q2',
    part: 'A',
    questionNumber: 2,
    text: 'Which one would be clearer to a new soldier in the field? Why?',
    imageSrc: PLACEHOLDER_IMAGES[1],
    minWords: 50,
    maxWords: 100,
    timeLimit: 90,
  },
  // Part B: Design Eye - Question 1
  {
    id: 'timed_part_b_q1',
    part: 'B',
    questionNumber: 1,
    text: 'Give three specific changes you\'d make to improve clarity for the user.',
    imageSrc: PLACEHOLDER_IMAGES[2],
    minWords: 50,
    maxWords: 150,
    timeLimit: 90,
  },
  // Part B: Design Eye - Question 2
  {
    id: 'timed_part_b_q2',
    part: 'B',
    questionNumber: 2,
    text: 'Give three specific changes you\'d make to improve clarity for the user.',
    imageSrc: PLACEHOLDER_IMAGES[3],
    minWords: 50,
    maxWords: 150,
    timeLimit: 90,
  },
];
