const pool = require("../../src/utils/db");

const rideController = {
  // fetch the ride information like location, fare and ride type
  getAllRidesInfo: async (req, res) => {
    try {
      const query = "SELECT * FROM ride_info";
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // fetch the ride info based on the pickup and destination locations
  getARideInfo: async (req, res) => {
    try {
      // Extract pickup and destination from the request
      const { pickup, destination } = req.query;

      // Check if both pickup and destination are provided
      if (!pickup || !destination) {
        return res
          .status(400)
          .json({ error: "Both pickup and destination must be provided" });
      }

      // Use parameterized query to avoid SQL injection
      const query =
        "SELECT * FROM ride_info WHERE (location1 = $1 AND location2 = $2) OR (location1 = $2 AND location2 = $1)";
      const { rows } = await pool.query(query, [pickup, destination]);

      // Check if a matching record is found
      if (rows.length > 0) {
        // Assuming there's only one matching record, you may need to adjust this if multiple matches are possible
        const fare = rows[0].fare;
        res.json({ fare });
      } else {
        res.status(404).json({
          error: "No matching ride found for the given pickup and destination",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // create a new ride instance
  createRideInfo: async (req, res) => {
    const { location1, location2, fare } = req.body;

    try {
      const query = `
        INSERT INTO ride_info (location1, location2, fare)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const values = [location1, location2, fare];

      const { rows } = await pool.query(query, values);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //create a ride w driver id, pick and destination and ride status
  createRide: async (req, res) => {
    const {
      destination,
      pickup_point,
      driver,
      passengers,
      ride_type,
      ride_status,
    } = req.body;

    const checkQuery = `SELECT * FROM rides WHERE driver = $1 AND ride_status = 'pending'`;
    const checkValues = [driver];
    const existingRide = await pool.query(checkQuery, checkValues);

    if (existingRide.rows.length > 0) {
      // Ride already exists
      return res.status(400).json({ error: "You are already in a queue." });
    }

    try {
      const query = `
      INSERT INTO rides (destination, pickup_point, driver, passengers, ride_type, ride_status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

      const values = [
        destination,
        pickup_point,
        driver,
        passengers,
        ride_type,
        ride_status,
      ];

      const { rows } = await pool.query(query, values);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //fetch all the rides
  getAllRides: async (req, res) => {
    try {
      const query = `
        SELECT *
        FROM rides
      `;

      const { rows } = await pool.query(query);

      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //get current ride of a driver
  getARide: async (req, res) => {
    try {
      const driverId = req.params.driver;

      console.log(driverId);

      // Query to fetch the ongoing ride and driver details in one query
      // const query = {
      //   text: `
      //     SELECT rides.*,
      //     drivers.*
      //     FROM rides
      //     LEFT JOIN drivers ON rides.driver = drivers.cid
      //     WHERE rides.driver = $1 AND rides.ride_status = $2
      //     LIMIT 1
      //   `,
      //   values: [driverId, "pending"],
      // };

      const fetchQuery =
        " SELECT * FROM rides WHERE driver = $1 AND ride_status = $2 LIMIT 1";
      const fetchValues = [driverId, "pending"];
      const result = await pool.query(fetchQuery, fetchValues);

      // Check if a ride was found
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Ongoing ride not found" });
      }

      // Send the combined details in the response
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error in getARide:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },

  //get current ride of a driver
  getCurrentRideWithDriverInfo: async (req, res) => {
    try {
      const driverId = req.params.driver;

      // Query to fetch the ongoing ride and driver details in one query
      const query = {
        text: `
            SELECT rides.*, drivers.*
            FROM rides
            LEFT JOIN drivers ON rides.driver = drivers.cid
            WHERE rides.driver = $1 AND rides.ride_status = $2
            LIMIT 1
          `,
        values: [driverId, "pending"],
      };

      const result = await pool.query(query);

      // Check if a ride was found
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Ongoing ride not found" });
      }

      // Send the combined details in the response
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error in getARide:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },

  getRidesByDriverAndStatus: async (req, res) => {
    try {
      const driverId = req.params.driver;
      const status = "done"; // Assuming you want rides with status "done"

      // Query to fetch rides by driver and status
      const fetchQuery =
        "SELECT * FROM rides WHERE driver = $1 AND ride_status = $2";
      const fetchValues = [driverId, status];
      const result = await pool.query(fetchQuery, fetchValues);

      // Check if rides were found
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "No rides found for this driver" });
      }

      // Send the fetched rides in the response
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching rides:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },

  getRidesByDriverAndStatus2: async (req, res) => {
    try {
      const driverId = req.params.driver;

      // Query to fetch the ongoing ride and driver details in one query
      const query = {
        text: `
        SELECT rides.*, drivers.name, drivers.licencenumber, drivers.cid, drivers.gender, drivers.mobilenumber, 
        drivers.vehiclenumber, drivers.vehiclebrand, drivers.vehiclecolor, drivers.vehicletype,
        drivers.vehiclecapacity, drivers.bankaccount, drivers.accountnumber
        FROM rides
        LEFT JOIN drivers ON rides.driver = drivers.cid
        WHERE rides.driver = $1 AND rides.ride_status = $2
        LIMIT 1;
          `,
        values: [driverId, "pending"],
      };

      const result = await pool.query(query);

      // Check if a ride was found
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Ongoing ride not found" });
      }

      // Send the combined details in the response
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error in getARide:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },

  //update the ride passenger information append new passenger to the rides
  //number of passenger should not be greter than car capacity
  //should not accept duplicate passenger id
  updateRidePassenger: async (req, res) => {
    const { id, passenger, description } = req.body;
    console.log(description);

    try {
      // Check if the passenger is in any other ride's passenger array
      const checkPassengerQuery = `
      SELECT id
      FROM rides
      WHERE $1 = ANY (passengers) AND ride_status = 'pending'
  `;
      const checkPassengerValues = [passenger];
      const passengerCheckResult = await pool.query(
        checkPassengerQuery,
        checkPassengerValues
      );

      if (passengerCheckResult.rows.length > 0) {
        console.log("alr in a ride");
        return res
          .status(400)
          .json({ message: "Passenger is already in another ride" });
      }

      // Fetch the current passenger array for the specified ride
      const fetchQuery = "SELECT passengers FROM rides WHERE id = $1";
      const fetchValues = [id];
      const fetchResult = await pool.query(fetchQuery, fetchValues);

      if (fetchResult.rows.length === 0) {
        return res.status(404).json({ message: "Ride not found" });
      }

      const currentPassengers = fetchResult.rows[0].passengers || [];

      // Check if the passenger already exists in the array
      if (currentPassengers.includes(passenger)) {
        return res
          .status(400)
          .json({ message: "Passenger already in the ride" });
      }

      // Fetch the capacity of the car from the drivers table
      const capacityQuery = `
        SELECT drivers.vehiclecapacity
        FROM rides
        JOIN drivers ON rides.driver = drivers.CID
        WHERE rides.id = $1
      `;
      const capacityValues = [id];
      const capacityResult = await pool.query(capacityQuery, capacityValues);

      if (capacityResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Driver not found for the ride" });
      }

      const carCapacity = capacityResult.rows[0].vehiclecapacity;

      // Check if the total number of passengers after the update exceeds the car capacity
      const updatedPassengers = [...currentPassengers, passenger];
      if (updatedPassengers.length > carCapacity) {
        return res.status(400).json({ message: "Car capacity exceeded" });
      }

      // Update the ride with the new passenger array
      const updateQuery =
        "UPDATE rides SET passengers = $1, ride_note = $3 WHERE id = $2 RETURNING *";
      const updateValues = [updatedPassengers, id, description];
      const { rows } = await pool.query(updateQuery, updateValues);

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getRidesByDestination: async (req, res) => {
    const { destination } = req.query;
    console.log(destination);
    try {
      const query = `
        SELECT rides.*, drivers.*
        FROM rides
        JOIN drivers ON rides.driver = drivers.CID
        WHERE rides.destination = $1 AND rides.ride_status = 'pending'
        ORDER BY rides.created_at
      `;

      const values = [destination];

      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No rides found for the specified destination" });
      }

      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //update rides status
  updateRideStatus: async (req, res) => {
    const { id } = req.body;

    try {
      // Fetch the current ride to check if it exists
      const fetchQuery = "SELECT * FROM rides WHERE id = $1";
      const fetchValues = [id];
      const fetchResult = await pool.query(fetchQuery, fetchValues);

      if (fetchResult.rows.length === 0) {
        return res.status(404).json({ message: "Ride not found" });
      }

      // Update the ride_status to "done"
      const updateQuery =
        "UPDATE rides SET ride_status = 'done' WHERE id = $1 RETURNING *";
      const updateValues = [id];
      const { rows } = await pool.query(updateQuery, updateValues);

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //delete the ride based on id
  deleteRide: async (req, res) => {
    const { id } = req.body;

    try {
      // Check if the ride exists
      const fetchQuery = "SELECT * FROM rides WHERE id = $1";
      const fetchValues = [id];
      const fetchResult = await pool.query(fetchQuery, fetchValues);

      if (fetchResult.rows.length === 0) {
        return res.status(404).json({ message: "Ride not found" });
      }

      // Delete the ride
      const deleteQuery = "DELETE FROM rides WHERE id = $1 RETURNING *";
      const deleteValues = [id];
      const { rows } = await pool.query(deleteQuery, deleteValues);

      res
        .status(200)
        .json({ message: "Ride deleted successfully", deletedRide: rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //get the first from queue based on the destionation location
  getFirstFromQueue: async (req, res) => {
    try {
      const destination = req.query.destination;
      console.log(destination);
      // const destination = 'Punakha';
      // Query to fetch the ongoing ride and driver details in one query
      // const query = {
      //   text: `
      //   SELECT rides.*, drivers.*
      //   FROM rides
      //   JOIN drivers ON rides.driver = drivers.cid
      //   WHERE rides.ride_status = $2
      //   AND COALESCE(array_length(rides.passengers, 1), 0) < drivers.vehiclecapacity
      //   AND rides.destination = $1
      //   LIMIT 1;
      //     `,
      //   values: [destination, "pending"],
      // };

      const query = {
        //fetch where the passenger is not there.
        text: `
        SELECT rides.*, drivers.*
        FROM rides
        JOIN drivers ON rides.driver = drivers.cid
        WHERE rides.ride_status = $2
        AND COALESCE(array_length(rides.passengers, 1), 0) < 1
        AND rides.destination = $1
        LIMIT 1;
          `,
        values: [destination, "pending"],
      };

      const result = await pool.query(query);

      // Check if a ride was found
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Ongoing ride not found" });
      }

      // Send the combined details in the response
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error in getARide:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },

  //check if the passeneegr have anu current ride and if there show the current ride
  getPassengerCurrentRide: async (req, res) => {
    const { userId } = req.query;
    console.log("passenger", userId);
    try {
      const checkPassengerQuery = `
      SELECT rides.*, drivers.*
      FROM rides
      JOIN drivers ON rides.driver = drivers.cid
      WHERE $1 = ANY (rides.passengers) AND rides.ride_status = 'pending'
      `;
      const checkPassengerValues = [userId];
      const passengerCheckResult = await pool.query(
        checkPassengerQuery,
        checkPassengerValues
      );
      console.log(passengerCheckResult.rows);
      if (passengerCheckResult.rows.length > 0) {
        console.log("12131");
        const currentRide = passengerCheckResult.rows[0]; // Assuming there's only one current ride
        return res
          .status(200)
          .json({
            message: "Passenger is already in another ride",
            currentRide: currentRide,
            flag: true,
          });
      } else {
        console.log("121sadasfadgf31");
        return res
          .status(200)
          .json({
            message: "Passenger is not in any current ride",
            flag: false,
          });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //update to add passenger

  //remove passenger
  // Remove a passenger from the ride
  removeRidePassenger: async (req, res) => {
    const { id, passenger } = req.body;

    try {
      // Fetch the current passenger array for the specified ride
      const fetchQuery = "SELECT passengers FROM rides WHERE id = $1";
      const fetchValues = [id];
      const fetchResult = await pool.query(fetchQuery, fetchValues);

      if (fetchResult.rows.length === 0) {
        return res.status(404).json({ message: "Ride not found" });
      }

      const currentPassengers = fetchResult.rows[0].passengers || [];

      // Check if the passenger exists in the array
      const passengerIndex = currentPassengers.indexOf(passenger);
      if (passengerIndex === -1) {
        return res
          .status(400)
          .json({ message: "Passenger not found in the ride" });
      }

      // Remove the passenger from the array
      currentPassengers.splice(passengerIndex, 1);

      // Update the ride with the new passenger array
      const updateQuery =
        "UPDATE rides SET passengers = $1 WHERE id = $2 RETURNING *";
      const updateValues = [currentPassengers, id];
      const { rows } = await pool.query(updateQuery, updateValues);

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = rideController;
