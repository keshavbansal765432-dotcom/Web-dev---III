let students = [
  {
    id: 1,
    name: "Aarav Sharma",
    age: 19,
    course: "BCA",
    email: "aarav@example.com"
  },
  {
    id: 2,
    name: "Priya Verma",
    age: 20,
    course: "B.Tech",
    email: "priya@example.com"
  },
  {
    id: 3,
    name: "Rohan Mehta",
    age: 18,
    course: "B.Sc",
    email: "rohan@example.com"
  }
];

function getAllStudents() {
  return students;
}

function findStudent(id) {
  return students.find(student => student.id === Number(id));
}

function addStudent(student) {
  const nextId = students.length
    ? Math.max(...students.map(item => item.id)) + 1
    : 1;

  const newStudent = { id: nextId, ...student };
  students.push(newStudent);
  return newStudent;
}

function replaceStudent(id, updatedStudent) {
  const index = students.findIndex(student => student.id === Number(id));

  if (index === -1) return null;

  students[index] = {
    id: Number(id),
    ...updatedStudent
  };

  return students[index];
}

function updateStudent(id, changes) {
  const index = students.findIndex(student => student.id === Number(id));

  if (index === -1) return null;

  students[index] = {
    ...students[index],
    ...changes,
    id: Number(id)
  };

  return students[index];
}

function removeStudent(id) {
  const index = students.findIndex(student => student.id === Number(id));

  if (index === -1) return null;

  return students.splice(index, 1)[0];
}

module.exports = {
  getAllStudents,
  findStudent,
  addStudent,
  replaceStudent,
  updateStudent,
  removeStudent
};
