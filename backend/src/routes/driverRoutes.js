const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const feedbackController = require('../controllers/feedbackController');

const upload = require('../../src/utils/multerConfig');

router.post('/feedback', feedbackController.createFeedback);

router.get('/routerequest', driverController.getAllrouterequest);
router.post('/RouteAccepted', driverController.RouteAccepted);
router.delete('/localroute/:id', driverController.deleteLocalRoute);


router.get('/drivers', driverController.getAllDrivers);
// router.post('/drivers', driverController.createDriver);
router.patch('/drivers', upload.fields([{ name: 'userprofile', maxCount: 1 }, { name: 'qrcode', 
maxCount: 1 }]), driverController.createDriver);
router.get('/drivers/:cid', driverController.getDriverInfo);
router.post('/driversInfo', driverController.addDriverInfo);
// Add more routes as needed

router.post('/insertLocation', driverController.insertLocation)

router.put('/updateLocation', driverController.updateLocation);

router.get('/driverlocations', driverController.getDriverLocations);

router.get('/driverId', driverController.getDriverId);


router.put('/drivers/:cid', async (req, res) => {
    const { cid } = req.params;
    const {
        name,
        licencenumber,
        // cid,
        gender,
        mobilenumber,
        vehiclenumber,
        vehiclebrand,
        vehiclecolor,
        vehicletype,
        vehiclecapacity,
        accountnumber,
        bankaccount,
  
     } = req.body;

    try {
        const updatedDriver = await driverController.updateDriver(
            // id, 
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
      );
        res.json(updatedDriver);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/drivers/:cid', async (req, res) => {
    const { cid } = req.params;
  
    try {
      // Assuming you have a function to delete a driver by ID
      await driverController.deleteDriver(req, res, cid);
    } catch (error) {
      console.error('Error deleting driver:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
  
  router.get('/drivers/user/:cid', async (req, res) => {
 
      const cid = req.headers.cid;
    
      try {
        const driver = await driverController.getDriverById(cid);
    
        if (!driver) {
          return res.status(404).json({ message: 'Driver not found' });
        }
    
        res.json(driver);
      } catch (error) {
        console.error('Error fetching driver:', error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
      }
    });
    

module.exports = router;





