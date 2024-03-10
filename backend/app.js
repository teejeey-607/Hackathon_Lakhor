const express = require("express");
const cors = require("cors");
const pool = require("./src/utils/db");
const dotenv = require("dotenv");
// const { subscribeToNATS } = require("./server");
const { connect, nkeyAuthenticator, JSONCodec } = require("nats");
const axios = require("axios");

const passengerRoutes = require("./src/routes/passengerRoutes");
const driverRoutes = require("./src/routes/driverRoutes");
const rideRoutes = require("./src/routes/rideRoutes");
const driverModel = require("./src/models/driverModel");
const passengerModel = require("./src/models/passengerModel");
const passengersMapModel = require("./src/models/passengerMapModel");
const rideModel = require("./src/models/rideModel");
const locationModel = require("./src/models/driverLocationModel");
const feedbackModel = require("./src/models/feedbackModel");

// const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Configuration for subscribing to NDI NATS server for staging
const natsURL = "nats://13.229.203.54:4222";
const seed = new TextEncoder().encode(
  "SUAPXY7TJFUFE3IX3OEMSLE3JFZJ3FZZRSRSOGSG2ANDIFN77O2MIBHWUM"
);

async function subscribeToNDINATS(threadId) {
  try {
    console.log("Subscribe to " + threadId);
    const jc = JSONCodec();

    const nc = await connect({
      servers: [natsURL],
      // debug: true,
      authenticator: nkeyAuthenticator(seed),
    });

    // Subscribe to the desired pattern ('threadId')
    const subscription = nc.subscribe(threadId, { max: 1 });
    // console.log("iii", subscription);
    // Process incoming messages
    for await (const msg of subscription) {
      const payload = jc.decode(msg.data);
      console.log(
        "Received message from NDI NATS:",
        payload.data.requested_presentation.revealed_attrs["ID Number"].value
      );
      console.log(
        "Received message from NDI NATS:",
        payload.data.requested_presentation.revealed_attrs["Full Name"].value
      );
      console.log(
        "Received message from NDI NATS:",
        payload.data.requested_presentation.revealed_attrs["Gender"].value
      );
      console.log(
        "Received message from NDI NATS:",
        payload.data.requested_presentation.self_attested_attrs["Mobile Number"]
      );
      try {
        // Handle the received message as needed
        const response = await axios.post(
          "http://localhost:3000/api/passengers",
          {
            CID: payload.data.requested_presentation.revealed_attrs["ID Number"]
              .value,
            name: payload.data.requested_presentation.revealed_attrs[
              "Full Name"
            ].value,
            gender:
              payload.data.requested_presentation.revealed_attrs["Gender"]
                .value,
            mobilenumber:
              payload.data.requested_presentation.self_attested_attrs[
                "Mobile Number"
              ],
            threadID: threadId,
          }
        );
        console.log("create passenger", response.data);
      } catch (error) {
        console.log(error);
      }
    }

    // // Handle errors outside of the try block
    // subscription.on("error", (err) => {
    //   console.error("Subscription error:", err);
    // });
  } catch (err) {
    console.error("Error connecting to NDI NATS server:", err);
    return; // exit function early if there's an error
  }
}

// Call the function to subscribe
// subscribeToNDINATS();

// Parse URL-encoded bodies (e.g., form data)
// app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const ipAddress = "192.168.129.216";

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
    // await passengerModel.createPassengersTable();
    // await driverModel.createDriversTable();
    // await driverModel.createDriversInfoTable();
    // await passengersMapModel.createMapPassengersTable();
    // await rideModel.createRideInfoTable();
    // await rideModel.createRidesTable();
    // // Start your server or perform other actions
    // await driverModel.createRouteAcceptedTable();
    // await locationModel.driverlocations();
    // await feedbackModel.createfeedbackTable();
  })
  .catch((error) => {
    console.error("Error connecting to PostgreSQL:", error);
  });

