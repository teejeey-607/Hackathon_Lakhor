const pool = require('../../src/utils/db');

// Function to insert feedback into the database
const createFeedback = async (req, res) => {
  try {
    const { name, mobilenumber, message } = req.body;
    
    // Check if all required fields are provided
    if (!name || !mobilenumber || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the feedback into the database
    const query = {
      text: 'INSERT INTO feedback (name, mobilenumber, message) VALUES ($1, $2, $3) RETURNING *',
      values: [name, mobilenumber, message],
    };

    const result = await pool.query(query);
    const feedback = result.rows[0];
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to get all feedback from the database
const getAllFeedback = async (req, res) => {
  try {
    const query = 'SELECT * FROM feedback';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
};
