const express = require('express');
const router = express.Router();
const {
    getAllBuses,
    getBusById,
    createBus,
    updateBus,
    deleteBus
} = require('../controllers/busController');

router.route('/')
    .get(getAllBuses)
    .post(createBus);

router.route('/:id')
    .get(getBusById)
    .put(updateBus)
    .delete(deleteBus);

module.exports = router;