// Sample route
app.get("/api/sample", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.get("/subscribe", async (req, res) => {
  try {
    var deepLinkURL = "";
    var ThreadID = "";
    const response = await axios.post(
      "https://staging.bhutanndi.com/authentication/authenticate",
      {
        grant_type: "client_credentials",
        client_id: "3tq7ho23g5risndd90a76jre5f",
        client_secret: "111rvn964mucumr6c3qq3n2poilvq5v92bkjh58p121nmoverquh",
      }
    );

    // Handle the response from the authentication endpoint
    // For demonstration, let's assume you want to do something with the response
    console.log("Authentication response:", response.data.access_token);
    const access_token = response.data.access_token;
    if (access_token) {
      const response = await axios.post(
        `https://stageclient.bhutanndi.com/verifier/proof-request`,
        {
          proofName: "Foundational ID",
          proofAttributes: [
            {
              name: "Full Name",
              restrictions: [
                {
                  cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                  schema_id: "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                },
              ],
            },
            {
              name: "Gender",
              restrictions: [
                {
                  cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                  schema_id: "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                },
              ],
            },
            // {
            //   name: "Date of Birth",
            //   restrictions: [
            //     {
            //       cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
            //       schema_id:
            //         "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
            //     },
            //   ],
            // },
            {
              name: "ID Type",
              restrictions: [
                {
                  cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                  schema_id: "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                },
              ],
            },
            {
              name: "ID Number",
              restrictions: [
                {
                  cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
                  schema_id: "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
                },
              ],
            },
            // {
            //   name: "Household Number",
            //   restrictions: [
            //     {
            //       cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
            //       schema_id:
            //         "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
            //     },
            //   ],
            // },
            // {
            //   name: "Blood Type",
            //   restrictions: [
            //     {
            //       cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
            //       schema_id:
            //         "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
            //     },
            //   ],
            // },
            {
              name: "Mobile Number",
              restrictions: [],
              selfAttestedAllowed: true,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response.data["data"]["deepLinkURL"]);
      // deepLinkURL = `${response.data["data"]["deepLinkURL"]}&returnUrl=exp://127.0.0.1:8081`;
      deepLinkURL = `${response.data["data"]["deepLinkURL"]}`;
      console.log(deepLinkURL);
      ThreadID = response.data["data"]["proofRequestThreadId"];
      subscribeToNDINATS(ThreadID);
      // try {
      //   console.log("Subscribe to " + ThreadID);
      //   const jc = JSONCodec();

      //   const nc = await connect({
      //     servers: [natsURL],
      //     // debug: true,
      //     authenticator: nkeyAuthenticator(seed),
      //   });

      //   // Subscribe to the desired pattern ('threadId')
      //   const subscription = nc.subscribe(ThreadID, { max: 1 });
      //   // console.log("iii", subscription);
      //   // Process incoming messages
      //   for await (const msg of subscription) {
      //     const payload = jc.decode(msg.data);
      //     console.log(
      //       "Received message from NDI NATS:",
      //       payload.data.requested_presentation.revealed_attrs["ID Number"]
      //         .value
      //     );
      //     console.log(
      //       "Received message from NDI NATS:",
      //       payload.data.requested_presentation.revealed_attrs["Full Name"]
      //         .value
      //     );
      //     console.log(
      //       "Received message from NDI NATS:",
      //       payload.data.requested_presentation.revealed_attrs["Gender"].value
      //     );
      //     console.log(
      //       "Received message from NDI NATS:",
      //       payload.data.requested_presentation.self_attested_attrs[
      //         "Mobile Number"
      //       ]
      //     );
      //     try {
      //       // Handle the received message as needed
      //       const response = await axios.post(
      //         "http://localhost:3000/api/passengers",
      //         {
      //           CID: payload.data.requested_presentation.revealed_attrs[
      //             "ID Number"
      //           ].value,
      //           name: payload.data.requested_presentation.revealed_attrs[
      //             "Full Name"
      //           ].value,
      //           gender:
      //             payload.data.requested_presentation.revealed_attrs["Gender"]
      //               .value,
      //           mobilenumber:
      //             payload.data.requested_presentation.self_attested_attrs[
      //               "Mobile Number"
      //             ],
      //         }
      //       );
      //       console.log("create passenger", response.data);
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   }

      //   // // Handle errors outside of the try block
      //   // subscription.on("error", (err) => {
      //   //   console.error("Subscription error:", err);
      //   // });
      // } catch (err) {
      //   console.error("Error connecting to NDI NATS server:", err);
      //   return; // exit function early if there's an error
      // }
    }

    // Send a response back to the client
    res.json({ deepLinkURL: deepLinkURL, ThreadID: ThreadID });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/validate/:ThreadID", async (req, res) => {
  const { ThreadID } = req.params;
  console.log("validate...", ThreadID);
  try {
    const response = await axios.post(
      "https://staging.bhutanndi.com/authentication/authenticate",
      {
        grant_type: "client_credentials",
        client_id: "3tq7ho23g5risndd90a76jre5f",
        client_secret: "111rvn964mucumr6c3qq3n2poilvq5v92bkjh58p121nmoverquh",
      }
    );

    // Handle the response from the authentication endpoint
    // For demonstration, let's assume you want to do something with the response
    console.log("Authentication response:", response.data.access_token);
    const access_token = response.data.access_token;
    if (access_token) {
      const response = await axios.get(
        `https://stageclient.bhutanndi.com/verifier/proof-request?threadId=${ThreadID}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response.data);
      res.status(200).json(response.data);
    }
  } catch (error) {
    console.log(error);
  }
});

// app.get("/subscribe/login", async (req, res) => {
//   try {
//     var deepLinkURL = "";
//     const response = await axios.post(
//       "https://staging.bhutanndi.com/authentication/authenticate",
//       {
//         grant_type: "client_credentials",
//         client_id: "3tq7ho23g5risndd90a76jre5f",
//         client_secret: "111rvn964mucumr6c3qq3n2poilvq5v92bkjh58p121nmoverquh",
//       }
//     );

//     // Handle the response from the authentication endpoint
//     // For demonstration, let's assume you want to do something with the response
//     console.log("Authentication response:", response.data.access_token);
//     const access_token = response.data.access_token;
//     if (access_token) {
//       const response = await axios.post(
//         `https://stageclient.bhutanndi.com/verifier/proof-request`,
//         {
//           proofName: "Foundational ID",
//           proofAttributes: [
//             {
//               name: "Full Name",
//               restrictions: [
//                 {
//                   cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
//                   schema_id: "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
//                 },
//               ],
//             },
//             {
//               name: "Gender",
//               restrictions: [
//                 {
//                   cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
//                   schema_id: "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
//                 },
//               ],
//             },
//             // {
//             //   name: "Date of Birth",
//             //   restrictions: [
//             //     {
//             //       cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
//             //       schema_id:
//             //         "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
//             //     },
//             //   ],
//             // },
//             {
//               name: "ID Type",
//               restrictions: [
//                 {
//                   cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
//                   schema_id: "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
//                 },
//               ],
//             },
//             {
//               name: "ID Number",
//               restrictions: [
//                 {
//                   cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
//                   schema_id: "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
//                 },
//               ],
//             },
//             // {
//             //   name: "Household Number",
//             //   restrictions: [
//             //     {
//             //       cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
//             //       schema_id:
//             //         "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
//             //     },
//             //   ],
//             // },
//             // {
//             //   name: "Blood Type",
//             //   restrictions: [
//             //     {
//             //       cred_def_id: "Ka4s9yvjDetTTME9KWuXAj:3:CL:51994:revocable",
//             //       schema_id:
//             //         "7tmq7RgiwSwE8e8DEuLCaP:2:Foundational ID:0.0.5",
//             //     },
//             //   ],
//             // },
//             {
//               name: "Mobile Number",
//               restrictions: [],
//               selfAttestedAllowed: true,
//             },
//           ],
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${access_token}`,
//           },
//         }
//       );
//       console.log(response.data["data"]["deepLinkURL"]);
//       // deepLinkURL = `${response.data["data"]["deepLinkURL"]}&returnUrl=exp://127.0.0.1:8081`;
//       deepLinkURL = `${response.data["data"]["deepLinkURL"]}`;
//       console.log(deepLinkURL);
//       const ThreadID = response.data["data"]["proofRequestThreadId"];
//       subscribeToNDINATS(ThreadID);
//     }

//     // Send a response back to the client
//     res.json({ deepLinkURL: deepLinkURL });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Use routes
app.use("/api", passengerRoutes);
app.use("/api", driverRoutes);
app.use("/api", rideRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
