
const pool = require('../../src/utils/db');
const upload = require('../../src/utils/multerConfig');
const { encodeImageToBase64 } = require("../../src/utils/imageUtils");

const driverController = {
  getAllDrivers: async (req, res) => {
    try {
      const query = 'SELECT * FROM drivers';
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async createDriver(req, res) {
    const {
      name,
      licenceNumber,
      CID,
      gender,
      mobileNumber,
      vehicleNumber,
      vehicleBrand,
      vehicleColor,
      vehicleType,
      vehicleCapacity,
      accountNumber,
      bankAccount,
    } = req.body;

    const requiredFields = [
      name,
      licenceNumber,
      CID,
      gender,
      mobileNumber,
      vehicleNumber,
      vehicleBrand,
      vehicleColor,
      vehicleType,
      vehicleCapacity,
      accountNumber,
      bankAccount,
    ];
    const missingFields = requiredFields.filter((field) => !field);
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }

    try {
      // Check if the CID already exists
      const checkQuery = "SELECT * FROM drivers WHERE CID = $1";
      const checkResult = await pool.query(checkQuery, [CID]);

      if (checkResult.rows.length > 0) {
        // If CID already exists, return a conflict response
        return res.status(409).json({ error: "CID already exists" });
      }
      // Access the uploaded image data using multer
      const userprofileFile = req.files["userprofile"][0];
      const qrcodeFile = req.files["qrcode"][0];

      // Encode images to base64
      const userProfileBase64 = await encodeImageToBase64(userprofileFile.path);
      const qrCodeBase64 = await encodeImageToBase64(qrcodeFile.path);

      // Insert the data into the database with base64-encoded images
      const query = `
        INSERT INTO drivers (
          name, licenceNumber, CID, gender, mobileNumber,
          photo, vehicleNumber, vehicleBrand, vehicleColor,
          vehicleType, vehicleCapacity, accountNumber, bankAccount, qrCode
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const values = [
        name,
        licenceNumber,
        CID,
        gender,
        mobileNumber,
        userProfileBase64,
        vehicleNumber,
        vehicleBrand,
        vehicleColor,
        vehicleType,
        vehicleCapacity,
        accountNumber,
        bankAccount,
        qrCodeBase64,
      ];

      const { rows } = await pool.query(query, values);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getDriverInfo: async (req, res) => {
    try {
      console.log(req.params.cid);
      const query = `SELECT * FROM driversinfo WHERE cid = $1`;
      const { rows } = await pool.query(query, [req.params.cid]);
      if (rows.length === 0) {
        res.status(404).json({ message: 'No driver information' });
      } else {
        res.json(rows);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  addDriverInfo: async (req, res) => {
    const {
      name,
      licencenumber,
      cid,
      gender,
      mobilenumber,
      vehiclenumber,
      vehiclebrand,
      vehiclecolor,
      vehicletype,
      vehiclecapacity,
    } = req.body;

    try {
      console.log(req.body);

      const checkQuery = 'SELECT * FROM driversInfo WHERE cid = $1';
      const checkResult = await pool.query(checkQuery, [cid]);

      if (checkResult.rows.length > 0) {
        return res.status(409).json({ error: 'CID already exists' });
      }

      const query = `
        INSERT INTO driversInfo (
          name, licencenumber, cid, gender, mobilenumber,
          vehiclenumber, vehiclebrand, vehiclecolor,
          vehicletype, vehiclecapacity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        name,
        licencenumber,
        cid,
        gender,
        mobilenumber,
        vehiclenumber,
        vehiclebrand,
        vehiclecolor,
        vehicletype,
        vehiclecapacity,
      ];

      console.log(values);

      const { rows } = await pool.query(query, values);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getAllrouterequest(req, res) {
    try {
      const query = 'SELECT * FROM passengersmap';
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteLocalRoute(req, res) {
    try {
      const { id } = req.params;

      // Check if the local route with the specified ID exists
      const checkQuery = 'SELECT * FROM passengersmap WHERE id = $1';
      const checkResult = await pool.query(checkQuery, [id]);

      if (checkResult.rows.length === 0) {
        // If the local route does not exist, return a not found response
        return res.status(404).json({ error: 'Local route not found' });
      }

      // Delete the local route
      const deleteQuery = 'DELETE FROM passengersmap WHERE id = $1';
      await pool.query(deleteQuery, [id]);

      res.json({ message: 'Local route deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async RouteAccepted(req, res) {
    const { d_cid, d_name, cid, name, pickupnote, destination, fare,drivercurrentLocation } = req.body;
  
    try {
      // Perform the database insertion here using the received data
      const query = `
        INSERT INTO routeaccepted (d_cid, d_name, cid, name, pickupnote, destination, fare, drivercurrentLocation, created_at)
        VALUES ($1, $2, $3, $4,$5, $6, $7,$8, CURRENT_TIMESTAMP)
      `;
  
      await pool.query(query, [d_cid, d_name, cid, name, pickupnote, destination, fare,  drivercurrentLocation]);
      res.status(201).json({ message: 'Route Accepted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },


};

const getDriverById = async (cid) => {
  try {
    const result = await pool.query('SELECT * FROM drivers WHERE cid = $1', [cid]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching driver:', error);
    throw new Error('Internal Server Error');
  }
};



const updateDriver = async (
  name,
  licencenumber,
  cid,
  gender,
  mobilenumber,
  vehiclenumber,
  vehiclebrand,
  vehiclecolor,
  vehicletype,
  vehiclecapacity,
  accountnumber,
  bankaccount,
) => {
  try {
    const result = await pool.query('SELECT * FROM drivers WHERE cid = $1', [cid]);
    const driver = result.rows[0];

    if (!driver) {
      throw new Error('Driver not found');
    }

    const updateQuery =
      'UPDATE drivers SET name = $1, licencenumber = $2, gender = $3, mobilenumber = $4, vehiclenumber = $5, vehiclebrand = $6, vehiclecolor = $7, vehicletype = $8, vehiclecapacity = $9, accountnumber = $10, bankaccount = $11 WHERE cid = $12';
    
    const updateValues = [
      name,
      licencenumber,
      gender,
      mobilenumber,
      vehiclenumber,
      vehiclebrand,
      vehiclecolor,
      vehicletype,
      vehiclecapacity,
      accountnumber,
      bankaccount,
      cid,
    ];

    await pool.query(updateQuery, updateValues);

    const updatedDriver = await getDriverById(cid);
    console.log('up:', updatedDriver);
    return updatedDriver;
  } catch (error) {
    console.error('Error updating driver:', error);
    throw new Error('Internal Server Error');
  }
};


const deleteDriver = async (req, res, cid) => {
 

  try {
    console.log('Deleting driver with cid:', cid);

    const result = await pool.query('SELECT * FROM drivers WHERE cid = $1', [ cid]);
    console.log('Result from database:', result.rows);

    const driver = result.rows[0];

    if (!driver) {
      console.log('driver not found');
      return res.status(404).json({ message: 'driver not found' });
    }

    if (driver.cid !== cid) {
      console.log('Unauthorized - You can only delete your own details');
      return res.status(401).json({ message: 'Unauthorized - You can only delete your own details' });
    }

    await pool.query('DELETE FROM drivers WHERE cid = $1', [cid]);

    console.log('Driver deleted successfully');
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};



const insertLocation = async (req, res) => {
  const { driver_id,name,vehiclenumber,mobilenumber, vehicletype, vehiclecapacity, vehiclebrand,vehiclecolor , latitude, longitude } = req.body;

  // Check if the driver exists in the database
  const checkDriverQuery = {
    text: 'SELECT * FROM driverlocations WHERE driver_id = $1',
    values: [driver_id],
  };

  try {
    const { rows } = await pool.query(checkDriverQuery);

    if (rows.length > 0) {
      // If the driver exists, update the latitude and longitude
      const updateQuery = {
        text: `
          UPDATE driverlocations
          SET latitude = $1, longitude = $2
          WHERE driver_id = $3
        `,
        values: [latitude,longitude, driver_id],
      };
      await pool.query(updateQuery);
      console.log('Driver location updated successfully');
      console.log(`Driver ${driver_id} location updated at ${new Date()}`);
      res.status(200).json({ message: 'Driver location updated successfully' });
    } else {
      // If the driver doesn't exist, insert a new record
      const insertQuery = {
        text: `
          INSERT INTO driverlocations(driver_id,name,vehiclenumber,mobilenumber, vehicletype, vehiclecapacity, vehiclebrand,vehiclecolor,latitude, longitude)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        values: [driver_id,name,vehiclenumber,mobilenumber,vehicletype,vehiclecapacity,vehiclebrand,vehiclecolor,latitude, longitude],
      };
      await pool.query(insertQuery);
      console.log('Driver location inserted successfully');
      res.status(201).json({ message: 'Driver location inserted successfully' });
    }
  } catch (error) {
    console.error('Error inserting or updating driver location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateLocation = async (req, res) => {
  const { driver_id, latitude, longitude } = req.body;

  // Update the latitude and longitude for the specified driver
  const updateQuery = {
    text: `
      UPDATE driverlocations
      SET latitude = $1, longitude = $2
      WHERE driver_id = $3
    `,
    values: [latitude, longitude, driver_id],
  };

  try {
    await pool.query(updateQuery);
    console.log('Driver location updated successfully');
    res.status(200).json({ message: 'Driver location updated successfully' });
  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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

const getDriverId = async (req, res) => {
  try {
    // Query the driverlocations table to get the driver_id
    const queryResult = await pool.query('SELECT DISTINCT driver_id FROM driverlocations');

    if (queryResult.rows.length === 0) {
      return res.status(404).json({ message: "No driver found in driverlocations table" });
    }

    const driver_id = queryResult.rows[0].driver_id;

    // Send the driver_id as JSON response
    res.status(200).json({ driver_id });
  } catch (error) {
    console.error('Error fetching driver ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};








module.exports = {
  getDriverById,
  updateDriver,
  deleteDriver,
  getDriverId,
  insertLocation,
  updateLocation,
  getDriverLocations,
  getAllDrivers: driverController.getAllDrivers,
  getDriverInfo: driverController.getDriverInfo,
  addDriverInfo: driverController.addDriverInfo,
  createDriver: driverController.createDriver,
  getAllrouterequest:driverController.getAllrouterequest,
  RouteAccepted:driverController.RouteAccepted,
  deleteLocalRoute:driverController.deleteLocalRoute
  
};


