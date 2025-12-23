import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuiz, submitQuiz } from "../../redux/slice/quizSlice";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  CircularProgress,
} from "@mui/material";

export const Quiz = () => {
  const dispatch = useDispatch();
  const { questions, loading, result } = useSelector((state) => state.quiz);
  const [answers, setAnswers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    dispatch(fetchQuiz());
  }, [dispatch]);

  const handleSelect = (qid, opt) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== qid);
      return [...filtered, { questionId: qid, selected: opt }];
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    dispatch(
      submitQuiz({
        answers,
      })
    );
  };

  if (loading) return <CircularProgress />;

  if (result) {
    return (
      <Box>
        <Typography variant="h4">Result</Typography>
        <Typography variant="h6">
          Score: {result.score} / {result.total}
        </Typography>
      </Box>
    );
  }

  if (!questions.length) return <Typography>No questions available</Typography>;

  const question = questions[currentStep];

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <Typography variant="h6">
        Question {currentStep + 1} of {questions.length}
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
        {question.question}
      </Typography>
      <RadioGroup
        value={
          answers.find((a) => a.questionId === question.id)?.selected || ""
        }
        onChange={(e) => handleSelect(question.id, e.target.value)}
      >
        {question.options.map((opt) => (
          <FormControlLabel
            key={opt}
            value={opt}
            control={<Radio />}
            label={opt}
          />
        ))}
      </RadioGroup>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="contained"
          disabled={currentStep === 0}
          onClick={handlePrev}
        >
          Previous
        </Button>

        {currentStep < questions.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Box>
    </Box>
  );
};
