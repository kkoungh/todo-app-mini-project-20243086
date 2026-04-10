require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Todo = require('./models/Todo');

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set.');
  }

  cachedConnection = mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'todoDB'
  });

  return cachedConnection;
}

router.get('/health', async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ ok: true, message: 'Server is running.' });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.get('/todos', async (req, res) => {
  try {
    await connectToDatabase();
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos.' });
  }
});

router.post('/todos', async (req, res) => {
  try {
    await connectToDatabase();

    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const todo = await Todo.create({ title });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create todo.' });
  }
});

router.put('/todos/:id', async (req, res) => {
  try {
    await connectToDatabase();

    const update = {};

    if (typeof req.body.title === 'string') {
      const title = req.body.title.trim();
      if (!title) {
        return res.status(400).json({ message: 'Title cannot be empty.' });
      }
      update.title = title;
    }

    if (typeof req.body.completed === 'boolean') {
      update.completed = req.body.completed;
    }

    const todo = await Todo.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update todo.' });
  }
});

router.post('/todos/:id/toggle', async (req, res) => {
  try {
    await connectToDatabase();

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle todo.' });
  }
});

router.delete('/todos/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    res.json({ message: 'Todo deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo.' });
  }
});

router.post('/todos/:id/delete', async (req, res) => {
  try {
    await connectToDatabase();
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    res.json({ message: 'Todo deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo.' });
  }
});

app.use('/api', router);
app.use('/', router);

if (process.env.NODE_ENV !== 'production') {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Database connection failed:', error.message);
      process.exit(1);
    });
}

module.exports = app;
