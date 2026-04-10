require('dotenv').config();

const Todo = require('../backend/models/Todo');
const { connectToDatabase } = require('../backend/db');

module.exports = async (req, res) => {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const todos = await Todo.find().sort({ createdAt: -1 });
      return res.status(200).json(todos);
    }

    if (req.method === 'POST') {
      const { action, id, title } = req.body || {};

      if (action === 'toggle') {
        const todo = await Todo.findById(id);

        if (!todo) {
          return res.status(404).json({ message: 'Todo not found.' });
        }

        todo.completed = !todo.completed;
        await todo.save();

        return res.status(200).json(todo);
      }

      if (action === 'delete') {
        const todo = await Todo.findByIdAndDelete(id);

        if (!todo) {
          return res.status(404).json({ message: 'Todo not found.' });
        }

        return res.status(200).json({ message: 'Todo deleted successfully.', id });
      }

      const normalizedTitle = typeof title === 'string' ? title.trim() : '';

      if (!normalizedTitle) {
        return res.status(400).json({ message: 'Title is required.' });
      }

      const todo = await Todo.create({ title: normalizedTitle });
      return res.status(201).json(todo);
    }

    return res.status(405).json({ message: 'Method not allowed.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to process todos.' });
  }
};
