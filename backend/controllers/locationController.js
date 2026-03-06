const Location = require('../models/Location');

// GET /api/locations - Get all locations
const getAllLocations = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const locations = await Location.find(filter).sort({ name: 1 });
        res.status(200).json({
            success: true,
            count: locations.length,
            data: locations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/locations/:id - Get single location by locationId slug
const getLocationById = async (req, res) => {
    try {
        // Support both MongoDB _id and locationId slug
        const location = await Location.findOne({ locationId: req.params.id })
            || await Location.findById(req.params.id).catch(() => null);
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        res.status(200).json({ success: true, data: location });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/locations - Create new location
const createLocation = async (req, res) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json({ success: true, data: location });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Location ID already exists' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/locations/:id - Update location by locationId slug
const updateLocation = async (req, res) => {
    try {
        let location = await Location.findOneAndUpdate(
            { locationId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!location) {
            location = await Location.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            }).catch(() => null);
        }
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        res.status(200).json({ success: true, data: location });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/locations/:id - Delete location by locationId slug
const deleteLocation = async (req, res) => {
    try {
        let location = await Location.findOneAndDelete({ locationId: req.params.id });
        if (!location) {
            location = await Location.findByIdAndDelete(req.params.id).catch(() => null);
        }
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        res.status(200).json({ success: true, message: 'Location deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllLocations, getLocationById, createLocation, updateLocation, deleteLocation };
