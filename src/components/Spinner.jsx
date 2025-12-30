import { Box, CircularProgress } from "@mui/material";

export default function Spinner() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFBEB", // amber-50
      }}
    >
      <CircularProgress
        size={55}
        thickness={4.5}
        sx={{
          color: "#D97706", // amber-600
          boxShadow: "0 0 20px rgba(217, 119, 6, 0.25)",
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}
