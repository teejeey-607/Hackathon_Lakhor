const pool = require('../utils/db');

const createPassengersTable = async () => {
  const passengerSchema = `
    CREATE TABLE IF NOT EXISTS passengers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      cid VARCHAR(11) NOT NULL,
      gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Others')) NOT NULL,
      mobilenumber VARCHAR(8) NOT NULL,
      emergencycontactnumber VARCHAR(8)
    )
  `;

  try {
    await pool.query(passengerSchema);
    console.log('Passengers table created successfully');
  } catch (error) {
    console.error('Error creating passengers table:', error);
    throw error;
  }
};

module.exports = {
  createPassengersTable,
};
