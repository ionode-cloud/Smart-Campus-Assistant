require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusdb';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['exam', 'event', 'workshop', 'holiday'] },
  description: String
});

const busSchema = new mongoose.Schema({
  route: { type: String, required: true },
  busNumber: String,
  timings: [String],
  points: [String],
  type: { type: String, enum: ['morning', 'evening'] }
});

const Event = mongoose.model('Event', eventSchema);
const Bus = mongoose.model('Bus', busSchema);

async function seedData() {
  try {
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany([
        { title: 'Mid Semester Exam', date: new Date('2026-02-01'), type: 'exam' },
        { title: 'Tech Fest 2026', date: new Date('2026-03-15'), type: 'event' },
        { title: 'AI Workshop', date: new Date('2026-01-25'), type: 'workshop' }
      ]);
    }

    const busCount = await Bus.countDocuments();
    if (busCount === 0) {
      await Bus.insertMany([
        { route: 'City Center', busNumber: 'MH-01-C01', timings: ['07:45 AM', '08:15 AM', '05:30 PM'], points: ['Main Gate', 'Hostel', 'City Center'] },
        { route: 'Railway Station', busNumber: 'MH-01-C02', timings: ['08:00 AM', '04:45 PM', '06:00 PM'], points: ['Main Gate', 'Station'] }
      ]);
    }
    console.log('✅ Data seeded');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 }).limit(5).lean();
    res.json(events);
  } catch (error) {
    res.status(500).json([]);
  }
});

app.get('/api/buses', async (req, res) => {
  try {
    const buses = await Bus.find().sort({ route: 1 }).lean();
    res.json(buses);
  } catch (error) {
    res.status(500).json([]);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  setTimeout(seedData, 1000);
});
