import React, { useState } from 'react';

interface QuizFormProps {
  onClose: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ onClose }) => {
  const [answers, setAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, question: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: event.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quiz answers:', answers);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Training Quiz</h2>
          <button
            onClick={onClose}
            className="ml-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>

        <form className="p-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="question1" className="block text-gray-700 dark:text-gray-300">
              Question 1: What is React?
            </label>
            <input
              type="text"
              id="question1"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded mt-2"
              value={answers.question1}
              onChange={(e) => handleChange(e, 'question1')}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="question2" className="block text-gray-700 dark:text-gray-300">
              Question 2: What is JSX?
            </label>
            <input
              type="text"
              id="question2"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded mt-2"
              value={answers.question2}
              onChange={(e) => handleChange(e, 'question2')}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="question3" className="block text-gray-700 dark:text-gray-300">
              Question 3: How do you handle state in React?
            </label>
            <input
              type="text"
              id="question3"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded mt-2"
              value={answers.question3}
              onChange={(e) => handleChange(e, 'question3')}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-600"
          >
            Submit Answers
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
