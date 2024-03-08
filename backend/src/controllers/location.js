const pool = require('../../src/utils/db');

const insertLocation = async (req, res) => {
  const { driver_id, latitude, longitude } = req.body;

  const insertQuery = {
    text: 'INSERT INTO driverlocations(driver_id, latitude, longitude) VALUES($1, $2, $3)',
    values: [driver_id, latitude, longitude],
  };

  try {
    const result = await pool.query(insertQuery);
    console.log('Driver location inserted successfully');
    res.status(201).json({ message: 'Driver location inserted successfully', insertedId: result.insertId });
  } catch (error) {
    console.error('Error inserting driver location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  insertLocation,
};
