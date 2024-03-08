const pool = require('../../src/utils/db');

const passengerMapController = {
  getAllMapPassengers: async (req, res) => {
    try {
      const query = 'SELECT * FROM passengersMap';
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
 
  createMapPassenger: async (req, res) => {
    const { cid,name,mobilenumber,date,time,pickupnote,numberofpassenger,destination,currentLocation,type } = req.body;

    try {
      const query = `
        INSERT INTO passengersMap (cid,name,mobilenumber,date,time,pickupnote,numberofpassenger,destination,currentLocation,type)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *
      `;

      const values = [cid,name,mobilenumber,date,time,pickupnote,numberofpassenger,destination,currentLocation,type];

      const { rows } = await pool.query(query, values);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = passengerMapController;
