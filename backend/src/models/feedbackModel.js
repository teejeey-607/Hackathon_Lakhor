const pool = require('../utils/db');

const createfeedbackTable = async () => {
    const feedbackSchema = `
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobilenumber VARCHAR(8) NOT NULL,
        message VARCHAR(255) NOT NULL
      )
    `;
  
    try {
      await pool.query(feedbackSchema);
      console.log('feedback table created successfully');
    } catch (error) {
      console.error('Error creating feedback table:', error);
      throw error;
    }
  };
  
  module.exports = {
    createfeedbackTable,
  };