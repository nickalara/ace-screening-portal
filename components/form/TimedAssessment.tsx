'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

export interface TimedQuestion {
  id: string;
  part: 'A' | 'B';
  questionNumber: number;
  text: string;
  imageSrc: string;
  minWords: number;
  maxWords: number;
  timeLimit: number; // in seconds
}

interface TimedAssessmentProps {
  questions: TimedQuestion[];
  onComplete: (responses: Record<string, string>) => void;
  onClose: () => void;
}

export function TimedAssessment({ questions, onComplete, onClose }: TimedAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(questions[0]?.timeLimit || 90);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Count words in text
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = countWords(currentAnswer);
  const meetsMinimum = wordCount >= currentQuestion?.minWords;
  const exceedsMaximum = wordCount > currentQuestion?.maxWords;

  const handleNextQuestion = useCallback((forceNext: boolean = false) => {
    // Save current answer
    const updatedResponses = {
      ...responses,
      [currentQuestion.id]: currentAnswer
    };
    setResponses(updatedResponses);

    // Check if this was the last question
    if (currentQuestionIndex >= questions.length - 1) {
      setIsComplete(true);
      onComplete(updatedResponses);
      return;
    }

    // Move to next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setCurrentAnswer('');
    setTimeRemaining(questions[currentQuestionIndex + 1]?.timeLimit || 90);
  }, [currentQuestionIndex, currentAnswer, responses, questions, onComplete, currentQuestion]);

  // Timer effect
  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - save current answer and move to next
          handleNextQuestion(true);
          return currentQuestion?.timeLimit || 90;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isComplete, handleNextQuestion, currentQuestion?.timeLimit]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentAnswer(e.target.value);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return null;
  }

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Assessment Complete</h2>
          <p className="text-slate-600 mb-6">
            Thank you for completing the timed assessment. Your responses have been saved.
          </p>
          <Button onClick={onClose} variant="primary" className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full my-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Part {currentQuestion.part}: Question {currentQuestion.questionNumber}
            </h2>
            <div className={`text-lg font-mono font-semibold ${timeRemaining <= 30 ? 'text-red-600' : 'text-slate-700'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="text-sm text-slate-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Image */}
        <div className="mb-6">
          <img
            src={currentQuestion.imageSrc}
            alt={`Question ${currentQuestionIndex + 1} reference`}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-lg text-slate-900 mb-2">{currentQuestion.text}</p>
          <p className="text-sm text-slate-600">
            ({currentQuestion.minWords}-{currentQuestion.maxWords} words)
          </p>
        </div>

        {/* Answer input */}
        <div className="mb-4">
          <Textarea
            label="Your Answer"
            value={currentAnswer}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
            rows={8}
            className="w-full"
          />
          <div className="flex justify-between items-center mt-2">
            <div className={`text-sm ${
              exceedsMaximum ? 'text-red-600' :
              meetsMinimum ? 'text-green-600' :
              'text-slate-600'
            }`}>
              Word count: {wordCount} / {currentQuestion.maxWords}
              {wordCount < currentQuestion.minWords && ` (minimum ${currentQuestion.minWords})`}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => handleNextQuestion(false)}
            variant="primary"
            disabled={!meetsMinimum || exceedsMaximum}
            className="px-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
