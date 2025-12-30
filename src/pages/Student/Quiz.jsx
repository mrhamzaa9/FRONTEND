import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  fetchQuiz,
  submitQuiz,
  resetQuiz,
  fetchStudentQuizzes,
} from "../../redux/slice/quizSlice";
import { Spinner } from "react-bootstrap";

export const Quiz = () => {
  const dispatch = useDispatch();
  const { questions, studentQuizzes, quizId, loading, result, error } = useSelector((state) => state.quiz);
  const { enrolledCourses } = useSelector((state) => state.student);

  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [answers, setAnswers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      dispatch(fetchStudentQuizzes()).unwrap().catch((err) => Swal.fire("Error", err, "error"));
    }
  }, [dispatch, enrolledCourses]);

  useEffect(() => {
    if (questions.length > 0) {
      setStarted(true);
      setCurrentStep(0);
      setAnswers([]);
    }
  }, [questions]);

  useEffect(() => { if (error) Swal.fire("Error", error, "error"); }, [error]);

  const startQuiz = () => {
    if (!selectedQuiz) return Swal.fire("Error", "Please select a quiz", "error");
    dispatch(fetchQuiz({ quizId: selectedQuiz })).unwrap()
      .then(() => setStarted(true))
      .catch((err) => Swal.fire("Error", err, "error"));
  };

  const handleSelect = (qid, value) => {
    setAnswers((prev) => {
      const others = prev.filter((a) => a.questionId !== qid);
      return [...others, { questionId: qid, selected: value }];
    });
  };

  const handleSubmit = () => {
    if (answers.length !== questions.length) return Swal.fire("Error", "Answer all questions", "error");
    dispatch(submitQuiz({ quizId, answers }));
  };

  // Loading
  if (loading) return <div className="text-center mt-8"><Spinner /></div>;

  // Quiz result
  if (result) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-amber-50 rounded-2xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-amber-700 mb-4">Quiz Result</h2>
        <p className="text-lg mb-2">Score: <span className="font-semibold text-blue-600">{result.correct}</span> / {result.total}</p>
        <button
          className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition cursor-pointer"
          onClick={() => { dispatch(resetQuiz()); setSelectedQuiz(""); setStarted(false); }}
        >
          Take Another Quiz
        </button>
      </div>
    );
  }

  // Quiz selection
  if (!started) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-amber-50 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-amber-700 mb-4">Select a Quiz</h2>
        {enrolledCourses.length === 0 ? (
          <p className="text-red-600">You are not enrolled in any course.</p>
        ) : studentQuizzes.length === 0 ? (
          <p className="text-gray-700">No quizzes available for your courses.</p>
        ) : (
          <>
            <select
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
            >
              <option value="">-- Select Quiz --</option>
              {studentQuizzes.map((q) => (
                <option key={q._id} value={q._id}>{q.topic} - {q.difficulty}</option>
              ))}
            </select>
            <button
              onClick={startQuiz}
              disabled={!selectedQuiz}
              className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition cursor-pointer disabled:bg-amber-300"
            >
              Start Quiz
            </button>
          </>
        )}
      </div>
    );
  }

  // Quiz questions
  const currentQuestion = questions[currentStep];
  const selectedAnswer = answers.find((a) => a.questionId === currentQuestion.id)?.selected || "";

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-amber-50 rounded-2xl border-amber-200 shadow-md">
      <h3 className="text-lg font-semibold text-amber-700 mb-2">
        Question {currentStep + 1} of {questions.length}
      </h3>
      <p className="text-gray-800 mb-4">{currentQuestion.question}</p>
      <div className="flex flex-col gap-2">
        {currentQuestion.options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 p-2 border rounded-md hover:bg-amber-100 cursor-pointer transition">
            <input
              type="radio"
              value={opt}
              checked={selectedAnswer === opt}
              onChange={() => handleSelect(currentQuestion.id, opt)}
            />
            {opt}
          </label>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl transition disabled:opacity-50"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(prev => prev - 1)}
        >
          Previous
        </button>
        {currentStep < questions.length - 1 ? (
          <button
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition disabled:opacity-50"
            disabled={!selectedAnswer}
            onClick={() => setCurrentStep(prev => prev + 1)}
          >
            Next
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50"
            disabled={answers.length !== questions.length}
            onClick={handleSubmit}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};
