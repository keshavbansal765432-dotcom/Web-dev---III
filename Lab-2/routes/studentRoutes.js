const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  findStudent,
  addStudent,
  replaceStudent,
  updateStudent,
  removeStudent
} = require("../data/student");

const validateStudent = require("../middleware/validateStudent");

// GET /api/students
// Optional filter: /api/students?course=BCA
router.get("/", (req, res) => {
  let records = [...getAllStudents()];

  if (req.query.course) {
    const wantedCourse = req.query.course.trim().toLowerCase();
    records = records.filter(
      student => student.course.toLowerCase() === wantedCourse
    );
  }

  if (req.query.search) {
    const keyword = req.query.search.trim().toLowerCase();
    records = records.filter(student =>
      student.name.toLowerCase().includes(keyword)
    );
  }

  res.json({
    success: true,
    count: records.length,
    data: records
  });
});

// GET /api/students/:id
router.get("/:id", (req, res) => {
  const student = findStudent(req.params.id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  res.json({
    success: true,
    data: student
  });
});

// POST /api/students
router.post("/", validateStudent, (req, res) => {
  const duplicateEmail = getAllStudents().some(
    student => student.email.toLowerCase() === req.body.email.toLowerCase()
  );

  if (duplicateEmail) {
    return res.status(409).json({
      success: false,
      message: "A student with this email already exists"
    });
  }

  const student = addStudent(req.body);

  res.status(201).json({
    success: true,
    message: "Student added successfully",
    data: student
  });
});

// PUT /api/students/:id
router.put("/:id", validateStudent, (req, res) => {
  if (!findStudent(req.params.id)) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  const student = replaceStudent(req.params.id, req.body);

  res.json({
    success: true,
    message: "Student details replaced successfully",
    data: student
  });
});

// PATCH /api/students/:id
router.patch("/:id", (req, res) => {
  const existing = findStudent(req.params.id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  const allowed = ["name", "age", "course", "email"];
  const changes = {};

  for (const field of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      changes[field] = req.body[field];
    }
  }

  if (!Object.keys(changes).length) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one valid field to update"
    });
  }

  if (changes.age !== undefined) {
    changes.age = Number(changes.age);
    if (!Number.isInteger(changes.age) || changes.age < 16 || changes.age > 100) {
      return res.status(400).json({
        success: false,
        message: "Age must be a valid number between 16 and 100"
      });
    }
  }

  if (changes.name !== undefined) changes.name = String(changes.name).trim();
  if (changes.course !== undefined) changes.course = String(changes.course).trim();
  if (changes.email !== undefined) changes.email = String(changes.email).trim().toLowerCase();

  const updated = updateStudent(req.params.id, changes);

  res.json({
    success: true,
    message: "Student updated successfully",
    data: updated
  });
});

// DELETE /api/students/:id
router.delete("/:id", (req, res) => {
  const deleted = removeStudent(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  res.json({
    success: true,
    message: "Student deleted successfully",
    data: deleted
  });
});

module.exports = router;
