const Bus = require('../models/Bus');

// GET /api/buses - Get all buses
const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: buses.length,
            data: buses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/buses/:id - Get single bus
const getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({ success: false, message: 'Bus not found' });
        }
        res.status(200).json({ success: true, data: bus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/buses - Create new bus
const createBus = async (req, res) => {
    try {
        const bus = await Bus.create(req.body);
        res.status(201).json({ success: true, data: bus });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Bus number already exists' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/buses/:id - Update bus
const updateBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!bus) {
            return res.status(404).json({ success: false, message: 'Bus not found' });
        }
        res.status(200).json({ success: true, data: bus });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/buses/:id - Delete bus
const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) {
            return res.status(404).json({ success: false, message: 'Bus not found' });
        }
        res.status(200).json({ success: true, message: 'Bus deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllBuses, getBusById, createBus, updateBus, deleteBus };
