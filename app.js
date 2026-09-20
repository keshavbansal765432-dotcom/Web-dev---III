const express = require("express");
const studentRoutes = require("./routes/studentRoutes");
const requestLogger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    message: "Student Record API is running",
    endpoints: "/api/students"
  });
});

app.use("/api/students", studentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested route does not exist"
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server"
  });
});

app.listen(PORT, () => {
  console.log(`Student Record API started on port ${PORT}`);
});
