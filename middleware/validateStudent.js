const allowedFields = ["name", "age", "course", "email"];

function validateStudent(req, res, next) {
  const body = req.body || {};

  if (typeof body.name !== "string" || body.name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name must contain at least 2 characters"
    });
  }

  const age = Number(body.age);
  if (!Number.isInteger(age) || age < 16 || age > 100) {
    return res.status(400).json({
      success: false,
      message: "Age must be a valid number between 16 and 100"
    });
  }

  if (typeof body.course !== "string" || !body.course.trim()) {
    return res.status(400).json({
      success: false,
      message: "Course is required"
    });
  }

  if (typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return res.status(400).json({
      success: false,
      message: "A valid email is required"
    });
  }

  const extraFields = Object.keys(body).filter(key => !allowedFields.includes(key));
  if (extraFields.length) {
    return res.status(400).json({
      success: false,
      message: `Unknown field(s): ${extraFields.join(", ")}`
    });
  }

  req.body = {
    name: body.name.trim(),
    age,
    course: body.course.trim(),
    email: body.email.trim().toLowerCase()
  };

  next();
}

module.exports = validateStudent;
