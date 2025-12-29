import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuiz, submitQuiz, resetQuiz, fetchStudentQuizzes  } from "../../redux/slice/quizSlice";
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

  const { questions, teacherQuizzes, quizId, loading, result, error } = useSelector(
    (state) => state.quiz
  );

  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [answers, setAnswers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);

  // Fetch teacher-generated quizzes on mount
useEffect(() => {
  dispatch(fetchStudentQuizzes())
    .unwrap()
    .catch((err) => Swal.fire("Error", err, "error"));
}, [dispatch]);
  // Start quiz
  const startQuiz = () => {
    if (!selectedQuiz) return Swal.fire("Error", "Please select a quiz", "error");

    dispatch(fetchQuiz({ quizId: selectedQuiz }));
  };

  // Reset quiz when new questions arrive
  useEffect(() => {
    if (questions.length > 0) {
      setStarted(true);
      setCurrentStep(0);
      setAnswers([]);
    }
  }, [questions]);

  // Handle answer selection
  const handleSelect = (qid, value) => {
    setAnswers((prev) => {
      const others = prev.filter((a) => a.questionId !== qid);
      return [...others, { questionId: qid, selected: value }];
    });
  };

  // Submit quiz
  const handleSubmit = () => {
    if (answers.length !== questions.length) {
      return Swal.fire("Error", "Answer all questions", "error");
    }
    dispatch(submitQuiz({ quizId, answers }));
  };

  // Show backend error
  useEffect(() => {
    if (error) Swal.fire("Error", error, "error");
  }, [error]);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Quiz result
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
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Select a Quiz
        </Typography>

        <TextField
          select
          fullWidth
          label="Available Quizzes"
          value={selectedQuiz}
          onChange={(e) => setSelectedQuiz(e.target.value)}
        >
          {teacherQuizzes && teacherQuizzes.length > 0 ? (
            teacherQuizzes.map((q) => (
              <MenuItem key={q._id} value={q._id}>
                {q.topic} - {q.difficulty}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No quizzes available</MenuItem>
          )}
        </TextField>

        <Button
          sx={{ mt: 3 }}
          variant="contained"
          fullWidth
          onClick={startQuiz}
        >
          Start Quiz
        </Button>
      </Box>
    );
  }

  // Multi-step quiz view
  const currentQuestion = questions[currentStep];
  const selected = answers.find((a) => a.questionId === currentQuestion.id)?.selected || "";

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h6">
        Question {currentStep + 1} of {questions.length}
      </Typography>

      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        {currentQuestion.question}
      </Typography>

   <RadioGroup
  value={selected}
  onChange={(e) => handleSelect(currentQuestion.id, e.target.value)}
>
  {currentQuestion.options.map((opt) => (
    <FormControlLabel
      key={opt}
      value={opt}      // Send option text, not index
      control={<Radio />}
      label={opt}
    />
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
            disabled={!selected}
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


