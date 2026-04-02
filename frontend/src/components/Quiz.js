"use client";
import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Award } from 'lucide-react';
import { trackQuizResult } from '@/lib/analytics';

export default function Quiz({ quizData, contentId, onClose }) {
  const [currentStep, setCurrentStep] = useState(0); // 0: start, 1: quiz, 2: results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quizData[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.length - 1;

  const handleOptionSelect = (optionIndex) => {
    if (showFeedback) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: optionIndex });
    setShowFeedback(true);
    
    if (optionIndex === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setCurrentStep(2);
      trackQuizResult(contentId, score + (selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswerIndex ? 0 : 0), quizData.length);
      // Correction: Score is already updated in handleOptionSelect. 
      // But trackQuizResult should be called with the final score.
      trackQuizResult(contentId, score, quizData.length);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setScore(0);
  };

  if (currentStep === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-2xl mb-6">
          <Award className="h-10 w-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Chapter Quiz</h3>
        <p className="text-slate-500 mb-8 text-lg">Test your knowledge on this chapter with {quizData.length} questions.</p>
        <button 
          onClick={() => setCurrentStep(1)}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98]"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (currentStep === 2) {
    const percentage = Math.round((score / quizData.length) * 100);
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        <div className="mb-6">
           <div className={`inline-flex items-center justify-center p-6 rounded-full mb-4 ${percentage >= 70 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
              <span className="text-4xl font-black">{percentage}%</span>
           </div>
           <h3 className="text-2xl font-bold text-slate-900">Quiz Completed!</h3>
           <p className="text-slate-500 mt-2">You got {score} out of {quizData.length} questions correct.</p>
        </div>

        <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-slate-600 font-medium">Correct Answers</span>
                <span className="text-green-600 font-bold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" /> {score}
                </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-slate-600 font-medium">Wrong Answers</span>
                <span className="text-red-600 font-bold flex items-center gap-2">
                    <XCircle className="h-5 w-5" /> {quizData.length - score}
                </span>
            </div>
        </div>

        <div className="flex gap-4">
            <button 
                onClick={resetQuiz}
                className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
                <RotateCcw className="h-5 w-5" /> Retake
            </button>
            <button 
                onClick={onClose}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md"
            >
                Done
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
          Question {currentQuestionIndex + 1} of {quizData.length}
        </span>
        <div className="flex gap-1">
          {quizData.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 w-6 rounded-full transition-all ${idx === currentQuestionIndex ? 'bg-blue-600' : idx < currentQuestionIndex ? 'bg-blue-200' : 'bg-slate-100'}`}
            />
          ))}
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-8">{currentQuestion.question}</h3>

      <div className="space-y-4 mb-8">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedAnswers[currentQuestionIndex] === idx;
          const isCorrect = idx === currentQuestion.correctAnswerIndex;
          
          let stateStyles = "border-slate-200 hover:border-blue-400 hover:bg-blue-50";
          if (showFeedback) {
            if (isCorrect) stateStyles = "border-green-500 bg-green-50 ring-2 ring-green-100";
            else if (isSelected) stateStyles = "border-red-500 bg-red-50 ring-2 ring-red-100";
            else stateStyles = "border-slate-100 opacity-50";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              disabled={showFeedback}
              className={`w-full p-5 text-left border-2 rounded-2xl transition-all duration-200 flex items-center justify-between group ${stateStyles}`}
            >
              <span className={`font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{option}</span>
              {showFeedback && isCorrect && <CheckCircle className="h-6 w-6 text-green-600 animate-in zoom-in" />}
              {showFeedback && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-red-600 animate-in zoom-in" />}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 animate-in slide-in-from-bottom-4 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
