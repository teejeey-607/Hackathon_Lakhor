const express = require('express');
const router = express.Router();
const passengerController = require('../controllers/passengerController');
const passengerMapController=require('../controllers/passengerMapController');
const feedbackController = require('../controllers/feedbackController');

router.post('/feedback', feedbackController.createFeedback);

router.get('/routerequest', passengerController.getAllDriver);

router.get('/passengers', passengerController.getAllPassengers);
router.post('/passengers', passengerController.createPassenger);

//get passengers info by threadID
// router.get('/passengers/:threadID', passengerController.getPassengerByThreadID);

// Add registration route
router.get('/passengers/check-duplicate/:cid',passengerController.checkDuplicateCID);

router.post('/map',passengerMapController.createMapPassenger)

router.get('/driverlocations', passengerController.getDriverLocations);


// Assuming you have a passengerController with getPassengerById function



router.put('/passengers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, cid,gender,mobilenumber,emergencycontactnumber } = req.body;

    try {
        const updatedPassenger = await passengerController.updatePassenger(id, name, cid,gender, mobilenumber,emergencycontactnumber );
        res.json(updatedPassenger);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/passengers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Assuming you have a function to delete a passenger by ID
    await passengerController.deletePassenger(req, res, id);
  } catch (error) {
    console.error('Error deleting passenger:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/passengers/user/:id', async (req, res) => {
    const { id } = req.params;
    const cid = req.headers.cid;
  
    try {
      const passenger = await passengerController.getPassengerById(id, cid);
  
      if (!passenger) {
        return res.status(404).json({ message: 'Passenger not found' });
      }
  
      res.json(passenger);
    } catch (error) {
      console.error('Error fetching passenger:', error);
      res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
  });

  router.get('/passengers/v/:threadID', async (req, res) => {
    const { threadID } = req.params;
    console.log(threadID, "this is thread id");

    try {
      const passenger = await passengerController.getPassengerByThreadID(threadID);
  
      if (!passenger) {
        return res.status(404).json({ message: 'Passenger not found' });
      }
  
      res.json(passenger);
    } catch (error) {
      console.error('Error fetching passenger:', error);
      res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
  });


  
  

module.exports = router;
