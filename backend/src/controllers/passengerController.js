



const pool = require('../../src/utils/db');

const getPassengerById = async (id, cid) => {
  try {
    const result = await pool.query('SELECT * FROM passengers WHERE id = $1 AND cid = $2', [id, cid]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching passenger:', error);
    throw new Error('Internal Server Error');
  }
};


const updatePassenger = async (id, name, cid, gender, mobilenumber, emergencycontactnumber) => {
  try {
    // Check if the passenger exists
    const result = await pool.query('SELECT * FROM passengers WHERE id = $1 AND cid = $2', [id, cid]);
    const passenger = result.rows[0];

    if (!passenger) {
      throw new Error('Passenger not found');
    }

    // Update the passenger in the database
    const updateQuery =
      'UPDATE passengers SET name = $1, cid = $2, gender = $3, mobilenumber = $4, emergencycontactnumber = $5 WHERE id = $6';
    const updateValues = [name, cid, gender, mobilenumber, emergencycontactnumber, id];
    await pool.query(updateQuery, updateValues);

    // Fetch and return the updated passenger details
    const updatedPassenger = await getPassengerById(id, cid);
    return updatedPassenger;
  } catch (error) {
    console.error('Error updating passenger:', error);
    throw new Error('Internal Server Error');
  }
};



const deletePassenger = async (req, res, id) => {
  const cid = req.headers.cid; // Assuming the CID is passed in the headers

  try {
    console.log('Deleting passenger with id:', id, 'and cid:', cid);

    // Check if the passenger exists
    const result = await pool.query('SELECT * FROM passengers WHERE id = $1 AND cid = $2', [id, cid]);
    console.log('Result from database:', result.rows);

    const passenger = result.rows[0];

    if (!passenger) {
      console.log('Passenger not found');
      return res.status(404).json({ message: 'Passenger not found' });
    }

    // Ensure that the user is only deleting their own details
    if (passenger.cid !== cid) {
      console.log('Unauthorized - You can only delete your own details');
      return res.status(401).json({ message: 'Unauthorized - You can only delete your own details' });
    }

    // Delete the passenger from the database
    await pool.query('DELETE FROM passengers WHERE id = $1', [id]);

    // Send the success response after successful deletion
    console.log('Passenger deleted successfully');
    res.json({ message: 'Passenger deleted successfully' });
  } catch (error) {
    console.error('Error deleting passenger:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const getAllPassengers = async (req, res) => {
  const cid = req.headers.cid; // Assuming the CID is passed in the headers

  try {
    const query = 'SELECT * FROM passengers WHERE cid = $1';
    const { rows } = await pool.query(query, [cid]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createPassenger = async (req, res) => {
  const { name, CID, gender, mobilenumber } = req.body;

  try {
    const query = `
      INSERT INTO passengers (name, CID, gender, mobilenumber)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [name, CID, gender, mobilenumber];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const checkDuplicateCID = async (req, res) => {
  const { cid } = req.params;

  try {
    console.log('Checking duplicate CID:', cid); // Add this line
    const result = await pool.query('SELECT * FROM passengers WHERE cid = $1', [cid]);
    res.json({ exists: !!result.rows[0] });
  } catch (error) {
    console.error('Error checking duplicate CID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




const getAllDriver= async(req, res)=> {
  try {
    const query = 'SELECT * FROM passengersmap';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const getDriverLocations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM driverlocations');
    // console.log('Driver locations retrieved successfully');
    res.status(200).json(result.rows); // Send the retrieved data as JSON response
  } catch (error) {
    console.error('Error retrieving driver locations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getPassengerById,
  updatePassenger,
  getAllPassengers,
  createPassenger,
  deletePassenger,
  checkDuplicateCID,
  getAllDriver,
  getDriverLocations
};

