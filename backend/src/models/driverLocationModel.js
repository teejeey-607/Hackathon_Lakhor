
const pool = require('../utils/db');

const driverlocations = async () => {
  const driverSchema = `
    CREATE TABLE IF NOT EXISTS driverlocations (
        driver_id BIGINT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        vehiclenumber VARCHAR(255) NOT NULL,
        mobilenumber VARCHAR(255) NOT NULL,
        vehicletype VARCHAR(255) NOT NULL,
        vehiclecapacity INT NOT NULL,
        vehiclebrand VARCHAR(255) NOT NULL,
        vehiclecolor VARCHAR(255) NOT NULL,
        latitude DECIMAL,
        longitude DECIMAL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(driverSchema);
    console.log('Driverslocation table created successfully');
    
    // Call a function to periodically refresh the data
    setInterval(refreshDriverLocations, 1000); // Refresh every minute (adjust interval as needed)
  } catch (error) {
    console.error('Error creating drivers table:', error);
    throw error;
  }
};

const refreshDriverLocations = async () => {
  try {
    // Fetch the latest data from the database
    const queryResult = await pool.query('SELECT * FROM driverlocations');
    // Process the data or perform any necessary actions
    
    // console.log('Driver locations refreshed successfully');
  } catch (error) {
    console.error('Error refreshing driver locations:', error);
  }
};

module.exports = {
  driverlocations
};
