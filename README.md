# Student Record REST API — Lab 2

A simple REST API built with Node.js and Express for managing student records.

## Features

- View all students
- Find a student by ID
- Add a new student
- Replace a complete student record
- Partially update a student
- Delete a student
- Filter students by course
- Search students by name
- Basic request logging
- Input validation
- JSON responses with HTTP status codes

## Setup

```bash
npm install
npm start
```

The server runs on:

```text
http://localhost:3000
```

## API routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | List students |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Add student |
| PUT | `/api/students/:id` | Replace student |
| PATCH | `/api/students/:id` | Partially update |
| DELETE | `/api/students/:id` | Delete student |

## Example POST body

```json
{
  "name": "Neha Kapoor",
  "age": 19,
  "course": "BCA",
  "email": "neha@example.com"
}
```

## Filtering

```text
/api/students?course=BCA
/api/students?search=neha
```

The project intentionally keeps data in memory, so restarting the server resets the sample records.
