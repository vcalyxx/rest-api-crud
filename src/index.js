const express = require("express");
const dotenv = require("dotenv");
require('./db');

dotenv.config();

const app = express();

app.use(express.json());

const taskRoutes = require('./routes/tasks');

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
