# Tasks REST API

A REST API built with Node.js, Express and PostgreSQL. Supports full CRUD 
operations for managing tasks. The whole thing runs in Docker so you don't 
need to install anything locally except Docker itself.

Built this to get a solid understanding of how REST APIs work under the hood —
routing, database connections, request/response cycles, the lot.

## Tech Stack

- Node.js + Express
- PostgreSQL
- Docker + Docker Compose

## Getting Started

Clone the repo:
```bash
git clone https://github.com/yourusername/rest-api-crud.git
cd rest-api-crud
```

Copy the environment file and fill in your values (or just leave them as 
is if you're running locally with Docker):
```bash
cp .env.example .env
```

Start everything with Docker:
```bash
docker-compose up --build
```

That's it. The API will be running on http://localhost:3000 and the database 
gets created automatically.

## API Endpoints

### Get all tasks
```
GET /tasks
```

Response:
```json
[
  {
    "id": 1,
    "title": "Buy milk",
    "done": false
  }
]
```

---

### Get a single task
```
GET /tasks/:id
```

Response:
```json
{
  "id": 1,
  "title": "Buy milk",
  "done": false
}
```

---

### Create a task
```
POST /tasks
```

Body:
```json
{
  "title": "Buy milk"
}
```

Response:
```json
{
  "id": 1,
  "title": "Buy milk",
  "done": false
}
```

---

### Update a task
```
PUT /tasks/:id
```

Body (send one or both fields):
```json
{
  "title": "Buy bread",
  "done": true
}
```

Response:
```json
{
  "id": 1,
  "title": "Buy bread",
  "done": true
}
```

---

### Delete a task
```
DELETE /tasks/:id
```

Response:
```json
{
  "message": "Task deleted successfully"
}
```

## Project Structure
```
├── database/
│   └── init.sql         # creates the tasks table on first run
├── src/
│   ├── controllers/
│   │   └── tasks.js     # logic for each route
│   ├── routes/
│   │   └── tasks.js     # route definitions
│   ├── db.js            # database connection
│   └── index.js         # entry point
├── .env.example
├── docker-compose.yml
└── Dockerfile
```

## Running Without Docker

If you'd rather run it locally without Docker you'll need Node.js and 
PostgreSQL installed. Update the `.env` file with your local PostgreSQL 
credentials then:
```bash
npm install
npm run dev
```