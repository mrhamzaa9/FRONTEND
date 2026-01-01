import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuiz, fetchTeacherQuizzes } from "../../redux/slice/quizSlice";
import { Box, Button, TextField, MenuItem, Typography, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { fetchSchoolsWithCourses } from "../../redux/slice/schoolSlice";

const Quiztech = () => {
  const dispatch = useDispatch();
  const { approved: schools } = useSelector((state) => state.school);
  const { teacherQuizzes, loading } = useSelector((state) => state.quiz);

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  useEffect(() => {
    dispatch(fetchTeacherQuizzes()).catch((err) => Swal.fire("Error", err, "error"));
    dispatch(fetchSchoolsWithCourses());
  }, [dispatch]);

  if (loading) return <Spinner />;

  if (!schools || schools.length === 0)
    return <p className="text-red-500 text-center mt-10">⛔ You cannot create quiz until approved by school.</p>;

  const handleGenerate = () => {
    if (!topic.trim()) return Swal.fire("Error", "Topic is required", "error");

    dispatch(fetchQuiz({ topic, difficulty }))
      .unwrap()
      .then((res) => {
        Swal.fire("Success", `Quiz generated! Quiz ID: ${res.quizId}`, "success");
        dispatch(fetchTeacherQuizzes()).catch((err) => Swal.fire("Error", err, "error"));
      })
      .catch((err) => Swal.fire("Error", err, "error"));
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography className="text-yellow-500" variant="h5" sx={{ mb: 2,  }}>Generate Quiz</Typography>

      <TextField label="Topic" fullWidth margin="normal" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <TextField select label="Difficulty" fullWidth margin="normal" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <MenuItem value="easy">Easy</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="hard">Hard</MenuItem>
      </TextField>

      <button className="bg-amber-500 p-2 hover:bg-amber-600 w-full text-white rounded-xl" variant="contained" onClick={handleGenerate} disabled={loading} sx={{ mt: 2 }}>
        {loading ? <CircularProgress size={24} /> : "Generate Quiz"}
      </button>

      {teacherQuizzes.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography  className="text-yellow-500"variant="h6">Your Quizzes</Typography>
          {teacherQuizzes.map((q) => (
            <Box key={q._id} sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mt: 2 }}>
              <Typography><strong>{q.topic}</strong> - {q.difficulty}</Typography>
              <Typography>Total Questions: {q.totalQuestions}</Typography>
              <Typography>Status: {q.isActive ? "Active" : "Inactive"}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Quiztech;
