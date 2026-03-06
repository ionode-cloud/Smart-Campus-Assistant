const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    locationId: {
        type: String,
        required: [true, 'Location ID (slug) is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Location name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    departments: {
        type: [String],
        default: []
    },
    timings: {
        type: String,
        default: null
    },
    type: {
        type: String,
        required: [true, 'Type is required'],
        enum: ['academic', 'residential', 'sports', 'facility', 'entrance', 'landmark'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);
