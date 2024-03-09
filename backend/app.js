const express = require('express');
const cors = require('cors');
const pool = require('./src/utils/db');
const dotenv = require('dotenv');
const connect =require("nats");

const passengerRoutes = require('./src/routes/passengerRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const rideRoutes = require('./src/routes/rideRoutes');
const driverModel = require('./src/models/driverModel');
const passengerModel = require('./src/models/passengerModel');
const passengersMapModel = require('./src/models/passengerMapModel')
const rideModel = require('./src/models/rideModel')
const locationModel=require('./src/models/driverLocationModel')
const feedbackModel =require('./src/models/feedbackModel')

// const bodyParser = require('body-parser');

dotenv.config();

const app = express();

const servers = [
  {},
  { servers: ["demo.nats.io:4442", "demo.nats.io:4222"] },
  { servers: "demo.nats.io:4443" },
  { port: 4222 },
  { servers: "localhost" },
];

await servers.forEach(async (v) => {
  try {
    const nc = await connect(v);
    console.log(`connected to ${nc.getServer()}`);
    // this promise indicates the client closed
    const done = nc.closed();
    // do something with the connection

    // close the connection
    await nc.close();
    // check if the close was OK
    const err = await done;
    if (err) {
      console.log(`error closing:`, err);
    }
  } catch (err) {
    console.log(`error connecting to ${JSON.stringify(v)}`);
  }
});

// Parse URL-encoded bodies (e.g., form data)
// app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const ipAddress = '192.168.129.216';

// Middleware
app.use(express.json()); // add this line to use express.json() middleware
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

const allowedOrigins = ["http://localhost:3000"];
//CORS allow frontend to communicate w backend

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

pool
  .connect()
  .then(async () => {
    // Create drivers table
    await passengerModel.createPassengersTable();
    await driverModel.createDriversTable();
    await driverModel.createDriversInfoTable();
    await passengersMapModel.createMapPassengersTable();
    await rideModel.createRideInfoTable();
    await rideModel.createRidesTable();
    // Start your server or perform other actions
    await driverModel.createRouteAcceptedTable();
    await locationModel.driverlocations();

    await feedbackModel.createfeedbackTable();
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL:', error);
  });

// Sample route
app.get('/api/sample', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Use routes
app.use('/api', passengerRoutes);
app.use('/api', driverRoutes);
app.use('/api', rideRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
