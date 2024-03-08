

const pool = require('../utils/db');

const createMapPassengersTable = async () => {
  const passengerSchema = `
    CREATE TABLE IF NOT EXISTS passengersMap (
      id SERIAL PRIMARY KEY,
      cid VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      mobilenumber VARCHAR(255) NOT NULL,
      time VARCHAR(255) NOT NULL,
      date VARCHAR(255) NOT NULL,
      pickupnote VARCHAR(255) NOT NULL,
      numberofpassenger VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      currentLocation VARCHAR(255) NOT NULL,
      type VARCHAR(255) NOT NULL
    );
  `;

  try {
    await pool.query(passengerSchema);
    console.log('PassengersMap table created successfully');
  } catch (error) {
    console.error('Error creating passengers table:', error);
    throw error;
  }
};

module.exports = {
  createMapPassengersTable,
};
