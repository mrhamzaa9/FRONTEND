import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuiz,
  submitQuiz,
  resetQuiz,
  fetchStudentQuizzes,
} from "../../redux/slice/quizSlice";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";

export const Quiz = () => {
  const dispatch = useDispatch();

  const { questions, studentQuizzes, quizId, loading, result, error } =
    useSelector((state) => state.quiz);
  const { enrolledCourses } = useSelector((state) => state.student);

  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [answers, setAnswers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);

  // Fetch quizzes for the student
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      dispatch(fetchStudentQuizzes())
        .unwrap()
        .catch((err) => Swal.fire("Error", err, "error"));
    }
  }, [dispatch, enrolledCourses]);

  // Reset quiz when new questions arrive
  useEffect(() => {
    if (questions.length > 0) {
      setStarted(true);
      setCurrentStep(0);
      setAnswers([]);
    }
  }, [questions]);

  // Show backend error
  useEffect(() => {
    if (error) Swal.fire("Error", error, "error");
  }, [error]);

  // Start quiz
  const startQuiz = () => {
    if (!selectedQuiz)
      return Swal.fire("Error", "Please select a quiz", "error");

    dispatch(fetchQuiz({ quizId: selectedQuiz }))
      .unwrap()
      .then(() => setStarted(true))
      .catch((err) => Swal.fire("Error", err, "error"));
  };

  // Handle answer selection
  const handleSelect = (qid, value) => {
    setAnswers((prev) => {
      const others = prev.filter((a) => a.questionId !== qid);
      return [...others, { questionId: qid, selected: value }];
    });
  };

  // Submit quiz
  const handleSubmit = () => {
    if (answers.length !== questions.length)
      return Swal.fire("Error", "Answer all questions", "error");

    dispatch(submitQuiz({ quizId, answers }));
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Quiz result view
  if (result) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h4">Result</Typography>
        <Typography variant="h6">
          Score: {result.correct} / {result.total}
        </Typography>
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => {
            dispatch(resetQuiz());
            setSelectedQuiz("");
            setStarted(false);
          }}
        >
          Take Another Quiz
        </Button>
      </Box>
    );
  }

  // Quiz selection before start
  if (!started) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Select a Quiz
        </Typography>

        {enrolledCourses.length === 0 ? (
          <Typography color="error">
            You are not enrolled in any course. Enroll to see available quizzes.
          </Typography>
        ) : studentQuizzes.length === 0 ? (
          <Typography color="textSecondary">
            No quizzes available for your enrolled courses.
          </Typography>
        ) : (
          <>
            <TextField
              select
              fullWidth
              label="Available Quizzes"
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
            >
              {studentQuizzes.map((q) => (
                <MenuItem key={q._id} value={q._id}>
                  {q.topic} - {q.difficulty}
                </MenuItem>
              ))}
            </TextField>

            <Button
              sx={{ mt: 3 }}
              variant="contained"
              fullWidth
              onClick={startQuiz}
              disabled={!selectedQuiz}
            >
              Start Quiz
            </Button>
          </>
        )}
      </Box>
    );
  }

  // Multi-step quiz view
  const currentQuestion = questions[currentStep];
  const selectedAnswer =
    answers.find((a) => a.questionId === currentQuestion.id)?.selected || "";

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h6">
        Question {currentStep + 1} of {questions.length}
      </Typography>

      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        {currentQuestion.question}
      </Typography>

      <RadioGroup
        value={selectedAnswer}
        onChange={(e) => handleSelect(currentQuestion.id, e.target.value)}
      >
        {currentQuestion.options.map((opt) => (
          <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
        ))}
      </RadioGroup>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="outlined"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          Previous
        </Button>

        {currentStep < questions.length - 1 ? (
          <Button
            variant="contained"
            disabled={!selectedAnswer}
            onClick={() => setCurrentStep((prev) => prev + 1)}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled={answers.length !== questions.length}
            onClick={handleSubmit}
          >
            Submit Quiz
          </Button>
        )}
      </Box>
    </Box>
  );
};
