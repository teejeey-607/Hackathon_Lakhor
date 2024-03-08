const pool = require('../utils/db');

const createDriversTable = async () => {
  const driverSchema = `
    CREATE TABLE IF NOT EXISTS drivers (
      name VARCHAR(255) NOT NULL,
      licencenumber VARCHAR(255) NOT NULL,
      cid BIGINT PRIMARY KEY,
      gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Others')) NOT NULL,
      mobilenumber VARCHAR(8) UNIQUE NOT NULL,
      photo TEXT, 
      vehiclenumber VARCHAR(255) NOT NULL,
      vehiclebrand VARCHAR(255) NOT NULL,
      vehiclecolor VARCHAR(255) NOT NULL,
      vehicletype VARCHAR(255) NOT NULL,
      vehiclecapacity INT NOT NULL,
      bankaccount VARCHAR(255) NOT NULL,
      accountnumber VARCHAR(255) NOT NULL,
      qrCode TEXT NOT NULL
    )
  `;

  try {
    await pool.query(driverSchema);
    console.log('Drivers table created successfully');
  } catch (error) {
    console.error('Error creating drivers table:', error);
    throw error;
  }
};

const createDriversInfoTable = async () => {
  const driverSchema = `
    CREATE TABLE IF NOT EXISTS driversInfo (
      name VARCHAR(255) NOT NULL,
      licenceNumber VARCHAR(255) NOT NULL,
      CID BIGINT PRIMARY KEY,
      gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Others')) NOT NULL,
      mobileNumber VARCHAR(8) UNIQUE NOT NULL,
      vehicleNumber VARCHAR(255) NOT NULL,
      vehicleBrand VARCHAR(255) NOT NULL,
      vehicleColor VARCHAR(255) NOT NULL,
      vehicleType VARCHAR(255) NOT NULL,
      vehicleCapacity INT NOT NULL
    )
  `;

  try {
    await pool.query(driverSchema);
    console.log('Drivers info table created successfully');
  } catch (error) {
    console.error('Error creating drivers table:', error);
    throw error;
  }
};

// const createLocalRouteTable = async () => {
//   const localRouteSchema = `
//     CREATE TABLE IF NOT EXISTS localroute (
//       id BIGINT PRIMARY KEY,
//       user_cid BIGINT,
//       pickup VARCHAR(255) NOT NULL,
//       destination VARCHAR(255) NOT NULL,
//       fare INT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;

//   try {
//     await pool.query(localRouteSchema);
//     console.log('Local Route table created successfully');
//   } catch (error) {
//     console.error('Error creating localroute table:', error);
//     throw error;
//   }
// };

// const createLocalRouteAcceptTable = async () => {
//   const localRouteSchema = `
//     CREATE TABLE IF NOT EXISTS routeaccept (
//       user_cid BIGINT,
//       pickup VARCHAR(255) NOT NULL,
//       destination VARCHAR(255) NOT NULL,
//       fare INT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;

//   try {
//     await pool.query(localRouteSchema);
//     console.log('Local Route Accept table created successfully');
//   } catch (error) {
//     console.error('Error creating localroute table:', error);
//     throw error;
//   }
// };

const createRouteAcceptedTable = async () => {
  const localRouteSchema = `
    CREATE TABLE IF NOT EXISTS routeaccepted (
      d_cid BIGINT,
      d_name VARCHAR(255) NOT NULL,
      cid BIGINT,
      name VARCHAR(255) NOT NULL,
      pickupnote VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      fare INT NOT NULL,
      drivercurrentLocation VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(localRouteSchema);
    console.log('Route Accepted table created successfully');
  } catch (error) {
    console.error('Error creating localroute table:', error);
    throw error;
  }
};

module.exports = {
  createDriversTable,
  createDriversInfoTable,
  // createLocalRouteTable,
  // createLocalRouteAcceptTable,
  createRouteAcceptedTable
};
