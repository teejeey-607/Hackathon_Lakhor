const pool = require("../utils/db");

const createRidesTable = async () => {
  const rideSchema = `
   CREATE TABLE IF NOT EXISTS rides (
    id SERIAL PRIMARY KEY,
    destination VARCHAR(255) NOT NULL,
    pickup_point VARCHAR(255),
    driver BIGINT NOT NULL,
    passengers INTEGER[] UNIQUE ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ride_type VARCHAR(50),
    ride_note VARCHAR(255),
    ride_status VARCHAR(50) NOT NULL DEFAULT 'pending'
    );
  `;//delete the ride type from here?? no bcs its for sharing or reserved
  //need to include thedeparture timestamp but no ui to enter the departure timestamp

  try {
    await pool.query(rideSchema);
    console.log("Rides table created successfully");
  } catch (error) {
    console.error("Error creating rides table:", error);
    throw error;
  }
};

const createRideInfoTable = async () => {
  const rideInfoSchema = `
  CREATE TABLE IF NOT EXISTS ride_info (
    id SERIAL PRIMARY KEY,
    location1 VARCHAR(255) NOT NULL,
    location2 VARCHAR(255) NOT NULL,
    ride_type VARCHAR(50),
    fare DECIMAL(10, 2) NOT NULL
  )`;//ride type should be either long distance or local route

  try {
    await pool.query(rideInfoSchema);
    console.log("RideInfoTable created successfully");
  } catch (error) {
    console.error("Error creating RideInfoTable:", error);
    throw error;
  }
};

module.exports = {
  createRidesTable,
  createRideInfoTable,
};
