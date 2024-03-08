// src/routes/passengerRoutes.js
const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

router.get('/ridesInfo', rideController.getAllRidesInfo);
router.get('/rideInfo', rideController.getARideInfo);//takes locations and give back the fare
router.post('/rideInfo', rideController.createRideInfo);

router.post('/ride', rideController.createRide); //create a newride
router.delete('/ride', rideController.deleteRide); //delete the ride
router.patch('/ride/status', rideController.updateRideStatus); //update the ride status

router.get('/rides', rideController.getAllRides); //getl all rides
router.get('/rides/:driver', rideController.getARide);//get a ride
router.get('/rides/done/:driver', rideController.getRidesByDriverAndStatus);//get all past rides of the driver
router.get('/rides/current/:driver', rideController.getRidesByDriverAndStatus2);//get current ride with driver
router.get('/rides/current/:driver/info', rideController.getCurrentRideWithDriverInfo);//get current ride with driver information

router.get('/ride/destionation', rideController.getRidesByDestination); //fetch rides by detination
router.patch('/ride/passenger', rideController.updateRidePassenger); //update the passengers in a ride, add passenger to the ride
router.patch('/ride/passenger/remove', rideController.removeRidePassenger); //update the passengers in a ride, remove passenger from ride
// Add registration route

router.get('/rides-first-queue', rideController.getFirstFromQueue);// get the first from the queue based on location
router.get('/rides-passenger-current-ride', rideController.getPassengerCurrentRide);// get the first from the queue based on location

module.exports = router;