const pool = require('../db');

const parseTaskId = (id) => {
  const taskId = Number.parseInt(id, 10);
  return Number.isInteger(taskId) && taskId > 0 ? taskId : null;
};

const validateTitle = (title) => {
  if (title === undefined) {
    return { valid: true };
  }

  if (typeof title !== 'string') {
    return { valid: false, message: 'Title must be a string' };
  }

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return { valid: false, message: 'Title cannot be empty' };
  }

  return { valid: true, value: trimmedTitle };
};

const validateDone = (done) => {
  if (done === undefined) {
    return { valid: true };
  }

  if (typeof done !== 'boolean') {
    return { valid: false, message: 'Done must be a boolean' };
  }

  return { valid: true, value: done };
};

const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const titleValidation = validateTitle(title);

    if (title === undefined) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!titleValidation.valid) {
      return res.status(400).json({ message: titleValidation.message });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [titleValidation.value]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseTaskId(id);

    if (!taskId) {
      return res.status(400).json({ message: 'Task id must be a positive integer' });
    }

    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, done } = req.body;
    const taskId = parseTaskId(id);
    const titleValidation = validateTitle(title);
    const doneValidation = validateDone(done);

    if (!taskId) {
      return res.status(400).json({ message: 'Task id must be a positive integer' });
    }

    if (!title && done === undefined) {
      return res.status(400).json({ message: 'Title or done is required' });
    }

    if (!titleValidation.valid) {
      return res.status(400).json({ message: titleValidation.message });
    }

    if (!doneValidation.valid) {
      return res.status(400).json({ message: doneValidation.message });
    }

    const existing = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [taskId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTitle = titleValidation.value ?? existing.rows[0].title;
    const updatedDone = doneValidation.value ?? existing.rows[0].done;

    const result = await pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
      [updatedTitle, updatedDone, taskId]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseTaskId(id);

    if (!taskId) {
      return res.status(400).json({ message: 'Task id must be a positive integer' });
    }

    const existing = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [taskId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await pool.query(
      'DELETE FROM tasks WHERE id = $1',
      [taskId]
    );

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTasks, createTask, getTaskById, updateTask, deleteTask };
