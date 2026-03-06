const mongoose = require('mongoose');

const routePathSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
}, { _id: false });

const busSchema = new mongoose.Schema({
    busName: {
        type: String,
        required: [true, 'Bus name is required'],
        trim: true
    },
    busNumber: {
        type: String,
        required: [true, 'Bus number is required'],
        trim: true,
        unique: true
    },
    startLocation: {
        type: String,
        required: [true, 'Start location is required'],
        trim: true
    },
    destination: {
        type: String,
        required: [true, 'Destination is required'],
        trim: true
    },
    stops: {
        type: [String],
        default: []
    },
    departureTime: {
        type: String,
        required: [true, 'Departure time is required']
    },
    arrivalTime: {
        type: String,
        required: [true, 'Arrival time is required']
    },
    routePath: {
        type: [routePathSchema],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bus', busSchema);
