const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    routeName: {
        type: String,
        required: [true, 'Route name is required'],
        trim: true
    },
    stops: {
        type: [String],
        default: []
    },
    pathCoordinates: {
        type: [{ lat: Number, lng: Number }],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
